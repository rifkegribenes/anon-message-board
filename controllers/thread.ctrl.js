const Thread = require('../models/thread');
const Reply = require('../models/reply');

// Get ten most recently bumped threads
exports.getTenRecentThreads = (req, res, next) => {
  Thread.find()
    .sort({bumped_on: -1})
    .limit(10)
    .exec()
    .then((threads) => {
      const formattedThreads = threads.map((thread) => {
        const recentReplies = thread.replies.sort((a, b) => {
          a = new Date(a.created_on);
          b = new Date(b.created_on);
          return a > b ? -1 : a < b ? 1 : 0;
        });
        const threeRecentReplies = recentReplies.slice(0, 3);
        return {
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: threeRecentReplies
        }
      });
      return res.status(200).json({formattedThreads});
    })
    .catch((err) => {
      console.log(`thread.ctrl.js > getAllThreads: ${err}`);
      return handleError(res, err);
    });
};

// Get a single thread by id. params = threadId
exports.getThreadById = (req, res, next) => {
  Thread.find({ _id: req.params.threadId })
    .then((thread) => {
      const formattedThread = {
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: thread.replies
      };
      return res.status(200).json({formattedThread});
      })
    .catch(err => {
      console.log(`thread.ctrl.js > getThreadById: ${err}`);
      return handleError(res, err);
    });
};

exports.addThread = (req, res, next) => {
  const { text, delete_password } = req.body;
  const { board } = req.params;

    const newThread = new Thread({
      text,
      delete_password,
  		created_on: new Date(),
  		bumped_on: new Date(),
  		replies: []
    });
    console.log(newThread);

    newThread.save()
	    .then((thread) => {
	      console.log('new thread saved');
	      console.log(thread);
	      res.redirect('/b/{board}');
	    })
	    .catch((err) => {
	      console.log(`thread.ctrl.js > addThread: ${err}`);
      return handleError(res, err);
	    });
}

// Deletes a thread from the DB
exports.deleteThread = (req, res, next) => {
  Thread.findOne({ _id: req.body.threadId })
    .then((thread) => {
      if (!thread) {
        return res.status(404).json({message: 'Thread not found.'});
      } else {
        // Valid password rquired to delete
        if (req.body.delete_password === thread.delete_password) {
          thread.remove()
            .then(() => res.status(204).send('success'))
            .catch(err => console.log(err));
          } else {
          res.status(403).send('incorrect password');
        }
      }
  })
  .catch((err) => {
      console.log('thread.ctrl.js > deleteThread');
      console.log(err);
      return handleError(res, err);
    });
}

// post reply. body = thread_id, text, delete_password
exports.addReply = (req, res, next) => {
  const { thread_id, delete_password, text } = req.body;
  
  const reply = new Reply({
    thread_id,
    delete_password,
    text,
    created_on: new Date(),
    reported: false
  });

  const target = { _id: thread_id };
  const updates = { $push: { replies: reply }, bumped_on: new Date() };
  const options = { new: true };

  Thread.findOneAndUpdate(target, updates, options)
  	.exec()
    .then((thread) => {
    	res.redirect('/b/{board}/{thread_id}')
      })
    .catch((err) => {
      console.log(`thread.ctrl.js > newReply: ${err}`);
      return handleError(res, err);
    });
}


// delete reply. body = thread_id, text, delete_password
exports.deleteReply = (req, res, next) => {
  const { thread_id, reply_id, delete_password } = req.body;

  const target = { _id: thread_id, 'replies._id': reply_id, 'replies.delete_password': delete_password };
  const updates = { $set: {'replies.$.text': 'deleted' } };
  const options = { new: true };
  
  Thread.findOne(target, updates, options)
  .exec()
  .then((thread) => {
    if (!thread) {
      res.send('incorrect password');
    }
    res.redirect('/b/{board}/{thread_id}')
    })
  .catch((err) => {
    console.log(`thread.ctrl.js > newReply: ${err}`);
    return handleError(res, err);
  });

  // Thread.findOneAndUpdate(target, updates, options)
  // 	.exec()
  //   .then((thread) => {
  //   	res.redirect('/b/{board}/{thread_id}')
  //     })
  //   .catch((err) => {
  //     console.log(`thread.ctrl.js > newReply: ${err}`);
  //     return handleError(res, err);
  //   });
// }

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}
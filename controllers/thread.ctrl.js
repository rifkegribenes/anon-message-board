const Thread = require('../models/thread');
const Reply = require('../models/reply');

// Get all threads
exports.getAllThreads = (req, res, next) => {
  Thread.find()
  	.then((threads) => {
    	return res.status(200).json({threads});
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
      return res.status(200).json({thread});
      })
    .catch(err => {
      console.log(`thread.ctrl.js > getThreadById: ${err}`);
      return handleError(res, err);
    });
};

exports.addThread = (req, res, next) => {
  const { text, delete_password } = req.body;

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

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}
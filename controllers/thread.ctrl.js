const mongoose = require('mongoose');
const models = require('../models');
const { Thread, Reply } = models;


const handleError = (res, err) => {
  return res.status(500).json({message: err});
}

///********* THREAD HANDLERS *********///

///********* POST *********///

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

    newThread.save()
	    .then((thread) => {
	      res.redirect(`/b/${board}`);
	    })
	    .catch((err) => {
	      console.log(`thread.ctrl.js > addThread: ${err}`);
      return handleError(res, err);
	    });
}

///********* GET *********///

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
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: threeRecentReplies
        }
      });
      return res.status(200).json(formattedThreads);
    })
    .catch((err) => {
      console.log(`thread.ctrl.js > getAllThreads: ${err}`);
      return handleError(res, err);
    });
};

///********* DELETE *********///

// Deletes a thread from the DB
exports.deleteThread = (req, res, next) => {
  Thread.findOne({ _id: req.body.thread_id })
    .then((thread) => {
      if (!thread) {
        return res.status(404).send('thread not found.');
      } else {
        // Valid password rquired to delete
        if (req.body.delete_password === thread.delete_password) {
          thread.remove()
            .then(() => res.send('success'))
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


///********* PUT *********///

// report thread. body = thread_id
exports.reportThread = (req, res, next) => {
  const { thread_id } = req.body;

  const target = { _id: thread_id };
  const updates = { $set: {'reported': true } };
  const options = { new: true };
  
  Thread.findOneAndUpdate(target, updates, options)
  .exec()
  .then((thread) => {
    if (!thread) {
      res.status(400).send('thread not found');
    } else {
      res.status(200).send('success');
    }
  })
  .catch((err) => {
    console.log(`thread.ctrl.js > reportThread: ${err}`);
    return handleError(res, err);
  });
}
const mongoose = require('mongoose');
const Thread = require('../models/thread');
const ReplySchema = require('../models/reply');
const Reply = mongoose.model('Reply', ReplySchema)


const handleError = (res, err) => {
  return res.status(500).json({message: err});
}

///********* REPLY HANDLERS *********///

///********* POST *********///

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
  
  Reply.save()
    .then((savedReply) => {
    
      const target = { _id: thread_id };
      const updates = { $push: { replies: savedReply }, bumped_on: new Date() };
      const options = { new: true };

      Thread.findOneAndUpdate(target, updates, options)
        .exec()
        .then((thread) => {
          res.redirect('/b/{board}/{thread_id}')
          })
        .catch((err) => {
          console.log(`reply.ctrl.js > POST Thread.findOneAndUpdate: ${err}`);
          return handleError(res, err);
        });
    })
    .catch((err) => {
      console.log(`reply.ctrl.js > POST Reply.save: ${err}`);
      return handleError(res, err);
    });

}

///********* GET *********///

// Get all replies in a thread. params = thread_id
exports.getThreadById = (req, res, next) => {
  Thread.findOne({ _id: req.query.thread_id })
    .then((thread) => {
      console.log('50');
      console.log(thread);
      if (!thread) { 
        res.status(404).send('thread not found'); 
      } else {
        const formattedThread = {
          _id: thread._id,
          text: thread.text,
          created_on: thread.created_on,
          bumped_on: thread.bumped_on,
          replies: thread.replies
        };
        console.log('55');
        console.log(formattedThread);
        res.status(200).json(formattedThread);
      }
    })
    .catch(err => {
      console.log(`thread.ctrl.js > getThreadById: ${err}`);
      return handleError(res, err);
    });
};

///********* DELETE *********///

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
      res.status(401).send('incorrect password');
    } else {
      res.status(200).send('success');
    }
  })
  .catch((err) => {
    console.log(`thread.ctrl.js > deleteReply: ${err}`);
    return handleError(res, err);
  });
}


///********* PUT *********///

// report reply. body = thread_id, reply_id
exports.reportReply = (req, res, next) => {
  const { thread_id, reply_id } = req.body;

  const target = { _id: thread_id, 'replies._id': reply_id };
  const updates = { $set: {'replies.$.reported': true } };
  const options = { new: true };
  
  Thread.findOne(target, updates, options)
  .exec()
  .then((thread) => {
    if (!thread) {
      res.status(400).send('reply not found');
    } else {
      res.status(200).send('success');
    }
  })
  .catch((err) => {
    console.log(`thread.ctrl.js > reportReply: ${err}`);
    return handleError(res, err);
  });
}
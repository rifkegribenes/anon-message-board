const Thread = require('../models/thread');

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
	      return res.status(200).json({
	          message: 'Thread saved successfully',
	          thread
	        });
	    })
	    .catch((err) => {
	      console.log(`thread.ctrl.js > addThread: ${err}`);
      return handleError(res, err);
	    });
}

// Deletes a thread from the DB
exports.deleteThread = (req, res, next) => {
  Thread.findOne({ _id: req.params.threadId })
    .then((thread) => {
      if (!thread) {
        return res.status(404).json({message: 'Thread not found.'});
      } else {
        // Only valid password can delete
        if (req.params.delete_password === thread.delete_password) {
          book.remove((err) => {
            if (err) {
              return handleError(res, err);
            } else {
              return res.status(204).json({message: `${book.title} was removed from your library.`});
            }
          });
        } else {
          return res.status(403).json({message: 'You do not have permission to delete this item.'});
        }
      }
  })
  .catch((err) => {
      console.log('book.ctrl.js > 114');
      console.log(err);
      return handleError(res, err);
    });
}

// change ownership of a book. params = bookId, userId of new owner
exports.updateBookOwner = (req, res, next) => {
  const { bookId, userId } = req.params;

  const target = { _id: bookId };
  const updates = { owner: userId };
  const options = { new: true };

  Book.findOneAndUpdate(target, updates, options)
  	.exec()
    .then((book) => {
    	return res.status(200).json({book});
      })
    .catch((err) => {
      console.log(`book.ctrl.js > updateBookOwner: ${err}`);
      return handleError(res, err);
    });
}

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}
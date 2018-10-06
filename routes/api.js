/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

const threadController = require('../controllers/thread.ctrl');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(threadController.getTenRecentThreads)
    .put(threadController.reportThread)
    .post(threadController.addThread)
    .delete(threadController.deleteThread);
    
  app.route('/api/replies/:board')
    .get(threadController.getThreadById)
    .put(threadController.reportReply)
    .post(threadController.addReply)
    .delete(threadController.deleteReply);
};

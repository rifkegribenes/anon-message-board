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
const replyController = require('../controllers/reply.ctrl');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(threadController.getTenRecentThreads)
    .put(threadController.reportThread)
    .post(threadController.addThread)
    .delete(threadController.deleteThread);
    
  app.route('/api/replies/:board')
    .get(replyController.getThreadById)
    .put(replyController.reportReply)
    .post(replyController.addReply)
    .delete(replyController.deleteReply);
};

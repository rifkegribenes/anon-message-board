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
    .put('/:thread_id', threadController.reportThread)
    .post('/', threadController.newThread)
    .delete('/', threadController.deleteThread);
    
  app.route('/api/replies/:board');

};

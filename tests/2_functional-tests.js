/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
const mocha = require('mocha');
const { suite, test } = mocha;
var server = require('../server');

const randomText = () => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

let _id1;
let _id2;
let _id3;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('create 2 new threads', function(done) {
        chai.request(server)
        .post('/api/threads/rifkegribenes')
        .send({text: randomText(), delete_password: 'pwd'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNull(err);
        });
        chai.request(server)
        .post('/api/threads/rifkegribenes')
        .send({text: randomText(), delete_password: 'pwd'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNull(err);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('get 10 most recent threads with 3 replies each', function(done) {
        chai.request(server)
          .get('/api/threads/rifkegribenes')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isNull(err);
            assert.isArray(res.body);
            assert.isBelow(res.body.length, 11);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'replies');
            assert.notProperty(res.body[0], 'reported');
            assert.notProperty(res.body[0], 'delete_password');
            assert.isArray(res.body[0].replies);
            assert.isBelow(res.body[0].replies.length, 4);
            _id1 = res.body[0]._id;
            _id2 = res.body[1]._id;
            done();
          });
        });
    });
    
    suite('DELETE', function() {
      test('delete thread with wrong password', function(done) {
        chai.request(server)
          .delete('/api/threads/rifkegribenes')
          .send({thread_id: _id1, delete_password:'wrongpassword'})
          .end(function(err, res){
            assert.equal(res.text, 'incorrect password');
            assert.equal(res.status, 403);
            done();
          });
      });
      test('delete thread with correct password', function(done) {
        chai.request(server)
          .delete('/api/threads/rifkegribenes')
          .send({thread_id: _id1, delete_password:'pwd'})
          .end(function(err, res){
            assert.equal(res.text, 'success');
            assert.isNull(err);
            done();
          });
      });
      

    });
    
    suite('PUT', function() {
      test('report thread', function(done) {
        chai.request(server)
          .put('/api/threads/rifkegribenes')
          .send({thread_id: _id2})
          .end(function(err, res){
            assert.equal(res.text, 'success');
            assert.isNull(err);
            done();
          });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('create new reply', function(done) {
        chai.request(server)
        .post('/api/replies/rifkegribenes')
        .send({text: 'the reply text', delete_password: 'pwd', thread_id: _id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNull(err);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('get all replies for one thread', function(done) {
        chai.request(server)
        .get('/api/replies/rifkegribenes')
        .query({thread_id: _id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          _id3 = res.body.replies[0]._id;
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'the reply text');
          done();
         });
      });
    });
    
    suite('PUT', function() {
      test('report reply', function(done) {
        chai.request(server)
          .put('/api/replies/rifkegribenes')
          .send({thread_id: _id2, reply_id: _id3})
          .end(function(err, res){
            assert.equal(res.text, 'success');
            assert.isNull(err);
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      test('delete reply with wrong password', function(done) {
        chai.request(server)
          .delete('/api/replies/rifkegribenes')
          .send({thread_id: _id2, reply_id: _id3, delete_password:'wrongpassword'})
          .end(function(err, res){
            assert.equal(res.text, 'incorrect password');
            assert.equal(res.status, 401);
            done();
          });
      });
      test('delete reply with correct password', function(done) {
        chai.request(server)
          .delete('/api/replies/rifkegribenes')
          .send({thread_id: _id2, reply_id: _id3, delete_password:'pwd'})
          .end(function(err, res){
            assert.equal(res.text, 'success');
            assert.isNull(err);
            done();
          });
      });
      
    });
    
  });

});

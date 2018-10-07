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

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('create 2 new threads', function(done) {
        chai.request(server)
        .post('/api/threads/rifkegribenes')
        .send({text:randomText(), delete_password:'pwd'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNull(err);
        });
        chai.request(server)
        .post('/api/threads/rifkegribenes')
        .send({text:randomText(), delete_password:'pwd'})
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
          .send({text:randomText(), delete_password:'pwd'})
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
      test('get 10 most recent threads with 3 replies each', function(done) {
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});

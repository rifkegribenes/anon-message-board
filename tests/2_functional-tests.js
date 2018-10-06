/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var expect = chai.expect;
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

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('create 2 new threads', function(done) {
        chai.request(server)
        .post('/api/threads/rifkegribenes')
        .send({text:randomText(), delete_password:'pwd'})
        .end(function(err, res){
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.redirect;
          done();
        });
        chai.request(server)
        .post('/api/threads/rifkegribenes')
        .send({text:randomText(), delete_password:'pwd'})
        .end(function(err, res){
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.redirect;
          expect(res).to.redirect;
          expect(res).to.redirectTo('/b/rifkegribenes');
          done();
        });
      });
    });
    
    suite('GET', function() {
      
    });
    
    suite('DELETE', function() {
      
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

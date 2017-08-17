// const assert = require('assert');
const express = require('express');
const mysql = require('mysql');
const app = express();
const config = require('./../config.json');
const Database = require('./../http/db.js');
const chai = require('chai');
const should = chai.should;
const assert = chai.assert;

let db = undefined;

describe('Access to db', function() {
  it('should return true if db is running and connected', function(done) {
    db = new Database();
    done();
  });
});

describe('Insert Subscription', function() {
  describe('#fail', function() {
    it('should throw Error', function(done) {
      let sub = {
        endpoint: undefined,
        keys: {
          auth: undefined,
          p256dh: undefined
        }
      };

      assert.throws(() => {
        db.insertSubscription(sub);
      }, Error, 'Invalid subscription object.');
      done();
    });
  });
});
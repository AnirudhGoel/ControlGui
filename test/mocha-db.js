const assert = require('assert');
const express = require('express');
const mysql = require('mysql');
const app = express();
const config = require('./../config.json');
const Database = require('./../http/db.js');
const chai = require('chai');

let db = undefined;

describe('Access to db', function() {
  it('should return true if db is running and connected', function(done) {
    db = new Database();
    done();
  });
});

describe('Insert Subscription', function() {
  let sub = {
    endpoint:'test',
    keys: {
      auth: 'test',
      p256dh: 'test'
    }
  };
  it('should return true if subscription is added', function(done) {
    db.insertSubscription(sub)
    .then(done());
  });
});
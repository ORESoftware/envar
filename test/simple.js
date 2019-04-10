#!/usr/bin/env node

const cp = require('child_process');
const path  = require('path');
const fs  = require('fs');
const http  = require('http');
const assert  = require('assert');
const EE  = require('events');
const strm = require('stream');

const envar = require('../dist/main');
const async = require('async');

function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

async.parallel([
  cb => {
    envar.getEnvString("$age", cb);
  },
  cb => {
    envar.getEnvStrings(["$age"], cb);
  },
  async () => {
    return envar.getEnvStringp("$age");
  },
  async () => {
    return envar.getEnvStringsp(["$age"]);
  }
  
], (err, results) => {
  
  if(err){
    throw err;
  }
  
  flattenDeep(results).forEach(v => {
    assert(typeof v === 'string', v + 'is not a string.');
  });
  
  console.log('We are all good.');
  process.exit(0);
  
});




#!/usr/bin/env node
'use strict';

/*

 READ ME:
 
 => the files in .r2g/tests will be copied to this location:

 $HOME/.r2g/temp/project/tests/*

 => they do not need to be .js files, but they need to have a hashbang,
 so that r2g knows how to run the file.
 
 => the test files in .r2g/tests can load non-test files from .r2g/fixtures.

*/


const assert = require('assert');
const path = require('path');
const cp = require('child_process');
const os = require('os');
const fs = require('fs');
const EE = require('events');


process.on('unhandledRejection', (reason, p) => {
  // note: unless we force process to exit with 1, process may exit with 0 upon an unhandledRejection
  console.error(reason);
  process.exit(1);
});


const to = setTimeout(() => {
  console.error('r2g phase-T test timed out.');
  process.exit(1);
}, 4000);

const envar = require('@oresoftware/envstr');
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
  
  clearTimeout(to);
  
  console.log('We are all good.');
  process.exit(0);
  
});


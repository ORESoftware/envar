#!/usr/bin/env node

const cp = require('child_process');
const path  = require('path');
const fs  = require('fs');
const http  = require('http');
const assert  = require('assert');
const EE  = require('events');
const strm = require('stream');

const envar = require('../dist/main');

envar.getEnvStrings(["$age"], (err, values) => {
  console.log('1:',{err,values});
});


envar.getEnvString("$age", (err, values) => {
  console.log('2:',{err,values});
  envar.kill(9);
});



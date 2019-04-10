'use strict';

import * as cp from 'child_process';
import {ChildProcess} from "child_process";
import {JSONParser} from '@oresoftware/json-stream-parser';
import * as uuid from 'uuid';
import * as async from 'async';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

type ErrValCb = (err: any, val?: string) => void;

const values = {
  proc: null as ChildProcess,
  cbs: new Map<string,ErrValCb >()
};

const startListening = (k: ChildProcess) => {
  
  k.stdout.pipe(new JSONParser()).on('data', d => {
    
    if (!d.uuid) {
      console.error('No uuid found.');
      return;
    }
    
    const cb = values.cbs.get(d.uuid);
    values.cbs.delete(d.uuid);
    
    if (!cb) {
      console.error('No callback found.');
      return;
    }
    
    cb(null, d.value);
  });
  
  return k;
};

export const getProc = (): ChildProcess => {
  return values.proc = values.proc || startListening(cp.spawn('bash'));
};

export const kill = (n: number) => {
  values.proc && values.proc.kill(<any>n);
  values.proc = null;
};

export const getEnvStrings = (strings: Array<string>, cb: (err: any, val?: Array<string>) => void) => {
  async.mapLimit(strings, 15, getEnvString, cb);
};

export const getEnvString = (v: string, cb: ErrValCb) => {
  const id = uuid.v4();
  values.cbs.set(id, cb);
  getProc().stdin.write(` cat <<EOF\n{"uuid":"${id}","value":"${v}"}\nEOF\n`);
};

export const getEnvStringsp = (strings: Array<string>) => {
  return new Promise((resolve, reject) => {
    getEnvStrings(strings, (err, values) => {
      err ? reject(err) : resolve(values);
    });
  });
};

export const getEnvStringp = (v: string) => {
  return new Promise((resolve, reject) => {
    getEnvString(v, (err, val) => {
      err ? reject(err) : resolve(val);
    });
  });
};

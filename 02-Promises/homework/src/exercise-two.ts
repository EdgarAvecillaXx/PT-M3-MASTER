'use strict';

import { prependListener } from 'process';

export {};

var Promise = require('bluebird'),
  async = require('async');
const exerciseUtils: Utils = require('./utils');

const readFile = exerciseUtils.readFile,
  promisifiedReadFile = exerciseUtils.promisifiedReadFile,
  blue = exerciseUtils.blue,
  magenta = exerciseUtils.magenta;

var args: string[] = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE,
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA(): void {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */
  // callback version
  /*   async.each(
    ['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- A. callback version --');
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log('-- A. callback version done --');
    }
  );
 */
  // promise version
  const p1 = promisifiedReadFile('poem-two/stanza-01.txt').then(stanza =>
    blue(stanza)
  );
  const p2 = promisifiedReadFile('poem-two/stanza-02.txt').then(stanza =>
    blue(stanza)
  );

  Promise.all([p1, p2]).then(() => console.log('done'));
}

function problemB() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  /*   async.each(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- B. callback version --');
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log('-- B. callback version done --');
    }
  );
 */
  // promise version
  Promise.map(filenames, (filename: string) =>
    promisifiedReadFile(filename).then(stanza => blue(stanza))
  ).then(() => {
    console.log('done');
  });
}

function problemC() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignor?? errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  /*   async.eachSeries(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- C. callback version --');
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log('-- C. callback version done --');
    }
  );
 */
  // promise version
  Promise.reduce(
    filenames,
    (total: number, filename: string) =>
      promisifiedReadFile(filename).then(stanza => blue(stanza)),
    0
  ).then(() => console.log('done'));
}

function problemD() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  /*   async.eachSeries(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log('-- D. callback version --');
        if (err) return eachDone(err);
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      if (err) magenta(new Error(err));
      console.log('-- D. callback version done --');
    }
  );
 */
  // promise version
  Promise.reduce(
    filenames,
    (total: number, filename: string) =>
      promisifiedReadFile(filename).then(stanza => blue(stanza)),
    0
  )
    .catch((err: string) => magenta(new Error(err)))
    .finally(() => {
      console.log('done');
    });
}

function problemE() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versi??n promisificada de fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile(filename: string, str: string) {
    // tu c??digo aqu??
  }
}

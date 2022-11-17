'use strict';

var fs = require('fs');
var Promise: PromiseConstructor = require('bluebird');
var chalk = require('chalk');

type Utils = {
  readFile: (filename: string, callback: Function) => void;
  promisifiedReadFile: (filename: string) => Promise<string>;
  blue: (filename: string | string[] | Error) => void;
  magenta: (filename: string | Error) => void;
};

var utils: Utils = {
  readFile: () => {},
  promisifiedReadFile: () => new Promise(() => {}),
  blue: () => {},
  magenta: () => {},
};

utils.readFile = function (filename, callback) {
  const randExtraTime: number = Math.random() * 200;
  setTimeout(function (): void {
    fs.readFile(filename, function (err: Error, buffer: unknown) {
      if (err) callback(err);
      else callback(null, buffer?.toString());
    });
  }, randExtraTime);
};

utils.promisifiedReadFile = function (filename) {
  return new Promise<string>(function (
    resolve: Function,
    reject: Function
  ): void {
    utils.readFile(filename, function (err: Error, str: string) {
      if (err) reject(err);
      else resolve(str);
    });
  });
};

utils.blue = function (text) {
  console.log(chalk.blue(text));
};

utils.magenta = function (text) {
  console.error(chalk.magenta(text));
};

module.exports = utils;

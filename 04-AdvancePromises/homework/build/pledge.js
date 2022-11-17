'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
const States = {
  PENDING: 'pending',
  FULLFILLED: 'fulfilled',
  REJECTED: 'rejected',
};
const { FULLFILLED, PENDING, REJECTED } = States;
function $Promise(executor) {
  if (typeof executor !== 'function') throw new TypeError('The executor is not a function');
  this._state = PENDING;
  this._value = undefined;
  this._handlerGroups = [];
  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}
$Promise.resolve = function (value) {
  return value instanceof $Promise
    ? value
    : new $Promise(resolve => {
        resolve(value);
      });
};
$Promise.all = function (values) {
  if (!Array.isArray(values)) throw new TypeError();
  let results = [];
  let completedPromises = 0;
  return new $Promise((resolve, reject) => {
    const Result = (value, index) => {
      results[index] = value;
      completedPromises += 1;
      if (completedPromises === values.length) {
        resolve(results);
      }
    };
    values.forEach((value, index) => {
      if (value instanceof $Promise) {
        value
          .then(value => {
            Result(value, index);
          })
          .catch(error => reject(error));
      } else {
        Result(value, index);
      }
    });
  });
};

$Promise.all([1, 2, 3, 4, 5]);
$Promise.prototype._internalResolve = function (data) {
  if (this._state === PENDING) {
    this._state = FULLFILLED;
    this._value = data;
    this._callHandlers();
  }
};
$Promise.prototype._internalReject = function (reason) {
  if (this._state === PENDING) {
    this._state = REJECTED;
    this._value = reason;
    this._callHandlers();
  }
};
$Promise.prototype.then = function (successCb, errorCb) {
  if (typeof successCb !== 'function') successCb = false;
  if (typeof errorCb !== 'function') errorCb = false;
  const downstreamPromise = new $Promise(function () {});
  this._handlerGroups.push({ successCb, errorCb, downstreamPromise });
  if (this._state !== PENDING) this._callHandlers();
  return downstreamPromise;
};
$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};
$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    const handler = this._handlerGroups.shift();
    if (this._state === FULLFILLED) {
      try {
        if (!handler.successCb) {
          handler.downstreamPromise._internalResolve(this._value);
        } else {
          const result = handler.successCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              value => handler.downstreamPromise._internalResolve(value),
              error => handler.downstreamPromise._internalReject(error)
            );
          } else {
            handler.downstreamPromise._internalResolve(result);
          }
        }
      } catch (e) {
        handler.downstreamPromise._internalReject(e);
      }
    } else if (this._state === REJECTED) {
      try {
        if (!handler.errorCb) {
          handler.downstreamPromise._internalReject(this._value);
        } else {
          const result = handler.errorCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              value => handler.downstreamPromise._internalResolve(value),
              error => handler.downstreamPromise._internalReject(error)
            );
          } else {
            handler.downstreamPromise._internalResolve(result);
          }
        }
      } catch (e) {
        handler.downstreamPromise._internalReject(e);
      }
    }
  }
};
module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/

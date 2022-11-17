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

type $Promise = {
  _state: string;
  _value: unknown;
  _handlerGroups: {
    successCb: Function | boolean;
    errorCb: Function | boolean;
    downstreamPromise: $Promise;
  }[];
  _internalResolve: Function;
  _internalReject: Function;
  _callHandlers: Function;
  then: Function;
  catch: Function;
  resolve: Function;
};

function $Promise(this: $Promise, executor: Function): void {
  if (typeof executor !== 'function') throw new TypeError('The executor is not a function');
  this._state = PENDING;
  this._value = undefined;
  this._handlerGroups = [];

  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}

$Promise.resolve = function (value: unknown) {
  return value instanceof $Promise
    ? value
    : new ($Promise as any)((resolve: Function) => {
        resolve(value);
      });
};

$Promise.all = function (values: unknown[]) {
  if (!Array.isArray(values)) throw new TypeError();
  let results: unknown[] = [];
  let completedPromises = 0;
  return new ($Promise as any)((resolve: Function, reject: Function) => {
    const Result = (value: unknown, index: number) => {
      results[index] = value;
      completedPromises += 1;
      if (completedPromises === values.length) {
        resolve(results);
      }
    };
    values.forEach((value: $Promise, index) => {
      if (value instanceof $Promise) {
        value
          .then((value: unknown) => {
            Result(value, index);
          })
          .catch((error: unknown) => reject(error));
      } else {
        Result(value, index);
      }
    });
  });
};

$Promise.prototype._internalResolve = function (data: unknown): void {
  if (this._state === PENDING) {
    this._state = FULLFILLED;
    this._value = data;
    this._callHandlers();
  }
};

$Promise.prototype._internalReject = function (reason: unknown): void {
  if (this._state === PENDING) {
    this._state = REJECTED;
    this._value = reason;
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb: unknown, errorCb: unknown) {
  if (typeof successCb !== 'function') successCb = false;
  if (typeof errorCb !== 'function') errorCb = false;
  const downstreamPromise: $Promise = new ($Promise as any)(function () {});
  this._handlerGroups.push({ successCb, errorCb, downstreamPromise });
  if (this._state !== PENDING) this._callHandlers();
  return downstreamPromise;
};

$Promise.prototype.catch = function (errorCb: unknown) {
  return this.then(null, errorCb);
};

$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    const handler: { successCb: Function; errorCb: Function; downstreamPromise: $Promise } =
      this._handlerGroups.shift();
    if (this._state === FULLFILLED) {
      try {
        if (!handler.successCb) {
          handler.downstreamPromise._internalResolve(this._value);
        } else {
          const result: $Promise = handler.successCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              (value: unknown) => handler.downstreamPromise._internalResolve(value),
              (error: unknown) => handler.downstreamPromise._internalReject(error)
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
          const result: $Promise = handler.errorCb(this._value);
          if (result instanceof $Promise) {
            result.then(
              (value: unknown) => handler.downstreamPromise._internalResolve(value),
              (error: unknown) => handler.downstreamPromise._internalReject(error)
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

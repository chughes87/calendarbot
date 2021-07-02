const { pipeWith } = require('ramda');

const unwrapPromise = (fn, res) =>
  res instanceof Promise
    ? res.then(fn)
    : fn(res);
const pipeP = pipeWith(unwrapPromise);

module.exports = {
  pipeP
};


const {
  pipeWith, pipe, apply, andThen, map, curry,
} = require('ramda');

const promiseAll = ps => Promise.all(ps);

const pipeP = (fns, onError) => input =>
  pipeWith(
    (fn, res) => (res instanceof Promise ?
      res.then(fn).catch(onError) :
      fn(res)),
    fns,
  )(input);

const convergeP = curry((fns, converger, value) => pipe(
  map(fn => fn(value)),
  promiseAll,
  andThen(apply(converger)),
)(fns));

module.exports = {
  pipeP,
  convergeP,
};

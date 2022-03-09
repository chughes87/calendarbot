const { pipeWith, pipe, apply, andThen, map } = require('ramda');

const promiseAll = ps => Promise.all(ps);

const pipeP = (fns, onError) => input =>
  pipeWith(
    (fn, res) => (res instanceof Promise ?
      res.then(fn).catch(onError) :
      fn(res)),
    fns,
  )(input);

const convergeP = (fns, converger) => pipe(
  map(fn => fn()),
  promiseAll,
  andThen(apply(converger)),
)(fns);

module.exports = {
  pipeP,
  convergeP,
};

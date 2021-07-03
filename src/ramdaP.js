const { pipeWith } = require('ramda');

const pipeP = (fns, onError) => (input) =>
  pipeWith(
    (fn, res) =>
      res instanceof Promise
        ? res.then(fn).catch(onError)
        : fn(res),
   fns
  )(input);


module.exports = {
  pipeP
};


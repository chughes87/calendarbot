const { pair, apply, objOf, bind, pipe, prop } = require('ramda');
const { promisify } = require('util');
const { pipeP } = require('./ramdaP');

var AWS = require('aws-sdk'),
  region = 'us-east-1',
  secret,
  decodedBinarySecret

var client = new AWS.SecretsManager({
  region: region,
})

const getSecret = promisify(bind(client.getSecretValue, client));

module.exports = pipeP([
  pair('SecretId'),
  apply(objOf),
  getSecret,
  prop('SecretString'),
  JSON.parse
]);


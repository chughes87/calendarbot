const {
  pair, apply, objOf, bind, prop,
} = require('ramda');
const { promisify } = require('util');
const AWS = require('aws-sdk');
const { pipeP } = require('./ramdaP');

const client = new AWS.SecretsManager({ region: process.env.AWS_REGION });

const getSecret = promisify(bind(client.getSecretValue, client));

module.exports = pipeP([
  pair('SecretId'),
  apply(objOf),
  getSecret,
  prop('SecretString'),
  JSON.parse,
]);

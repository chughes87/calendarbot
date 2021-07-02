const { bind, pipe, prop } = require('ramda');
const { promisify } = require('util')

var AWS = require('aws-sdk'),
  region = 'us-east-1',
  secret,
  decodedBinarySecret

var client = new AWS.SecretsManager({
  region: region,
})

const getSecret = promisify(bind(client.getSecretValue, client));

module.exports = (secretName) =>
  getSecret({ SecretId: secretName })
    .then(pipe(
      prop('SecretString'),
      JSON.parse
    ))


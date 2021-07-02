const { promisify } = require('util')

var AWS = require('aws-sdk'),
  region = 'us-east-1',
  secret,
  decodedBinarySecret

var client = new AWS.SecretsManager({
  region: region,
})

module.exports = (secretName, cb) =>
  client.getSecretValue({ SecretId: secretName }, function(err, data) {
    if (err) {
      console.log(err)
      return
    }

    if ('SecretString' in data) {
      secret = data.SecretString
    } else {
      let buff = new Buffer(data.SecretBinary, 'base64')
      decodedBinarySecret = buff.toString('ascii')
    }

    cb(JSON.parse(data.SecretString))
  })


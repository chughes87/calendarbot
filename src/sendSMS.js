const { curry } = require('ramda');
const twilio = require('twilio');

module.exports = curry((
  { twilio_sid, twilio_token, twilio_number, my_number },
  message
) => {
  const client = twilio(twilio_sid, twilio_token);

  client.messages
    .create({
      body: message,
      from: twilio_number,
      to: my_number
    })
});

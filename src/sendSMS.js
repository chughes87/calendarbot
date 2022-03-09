/* eslint-disable camelcase */
const twilio = require('twilio');

module.exports = function sendSMS(
  {
    twilio_sid, twilio_token, twilio_number, my_number,
  },
  message,
) {
  return message.length > 0 ?
    twilio(twilio_sid, twilio_token)
      .messages
      .create({
        body: message,
        from: twilio_number,
        to: my_number,
      }) :
    null;
};

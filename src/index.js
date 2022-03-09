const { identity } = require('ramda');
const { pipeP, convergeP } = require('./ramdaP');
const getEvents = require('./getEvents');
const { filterNextHour, stringifyEvents } = require('./eventProcessor');
const getSecret = require('./getSecret');
const sendSMS = require('./sendSMS');

const getMessage = pipeP([
  getEvents,
  filterNextHour,
  stringifyEvents,
]);

module.exports.handler = () =>
  pipeP(
    [
      getSecret,
      convergeP(
        [identity, getMessage],
        sendSMS,
      ),
    ],
    err => console.log(err),
  )('calendarbot_auth');

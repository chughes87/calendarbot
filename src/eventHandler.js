const { identity } = require('ramda');
const { pipeP, convergeP } = require('./ramdaP');
const getEvents = require('./getEvents');
const { filterNextDate, filterNextHour, stringifyEvents } = require('./eventProcessor');
const getSecret = require('./getSecret');
const sendSMS = require('./sendSMS');

const buildGetMessage = filterer => pipeP([
  getEvents,
  filterer,
  stringifyEvents,
]);

const handleEvent = filterer =>
  pipeP(
    [
      getSecret,
      convergeP(
        [identity, buildGetMessage(filterer)],
        sendSMS,
      ),
    ],
    // eslint-disable-next-line no-console
    err => console.log(err),
  )('calendarbot_auth');

module.exports.hourly = () => handleEvent(filterNextHour);
module.exports.daily = () => handleEvent(filterNextDate);

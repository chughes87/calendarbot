const { identity } = require('ramda');
const { pipeP, convergeP } = require('./ramdaP');
const getEvents = require('./getEvents');
const { filterNextDate, filterNextHour, stringifyEvents, filterNextWeek } = require('./eventProcessor');
const getSecret = require('./getSecret');
const sendSMS = require('./sendSMS');

const buildGetMessage = (filterer, shouldIncludeDate, maxEvents) => pipeP([
  getEvents(maxEvents),
  filterer,
  stringifyEvents(shouldIncludeDate),
]);

const handleEvent = (filterer, shouldIncludeDate, maxEvents) =>
  pipeP(
    [
      getSecret,
      convergeP(
        [identity, buildGetMessage(filterer, shouldIncludeDate, maxEvents)],
        sendSMS,
      ),
    ],
    // eslint-disable-next-line no-console
    err => console.log(err),
  )('calendarbot_auth');

module.exports.hourly = () => handleEvent(filterNextHour, false);
module.exports.daily = () => handleEvent(filterNextDate, true);
module.exports.weekly = () => handleEvent(filterNextWeek, true, 50);

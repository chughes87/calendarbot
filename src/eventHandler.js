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

const getHourlyMessage = buildGetMessage(filterNextHour, false);
const getDailyMessage = buildGetMessage(filterNextDate, true);
const getWeeklyMessage = buildGetMessage(filterNextWeek, true, 50);

const handleEvent = (getMessage) =>
  pipeP(
    [
      getSecret,
      convergeP(
        [identity, getMessage],
        sendSMS,
      ),
    ],
    // eslint-disable-next-line no-console
    err => console.log(err),
  )('calendarbot_auth');

module.exports.hourly = () => handleEvent(getHourlyMessage)
module.exports.daily = () => handleEvent(getDailyMessage);
module.exports.weekly = () => handleEvent(getWeeklyMessage);

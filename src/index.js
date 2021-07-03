const { map, curry, pipe, tap, pipeWith, andThen, filter, path } = require('ramda');
const moment = require('moment');
const { pipeP } = require('./ramdaP');
const getEvents = require('./getEvents');
const processEvents = require('./processEvents');
const getSecret = require('./getSecret');
const sendSMS = require('./sendSMS');

const tagLog = curry((tag, data) =>
  console.log(`${tag}: ${JSON.stringify(data, null, 2)}`))
const nextHour = moment().add(1, 'hour');
const newDate = x => new Date(x);
const isNow = date =>
  date.utc().hour() === nextHour.utc().hour() &&
  date.utc().date() === nextHour.utc().date();

console.log('nextHour: ', nextHour);

module.exports.handler = () =>
  pipeP(
    [
      getSecret,
      (auth) =>
        pipeP([
          getEvents,
          path(['data', 'items']),
          filter(pipe(
            path(['start', 'dateTime']),
            moment,
            isNow
          )),
          processEvents,
          tap(tagLog('Sending SMS')),
          sendSMS(auth),
        ])(auth)
    ],
    (err) => console.log(err)
  )('calendarbot_auth');


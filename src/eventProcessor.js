const {
  trim, filter, toPairs, join, reduce, lensPath, prop, path, groupBy, map,
  pick, over, lens, assoc, pipe, paths,
} = require('ramda');
const moment = require('moment');

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const formatDate = start =>
  `${dayNames[start.getDay()]} ${start.getMonth() + 1}/${start.getDate()}`;
const formatTimes = ([start, end]) =>
  `${start.getHours()}:${start.getMinutes()}-${end.getHours()}:${end.getMinutes()}`;
const newDate = x => new Date(x);
const startPath = ['start', 'dateTime'];
const endPath = ['end', 'dateTime'];
const formatEvents = pipe(
  map(({ summary, time }) => `${time} ${summary}`),
  join('\n'),
);

const nextHour = moment().add(1, 'hour');
const isInNextHour = date =>
  date.utc().hour() === nextHour.utc().hour() &&
    date.utc().date() === nextHour.utc().date();

const filterNextHour = pipe(
  path(['data', 'items']),
  filter(pipe(
    path(startPath),
    moment,
    isInNextHour,
  )),
);

const stringifyEvents = pipe(
  map(pipe(
    over(lensPath(startPath), newDate),
    over(lensPath(endPath), newDate),
    over(lens(paths([startPath, endPath]), assoc('time')), formatTimes),
    over(lens(path(startPath), assoc('date')), formatDate),
    pick(['summary', 'time', 'date']),
  )),
  groupBy(prop('date')),
  toPairs,
  reduce((string, [date, events]) =>
    `${string}${date}\n${formatEvents(events)}\n\n`, ''),
  trim,
);

module.exports = {
  filterNextHour,
  stringifyEvents,
};

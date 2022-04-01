const {
  trim, filter, toPairs, join, reduce, lensPath, prop, path, groupBy, map,
  pick, over, lens, assoc, pipe, paths,
} = require('ramda');

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

const now = new Date();
const nextHour = new Date(now);
nextHour.setHours(now.getHours() + 1);
const isInNextHour = date =>
  date.getHours() === nextHour.getHours() &&
    date.getDate() === nextHour.getDate();

const isInNextDate = date => {
  const testDate = new Date(now);
  testDate.setDate(testDate.getDate() + 1);
  return date.getDate() === testDate.getDate();
}

const isInNextWeek = date => {
  const testDate = new Date(now);
  testDate.setDate(testDate.getDate() + 7);
  return date.getDate() <= testDate.getDate();
}

const buildFilterEvents = comparator => pipe(
  path(['data', 'items']),
  filter(pipe(
    path(startPath),
    start => new Date(start),
    comparator,
  )),
);

const filterNextHour = buildFilterEvents(isInNextHour);
const filterNextDate = buildFilterEvents(isInNextDate);
const filterNextWeek = buildFilterEvents(isInNextWeek);

const stringifyEvents = (shouldIncludeDate) => pipe(
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
    `${string}${shouldIncludeDate ? `${date}\n` : ''}${formatEvents(events)}\n\n`, ''),
  trim,
);

module.exports = {
  filterNextHour,
  filterNextDate,
  filterNextWeek,
  stringifyEvents,
};

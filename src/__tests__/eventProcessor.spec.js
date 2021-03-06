const moment = require('moment');
const { filterNextHour, stringifyEvents } = require('../eventProcessor');

jest.mock('moment', () => {
  const mmt = jest.requireActual('moment');
  return x => (x ? mmt(x) : mmt(0));
});

const getItem = event => ({
  start: {
    dateTime: event.start,
  },
  end: {
    dateTime: event.end,
  },
  summary: event.summary,
});
const getItems = events => events.map(getItem);
const getInput = events => ({ data: { items: getItems(events) } });

const defaultSummary = 'do something';

describe('stringifyEvents', () => {
  it('should produce expected message', () => {
    const input = getItems([{
      start: moment().add(1, 'hour'),
      end: moment().add(2, 'hour'),
      summary: defaultSummary,
    }]);

    const result = stringifyEvents(true)(input);
    expect(result).toEqual(`Wed 12/31\n17:0-18:0 ${defaultSummary}`);
  });

  it('should exclude date if specified', () => {
    const input = getItems([{
      start: moment().add(1, 'hour'),
      end: moment().add(2, 'hour'),
      summary: defaultSummary,
    }]);

    const result = stringifyEvents(false)(input);
    expect(result).toEqual(`17:0-18:0 ${defaultSummary}`);
  });
});

describe('filterNextHour', () => {
  it('should filter events that are not happening in the next hour', () => {
    const now = new Date();
    const firstEvent = {
      start: moment(now).add(1, 'hour'),
      end: moment(now).add(2, 'hour'),
      summary: defaultSummary,
    };
    const input = getInput([
      firstEvent,
      {
        start: moment(now).add(2, 'hour'),
        end: moment(now).add(3, 'hour'),
        summary: 'do something else',
      },
    ]);

    const result = filterNextHour(input);
    expect(result).toEqual([getItem(firstEvent)]);
  });
});

import { FormatDate } from "./FormatDate";

describe('Format Date', () => {
  it('should return a date increase', async () => {
    const formatDate = new FormatDate();
    const date = new Date('2024-01-01T10:00:00');
    const timeToIncreaseDay = '3d';
    const timeToIncreaseHours = '5h';
    const timeToIncreaseSeconds = '10s';
    const timeToIncreaseMinutes = '30m';

    const increasedDay = await formatDate.execute(date, timeToIncreaseDay);
    expect(increasedDay.getTime()).toBeGreaterThan(date.getTime());
    expect(increasedDay.getDate()).toBeGreaterThan(date.getDate());
    expect(increasedDay.getDate() - 3).toBe(date.getDate());

    const increaseHours = await formatDate.execute(date, timeToIncreaseHours);
    expect(increaseHours.getTime()).toBeGreaterThan(date.getTime());
    expect(increaseHours.getHours()).toBeGreaterThan(date.getHours());
    expect(increaseHours.getHours() - 5).toBe(date.getHours());

    const increaseSeconds = await formatDate.execute(date, timeToIncreaseSeconds);
    expect(increaseSeconds.getTime()).toBeGreaterThan(date.getTime());
    expect(increaseSeconds.getSeconds()).toBeGreaterThan(date.getSeconds());
    expect(increaseSeconds.getSeconds() - 10).toBe(date.getSeconds());

    const increaseMinutes = await formatDate.execute(date, timeToIncreaseMinutes);
    expect(increaseMinutes.getTime()).toBeGreaterThan(date.getTime());
    expect(increaseMinutes.getMinutes()).toBeGreaterThan(date.getMinutes());
    expect(increaseMinutes.getMinutes() - 30).toBe(date.getMinutes());

  });

  it('should return a date increase when param timeToIncrease is not provided', async () => {
    const formatDate = new FormatDate();
    const date = new Date('2024-01-01T10:00:00');

    const increasedDay = await formatDate.execute(date);
    expect(increasedDay.getTime()).toBeGreaterThan(date.getTime());
    expect(increasedDay.getDate()).toBeGreaterThan(date.getDate());
    expect(increasedDay.getDate() - 7).toBe(date.getDate());

  });

  it('should return a date increase default when param timeToIncrease is not provided', async () => {
    const formatDate = new FormatDate();
    const date = new Date('2024-01-01T10:00:00');
    const timeToIncrease = 'any_string';

    const increasedDay = await formatDate.execute(date, timeToIncrease);
    expect(increasedDay.getTime()).toBeGreaterThan(date.getTime());
    expect(increasedDay.getDate()).toBeGreaterThan(date.getDate());
    expect(increasedDay.getDate() - 7).toBe(date.getDate());

  });
});
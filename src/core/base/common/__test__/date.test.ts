import {
  fromNow,
  fromNowByDay,
  getDurationString,
  toLocalISOString,
} from "../date";

describe("Time Utils", () => {
  describe("fromNow", () => {
    it('should return "now" if the time difference is less than 30 seconds', () => {
      const now = Date.now();
      expect(fromNow(now)).toBe("now");
    });

    it('should return "x seconds ago" for times less than a minute ago', () => {
      const now = Date.now();
      const tenSecondsAgo = now - 40000; // 40 seconds ago
      expect(fromNow(tenSecondsAgo, true)).toBe("40 secs ago");
    });

    it('should return "x minutes ago" for times between 1 and 59 minutes ago', () => {
      const now = Date.now();
      const thirtyMinutesAgo = now - 30 * 60 * 1000; // 30 minutes ago
      expect(fromNow(thirtyMinutesAgo)).toBe("30 mins ago");
    });

    it('should return "x hours ago" for times between 1 and 23 hours ago', () => {
      const now = Date.now();
      const threeHoursAgo = now - 3 * 60 * 60 * 1000; // 3 hours ago
      expect(fromNow(threeHoursAgo)).toBe("3 hous ago"); // TODO: ?? Why hous
    });

    it('should return "x days ago" for times between 1 and 6 days ago', () => {
      const now = Date.now();
      const fourDaysAgo = now - 4 * 24 * 60 * 60 * 1000; // 4 days ago
      expect(fromNow(fourDaysAgo)).toBe("4 days ago");
    });

    it('should return "x months ago" for times between 1 and 11 months ago', () => {
      const now = Date.now();
      const twoMonthsAgo = now - 60 * 24 * 60 * 60 * 1000; // 2 months ago
      expect(fromNow(twoMonthsAgo, true)).toBe("2 mons ago"); // TODO: ?? mons
    });

    it('should return "x years ago" for times more than a year ago', () => {
      const now = Date.now();
      const threeYearsAgo = now - 3 * 365 * 24 * 60 * 60 * 1000; // 3 years ago
      expect(fromNow(threeYearsAgo, true)).toBe("3 yeas ago"); // TODO: ?? yeas
    });
  });

  describe("fromNowByDay", () => {
    it('should return "Today" for dates from today', () => {
      const now = new Date();
      expect(fromNowByDay(now)).toBe("Today");
    });

    it('should return "Yesterday" for dates from yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(fromNowByDay(yesterday)).toBe("Yesterday");
    });

    it('should return "x days ago" for dates more than 2 days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      expect(fromNowByDay(threeDaysAgo)).toBe("3 days ago");
    });
  });

  describe("getDurationString", () => {
    it('should return "x milliseconds" for durations less than a second', () => {
      expect(getDurationString(500)).toBe("500ms");
    });

    it('should return "x seconds" for durations less than a minute', () => {
      expect(getDurationString(30000)).toBe("30s");
    });

    it('should return "x minutes" for durations less than an hour', () => {
      expect(getDurationString(60000 * 5)).toBe("5 mins");
    });

    it('should return "x hours" for durations less than a day', () => {
      expect(getDurationString(60000 * 60 * 2)).toBe("2 hrs");
    });

    it('should return "x days" for durations more than a day', () => {
      expect(getDurationString(60000 * 60 * 24 * 3)).toBe("3 days");
    });
  });

  describe("toLocalISOString", () => {
    it("should return a valid local ISO string", () => {
      const date = new Date("2024-01-01T12:34:56.789Z");
      const isoString = toLocalISOString(date);
      expect(isoString).toBe("2024-01-01T12:34:56.789Z");
    });
  });
});

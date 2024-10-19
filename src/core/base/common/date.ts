import { localize } from "./localize";

const _SECONDS_IN_MINUTE = 60;
const _SECONDS_IN_HOUR = _SECONDS_IN_MINUTE * 60;
const _SECONDS_IN_DAY = _SECONDS_IN_HOUR * 24;
const _SECONDS_IN_WEEK = _SECONDS_IN_DAY * 7;
const _SECONDS_IN_MONTH = _SECONDS_IN_DAY * 30;
const _SECONDS_IN_YEAR = _SECONDS_IN_DAY * 365;

/**
 * Get the time difference in seconds from the current time to the given date.
 * @param date The date to calculate the time difference from.
 * @returns The time difference in seconds.
 */
function _getTimeDifference(date: number): number {
  return Math.round((new Date().getTime() - date) / 1000);
}

/**
 * Create a localized string representing the time difference between now and the specified date.
 * @param date The date to generate the difference from (as a timestamp or Date object).
 * @param appendAgoLabel Whether to append the word "ago" to the string.
 * @param useFullTimeWords Whether to use full words (e.g. "seconds" instead of "secs").
 * @param disallowNow Whether to prevent returning "now" for differences less than 30 seconds.
 * @returns A localized string representing the time difference.
 */
export function fromNow(
  date: number | Date,
  appendAgoLabel = true,
  useFullTimeWords = false,
  disallowNow = false
): string {
  if (typeof date !== "number") {
    date = date.getTime();
  }

  const seconds = _getTimeDifference(date);

  if (seconds < -30) {
    return localize(
      "date.fromNow.in",
      "in {0}",
      fromNow(new Date().getTime() + seconds * 1000, false)
    );
  }

  if (!disallowNow && seconds < 30) {
    return localize("date.fromNow.now", "now");
  }

  let value: number;

  if (seconds < _SECONDS_IN_MINUTE) {
    value = seconds;
    return _formatTime(value, "second", appendAgoLabel, useFullTimeWords);
  }

  if (seconds < _SECONDS_IN_HOUR) {
    value = Math.floor(seconds / _SECONDS_IN_MINUTE);
    return _formatTime(value, "minute", appendAgoLabel, useFullTimeWords);
  }

  if (seconds < _SECONDS_IN_DAY) {
    value = Math.floor(seconds / _SECONDS_IN_HOUR);
    return _formatTime(value, "hour", appendAgoLabel, useFullTimeWords);
  }

  if (seconds < _SECONDS_IN_WEEK) {
    value = Math.floor(seconds / _SECONDS_IN_DAY);
    return _formatTime(value, "day", appendAgoLabel, useFullTimeWords);
  }

  if (seconds < _SECONDS_IN_MONTH) {
    value = Math.floor(seconds / _SECONDS_IN_WEEK);
    return _formatTime(value, "week", appendAgoLabel, useFullTimeWords);
  }

  if (seconds < _SECONDS_IN_YEAR) {
    value = Math.floor(seconds / _SECONDS_IN_MONTH);
    return _formatTime(value, "month", appendAgoLabel, useFullTimeWords);
  }

  value = Math.floor(seconds / _SECONDS_IN_YEAR);
  return _formatTime(value, "year", appendAgoLabel, useFullTimeWords);
}

/**
 * Format the time difference based on the value and unit.
 * @param value The time value (e.g. 5).
 * @param unit The unit of time (e.g. "minute").
 * @param appendAgoLabel Whether to append "ago" to the output string.
 * @param useFullTimeWords Whether to use full words (e.g. "seconds" instead of "secs").
 * @returns The formatted and localized string for the time difference.
 */
function _formatTime(
  value: number,
  unit: string,
  appendAgoLabel: boolean,
  useFullTimeWords: boolean
): string {
  const isSingular = value === 1;
  const timeUnit = isSingular ? unit : `${unit}s`;
  const shortTimeUnit = isSingular ? unit.slice(0, 3) : `${unit.slice(0, 3)}s`;

  if (appendAgoLabel) {
    return useFullTimeWords
      ? localize(
          `date.fromNow.${timeUnit}.ago.fullWord`,
          `{0} ${timeUnit} ago`,
          value
        )
      : localize(
          `date.fromNow.${shortTimeUnit}.ago`,
          `{0} ${shortTimeUnit} ago`,
          value
        );
  }

  return useFullTimeWords
    ? localize(`date.fromNow.${timeUnit}.fullWord`, `{0} ${timeUnit}`, value)
    : localize(`date.fromNow.${shortTimeUnit}`, `{0} ${shortTimeUnit}`, value);
}

/**
 * Create a localized string showing time difference, returning "Today" or "Yesterday" for dates within the last two days.
 * @param date The date to compare (as a timestamp or Date object).
 * @param appendAgoLabel Whether to append the word "ago" to the string.
 * @param useFullTimeWords Whether to use full words (e.g. "seconds" instead of "secs").
 * @returns A localized string for "Today", "Yesterday" or the time difference.
 */
export function fromNowByDay(
  date: number | Date,
  appendAgoLabel = true,
  useFullTimeWords = false
): string {
  if (typeof date !== "number") {
    date = date.getTime();
  }

  const todayMidnightTime = new Date();
  todayMidnightTime.setHours(0, 0, 0, 0);

  const yesterdayMidnightTime = new Date(todayMidnightTime.getTime());
  yesterdayMidnightTime.setDate(yesterdayMidnightTime.getDate() - 1);

  if (date > todayMidnightTime.getTime()) {
    return localize("today", "Today");
  }

  if (date > yesterdayMidnightTime.getTime()) {
    return localize("yesterday", "Yesterday");
  }

  return fromNow(date, appendAgoLabel, useFullTimeWords);
}

/**
 * Convert milliseconds to a readable duration string, adjusting for precision intelligently.
 * @param ms The duration in milliseconds.
 * @param useFullTimeWords Whether to use full words (e.g. "seconds" instead of "secs").
 * @returns A localized string representing the duration.
 */
export function getDurationString(
  ms: number,
  useFullTimeWords = false
): string {
  const seconds = Math.abs(ms / 1000);

  if (seconds < 1) {
    return useFullTimeWords
      ? localize("duration.ms.full", "{0} milliseconds", ms)
      : localize("duration.ms", "{0}ms", ms);
  }

  if (seconds < _SECONDS_IN_MINUTE) {
    return useFullTimeWords
      ? localize("duration.s.full", "{0} seconds", Math.round(ms) / 1000)
      : localize("duration.s", "{0}s", Math.round(ms) / 1000);
  }

  if (seconds < _SECONDS_IN_HOUR) {
    return useFullTimeWords
      ? localize(
          "duration.m.full",
          "{0} minutes",
          Math.round(ms / (_SECONDS_IN_MINUTE * 1000))
        )
      : localize(
          "duration.m",
          "{0} mins",
          Math.round(ms / (_SECONDS_IN_MINUTE * 1000))
        );
  }

  if (seconds < _SECONDS_IN_DAY) {
    return useFullTimeWords
      ? localize(
          "duration.h.full",
          "{0} hours",
          Math.round(ms / (_SECONDS_IN_HOUR * 1000))
        )
      : localize(
          "duration.h",
          "{0} hrs",
          Math.round(ms / (_SECONDS_IN_HOUR * 1000))
        );
  }

  return localize(
    "duration.d",
    "{0} days",
    Math.round(ms / (_SECONDS_IN_DAY * 1000))
  );
}

/**
 * Convert a Date object to a local ISO string.
 * @param date The date to convert.
 * @returns A string in ISO format with local timezone.
 */
export function toLocalISOString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}.${String(date.getMilliseconds()).padStart(3, "0")}Z`;
}

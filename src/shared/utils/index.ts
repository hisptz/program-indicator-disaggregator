import { DateTime } from "luxon";

export const getSanitizedDateString = (date: string): string => {
  try {
    const dateTime = DateTime.fromISO(date);
    return dateTime.toLocaleString(DateTime.DATE_FULL);
  } catch (error) {
    return "N/A";
  }
};

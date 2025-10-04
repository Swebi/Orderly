import createEventDateTime from "./timeConverter.js";
import { EVENT_COLORS } from "./googleUtils.js";

const generateEvent = (
  subject,
  startTime,
  endTime,
  room,
  specificDate,
  color
) => {
  const start = createEventDateTime(startTime, specificDate);
  const end = createEventDateTime(endTime, specificDate);

  const colorId = EVENT_COLORS[color];

  return {
    summary: subject,
    start: {
      dateTime: start,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: end,
      timeZone: "Asia/Kolkata",
    },
    reminders: {
      useDefault: false,
    },
    description: room,
    extendedProperties: {
      private: {
        generated_by: "Orderly",
      },
    },
    colorId: colorId,
  };
};

export default generateEvent;

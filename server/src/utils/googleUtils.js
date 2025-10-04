import { google } from "googleapis";
import dotenv from "dotenv";
import generateEvent from "../utils/generateEvent.js";

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
export const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

export const EVENT_COLORS = {
  LIGHT_BLUE: 1, // "#a4bdfc"
  LIGHT_GREEN: 2, // "#7ae7bf"
  LIGHT_PURPLE: 3, // "#dbadff"
  LIGHT_RED: 4, // "#ff887c"
  YELLOW: 5, // "#fbd75b"
  ORANGE: 6, // "#ffb878"
  CYAN: 7, // "#46d6db"
  LIGHT_GRAY: 8, // "#e1e1e1"
  BLUE: 9, // "#5484ed"
  GREEN: 10, // "#51b749"
  RED: 11, // "#dc2127"
};

export const deleteExistingEvents = async (startOfDay, endOfDay) => {
  const existingEvents = await calendar.events.list({
    calendarId: "primary",
    singleEvents: true,
    timeMin: startOfDay,
    timeMax: endOfDay,
    privateExtendedProperty: ["generated_by=Orderly"],
  });

  await Promise.all(
    existingEvents.data.items.map(async (event) => {
      await calendar.events.delete({
        calendarId: "primary",
        eventId: event.id,
      });
    })
  );
};

export const addLectureEvents = async (lectures, currentDate, color) => {
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.subject) {
        const event = generateEvent(
          lecture.subject,
          lecture.start,
          lecture.end,
          lecture.room ? lecture.room : "",
          currentDate,
          color
        );

        await calendar.events.insert({
          calendarId: "primary",
          auth: oauth2Client,
          resource: event,
        });
      }
    })
  );
};

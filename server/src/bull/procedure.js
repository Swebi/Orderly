import prisma from "../../prisma/prisma.client.js";
import dotenv from "dotenv";
import {
  addLectureEvents,
  deleteExistingEvents,
  EVENT_COLORS,
  oauth2Client,
} from "../utils/googleUtils.js";
import { DateTime } from "luxon";
import { checkSchedule, mockTimetable } from "../utils/data.js";
import automatePlanner from "../scrapers/planner.js";
import automateTimetableScrape from "../scrapers/timetable.js";
import generateTimetable from "../utils/generateTimetable.js";
dotenv.config();

export const scrapeProcedure = async (job) => {
  console.log("Initialise Scraper Procedure");
  job.log("Initialise Scraper Procedure");
  if (job.data.type === "scrape planner") {
    const planner = await automatePlanner(job);

    for (const [date, dayOrder] of Object.entries(planner)) {
      await prisma.academia.upsert({
        where: { date },
        update: { dayOrder },
        create: { date, dayOrder },
      });
    }
    return planner;
  } else if (job.data.type === "scrape timetable") {
    const { email } = job.data.user;
    const { academiaEmail } = job.data.user;

    const data = await automateTimetableScrape(job);
    const { batch } = data;
    const { courses } = data;

    let generatedTimetable = generateTimetable(courses, batch);

    if (!generatedTimetable || Object.keys(generatedTimetable).length === 0) {
      generatedTimetable = mockTimetable;
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        timetable: generatedTimetable,
        academiaEmail,
      },
    });

    return generatedTimetable;
  }
};

export const calendarProcedure = async (job) => {
  console.log("Initialise Calendar Procedure");
  job.log("Initialise Calendar Procedure");

  const user = job.data.user;
  const refreshToken = user.refreshToken;
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const days = 15;

  for (let i = 0; i < days; i++) {
    const currentDate = DateTime.now()
      .setZone("Asia/Kolkata")
      .plus({ days: i })
      .toFormat("yyyy-MM-dd");

    const { dayOrder } = await prisma.academia.findFirst({
      where: {
        date: currentDate,
      },
    });

    if (dayOrder === 0) {
      job.log(`No Day Order for ${currentDate}`);
      continue;
    }

    job.log(`Day Order for ${currentDate}`, dayOrder);

    const lectures = user.timetable[dayOrder];
    const color = user.color ?? EVENT_COLORS.BLUE;

    if (checkSchedule(user.timetable)) {
      const startOfDay = DateTime.now()
        .setZone("Asia/Kolkata")
        .plus({ days: i })
        .startOf("day")
        .toISO();
      const endOfDay = DateTime.now()
        .setZone("Asia/Kolkata")
        .plus({ days: i })
        .endOf("day")
        .toISO();

      await deleteExistingEvents(startOfDay, endOfDay);
      await addLectureEvents(lectures, currentDate, color);
    } else {
      job.log(`No lectures found for ${currentDate}`);
    }
  }

  return `Successfully added calendar events for ${user.email}`;
};

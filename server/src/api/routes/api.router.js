import { Router } from "express";
import {
  createTimetable,
  getTimetable,
  createCalendar,
  getDayOrder,
  getJobStatus,
  updateJob,
  getAcademiaEmail,
  updateUserColor,
} from "../controllers/api.controller.js";
import { scrapeTimetable } from "../controllers/api.controller.js";
const router = Router();

router.post("/timetable", createTimetable);
router.get("/timetable", getTimetable);
router.post("/scrape", scrapeTimetable);
router.get("/dayorder", getDayOrder);
router.post("/calendar", createCalendar);
router.post("/job", updateJob);
router.get("/job", getJobStatus);
router.get("/academia-email", getAcademiaEmail);
router.post("/color", updateUserColor);

export default router;

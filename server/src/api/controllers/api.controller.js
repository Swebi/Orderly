import prisma from "../../../prisma/prisma.client.js";
import { oauth2Client, scopes } from "../../utils/googleUtils.js";
import axios from "axios";
import { DateTime } from "luxon";

export const createTimetable = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { timetable } = req.body;

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        timetable,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Updated timetable succesfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTimetable = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        timetable: true,
      },
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUserColor = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { color } = req.body;

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        color,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Updated color succesfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const scrapeTimetable = async (req, res, next) => {
  req.user.academiaEmail = req.body.email;
  req.user.academiaPassword = req.body.password;
  try {
    const result = await axios.post(
      `${process.env.SERVER_URL}/admin/scrape-timetable`,
      req.user,
      {
        headers: {
          "x-admin-password": process.env.ADMIN_PASSWORD,
        },
        withCredentials: true,
      }
    );
    if (result) {
      res.status(200).json({
        success: true,
        message: "Succesfully scraped timetable from academia",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Could not scrape timetable from academia",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getDayOrder = async (req, res, next) => {
  try {
    const todayIST = DateTime.now()
      .setZone("Asia/Kolkata")
      .toFormat("yyyy-MM-dd");

    const { dayOrder } = await prisma.academia.findFirst({
      where: {
        date: todayIST,
      },
    });

    res.status(200).json({ success: true, data: dayOrder });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCalendar = async (req, res, next) => {
  try {
    const result = await axios.post(
      `${process.env.SERVER_URL}/admin/calendar`,
      req.user,
      {
        headers: {
          "x-admin-password": process.env.ADMIN_PASSWORD,
        },
        withCredentials: true,
      }
    );
    if (result) {
      res.status(200).json({
        success: true,
        message: "Succesfully added events to calendar",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { enabled } = req.body;

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        enabled,
      },
    });

    res.status(200).json({
      success: true,
      message: "Updated job succesfully",
      data: enabled,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getJobStatus = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        enabled: true,
      },
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAcademiaEmail = async (req, res, next) => {
  try {
    const { email } = req.user;

    const data = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        academiaEmail: true,
      },
    });

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

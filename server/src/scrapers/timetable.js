import { getCookies } from "./login.js";
import { parseTimetable } from "../parsers/timetableParser.js";
import dotenv from "dotenv";
import axios from "axios";
import { decrypt } from "../utils/crypto.js";
dotenv.config();

const automateTimetableScrape = async (job) => {
  try {
    const email = job.data.user.academiaEmail;
    const decryptedPassword = decrypt(job.data.user.encryptedPassword);

    const cookiesObj = await getCookies(email, decryptedPassword);
    const cookieHeader = Object.entries(cookiesObj)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const url =
      "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/My_Time_Table_2023_24";
    const headers = {
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.9",
      Connection: "keep-alive",
      DNT: "1",
      Referer: "https://academia.srmist.edu.in/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookieHeader,
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const timetable = parseTimetable(response.data);
      const { batch, courses } = timetable;
      job.log(batch, courses);
      return { batch, courses };
    } else {
      throw new Error("Failed to fetch timetable data");
    }
  } catch (error) {
    console.error("Error in getTimetable:", error.message);
    throw error;
  }
};

export default automateTimetableScrape;
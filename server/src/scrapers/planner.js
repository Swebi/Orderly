import { getCookies } from "./login.js";
import { parsePlanner } from "../parsers/plannerParser.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const automatePlanner = async (job) => {
  try {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    console.log("Getting Planner");
    job.log("Getting Planner");

    const cookiesObj = await getCookies(email, password);
    const cookieHeader = Object.entries(cookiesObj)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const url =
      "https://academia.srmist.edu.in/srm_university/academia-academic-services/page/Academic_Planner_2025_26_EVEN";
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
      const planner = parsePlanner(response.data);
      return planner;
    } else {
      throw new Error("Failed to fetch planner data");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error;
  }
};

export default automatePlanner;

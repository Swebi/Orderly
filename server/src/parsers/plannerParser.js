import * as cheerio from "cheerio";

function extractSanitizedHtml(htmlSnippet) {
  const $ = cheerio.load(htmlSnippet);
  const zmlDiv = $("[zmlvalue]");
  if (!zmlDiv.length) return null;
  let escapedHtml = zmlDiv.attr("zmlvalue");
  if (!escapedHtml) return null;
  try {
    escapedHtml = escapedHtml
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
    escapedHtml = escapedHtml.replace(/\\x([0-9A-Fa-f]{2})/g, (m, g1) =>
      String.fromCharCode(parseInt(g1, 16))
    );
    escapedHtml = escapedHtml.replace(/\\u([0-9A-Fa-f]{4})/g, (m, g1) =>
      String.fromCharCode(parseInt(g1, 16))
    );
    escapedHtml = escapedHtml.replace(/\\\//g, "/");
    escapedHtml = escapedHtml.replace(/\\'/g, "'");
    escapedHtml = escapedHtml.replace(/\\"/g, '"');
    escapedHtml = escapedHtml.replace(/\\n/g, "\n");
    escapedHtml = escapedHtml.replace(/\\r/g, "");
  } catch (e) {
    return null;
  }
  return escapedHtml;
}

export const parsePlanner = (html) => {
  let innerHtml = extractSanitizedHtml(html);
  if (innerHtml) {
    html = innerHtml;
  }
  const $ = cheerio.load(html);
  const result = {};

  const headers = $("table th");
  let months = [];
  headers.each((_, header) => {
    const text = $(header).text();
    if (text.includes("'26")) {
      months.push(text.replace("'26", "").trim());
    }
  });

  const monthsList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const rows = $("table tbody tr");
  rows.each((_, row) => {
    const cells = $(row).find("td");
    for (let i = 0; i < months.length; i++) {
      let dateIndex = i * 5;
      let doIndex = i * 5 + 3;
      if (cells.eq(dateIndex).length && cells.eq(doIndex).length) {
        let date = cells.eq(dateIndex).text().trim();
        let doValue = cells.eq(doIndex).text().trim();
        if (date) {
          let year = "2026";
          let monthIndex = monthsList.indexOf(months[i]) + 1;
          let formattedDate = `${year}-${monthIndex
            .toString()
            .padStart(2, "0")}-${date.padStart(2, "0")}`;
          let parsedDoValue = doValue === "-" ? 0 : parseInt(doValue, 10) || 0;
          result[formattedDate] = parsedDoValue;
        }
      }
    }
  });

  return result;
};

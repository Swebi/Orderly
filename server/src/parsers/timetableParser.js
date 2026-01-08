import * as cheerio from "cheerio";

function extractSanitizedHtml(
  htmlSnippet,
  containerId = "zc-viewcontainer_My_Time_Table_2023_24"
) {
  const $ = cheerio.load(htmlSnippet);
  const targetTd = $(`td#${containerId}`);
  let scriptContent = null;
  if (targetTd.length) {
    const script = targetTd.find("script").first();
    if (
      script.length &&
      script.html() &&
      script.html().includes("pageSanitizer.sanitize")
    ) {
      scriptContent = script.html();
    }
  }

  if (!scriptContent) return null;
  const match = scriptContent.match(
    /pageSanitizer\.sanitize\s*\(\s*'([\s\S]*?)'\s*\)/
  );
  if (!match) return null;
  let escapedHtml = match[1];
  try {
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

export const parseTimetable = (htmlSnippet) => {
  let innerHtml = extractSanitizedHtml(htmlSnippet);
  if (innerHtml) {
    htmlSnippet = innerHtml;
  }
  const $ = cheerio.load(htmlSnippet);

  let batch = "Batch not found";
  const infoTable = $(".cntdDiv table").first();
  infoTable.find("tr").each((i, el) => {
    const tds = $(el).find("td");
    if (tds.eq(0).text().trim().startsWith("Combo / Batch:")) {
      const batchValue = tds.eq(1).text().trim();
      const match = batchValue.match(/\/(\d+)/);
      batch = match ? match[1] : batchValue;
    }
  });

  const courses = [];
  const rows = $(".course_tbl tbody tr").slice(1);
  rows.each((i, row) => {
    const columns = $(row).find("td");
    const courseTitle = columns.eq(2).text().trim() || "N/A";
    const slot = columns.eq(8).text().trim() || "N/A";
    const roomNumber = columns.eq(9).text().trim() || "N/A";
    courses.push({
      courseTitle,
      slot,
      roomNumber,
    });
  });

  return { batch, courses };
};

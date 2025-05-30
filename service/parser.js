const parser = require("xlsx");
const path = require('path');
 require("dotenv").config();

const getTodaysTopic = () => {
  const filePath = path.join(__dirname, process.env.FILE_PATH);
  const workbook = parser.readFile(filePath);
  const topic = [];
  const today = new Date().toISOString().split("T")[0];
  let todayTopic = null;
  let yesterdayTopic = null;
  workbook.SheetNames.forEach((sheetName) => {
    const jsonData = parser.utils.sheet_to_json(workbook.Sheets[sheetName]);
    jsonData.forEach((row) => {
      const dateStart = row["Date to Start"]
        ? excelDateToJSDate(row["Date to Start"])
        : null;
      const dueDate = row["Due Date to Complete"]
        ? excelDateToJSDate(row["Due Date to Complete"])
        : null;

      if (dateStart == today || dueDate == today) {
        if (dateStart === today) {
          todayTopic = {
            heading: row["Topic"],
            topic: row["Sub Topic"],
            dateStart: dateStart,
            dueDate: dueDate,
          };
        }
        if (dueDate === today) {
          yesterdayTopic = {
            heading: row["Topic"],
            topic: row["Sub Topic"],
            dateStart: dateStart,
            dueDate: dueDate,
          };
        }
      }
    });
  });
  if (todayTopic || yesterdayTopic) {
    topic.push({
      Todays: todayTopic,
      yesterday: yesterdayTopic,
    });
  }
  return topic.length > 0 ? topic : null;
};
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split("T")[0];
}

module.exports = {
  getTodaysTopic: getTodaysTopic,
};

const cron = require('node-cron');
const { getTodaysTopic } = require('./parser');
const { sendEmail } = require('./mailer');

function formatTopicMessage(data) {
    let message = `📅 Daily JavaScript Tracker\n\n`;

    if (data[0].Todays) {
        message += `-------------------------\n📖 Today's Topic to Study\n-------------------------\n`;
        message += `📌 Topic      : ${data[0].Todays.heading}\n`;
        message += `🔍 Subtopic   : ${data[0].Todays.topic}\n`;
        message += `📅 Start Date : ${data[0].Todays.dateStart}\n`;
        message += `🕒 Due Date   : ${data[0].Todays.dueDate}\n\n`;
    } else {
        message += `📖 No topic scheduled for today.\n\n`;
    }

    if (data[0].yesterday) {
        message += `-----------------------------\n🧠 Yesterday's Topic Recap\n-----------------------------\n`;
        message += `📌 Topic      : ${data[0].yesterday.heading}\n`;
        message += `🔍 Subtopic   : ${data[0].yesterday.topic}\n`;
        message += `📅 Start Date : ${data[0].yesterday.dateStart}\n`;
        message += `🕒 Due Date   : ${data[0].yesterday.dueDate}\n`;
    } else {
        message += `🧠 No topic to recap today.\n`;
    }

    return message;
}

const scheduleNotification =  () => {
    const dataFetcher = async () => {
        const data =  getTodaysTopic();
        if (!data) {
            return;
        } 
        const message = formatTopicMessage(data); 
        await sendEmail("📚 Your JavaScript Topics for Today", message.replace(/\n/g, '<br>')) }
    cron.schedule("0 6 * * *", dataFetcher, { timezone: "Asia/Kolkata" });
    cron.schedule("0 21 * * *", dataFetcher, { timezone: "Asia/Kolkata" });
}
module.exports = {
    scheduleNotification: scheduleNotification
}
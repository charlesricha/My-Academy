# Week 60: Alerts & Notifications

An IoT system that just shows a dashboard is "Passive." A great IoT system is "Proactive." If your basement is flooding, you want your phone to scream at you.

## 1. Where do Alerts happen?

1.  **On the Device (Edge):** ESP32 checks `if (temp > 100)` and sends an alert.
    *   **Pro:** Immediate.
2.  **In the Cloud (Serverless):** A script monitors the database.
    *   **Pro:** Can detect if the device goes offline.

## 2. Notification Channels: Telegram Bots

Telegram is the engineer's favorite because it has a free, easy API.
1.  Talk to `@BotFather` to create a bot.
2.  Get your `TOKEN` and `CHAT_ID`.
3.  Make a simple HTTPS POST request to send a message.

## 3. Coding: Sending an Alert (Next.js API)

```javascript
// pages/api/alert.js
export default async function handler(req, res) {
  const { message } = req.body;
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });

  res.status(200).json({ status: 'sent' });
}
```

## 4. Alert Fatigue (The "Boy Who Cried Wolf")

If your sensor jitters between 24.9 and 25.1, you'll get 100 notifications in a minute.
*   **Hysteresis:** Only send the "Clear" alert when the value drops significantly below the threshold (e.g., 23.0°C).
*   **Rate Limiting:** Use a timer to ensure you only send one notification every 10 minutes.

## 5. Learning Resources (The "Why")

*   **Video:** [How to create a Telegram Bot](https://www.youtube.com/watch?v=aNmRNjME6mE) - Step by step.
*   **Video:** [The Importance of Hysteresis](https://www.youtube.com/watch?v=pYitB_Y0T8k) - Why we don't want a "jittery" alarm.
*   **Article:** [Building a Notification System](https://firebase.google.com/docs/cloud-messaging) - Looking at Firebase Cloud Messaging (FCM).

## Summary for the Assignment
1.  Create a Telegram Bot.
2.  Write a script that monitors your sensor data.
3.  If the value goes above a threshold, send a message to your phone.
4.  **Advanced:** Implement a "Heartbeat." If the device hasn't sent data in 5 minutes, send an "OFFLINE" alert.

---
**Senior Insight:** Always think about the "Happy Path" and the "Failure Path." A notification system is only useful if it's reliable. Test it by unplugging your sensor—do you get an "Offline" alert? That's the mark of a senior engineer.
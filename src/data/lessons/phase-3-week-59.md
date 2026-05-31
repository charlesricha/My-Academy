# Week 59: Real-time Dashboard

Data in a database is useless if no one sees it. This week, we connect the dots. We're going to build a **Next.js dashboard** that listens to your Firebase data live.

## 1. The Full-Stack IoT Loop

1.  **Hardware:** ESP32 -> Sends "25C" to Firebase.
2.  **Cloud:** Firebase updates the value.
3.  **Frontend:** Next.js uses the Firebase SDK to "listen" and updates the UI instantly.

## 2. Coding: The Firebase Hook

In React, we use the `onValue` hook to set up a permanent connection.

```javascript
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function Dashboard() {
  const [temp, setTemp] = useState(0);

  useEffect(() => {
    const tempRef = ref(db, "sensors/temp");
    // This is the listener!
    const unsubscribe = onValue(tempRef, (snapshot) => {
      const val = snapshot.val();
      setTemp(val);
    });

    // CLEANUP: Stop listening if we leave the page
    return () => unsubscribe();
  }, []);

  return (
    <div className="card">
      <h1>Current Temp: {temp}°C</h1>
    </div>
  );
}
```

## 3. Visualizing Data (Charts)

Numbers are hard to read. Trends are easy.
*   **Gauges:** Great for current speed or temperature.
*   **Line Charts:** Great for history.
**Senior Strategy:** Don't plot every single data point. If you have 10,000 points, the browser will crash. "Downsample" your data or only show the last 50 points.

## 4. Learning Resources (The "Why")

*   **Video:** [Realtime Apps with React & Firebase](https://www.youtube.com/watch?v=zQyrwxMPm88) - A complete build tutorial.
*   **Video:** [Data Visualization with Recharts](https://www.youtube.com/watch?v=FE-7f0p_ZRY) - Making pretty graphs.
*   **Article:** [Effective Data Visualization](https://web.archive.org/web/20210126115934/https://blog.hubspot.com/marketing/data-visualization-best-practices) - How to choose the right chart for the right data.

## 5. Controlling Hardware from the Web

To turn an LED on from your laptop:
1.  Web App calls `set(ref(db, "led"), true)`.
2.  Firebase pushes this to the ESP32.
3.  ESP32 toggles the physical pin.

## Summary for the Assignment
1.  Use the Next.js project we've been building.
2.  Create a new page `/dashboard/iot`.
3.  Add a listener to a Firebase path.
4.  **Experiment:** Manually change the value in the Firebase console and watch your web app update instantly. It should feel like a "live" app.

---
**Senior Pro-Tip:** Use a "Loading" state. If the internet is slow, show a spinner. Never just show a `0` or a blank screen while waiting for the first piece of data. Users hate not knowing if an app is working.
# Week 41: Web Performance

## 1. Overview (Why This Exists)
Performance is not a "bonus feature"; it is a business requirement. Google has proven that a 1-second delay in page load time can lead to a 20% drop in conversions. Users today are impatient, and Google’s search algorithm now penalizes "slow" sites using **Core Web Vitals**. You can build the most beautiful, secure app in the world, but if it takes 5 seconds to load on a mobile phone with a weak 4G connection, nobody will ever see it. This week, we learn the science of speed: how to audit your site, identify bottlenecks, and optimize every byte that travels over the wire.

## 2. Core Concepts

### 1. Core Web Vitals (The Scorecard)
Google measures performance using three key metrics:
- **LCP (Largest Contentful Paint)**: How long it takes for the biggest element (like a hero image) to appear. (Target: < 2.5s)
- **FID (First Input Delay)**: How long before the user can actually click something. (Target: < 100ms)
- **CLS (Cumulative Layout Shift)**: Does the page jump around while loading? (Target: < 0.1)

### 2. The Critical Rendering Path
This is the sequence of steps the browser takes to turn HTML, CSS, and JS into pixels.
- **Blocking Resources**: By default, `<script>` and `<link rel="stylesheet">` tags stop the browser from rendering until they are downloaded.
- **Optimization**: Use `async` or `defer` for scripts and inline critical CSS to get pixels on the screen faster.

### 3. Image Optimization
Images are usually 70-80% of a page's total weight.
- **Formats**: Use modern formats like **WebP** or **AVIF** instead of PNG/JPG.
- **Lazy Loading**: Use `loading="lazy"` so images only download when the user scrolls near them.
- **Srcset**: Provide different image sizes for different screen resolutions so a phone doesn't download a 4K desktop image.

### 4. Code Splitting and Bundling
If your React app is 2MB, the user has to download the *entire* app before seeing the first page.
- **Code Splitting**: Breaking your code into smaller chunks. The user only downloads the code for the page they are currently visiting.
- **Minification**: Removing whitespace and shortening variable names to reduce file size.

## 3. Code Examples

### Example 1: Auditing with Lighthouse
You don't guess; you measure.
1. Open Chrome DevTools -> **Lighthouse** tab.
2. Select "Mobile" and "Performance".
3. Click "Analyze page load".
4. This report is your "Todo list" for performance engineering.

### Example 2: Modern Image Handling
Using `srcset` and `lazy loading` for maximum efficiency.

```html
<img 
    src="hero-large.webp" 
    srcset="hero-small.webp 400w, hero-medium.webp 800w, hero-large.webp 1200w"
    sizes="(max-width: 600px) 400px, 800px"
    alt="Academy Workshop"
    loading="lazy"
    width="1200" 
    height="600"
>
<!-- Providing width/height prevents Layout Shift (CLS) -->
```

### Example 3: Code Splitting in React
Using `React.lazy` to load heavy components only when needed.

```jsx
import React, { Suspense, lazy } from 'react';

// The heavy Analytics chart is loaded in a separate chunk
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
    return (
        <div>
            <h1>User Dashboard</h1>
            <Suspense fallback={<div>Loading Chart...</div>}>
                <HeavyChart />
            </Suspense>
        </div>
    );
}
```

## 4. Common Mistakes

### 1. The "Library for Everything" Trap
Importing a massive library like `Moment.js` or `Lodash` just to use one small function. This adds hundreds of kilobytes to your bundle. **Always check the "Bundle Size" of a library before adding it.**

### 2. Not Using a CDN
Serving your images and scripts from your own slow server in New York to a user in Tokyo. **Use a CDN (Content Delivery Network)** like Cloudflare or Vercel to cache your files in data centers all over the world.

### 3. Forgotten Console Logs
Leaving `console.log` statements in production code. While small, thousands of logs in a complex loop can actually slow down the JavaScript engine.

### 4. Unoptimized Fonts
Loading 5 different weights of a custom font. Each font file is a blocking request. **Use variable fonts or limit yourself to 2 weights.**

## 5. Mental Model
Imagine your web app is a **Formula 1 Pit Crew**.
- **The Browser** is the car.
- **The Network** is the track.
- Every byte of JavaScript or CSS is **Weight** added to the car.
- **Minification** is stripping out the heavy seats and dashboard to make the car faster.
- **Lazy Loading** is only putting enough fuel in the car to reach the next pit stop, rather than weighing it down with a full tank.
- **Caching** is having the spare tires ready and waiting right at the edge of the track, instead of having to fetch them from the factory across the country.

## 6. Key Takeaways
- **Measure first**: Use Lighthouse to find the real bottlenecks.
- **Core Web Vitals** are the industry standard for performance.
- **Optimize Images**: They are the #1 cause of slow sites.
- **Code Splitting**: Don't make the user pay for code they aren't using yet.
- **CLS Matters**: Always provide dimensions for images to prevent jumping.
- **Minify and Compress**: Use Gzip or Brotli compression on your server.

## 7. What's Next
You can build apps that are fast, secure, and powerful. You are now a high-level fullstack engineer. But how do you ensure your app *stays* high-quality as you add more features? How do you deploy it to millions of users without breaking it? Next week, we move into **Testing & CI/CD**. We’ll learn how to write automated tests that catch bugs for us and how to build a "deployment pipeline" that automatically ships our code to the world.

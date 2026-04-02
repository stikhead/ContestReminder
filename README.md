
# ContestReminder

**ContestReminder** is a browser extension designed for competitive programmers to track upcoming contests across multiple platforms. It provides a centralized dashboard and automated system notifications to ensure users never miss a registration or start time.

---

## Technical Stack

* **Frontend:** React, Tailwind CSS, Vite, CRXjs
* **Extension API:** Chrome Alarms API, Chrome Notifications API, Chrome Storage
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose)
* **Authentication:** JWT-based secure login with Google OAuth

---

## Features

* **Real-time Tracking:** Fetches live contest data from platforms such as Codeforces, LeetCode, AtCoder, and CodeChef.
* **Custom Reminders:** Set system-level notifications for specific contests.
* **Platform Filtering:** Toggle visibility for specific platforms based on user preference.
* **Persistent Storage:** User preferences and notification settings are synced across devices via a custom backend.

---

## Preview

| Calendar View | Saved Reminders | Notification | Today |
| :---: | :---: | :---: | :---: |
| ![Calendar View](https://cdn.discordapp.com/attachments/1063099685130215494/1489131485280866455/Screenshot_2026-04-02_101725.png?ex=69cf4d44&is=69cdfbc4&hm=70c338ae40511df17b7ae1e0dcba6b44e40622e9ac26f7866c4ef26f963f2d11&) | ![Saved Reminders](https://media.discordapp.net/attachments/1063099685130215494/1489131484999712779/Screenshot_2026-04-02_101701.png?ex=69cf4d44&is=69cdfbc4&hm=dab33156862cc6921fd6be25848d5d3fc4beca911879b0742a4f232505d29692&=&format=webp&quality=lossless&width=440&height=574) | ![Notification](https://media.discordapp.net/attachments/1063099685130215494/1489131485561880626/Screenshot_2026-04-02_104605.png?ex=69cf4d44&is=69cdfbc4&hm=28f2fe9a25f49931782cd57b7f5444d2292f5ed8a09f081bc2a9aa1653a2cd17&=&format=webp&quality=lossless&width=430&height=271) | ![Today](https://media.discordapp.net/attachments/1063099685130215494/1489131484689203353/Screenshot_2026-04-02_101640.png?ex=69cf4d44&is=69cdfbc4&hm=99d453c1dec8a6b86d67107126df94fae746f6e1dbeb931071203b587e90ece8&=&format=webp&quality=lossless&width=442&height=576) 

--
## Installation (Manual Load)

Since the extension is currently in development mode, use the following steps to install it in your browser:

### 1.1 Quick Install (From Release)
If you prefer not to build from source, follow these steps:
1. Navigate to the **Releases** section on the right side of this GitHub repository.
2. Download the `build.zip` file from the latest release.
3. **Extract (unzip)** the `build.zip` file.
4. If the resulting folder contains another zip file, **unzip** that as well to access the final build directory.
5. Follow the **Load into Chrome** steps below.

### 1.2 Build from Source
If you wish to modify the code or build it yourself:
1. Clone the repository:
   ```bash
   git clone https://github.com/stikhead/ContestReminder.git
   cd contest-reminder
   ```
2. Install dependencies and build:
   ```bash
   cd src/frontend
   npm install
   npm run build
   ```

---

### 2. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Navigate to your project directory and select the **dist** folder (or the folder extracted in Step 1.1).

---

## Future Scope

| Feature | Priority | Description |
| :--- | :--- | :--- |
| **Web Store Publishing** | High | Official release on the Chrome Web Store and Microsoft Edge Add-ons. |
| **Calendar Synchronization** | High | Integration with Google Calendar and Outlook to automatically block timings. |
| **Platform Expansion** | Medium | Extending API support to include AtCoder, TopCoder, and HackerRank. |
| **Cloud Browser Sync** | Medium | Implementing \`chrome.storage.sync\` to maintain settings across browsers. |
| **Mobile Application** | Low | A companion React Native app for push notifications on the go. |
| **Social Features** | Low | Friend lists to track shared contests and set collective group reminders. |

---

## License

This project is licensed under the MIT License.

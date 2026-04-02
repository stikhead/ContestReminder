
# ContestReminder

**ContestReminder** is a browser extension designed for competitive programmers to track upcoming contests across multiple platforms. It provides a centralized dashboard and automated system notifications to ensure users never miss a registration or start time.

---

## Technical Stack

* **Frontend:** React, Tailwind CSS, Vite, CRXjs
* **Extension API:** Chrome Alarms API, Chrome Notifications API, Chrome Storage
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose)
* **Authentication:** JWT-based secure login with google oauth

---

## Features

* **Real-time Tracking:** Fetches live contest data from platforms such as Codeforces, LeetCode, AtCoder, , and CodeChef.
* **Custom Reminders:** Set system-level notifications for specific contests.
* **Platform Filtering:** Toggle visibility for specific platforms based on user preference.
* **Persistent Storage:** User preferences and notification settings are synced across devices via a custom backend.

---

## Installation (Manual Load)

Since the extension is currently in development mode, use the following steps to install it in your browser:

### 1.1 Quick Install (From Release)
If you prefer not to build from source, follow these steps:
1. Navigate to the **Releases** section on the right side of this GitHub repository.
2. Download the `build.zip` from the latest release.
3. Extract (unzip) the file to a folder on your local machine.
4. Follow the **Load into Chrome** steps below.

### 1.2 Build from Source
If you wish to modify the code or build it yourself:
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/contest-reminder.git
   cd contest-reminder
   \`\`\`
2. Install dependencies and build:
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

### 2. Load into Chrome
1. Open Chrome and navigate to \`chrome://extensions/\`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click the **Load unpacked** button.
4. Navigate to your project directory and select the **dist** folder.

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

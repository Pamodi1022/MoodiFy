# 🌈 MoodiFy – Track Your Emotions, Understand Your Mind

Welcome to **MoodiFy**, a user friendly mood-tracking app built to help you log, reflect, and visualize your emotions over time. Whether you're navigating your mental health journey or just want to build more emotional awareness, MoodiFy gives you the tools to better understand yourself — one day at a time.

---

## 📱 Features at a Glance

✨ **Daily Mood Logging**
- Choose from acurated mood list (Happy, Sad, Angry, Neutral, etc.).
- Add optional notes to describe your day or thoughts.
- Each entry is time-stamped automatically.

📅 **Mood Calendar**
- Visualize mood patterns across days with a color-coded calendar.
- Track emotional trends and gain insights over weeks and months.

💾 **Persistent Data Storage**
- Uses local storage to retain data between sessions.
- No sign-up required — just open the app and start tracking.

🌟 **Favorites & Journal**
- Mark journal entries as favorites for quick access.
- Edit past entries and attach images or audio notes.

🎯 **Clean & Responsive UI**
- Designed for simplicity and clarity.
- Fully responsive layout for different screen sizes.

---

## 🛠️ Setup and Installation

Ready to experience **MoodiFy** on your mobile device? Just follow these steps to set up the development environment using **Expo**:

### ✅ Prerequisites

- Install **Node.js** (https://nodejs.org/)
- Install **Expo CLI** globally:
  
  ```bash
  npm install -g expo-cli
  ```

- Install the **Expo Go app** on your mobile device:
  - [Expo Go on Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [Expo Go on iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)

> **Important:** Ensure your **mobile device and development computer are connected to the same Wi-Fi network**. This is essential for Expo to sync the app to your phone.

---

### 🚀 Running the App

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Pamodi1022/MoodiFy.git
   cd MoodiFy
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server with Expo**

   ```bash
   expo start
   ```

   This will launch Expo Dev Tools in your browser.

4. **Open the App on Your Device**

   - Scan the QR code shown in Expo Dev Tools using the **Expo Go** app on your phone.
   - The app will open instantly — no build required!

---

## 🧠 Design Decisions & Architecture

- **Frontend Framework:** Built using **React Native** to leverage component-based development and fast UI updates.
- **State Management:** Utilizes **React Hooks** (`useState`) for clean, localized state handling.
- **Storage Mechanism:** **LocalStorage** is used for simplicity, allowing offline access and immediate persistence.
- **UI/UX Design:** Custom **styling** focuses on minimalism, accessibility, and mobile-first responsiveness.
- **Navigation:** Implemented with a structured `AppNavigator` to ensure smooth transitions between views.
- **Calendar Component:** A handcrafted calendar that visually maps user moods by date — simple, informative, and intuitive.

---

## 🚧 Known Limitations & Future Roadmap

While MoodiFy offers a solid starting point, here are areas for growth:

- 🔐 **No Authentication:** MoodiFy is currently a personal tool with no login functionality.
- 📦 **Limited Scalability:** LocalStorage works well for individual use, but a cloud backend would improve long-term scalability.
- 📊 **Basic Visualizations:** Current insights are minimal; future versions will include charts, filters, and more analytics.
- 📤 **Data Portability:** Adding export/import options (CSV, JSON) is a top priority.
- 🔗 **API Integration:** Potential to pull mood-boosting content (quotes, activities) from external APIs.
- 📱 **Deeper Mobile Optimization:** Further refinements to gestures, touch areas, and animations are planned.

---

## 📸 Demo & Screenshots

Explore the MoodiFy experience visually:

- 🖼️ **Screenshot 1:** Mood Logging Screen  
  _See how easy it is to record your mood in seconds._

- 🗓️ **Screenshot 2:** Calendar View  
  _Visualize your emotional journey over time._
  

## 🧰 Technologies Used

- **React Native** – Component-based UI
- **JavaScript** – App logic and interactivity
- **HTML & CSS** – Structure and styling
- **LocalStorage** – Persistent, local-first data storage

---


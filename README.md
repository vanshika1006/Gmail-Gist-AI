# Gmail-Gist-AI
Gmail-Gist-AI Assistant is a Chrome Extension integrated with a Spring Boot backend that enhances Gmail with AI-powered features like smart email replies, tone customization, intent-based responses, and email summarization — helping users communicate faster and more effectively.

# 📬 Gmail Gist AI

Gmail Gist AI is a smart email assistant that integrates directly with your Gmail via a Chrome Extension. It uses AI to enhance your email productivity with features like auto-replies, tone-based suggestions, and one-click summarization — all powered by the Google Gemini API.

---

## 🚀 Features

- 💡 **AI Reply**: Automatically generates intelligent email responses.
- 🧠 **Intent-Based Reply**: Suggests replies based on your typing intent.
- ✂️ **Summarization**: Summarizes long email threads to save time.
- 🎨 **Tone Selector**: Choose a tone for replies like Professional, Friendly, Casual, or Formal.

---

## 🛠 Tech Stack

- **Frontend**: React.js
- **Backend**: Spring Boot
- **Chrome Extension**: JavaScript
- **AI**: Google Gemini API

---

## 📂 Folder Structure
- email-writer
- email-writer-extension
- email-writer-react-frontend


---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vanshika1006/Gmail-Gist-AI.git
cd Gmail-Gist-AI

cd email-writer
./mvnw spring-boot:run

Add your api_key in application.properties file
gemini.api.key=YOUR_API_KEY

**Setting up the frontend(if needed)**
cd email-writer-react-frontend
npm install
npm start

Setting up Chrome-Extension

Go to chrome://extensions in your browser.
Enable "Developer Mode"
Click "Load Unpacked"
Select the email-writer-extension folder

Made with 💻 by Vanshika Chopra.

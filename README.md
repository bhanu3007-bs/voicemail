VOICE MAIL FOR BLIND

Voice Mail for Blind is an assistive voice-based email system designed to help visually impaired users send, receive, and manage emails entirely through voice commands.
By using speech-to-text and text-to-speech technologies, the system enables hands-free communication, supports multiple languages, provides keyword summarization for long
emails, and ensures secure access through voice or PIN authentication—empowering blind users with greater independence in digital communication.

📁 Repository Files Navigation

voice-email-blind/

├── app.py                                                                                                                    # Main voice control application

├── train_intent_model.py                                                                                                     # Intent classification model using Random Forest

├── requirements.txt                                                                                                          # Project dependencies

├── README.md                                                                                                                 # Project documentation

├── templates/

│   └── index.html                                                                                                            # Voice-guided HTML interface (for screen readers)

├── static/

│   ├── style.css                                                                                                             # Audio style prompts

│   └── voice_tts.js                                                                                                          # TTS and STT interaction

|   └── command_classifier.pkl                                                                                                # Trained ML model for command prediction




🧠 Project Overview

Voice Email for Blind is an assistive AI-driven voice-based email system designed specifically for visually impaired users. Built using Python, STT (Speech-to-Text), and TTS (Text-to-Speech) technologies, the system allows users to compose, send, receive, and manage emails completely hands-free.




🚀 Features

🎙️ Full Voice Control: No screen or keyboard needed

🌍 Multilingual Support: Interact in multiple languages

🧠 Keyword Summarization: Extracts key points from long emails

🔐 Voice Authentication: Secures access through voice/PIN

🛡️ Secure Email Handling: Includes encryption & logout on inactivity

📱 Mobile & Smart Device Ready (Planned for future)





🏗️ Architecture

Modular design (Authentication, Command Processor, Email Handler)

Client-server model (voice interaction on client, processing in backend)

Random Forest classifier for command recognition





📦 Tech Stack

Python, Flask, SpeechRecognition, gTTS, pyttsx3

SMTP/IMAP for email transmission

SQLite/MySQL for secure data storage

NLP libraries: NLTK / spaCy





🧪 Testing & Deployment

Unit-tested each module (TTS/STT, NLP, Email)

Real-world testing with visually impaired users

Deployed on desktop; mobile and smart assistant support coming soon





🔐 Security Highlights

Voice keyword registration & authentication

PIN and 2FA (optional)

Data encryption and session timeout





🛠️ How to Run

1. Clone the repo


2. Install dependencies:

pip install -r requirements.txt


3. Run the app:

python app.py






📡 API Endpoints

POST /compose – Compose email via voice

GET /read – Read all unread messages aloud

POST /summary – Voice summaries of long emails

POST /login – Authenticate via voice keyword





🔍 Future Enhancements

📲 Mobile app integration

🔁 Real-time language translation

📎 Voice-driven attachment handling

🧠 AI-based email prioritization

🧭 Voice-guided tutorials for onboarding

🤖 Alexa / Google Assistant integration





👩‍💻 Developer

M. Bhanu Sri

BVRIT, CSE, 2024–2025

Project Guide: Mrs. G. Geetha

Domain: Full Stack Development – Web

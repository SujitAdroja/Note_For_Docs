<div align="center">
    <img width="200" height="200" alt="web-logo" src="https://github.com/user-attachments/assets/18a098cf-18a9-4ba8-84b5-d6d255f88b04" />
</div>

# Note For Doc (Note4Doc)
⚡ This project implements a **Patient Case Notes System** designed for NHS doctors to:
> Manually type patient case notes. Upload scanned case notes (images or PDFs, handwritten or typed) that are automatically transcribed using OCR/AI


## ✨ Features
### 📝 Case Notes Input
- **Manual entry:** Doctors can type patient case notes easily through a user-friendly web interface.  
- **Scanned uploads:** Support for uploading scanned case notes in **image (JPEG, PNG)** and **PDF** formats.

### 🤖 OCR & AI Transcription
- **Automatic transcription** of scanned documents using OCR engines like Tesseract.  
- **Structured text extraction** to convert handwritten or typed notes into editable and searchable text.

### 💾 Scalable Storage & Retrieval
- Efficient storage of both raw files and processed text in a relational database (PostgreSQL).
- Fast retrieval APIs to access patient notes anytime.

### 🛠️ Developer Experience
- **TypeScript-first** development
- **Monorepo structure** with Node workspaces
- **Beautiful, responsive design** built with Tailwind CSS and Shadcn UI

## 🚀 Quick Start
### Prerequisites
- Node.js 16+
- Npm/Bun

### Installation
1. Clone the repository
```bash
    https://github.com/Sharmil001/lief-assignment.git
    cd lief-assignment
```
2. Install dependencies
```bash
    cd frontend && npm install
    cd backend && npm install 
```
3. Run the interpreter
```bash
    npm run dev #root
```

## ⚙️ Environment Variables Setup
### Backend `.env`
Create a `.env` file inside the `backend` folder with the following variables:
```env
APP_FRONTEND_ENDPOINT=""         # URL of the frontend application
APP_DB_PASSWORD=""              # Database password
APP_DB_HOST=""                   # Database host address
APP_DB_NAME=""                   # Database name
APP_DB_PORT=""                   # Database port
APP_DB_SSL=""                    # Enable SSL for DB connection (true/false)
APP_DB_USER=""                   # Database username
APP_DATABASE_CONNECTION=""       # Full database connection string (optional)
APP_PORT=""                  # Backend server port
APP_PERPLEXITY_API_KEY=          # API key for Perplexity AI service
APP_JWT_SECRET=                  # Secret key for JWT authentication
APP_NODE_ENV=                    # Environment (development/production)
```

### Frontend `.env`
Create a `.env` file in the `frontend` folder with the following variables:

```env
NEXT_PUBLIC_API_URL="" #Backend API endpoint
```


## 🏗️ Project Structure
```
lief-assignment/
├── backend/                  # Node.js/Express backend service(s)
│   ├── src/                  # Backend source code
│   ├── tests/                # Backend tests
│   ├── .env                  # Backend environment variables
│   ├── drizzle.config.ts     # Drizzle ORM configuration for backend
│   ├── tsconfig.json         # TypeScript config for backend
│   └── package.json          # Backend dependencies & scripts
├── frontend/                 # React/Next.js frontend application
│   ├── components/           # Reusable UI components
│   ├── pages/                # Next.js pages or React views
│   ├── public/               # Static assets like images, icons, fonts
│   ├── .env                  # Frontend environment variables
│   ├── tsconfig.json         # TypeScript config for frontend
│   └── package.json          # Frontend dependencies & scripts
├── shared/                   # Shared code across backend and frontend
│   ├── utils/                # Helper functions/utilities
│   └── types/                # Shared TypeScript types & interfaces
├── scripts/                  # Helper scripts (e.g., build, deploy, setup)
├── .gitignore                # Git ignore rules
├── README.md                 # Project README file
└── package.json              # Root-level dependencies & workspace config (lint, format, etc.)
```


## 🎯 Key Technologies
### Frontend
- **Next 15** — latest Next.js with concurrent features for optimal performance and scalability.
- **React Hook Form 7** - Modern, performant form management library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful component library

### Backend
- **Node** - Fast JavaScript runtime
- **Express** - Web framework for building APIs  
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - open-source relational database
- **tesseract** - OCR engine integrated for text recognition 
- **pdf2pic & PDF Parser** - Tools to convert and parse PDF files

### AI Integration
- **Perplexity SDK** - Unified AI interface for accessing multiple AI providers seamlessly
- **Streaming** - Real-time text formater & streaming interactive AI response


## 🌐 Deployment
### Frontend (Vercel)
**Build the frontend**  
   ```bash
   cd frontend
   npm run build
````

###Backend (Render)
**Build the backend**  
   ```bash
   cd backend
   npm run build
```

---

<p align="center">
  Made with ❤️ by the <b><a href="https://github.com/Sharmil001">Sharmil Adroja</a></b>
</p>

---
## Screenshots
<img width="600" height="600" alt="Screenshot 2025-08-11 at 10 32 16 AM" src="https://github.com/user-attachments/assets/f5d2668d-4f22-4a12-b54c-7b5cd1ba2984" />
<img width="600" height="600" alt="Screenshot 2025-08-11 at 10 33 08 AM" src="https://github.com/user-attachments/assets/92ad5019-8268-4d8a-aaef-b9df5eeafcbe" />
<img width="600" height="600" alt="Screenshot 2025-08-11 at 4 04 03 PM" src="https://github.com/user-attachments/assets/e4291a38-2657-469e-9750-472a7281529a" />
<img width="600" height="600" alt="Screenshot 2025-08-11 at 10 34 09 AM" src="https://github.com/user-attachments/assets/02ca2078-f183-4ef1-a230-999d27f27b94" />
<img width="600" height="600" alt="Screenshot 2025-08-11 at 10 32 50 AM" src="https://github.com/user-attachments/assets/bd9b96cf-ae0d-4397-9853-6ba3076c903e" />
<img width="600" height="600" alt="Screenshot 2025-08-11 at 10 34 50 AM" src="https://github.com/user-attachments/assets/750977c6-33be-4918-8a6f-55fc9fdc161b" />
<img width="600" height="600" alt="Screenshot 2025-08-11 at 10 35 05 AM" src="https://github.com/user-attachments/assets/6361ec74-9f4a-4e18-8f3f-847c1f407dac" />



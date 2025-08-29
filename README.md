📌 JobNet – AI + Web3 Recruitment Platform

JobNet is an AI-powered job matching and networking platform that connects job seekers and employers. It uses NLP (Natural Language Processing) for skill extraction, AI algorithms for personalized recommendations, and Web3 blockchain payments to ensure transparent job postings.

✨ Features
👤 Profile Management

Create and update your profile with bio, LinkedIn, and skills.

AI Skill Extractor: Paste your resume or job description → auto-extracts relevant skills.

Wallet Connection (MetaMask/Phantom) to enable blockchain-secured features.

💼 Job Posting (Employers)

Employers must pay a small crypto fee before posting jobs.

Blockchain payment verified on Ethereum/Polygon (via MetaMask) or Solana (via Phantom) testnets.

Only after successful payment, job posting is unlocked.

Job stored securely in MongoDB and visible to candidates.

🔎 Job Browsing (Candidates)

Browse and filter jobs by title, location, and type.

AI Recommendations suggest the most relevant jobs based on profile skills.

Apply directly through the platform.

🤖 AI-Powered Features

Skill Extraction using NLP (natural, compromise).

Job–Candidate Match Score using cosine similarity between skills.

Smart Recommendations:

Jobs recommended to candidates.

Candidates recommended to employers.

Transparent explanations for why a match was suggested.

🌐 Networking Feed

Share posts and updates like a lightweight LinkedIn.

Filter posts by tags, skills, or location.

🛡️ Admin Controls

Admin dashboard to track users, jobs, and blockchain transactions.

Feature Flags to toggle AI on/off.

Rollback option to clear AI-processed data for compliance.

🛠 Tech Stack

Frontend: React, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB (Mongoose)
AI / NLP: natural, compromise
Web3: ethers.js (Ethereum/Polygon) / @solana/web3.js (Solana)
Deployment: Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas

📂 Project Structure
JobNet/
│── app/              # Next.js App router pages
│── components/       # Reusable UI components
│── lib/              # API utils, config
│── public/           # Static assets
│── scripts/          # Setup / helper scripts
│── styles/           # Global styles
│── middleware.ts     # Middleware (auth, routing)
│── next.config.mjs   # Next.js config
│── package.json      # Dependencies
│── README.md         # Project documentation

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/Tanish-og/JOBNET.git
cd JOBNET

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env file and add:

MONGODB_URI=your-mongodb-atlas-url
JWT_SECRET=your-secret-key
CHAIN=polygon_amoy   # or ethereum_sepolia / solana_devnet
ADMIN_PUBLIC_ADDRESS=0xYourAdminWalletAddress
JOB_POST_FEE=0.00001
AI_FEATURES_ENABLED=true

4️⃣ Run the App
npm run dev

📸 Screenshots
Dashboard

Browse Jobs

Profile with AI Skill Extractor + Wallet

🔗 Live Demo

🌍 Deployed on Vercel

📊 Future Enhancements

On-chain smart contracts for escrow job payments.

Advanced AI ranking using embeddings.

Real-time chat between employers & candidates.

Analytics dashboard for job trends.

# AI Resume Analyzer

![AI Resume Analyzer Cover](https://via.placeholder.com/1200x630.png?text=AI+Resume+Analyzer)

**AI Resume Analyzer** is a modern, production-ready SaaS application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). By leveraging Google Gemini AI, it deeply analyzes resumes against specific job descriptions to provide actionable insights, missing keywords, structural feedback, and a deterministic ATS score.

---

## 🚀 Features

- **📄 Resume Parsing:** Extracts text from PDF and DOCX files locally on the server without relying on third-party parsing APIs.
- **🧠 AI-Powered Analysis:** Uses Google Gemini 2.5 Pro to evaluate resumes against job descriptions.
- **🎯 Deterministic ATS Scoring:** Proprietary local algorithm calculates ATS scores transparently, ensuring consistent results without AI hallucinations.
- **📊 Analytics Dashboard:** Beautiful, Vercel-inspired charts (built with Recharts) to visualize your ATS score trends, missing technical skills, and keyword frequencies across multiple analyses.
- **🔒 Secure Authentication:** Handled seamlessly via Clerk, ensuring user data privacy.
- **🗄️ PostgreSQL Database:** Robust data storage powered by Prisma and Neon Serverless Postgres.
- **📥 PDF Export:** Generate and download professional, beautifully formatted PDF reports entirely on the server.

---

## 🛠 Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Authentication:** Clerk
- **AI Model:** Google Gemini API (`@google/genai`)
- **Charts:** Recharts
- **PDF Generation:** `@react-pdf/renderer`

### Folder Structure
```text
/app               # Next.js App Router (Pages, Layouts, API Routes)
/components        # Reusable UI Components (Shadcn, Charts, Dashboard)
/lib               # Core Logic (Prisma, ATS Scoring, PDF Generation, Analytics)
/prisma            # Prisma Schema and Migrations
/public            # Static Assets
```

---

## ⚙️ Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root of the project and populate it with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini API
GEMINI_API_KEY=AIzaSy...

# Neon PostgreSQL Database
# IMPORTANT: Append &connect_timeout=30 to prevent cold-start timeouts
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require&connect_timeout=30
```

### 4. Setup Database
Push the Prisma schema to your Neon database:
```bash
npx prisma db push
```

### 5. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
Visit `http://localhost:3000` to see the application running.

---

## ☁️ Deployment to Vercel

This project is fully optimized for Vercel deployment.

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **Environment Variables:** In the Vercel dashboard, copy and paste all the variables from your `.env.local` file.
5. **Build Command:** Vercel automatically detects Next.js. Leave the build command as `npm run build`.
6. Click **Deploy**.

> **Note on Neon Postgres + Vercel:** Vercel serverless functions can occasionally time out when connecting to sleeping databases. Ensure your `DATABASE_URL` includes `&connect_timeout=30` to mitigate this.

---

## 🔮 Future Roadmap

- [ ] **Cover Letter Generation:** Use AI to generate highly targeted cover letters based on the analyzed job description.
- [ ] **Mock Interviews:** Expand the platform to generate personalized interview questions based on missing skills.
- [ ] **Multi-Language Support:** Allow resume analysis in Spanish, French, and German.
- [ ] **Stripe Integration:** Introduce premium tiers for bulk analyses and advanced API access.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## © Copyright

© 2026 Dinesh Babu. All Rights Reserved.

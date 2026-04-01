import { Router, type IRouter } from "express";
import {
  SendChatMessageBody,
  SendChatMessageResponse,
} from "@workspace/api-zod";
import { careerQA, careerDatabase, scholarships, coursesData } from "../data/careerData.js";

const router: IRouter = Router();

// ──────────────────────────────────────────────────────────────────────────────
// Extended Q&A knowledge base
// ──────────────────────────────────────────────────────────────────────────────
const extendedQA: Array<{ keywords: string[]; answer: string }> = [
  // Greetings
  { keywords: ["hello", "hi", "hey", "howdy", "good morning", "good evening"], answer: "Hello! 👋 I'm your AI Career Advisor. Ask me anything about careers, skills, scholarships, salaries, resumes, interviews, coding, or college. What would you like to know today?" },
  { keywords: ["who are you", "what are you", "introduce yourself"], answer: "I'm the AI Career Advisor built into the Student Advisor app! 🤖 I can answer questions about careers, tech skills, scholarships, job hunting, internships, resumes, salaries, higher studies, and much more. Ask away!" },
  { keywords: ["thank you", "thanks", "thank u", "thx"], answer: "You're welcome! 😊 Feel free to ask me anything else about your career journey. I'm here to help!" },

  // BCA / BTech / MCA specific
  { keywords: ["bca", "bachelor of computer application"], answer: "**BCA (Bachelor of Computer Applications)** is a 3-year degree great for tech careers!\n\n📌 **Subjects**: C, Java, Python, DBMS, Web Dev, Data Structures, Networking\n💼 **Career options**: Software Developer, Web Developer, Data Analyst, System Admin\n🎓 **After BCA**: MCA (top NIT/IIT), MTech, MBA-IT, or direct jobs\n💰 **Salary**: ₹3–8 LPA (freshers), ₹8–20 LPA (3-5 years exp)\n\n**Top companies hiring BCA grads**: TCS, Infosys, Wipro, Cognizant, HCL, Accenture\n\nUse our **Career Assessment** to find the best path for your BCA background!" },
  { keywords: ["btech", "b.tech", "bachelor of technology"], answer: "**BTech** is a 4-year engineering degree — one of the most valuable for tech careers!\n\n📌 **Top branches**: CS, IT, ECE, EE, Mechanical, Civil\n💼 **CS/IT careers**: Software Dev, Data Science, AI/ML, Cloud, Cybersecurity\n🎓 **After BTech**: MTech (GATE), MS abroad (GRE), MBA (CAT/GMAT), direct jobs\n💰 **Salary**: ₹4–15 LPA (freshers from tier-2), ₹10–40 LPA (top IIT/NIT grads)\n\n**Top companies visiting BTech campus**: Google, Amazon, Microsoft, TCS, Infosys, Deloitte, JP Morgan\n\nStart your **Career Assessment** to discover your ideal tech role!" },
  { keywords: ["mca", "master of computer application"], answer: "**MCA (Master of Computer Applications)** is a 2-year postgraduate degree that opens high-paying tech roles!\n\n📌 **Entrance Exams**: NIMCET (for NITs), TANCET, university-specific tests\n💼 **Career options**: Software Engineer, Full Stack Developer, Data Analyst, System Architect\n🎓 **Specializations**: AI/ML, Cloud, Web Dev, Mobile Development\n💰 **Salary**: ₹5–15 LPA (freshers), up to ₹30+ LPA (5+ years)\n\n**Top MCA colleges**: NIT Trichy, NIT Warangal, DTU, BIT Mesra, VIT, Manipal\n\nA great option if you have BCA/BSc and want to enter high-paying software roles!" },

  // Specific tech questions
  { keywords: ["python", "learn python", "python for beginners"], answer: "**Python Learning Roadmap:**\n\n🟢 **Beginner (1–2 months)**:\n• Variables, data types, loops, functions\n• Lists, dicts, tuples, sets\n• File handling, exception handling\n\n🟡 **Intermediate (2–4 months)**:\n• OOP in Python, modules, packages\n• Libraries: NumPy, Pandas, Matplotlib\n• APIs with requests, Flask basics\n\n🔴 **Advanced (4–6 months)**:\n• Django/FastAPI for web apps\n• Machine learning with Scikit-learn\n• Web scraping, automation\n\n**Free resources**: Python.org docs, freeCodeCamp, CS50P (Harvard), Automate the Boring Stuff\n**Practice**: HackerRank Python track, LeetCode easy problems in Python" },
  { keywords: ["java", "learn java", "java programming"], answer: "**Java Learning Roadmap:**\n\n🟢 **Beginner**: Syntax, OOP (classes, inheritance, polymorphism), Exception handling\n🟡 **Intermediate**: Collections Framework, Generics, Multithreading, File I/O\n🔴 **Advanced**: Spring Boot (backend), Hibernate (ORM), JUnit (testing), Maven/Gradle\n\n💼 **Java is used for**: Backend APIs, Android apps, enterprise software, banking systems\n\n**Free resources**: MOOC.fi Java Programming, Coding with John (YouTube), Baeldung\n**Certifications**: Oracle Java SE Developer (OCA/OCP)\n**Salary for Java Developer**: ₹6–20 LPA in India" },
  { keywords: ["javascript", "js", "learn javascript", "node.js", "nodejs"], answer: "**JavaScript Learning Roadmap:**\n\n🟢 **Basics**: Variables, functions, arrays, objects, DOM manipulation\n🟡 **Intermediate**: ES6+ features, async/await, fetch API, modules\n🔴 **Frontend**: React.js (most popular), Vue.js, or Angular\n🔴 **Backend**: Node.js + Express, REST APIs\n🔴 **Full Stack**: MERN stack (MongoDB + Express + React + Node)\n\n**Free resources**: javascript.info, The Odin Project, freeCodeCamp\n**Projects**: Todo app → Weather app → E-commerce site → Chat app\n**Salary**: ₹5–22 LPA for Full Stack JS Developers" },
  { keywords: ["react", "reactjs", "react.js"], answer: "**React.js Learning Path:**\n\n✅ **Prerequisites**: HTML, CSS, JavaScript (ES6+)\n\n📚 **Core Concepts**:\n• JSX, Components, Props, State\n• useEffect, useState, useContext hooks\n• React Router for navigation\n• Axios/fetch for API calls\n• Redux or Zustand for state management\n\n🛠️ **Build these projects**: Todo app → Blog → Weather dashboard → Full e-commerce\n\n**Resources**: React.dev (official), Scrimba React course, Full Stack Open (Helsinki)\n**Jobs**: Frontend Developer, React Developer, Full Stack Developer\n**Salary**: ₹6–20 LPA" },
  { keywords: ["sql", "database", "mysql", "postgresql", "mongodb"], answer: "**Database / SQL Guide:**\n\n📊 **SQL Fundamentals**:\n• SELECT, WHERE, GROUP BY, ORDER BY, HAVING\n• JOINs (INNER, LEFT, RIGHT, FULL)\n• Subqueries, CTEs, Window Functions\n• Indexes, transactions, normalization\n\n🛠️ **Popular databases**:\n• **MySQL/PostgreSQL** — Relational, for web apps\n• **MongoDB** — NoSQL, for flexible/document data\n• **SQLite** — Lightweight, for mobile/small apps\n• **Redis** — In-memory, for caching\n\n**Practice**: HackerRank SQL, SQLZoo, LeetCode Database section\n**Certifications**: Oracle Database, Microsoft SQL Server cert\n**Salary**: ₹5–18 LPA for DB professionals" },
  { keywords: ["machine learning", "ml", "deep learning", "neural network", "tensorflow", "pytorch"], answer: "**Machine Learning / Deep Learning Path:**\n\n📚 **Prerequisites**: Python, Statistics, Linear Algebra, Calculus\n\n🤖 **ML Core**:\n• Supervised Learning (Regression, Classification)\n• Unsupervised Learning (Clustering, PCA)\n• Ensemble methods (Random Forest, XGBoost)\n• Model evaluation, cross-validation\n\n🧠 **Deep Learning**:\n• Neural Networks → CNNs → RNNs → Transformers\n• TensorFlow or PyTorch (pick one!)\n• Transfer Learning, Fine-tuning\n\n**Resources**: Andrew Ng ML course (Coursera), fast.ai, Hugging Face\n**Practice**: Kaggle competitions, Papers With Code\n**Jobs**: ML Engineer ₹10–30 LPA, AI Researcher ₹12–40 LPA" },
  { keywords: ["data science", "data scientist"], answer: "**Data Science Career Path:**\n\n1️⃣ **Learn Python** (NumPy, Pandas, Matplotlib, Seaborn)\n2️⃣ **Master SQL** (querying, joins, aggregations)\n3️⃣ **Statistics** (probability, hypothesis testing, regression)\n4️⃣ **Machine Learning** (Scikit-learn, model evaluation)\n5️⃣ **Data Visualization** (Tableau, Power BI, Plotly)\n6️⃣ **Big Data Tools** (Spark, Hadoop — for senior roles)\n\n📊 **Build a portfolio**: 5 Kaggle projects, a GitHub profile, a blog\n\n**Entry-level jobs**: Data Analyst → Junior Data Scientist → Senior DS\n**Salary**: ₹6–25 LPA in India, $90k–$150k in the US\n**Top companies**: Amazon, Flipkart, Zomato, Swiggy, Mu Sigma, Fractal" },
  { keywords: ["git", "github", "version control"], answer: "**Git / GitHub Guide:**\n\n🔧 **Essential Git commands**:\n• `git init`, `git clone` — start a repo\n• `git add`, `git commit -m 'message'` — save changes\n• `git push`, `git pull` — sync with remote\n• `git branch`, `git checkout -b` — work on features\n• `git merge`, `git rebase` — combine branches\n• `git stash` — save work temporarily\n• `git log`, `git diff` — review history\n\n📁 **GitHub best practices**:\n✅ Clear README with project description\n✅ Commit messages that explain *why*, not just *what*\n✅ Use .gitignore for node_modules, env files\n✅ Pin important repos on your profile\n✅ Contribute to open-source projects\n\n**Resource**: learngitbranching.js.org (interactive)" },
  { keywords: ["docker", "kubernetes", "k8s", "container"], answer: "**Docker & Kubernetes Guide:**\n\n🐳 **Docker Basics**:\n• Container: lightweight isolated app environment\n• `docker build`, `docker run`, `docker push`\n• Dockerfile: defines your app environment\n• docker-compose: run multi-container apps locally\n\n⚙️ **Kubernetes (K8s) Basics**:\n• Cluster → Nodes → Pods → Containers\n• Deployments, Services, Ingress, ConfigMaps\n• `kubectl get pods`, `kubectl apply -f`\n• Helm: package manager for K8s\n\n**Resources**: Docker official docs, Kubernetes.io, TechWorld with Nana (YouTube)\n**Certifications**: CKA (Certified Kubernetes Administrator), CKAD\n**Jobs**: DevOps Engineer ₹8–25 LPA, Cloud Engineer ₹8–22 LPA" },
  { keywords: ["linux", "ubuntu", "bash", "shell", "command line", "terminal"], answer: "**Linux / Shell Scripting Guide:**\n\n📌 **Essential Linux commands**:\n• Navigation: `ls`, `cd`, `pwd`, `find`, `locate`\n• Files: `cp`, `mv`, `rm`, `mkdir`, `touch`, `cat`, `less`\n• Permissions: `chmod`, `chown`, `sudo`\n• Process: `ps`, `top`, `htop`, `kill`, `nohup`\n• Network: `curl`, `wget`, `ping`, `netstat`, `ssh`\n• Package: `apt`, `yum`, `brew`\n\n📝 **Bash scripting**: variables, loops, if/else, functions, cron jobs\n\n**Why learn Linux**: Servers run Linux — essential for DevOps, Cloud, Backend Dev\n**Resources**: LinuxCommand.org, OverTheWire (security), Linux Foundation free courses" },

  // Soft skills / general career
  { keywords: ["communication skills", "soft skills", "presentation", "public speaking"], answer: "**Building Communication & Soft Skills:**\n\n🗣️ **For interviews & workplace**:\n• Practice the STAR method (Situation, Task, Action, Result)\n• Record yourself answering common interview questions\n• Join Toastmasters or a debate club\n• Read books: 'How to Win Friends & Influence People', 'Talk Like TED'\n\n📝 **Writing skills**:\n• Write technical blogs on Medium or Dev.to\n• Practice email writing with professional tone\n• Use Grammarly to improve written English\n\n🤝 **Teamwork & leadership**:\n• Lead college projects or events\n• Volunteer for hackathons & tech fests\n• Mentorship programs\n\nSoft skills + technical skills = 10x career growth!" },
  { keywords: ["networking", "linkedin", "professional network", "connection"], answer: "**Building Your Professional Network:**\n\n🔗 **LinkedIn tips**:\n• Optimize your profile headline: 'BCA Student | Python Developer | Seeking Internship'\n• Write a compelling About section (your story + goals)\n• Post weekly: projects, learnings, certifications\n• Connect with 20+ HRs and alumni per week\n• Comment thoughtfully on industry posts\n\n🤝 **Other networking**:\n• Attend hackathons, tech meetups, and workshops\n• Join Discord servers for your tech domain\n• Reach out to seniors from your college at target companies\n• Contribute to open-source projects to meet developers\n\n📧 Use our **Email Generator** to send cold emails to HRs at your target companies!" },
  { keywords: ["hackathon", "competition", "coding competition", "competitive programming"], answer: "**Hackathons & Competitive Programming:**\n\n🏆 **Top hackathons to participate in**:\n• Smart India Hackathon (SIH) — Government of India\n• HackMIT, HackGT — US university hackathons (virtual)\n• Devfolio hackathons — India's largest hackathon platform\n• Google Solution Challenge\n• Microsoft Imagine Cup\n• ETHIndia (blockchain)\n\n💻 **Competitive Programming**:\n• **LeetCode** — for FAANG interviews (do 100+ problems)\n• **Codeforces** — competitive programming (Div 2/3)\n• **HackerRank** — beginner-friendly\n• **CodeChef** — monthly Long Challenges\n\n🎯 **DSA topics**: Arrays, Strings, DP, Graphs, Trees, Binary Search, Recursion\n\nHackathon wins = strong portfolio + networking + prizes!" },
  { keywords: ["freelance", "freelancing", "upwork", "fiverr", "freelancer"], answer: "**Starting Freelancing as a Student:**\n\n💰 **Best platforms**:\n• **Upwork** — for professional clients, higher pay\n• **Fiverr** — start with gigs at fixed prices\n• **Toptal** — top 3% freelancers, premium clients\n• **Freelancer.in** — Indian platform\n• **LinkedIn Jobs** — remote contract work\n\n🛠️ **High-demand freelance skills**:\n• Web development (React, WordPress)\n• Mobile apps (Flutter, React Native)\n• Data analysis & dashboards (Python, Excel, Power BI)\n• UI/UX design (Figma)\n• Content writing & SEO\n\n**Starting tips**:\n✅ Create a strong profile with portfolio\n✅ Start with lower rates to build reviews\n✅ Deliver on time, over-communicate\n✅ Aim for long-term retainer clients\n\n**Earnings**: ₹500–₹5,000/hour depending on skill & experience" },
  { keywords: ["open source", "contribute", "github contribution", "pull request"], answer: "**Contributing to Open Source:**\n\n🌟 **Why contribute?**\n• Real-world coding experience\n• Portfolio proof of skills\n• Network with top developers\n• Many companies check open-source contributions\n\n🚀 **How to start**:\n1. Find beginner-friendly issues tagged 'good-first-issue' on GitHub\n2. Explore: **First Contributions** repo, GitHub Explore\n3. Contribute to projects you use (React, VS Code, Python libs)\n4. Programs: Google Summer of Code (GSoC), Hacktoberfest, MLH Fellowship\n\n📝 **Process**: Fork → Clone → Branch → Fix → PR → Review → Merge\n\n**Top projects for beginners**: freeCodeCamp, TensorFlow, Django, React, Scikit-learn" },
  { keywords: ["remote job", "remote work", "work from home", "wfh"], answer: "**Getting a Remote Job:**\n\n🌍 **Best platforms for remote tech jobs**:\n• **Remote.co, We Work Remotely** — curated remote jobs\n• **AngelList / Wellfound** — startups (global)\n• **Toptal, Turing** — vetted remote developers\n• **LinkedIn** — filter by 'Remote'\n• **X-Team, Andela** — remote developer networks\n\n💡 **Tips to stand out**:\n✅ Build a strong online presence (GitHub + LinkedIn + portfolio)\n✅ Showcase your ability to work independently\n✅ Learn communication tools: Slack, Notion, Jira, Zoom\n✅ Time zone flexibility helps for global companies\n\n**Avg remote salary**: ₹15–50 LPA (India-based, working for US companies)\n**Tax note**: Register as freelancer/consultant or set up sole proprietorship" },
  { keywords: ["portfolio", "portfolio website", "personal website"], answer: "**Building Your Portfolio Website:**\n\n🌐 **What to include**:\n• About section (who you are, your skills, goals)\n• Projects section (3–5 best projects with GitHub links & live demos)\n• Skills & tech stack\n• Resume/CV download link\n• Contact form or email link\n\n🛠️ **Tech options**:\n• **No-code**: Notion, Carrd, Webflow\n• **Code it yourself**: React + Tailwind + Vercel (shows skills!)\n• **Templates**: GitHub Pages, Netlify, Portfolio templates\n\n✅ **Must-haves**:\n• Mobile responsive design\n• Fast loading (optimize images)\n• Clear project descriptions with impact metrics\n• Live links to deployed projects\n\n**Deploy for free**: Vercel, Netlify, GitHub Pages\n**Inspiration**: devfolio.co, Brittany Chiang's portfolio, developers on Dribbble" },
  { keywords: ["aptitude", "quantitative aptitude", "logical reasoning", "verbal ability"], answer: "**Aptitude Preparation Guide:**\n\n📊 **Quantitative Aptitude topics**:\n• Number system, HCF/LCM, percentages\n• Profit/loss, ratio, time-speed-distance\n• Permutation, combination, probability\n• Mixtures, pipes & cisterns, ages\n\n🧩 **Logical Reasoning**:\n• Syllogisms, blood relations, direction sense\n• Coding-decoding, arrangements, puzzles\n• Series (number, letter, figure)\n\n📝 **Verbal Ability**:\n• Reading comprehension, para jumbles\n• Sentence completion, vocabulary\n• Grammar: tenses, articles, prepositions\n\n**Practice platforms**: IndiaBix, PrepInsta, Testbook, Face Prep\n**Company-specific**: TCS Ninja/Digital, Infosys Spec, Wipro NLTH mock tests\n\n**Tip**: Practice 20–30 questions daily for 60 days before campus placements!" },
  { keywords: ["campus placement", "placement preparation", "campus recruitment", "on campus"], answer: "**Campus Placement Preparation:**\n\n📅 **Timeline** (6 months before):\n• Month 1–2: DSA (LeetCode 100+ problems)\n• Month 2–3: Core subjects (DBMS, OS, CN, OOP)\n• Month 3–4: Aptitude + verbal (IndiaBix, PrepInsta)\n• Month 4–5: Resume + projects + mock interviews\n• Month 5–6: Company-specific prep + HR round practice\n\n📚 **Core subjects to revise**:\n• DBMS: ER diagrams, normalization, SQL queries, transactions\n• OS: Processes, threads, scheduling, deadlocks, memory management\n• Computer Networks: OSI model, TCP/IP, protocols, subnetting\n• OOP: 4 pillars, design patterns, SOLID principles\n\n**Companies by difficulty**: TCS/Infosys (easy) → Wipro/HCL (medium) → Accenture/Deloitte (hard) → FAANG (very hard)\n\nUse our **Email Generator** for companies not visiting your campus!" },
  { keywords: ["off campus", "off-campus placement", "direct application"], answer: "**Off-Campus Job Hunting:**\n\n🎯 **Strategy**:\n1. Polish your resume (1 page, ATS-friendly)\n2. Build a strong LinkedIn profile + GitHub\n3. Apply on: LinkedIn, Naukri, Internshala, AngelList, Instahyre\n4. Cold email HRs using our **Email Generator** tool!\n5. Referrals from seniors and alumni (most effective)\n6. Apply to startups via Wellfound — less competition\n\n📌 **Key tip**: Personalize every application. Generic applications get ignored.\n\n**Response rate boosters**:\n• Common connections between you and the HR\n• A strong cover letter/email body\n• Projects directly related to the company's domain\n• A live demo link instead of just GitHub\n\n**Follow-up**: Send a polite follow-up email after 5–7 days if no response." },
  { keywords: ["gpa", "cgpa", "marks", "percentage", "grades"], answer: "**Does GPA/CGPA Really Matter?**\n\n✅ **When it matters**:\n• Campus placements (many companies filter at 60–65% / 6+ CGPA)\n• Government jobs, PSUs, GATE-based admissions\n• MS applications abroad (3.5+ GPA preferred)\n• Scholarships and fellowship programs\n\n📊 **General cutoffs**:\n• **Mass recruiters** (TCS, Infosys): 60% / 6.0 CGPA\n• **Top IT companies**: 65–70% / 6.5–7.0 CGPA\n• **Product companies**: Usually skill-based, lower cutoffs\n• **FAANG**: Rarely mention GPA once you clear coding rounds\n\n💡 **If your CGPA is low**:\n• Focus on strong projects & skills\n• Target companies that don't have CGPA filters\n• Off-campus applications and freelancing help build proof of work\n• Certifications, hackathon wins can compensate" },
  { keywords: ["internship stipend", "internship salary", "paid internship"], answer: "**Internship Stipends in India (2025):**\n\n💰 **By company type**:\n• **FAANG internships**: ₹80k–₹1.5 lakh/month\n• **Top Indian Product**: ₹30k–₹80k/month (Flipkart, Zomato, Razorpay)\n• **Mid-tier IT/SaaS**: ₹10k–₹30k/month\n• **Mass recruiters** (TCS, Infosys): ₹5k–₹15k/month\n• **Startups**: ₹0–₹30k (varies widely)\n\n🔍 **How to find paid internships**:\n• Internshala (filter by stipend)\n• LinkedIn (search 'internship' + location)\n• AngelList / Wellfound (startups)\n• Company career pages directly\n• Cold email using our **Email Generator** tool!\n\n**Tip**: A great stipend + learning + PPO (Pre-Placement Offer) is the jackpot. Don't just chase stipend — company name and skills learned matter more!" },
  { keywords: ["ppo", "pre placement offer", "full time offer from internship"], answer: "**Getting a PPO (Pre-Placement Offer) from Your Internship:**\n\n🎯 **What is PPO?**: A full-time job offer at the end of your internship — the best way to secure a job!\n\n✅ **How to get a PPO**:\n• Deliver projects on time with high quality\n• Take initiative — solve problems beyond your assigned task\n• Communicate progress proactively with your manager\n• Ask for feedback and implement it quickly\n• Build strong relationships with your team\n• Understand the company's business and culture\n\n📌 **Stats**: ~40–60% of interns at top companies get PPOs if they perform well\n\n**PPO-friendly companies**: Microsoft, Amazon, Flipkart, Razorpay, CRED, Freshworks, Zoho — all known for converting strong interns!" },
  { keywords: ["startup job", "startup vs mnc", "startup or mnc", "which company to join"], answer: "**Startup vs MNC — Which to Choose?**\n\n🏢 **MNC (TCS, Infosys, Microsoft, etc.)**:\n✅ Stable job, defined role, good benefits\n✅ Brand name on resume, structured training\n❌ Slower growth, bureaucratic, less ownership\n❌ Siloed work, less variety\n\n🚀 **Startup**:\n✅ Fast growth, wear multiple hats, equity potential\n✅ More ownership, learning curve is steep (good!)\n✅ Better for entrepreneurship exposure\n❌ Less stability, may have fewer resources\n❌ Could shut down\n\n💡 **Recommendation**:\n• **Early career**: Either is fine — prioritize learning & skills over brand\n• **If you want to grow fast**: Startup or product company (Razorpay, CRED, etc.)\n• **If you want stability**: Large IT company or established product company\n• **Best strategy**: MNC for 1–2 years → switch to a high-growth startup" },
  { keywords: ["flutter", "dart", "mobile app", "android", "ios app", "react native"], answer: "**Mobile App Development Guide:**\n\n📱 **Cross-platform (build once, run on iOS + Android)**:\n• **Flutter** (Google) + Dart — Fast, beautiful UI, used by Google Pay, BMW\n• **React Native** (Meta) + JavaScript — Large community, used by Facebook, Airbnb\n\n🍎 **Native iOS**: Swift (Xcode) — best performance for iOS-only apps\n🤖 **Native Android**: Kotlin (Android Studio) — best for Google Play apps\n\n**Learning path**: HTML/CSS → JavaScript → React → React Native (OR) Dart → Flutter\n\n**Projects to build**: Calculator → Weather App → Todo → Chat App → E-commerce\n**Jobs**: Mobile Developer ₹6–22 LPA in India" },
  { keywords: ["blockchain", "web3", "solidity", "ethereum", "nft", "crypto", "defi"], answer: "**Blockchain / Web3 Development:**\n\n⛓️ **Core concepts**:\n• Distributed ledger, consensus mechanisms (PoW, PoS)\n• Smart contracts (Ethereum, Solana)\n• DeFi (Decentralized Finance), NFTs, DAOs\n\n🛠️ **Tech stack**:\n• **Solidity** — Smart contracts on Ethereum\n• **Hardhat/Truffle** — Development frameworks\n• **Web3.js / Ethers.js** — Connect frontend to blockchain\n• **IPFS** — Decentralized storage\n• **Rust** — For Solana programs\n\n**Resources**: CryptoZombies, Buildspace, Alchemy University, Patrick Collins' YouTube\n**Jobs**: Blockchain Developer — ₹12–40 LPA in India (booming market)\n**Hackathons**: ETHIndia, Solana Hacker House — great for exposure" },
  { keywords: ["devops", "ci/cd", "jenkins", "github actions", "infrastructure"], answer: "**DevOps Learning Roadmap:**\n\n1️⃣ **Linux** — Command line, bash scripting, processes\n2️⃣ **Networking** — TCP/IP, DNS, HTTP, firewalls, VPNs\n3️⃣ **Version Control** — Git, GitHub\n4️⃣ **CI/CD** — GitHub Actions, Jenkins, GitLab CI\n5️⃣ **Docker** — Containers, Dockerfile, docker-compose\n6️⃣ **Kubernetes** — Orchestration, pods, deployments, Helm\n7️⃣ **Cloud** — AWS/GCP/Azure: EC2, S3, Lambda, VPC\n8️⃣ **IaC** — Terraform, Ansible\n9️⃣ **Monitoring** — Prometheus, Grafana, ELK stack\n\n**Certifications**: AWS SAA, CKA, HashiCorp Terraform Associate\n**Jobs**: DevOps Engineer ₹8–25 LPA, SRE ₹10–30 LPA\n**Resources**: TechWorld with Nana (YouTube), KodeKloud, Linux Foundation courses" },
  { keywords: ["artificial intelligence", "ai career", "become ai engineer"], answer: "**AI Engineering Career Path:**\n\n📚 **Foundation (3–6 months)**:\n• Python (NumPy, Pandas)\n• Math: Linear Algebra, Statistics, Calculus\n• Probability and Information Theory\n\n🤖 **ML Phase (3–6 months)**:\n• Supervised & Unsupervised Learning\n• Scikit-learn, model evaluation, feature engineering\n• Kaggle competitions\n\n🧠 **Deep Learning Phase (3–6 months)**:\n• Neural networks, backpropagation\n• CNNs (images), RNNs/LSTMs (sequences)\n• Transformers, BERT, GPT architecture\n• TensorFlow or PyTorch\n\n🚀 **Specialization**:\n• NLP (Natural Language Processing)\n• Computer Vision\n• Generative AI (LLMs, diffusion models)\n• MLOps (deploying AI models)\n\n**Jobs**: ML Engineer ₹10–35 LPA, AI Researcher ₹15–50 LPA" },
  { keywords: ["product manager", "product management", "pm role", "become product manager"], answer: "**Product Management Career Guide:**\n\n📋 **What does a PM do?**: Bridge between business, design, and engineering. Define what gets built and why.\n\n🛠️ **Key skills**:\n• User research & empathy\n• Data analysis (SQL, Excel, Mixpanel)\n• Writing PRDs (Product Requirements Documents)\n• Agile/Scrum methodology\n• Roadmapping, prioritization frameworks (RICE, MoSCoW)\n• Stakeholder communication\n\n🎓 **How to become a PM**:\n• Engineering/design/marketing background\n• MBA from top B-school (IIM, ISB) or Product-specific bootcamps\n• APM programs: Google APM, Microsoft PM, Flipkart's PM program\n\n📚 **Resources**: 'Cracking the PM Interview' (book), Lenny's Newsletter, Shreyas Doshi on LinkedIn\n**Salary**: ₹12–30 LPA (mid-level), ₹30–80 LPA+ (senior/Director)\n**Path**: Engineer/Designer → APM → PM → Senior PM → GPM/CPO" },
  { keywords: ["ux research", "user research", "usability testing"], answer: "**UX Research Guide:**\n\n🔍 **Core methods**:\n• User interviews — qualitative insights\n• Surveys — quantitative patterns\n• Usability testing — observe users using the product\n• A/B testing — compare two versions\n• Card sorting, tree testing — information architecture\n• Heatmaps (Hotjar), session recording\n\n📊 **Tools**: Figma, Maze, UserTesting, Lookback, Typeform, Dovetail\n\n**Career path**: UX Researcher → Senior UX Researcher → Research Lead → Head of Design Research\n**Salary**: ₹8–22 LPA in India, $80k–$150k in US\n**Transition**: Psychology/Sociology grads do well here alongside design grads" },
  { keywords: ["salary negotiation", "negotiate salary", "how to negotiate"], answer: "**Salary Negotiation Tips:**\n\n💰 **Before the negotiation**:\n• Research market rates (Glassdoor, LinkedIn Salary, AmbitionBox)\n• Know your BATNA (Best Alternative to Negotiated Agreement)\n• Have a number in mind — aim 15–20% above your target\n\n🗣️ **During negotiation**:\n• Never give a number first — let them anchor\n• Use: 'Based on my research and skills, I was expecting around ₹X'\n• Counter offer politely: 'I was hoping for ₹Y — is there flexibility?'\n• Negotiate beyond salary: joining bonus, ESOPs, WFH, extra leaves\n\n✅ **Script**: 'Thank you for the offer! I'm very excited about this role. Based on my research and the value I'll bring, I was expecting ₹X. Is there room to get closer to that?'\n\n📌 **Tip**: Always negotiate — companies expect it. The worst they say is no!" },
];

// ──────────────────────────────────────────────────────────────────────────────
// Intent detection
// ──────────────────────────────────────────────────────────────────────────────
function detectIntent(text: string): string {
  const t = text.toLowerCase();
  if (/email|mail|cold email|hr mail|send email/.test(t)) return "email";
  if (/skill|learn|improve|practice|course|tutorial|study/.test(t)) return "skill";
  if (/scholarship|grant|funding|financial aid|stipend scholarship|fellowship/.test(t)) return "scholarship";
  if (/roadmap|career path|career guidance|how to become|steps to|plan my career/.test(t)) return "roadmap";
  if (/salary|pay|money|income|earn|ctc|package|lpa/.test(t)) return "salary";
  if (/resume|cv|portfolio|linkedin profile|github profile/.test(t)) return "resume";
  if (/internship|job hunt|placement|campus|offer letter|hire me/.test(t)) return "job";
  if (/interview|prepare|interview question|aptitude|coding round|hr round|technical round/.test(t)) return "interview";
  if (/college|university|admission|entrance exam|gate score|gre score|cat exam/.test(t)) return "exam";
  if (/programming language|which language|best language|python vs|java vs/.test(t)) return "language";
  if (/project|portfolio project|github project|build what|hackathon/.test(t)) return "project";
  if (/certification|certificate|aws cert|google cert|microsoft cert|azure cert/.test(t)) return "certification";
  if (/ai|machine learning|deep learning|neural|nlp|computer vision|generative/.test(t)) return "ai";
  if (/cloud|aws|azure|gcp|devops|docker|kubernetes|terraform/.test(t)) return "cloud";
  if (/cybersecurity|security|ethical hacking|penetration|ctf|bug bounty/.test(t)) return "security";
  if (/web|frontend|backend|fullstack|react|node|html|css|javascript/.test(t)) return "webdev";
  if (/data|analytics|tableau|power bi|sql|database|excel/.test(t)) return "data";
  if (/design|ui|ux|figma|graphic|product design/.test(t)) return "design";
  if (/startup|entrepreneur|business|freelance|self employed/.test(t)) return "startup";
  if (/higher study|masters|phd|abroad|ms in us|mba|gre|ielts|toefl/.test(t)) return "higherstudy";
  if (/hello|hi|hey|help|who are you|what can you do|good morning|good evening/.test(t)) return "greeting";
  if (/career|profession|field|domain|which career|best career for me/.test(t)) return "career";
  return "chat";
}

// ──────────────────────────────────────────────────────────────────────────────
// Find best match from all Q&A sources
// ──────────────────────────────────────────────────────────────────────────────
function findBestAnswer(query: string): string | null {
  const q = query.toLowerCase().trim();

  // 1. Check extended Q&A (keyword array matching)
  let bestExtended: string | null = null;
  let bestExtendedScore = 0;
  for (const item of extendedQA) {
    for (const keyword of item.keywords) {
      if (q.includes(keyword)) {
        const score = keyword.length;
        if (score > bestExtendedScore) {
          bestExtendedScore = score;
          bestExtended = item.answer;
        }
      }
    }
  }
  if (bestExtended && bestExtendedScore >= 3) return bestExtended;

  // 2. Check original careerQA (exact substring match)
  let bestQA: string | null = null;
  let bestQAScore = 0;
  for (const item of careerQA) {
    if (q.includes(item.question.toLowerCase())) {
      const score = item.question.length;
      if (score > bestQAScore) {
        bestQAScore = score;
        bestQA = item.answer;
      }
    }
  }
  if (bestQA) return bestQA;

  // 3. Fuzzy match on original careerQA (60% word overlap)
  for (const item of careerQA) {
    const words = item.question.toLowerCase().split(/\s+/);
    const matchCount = words.filter((w) => q.includes(w) && w.length > 3).length;
    const score = matchCount / words.length;
    if (score >= 0.6 && matchCount > bestQAScore) {
      bestQAScore = matchCount;
      bestQA = item.answer;
    }
  }

  return bestQA;
}

// ──────────────────────────────────────────────────────────────────────────────
// Generate response
// ──────────────────────────────────────────────────────────────────────────────
function generateResponse(message: string, intent: string): string {
  const msg = message.toLowerCase();

  // Q&A lookup first
  const qaAnswer = findBestAnswer(msg);
  if (qaAnswer) return qaAnswer;

  // Career database lookup
  for (const career of Object.keys(careerDatabase)) {
    if (msg.includes(career.toLowerCase())) {
      const info = careerDatabase[career]!;
      return `**${career}** is a great career choice!\n\n📌 **Description**: ${info.description}\n\n🧠 **Key Skills**: ${info.requiredSkills.slice(0, 5).join(", ")}\n\n🗺️ **First Steps**: ${info.steps.slice(0, 3).join(" → ")}\n\n🏆 **Certifications**: ${info.certifications.slice(0, 2).join(", ")}\n\n📋 **Exams**: ${info.exams.slice(0, 2).join(", ")}\n\n💡 Use our **Career Assessment** for a personalized recommendation, or **Skill Intelligence** to get your full learning roadmap!`;
    }
  }

  // Intent-based fallback
  switch (intent) {
    case "greeting":
      return "Hello! 👋 I'm your AI Career Advisor. I can help with:\n\n🎯 Career guidance & assessment\n💡 Skill learning roadmaps\n🎓 Scholarships & financial aid\n📝 Resume & interview tips\n💼 Jobs, internships & placements\n📧 Cold email tips\n🎓 Higher studies (MS, GATE, MBA)\n💰 Salary insights\n\nWhat would you like to know?";

    case "scholarship":
      return "Here are scholarships you can apply for! 🎓\n\n**Merit-based**:\n• KVPY — Science students\n• INSPIRE — Top 1% in board exams\n• Prime Minister's Scholarship — Wards of defence personnel\n\n**Need-based**:\n• PM-YASASVI — OBC/EBC/DNT students\n• HDFC Badhte Kadam — Economically weaker sections\n• Reliance Foundation Scholarships\n\n**Women in tech**:\n• Adobe Women in Technology\n• Google Women Techmakers\n• Cisco Women in Tech Scholarship\n\nGo to the **Scholarships** tab to filter by your profile!";

    case "skill":
      return "To identify skills to learn, use our **Skill Intelligence** tool! 💡\n\nTop in-demand skills in 2025:\n🐍 Python • 📊 SQL • ⚛️ React.js • ☁️ AWS • 🤖 Machine Learning • 🔒 Cybersecurity • 📱 Flutter • 🐳 Docker\n\nUse the **Skill Intelligence** tab → select your target career → enter current skills → get a personalized learning plan with courses, certifications & timelines!";

    case "roadmap":
      return "Our **Skill Intelligence** section gives you a complete roadmap! 🗺️\n\nJust pick your target career and enter your current skills — you'll get:\n✅ Skills ranked by industry demand\n✅ Estimated time per skill\n✅ Top courses and certifications\n✅ Relevant exams\n\nAlso check the **Career Roadmap** after the Career Assessment!";

    case "salary":
      return "Salary ranges in India (2025):\n\n💼 **Software Engineer**: ₹6–20 LPA\n📊 **Data Scientist**: ₹8–25 LPA\n🤖 **AI/ML Engineer**: ₹10–30 LPA\n☁️ **Cloud/DevOps**: ₹8–25 LPA\n🔒 **Cybersecurity**: ₹7–20 LPA\n🎨 **UI/UX Designer**: ₹5–18 LPA\n📱 **Mobile Developer**: ₹6–20 LPA\n🖥️ **Full Stack Dev**: ₹7–22 LPA\n📣 **Digital Marketer**: ₹4–15 LPA\n📋 **Product Manager**: ₹12–30 LPA\n\nSalaries vary with experience, skills, company size, and city.";

    case "resume":
      return "Top resume tips:\n\n✅ Keep it **1 page** maximum\n✅ Strong **summary**: '3rd year CS student skilled in Python, React, and ML seeking internship in data science'\n✅ Highlight **projects** with tech stack + impact metrics\n✅ List skills prominently (Python, SQL, React...)\n✅ Include **GitHub** and **LinkedIn** links\n✅ Quantify: 'Improved query speed by 40%'\n✅ Use action verbs: built, designed, deployed, led, optimized\n✅ Tailor to each job description\n✅ ATS-friendly format (no tables, no images)\n\n🛠️ Free tools: Novoresume, Resume.io, Overleaf LaTeX templates";

    case "job":
      return "To land your first tech job:\n\n🎯 **Build 3–5 strong projects** with live demos on GitHub\n📚 **Practice DSA** on LeetCode (100+ problems: easy → medium)\n🏆 **Get certifications** (AWS, Google, Meta)\n🤝 **Network on LinkedIn** — connect with 20 HRs/week\n📝 **Apply consistently** — 10+ apps/week on Naukri, Internshala, LinkedIn\n📧 **Cold email HRs** using our **Email Generator** — HR contacts are pre-filled!\n💬 **Practice interviews** using STAR method\n🏫 **Talk to seniors** in your target companies for referrals";

    case "interview":
      return "Interview preparation guide:\n\n**Technical Round:**\n📌 LeetCode: Easy → Medium → Hard progression\n📌 Core CS: DBMS, OS, Computer Networks, OOP\n📌 Review all your projects thoroughly\n📌 System design basics (for senior roles)\n\n**HR Round:**\n📌 'Tell me about yourself' (2-min story)\n📌 Why this company? (Research before interview)\n📌 STAR method for behavioral questions\n📌 Questions to ask the interviewer\n\n**Aptitude**: IndiaBix, PrepInsta, Face Prep\n**Resources**: GeeksForGeeks, InterviewBit, Glassdoor company reviews";

    case "exam":
      return "Important exams for CS/IT students:\n\n🎓 **GATE** — M.Tech at IITs/NITs, PSU jobs\n🌍 **GRE** — MS abroad (320+ for top 20 univ)\n📊 **CAT** — MBA at IIMs\n🏛️ **UPSC** — Civil services\n💻 **TCS NQT / Infosys InfyTQ** — Campus recruitment\n🔬 **KVPY** — Science talent scholarships\n🌐 **IELTS/TOEFL** — English for abroad studies\n🎓 **NIMCET** — MCA at NITs";

    case "language":
      return "Programming language guide:\n\n🐍 **Python** — Data science, AI/ML, scripting. Best for beginners.\n☕ **Java** — Enterprise apps, Android. Strong OOP base.\n⚡ **JavaScript** — Web development (frontend + Node.js backend)\n🔷 **C++** — Competitive programming, game dev, systems\n📱 **Kotlin** — Android development\n🦀 **Rust** — Systems programming, high performance\n🐹 **Go** — Backend microservices, cloud-native\n🍎 **Swift** — iOS development\n\n**For beginners**: Start with Python → then pick based on your goal!";

    case "project":
      return "Project ideas for your portfolio:\n\n🌐 **Web**: E-commerce site, blog platform, real-time chat app\n📊 **Data**: Sales dashboard, stock predictor, COVID tracker\n🤖 **AI/ML**: Image classifier, resume parser, fake news detector, chatbot\n☁️ **Cloud**: Serverless app, CI/CD pipeline\n🔒 **Security**: Password manager, vulnerability scanner\n📱 **Mobile**: Expense tracker, habit tracker, food delivery clone\n\n✅ Always: Deploy live + write a README + add to GitHub\n✅ Write a blog post about each project for SEO and visibility";

    case "certification":
      return "Top certifications by domain:\n\n☁️ **Cloud**: AWS Solutions Architect, Google Cloud ACE, Azure AZ-900\n🤖 **AI/ML**: TensorFlow Developer, AWS ML Specialty\n🔒 **Security**: CompTIA Security+, CEH, OSCP\n📊 **Data**: Google Data Analytics, Tableau Desktop Specialist\n🌐 **Web**: Meta Frontend Developer, Full Stack Open\n🏗️ **DevOps**: CKA (Kubernetes), Docker Associate, GitHub Actions\n\n**Free resources**: Google Career Certificates, Microsoft Learn, AWS Skill Builder";

    case "ai":
      return "AI/ML career path:\n\n📚 Python → Linear Algebra → Statistics → Probability\n🤖 ML: Scikit-learn → Kaggle competitions\n🧠 DL: PyTorch → CNNs → Transformers → LLMs\n🔤 NLP: spaCy, HuggingFace, BERT, GPT fine-tuning\n\n**Generative AI (2025 focus)**: LLM prompting → RAG → Fine-tuning → LangChain → LlamaIndex\n\n**Jobs**: ML Engineer ₹10–35 LPA, AI Researcher ₹15–50 LPA\n**Resources**: fast.ai, HuggingFace, deeplearning.ai, Papers With Code";

    case "cloud":
      return "Cloud & DevOps path:\n\n☁️ Linux → Networking → Docker → Kubernetes → AWS/GCP/Azure\n🔄 CI/CD: GitHub Actions → Jenkins\n📦 IaC: Terraform → Ansible\n📊 Monitoring: Prometheus + Grafana\n\n**Certifications**: AWS SAA-C03, Google ACE, CKA\n**Jobs**: Cloud Engineer ₹8–25 LPA, DevOps ₹8–22 LPA\n**Resources**: TechWorld with Nana, KodeKloud, AWS Skill Builder (free tier)";

    case "security":
      return "Cybersecurity career path:\n\n🌐 Networking → Linux → Python scripting\n🔓 Ethical hacking: Kali Linux, Metasploit, Burp Suite\n🕵️ Web pentesting, network pentesting\n🏆 CTFs: TryHackMe → HackTheBox\n🐛 Bug bounty: HackerOne, Bugcrowd\n\n**Certifications**: CompTIA Security+, CEH, OSCP (advanced)\n**Jobs**: Security Analyst ₹7–20 LPA, Penetration Tester ₹8–25 LPA";

    case "webdev":
      return "Web Development path:\n\n🏗️ HTML → CSS → JavaScript → React/Vue\n⚙️ Backend: Node.js/Python → REST APIs → SQL/NoSQL\n🚀 Deploy: Vercel (frontend) → Railway/Render (backend)\n\n**Full Stack**: MERN (MongoDB, Express, React, Node) or PERN (PostgreSQL)\n**Jobs**: Frontend ₹5–18 LPA, Backend ₹6–20 LPA, Full Stack ₹7–22 LPA\n**Free resources**: The Odin Project, freeCodeCamp, MDN";

    case "data":
      return "Data Analytics path:\n\n📊 Excel → SQL → Python (Pandas, NumPy) → Visualization (Tableau/Power BI)\n📉 Statistics → ML basics → Business storytelling\n\n**Jobs**: Data Analyst ₹5–18 LPA, Business Analyst ₹6–20 LPA\n**Practice**: Kaggle datasets, data.gov.in, Google Data Analytics certificate";

    case "design":
      return "UI/UX Design path:\n\n🎨 Figma fundamentals → Typography + Color theory → UX Process (Research → Wireframe → Prototype → Test)\n📱 Mobile: Material Design + iOS HIG → Accessibility (WCAG)\n🌐 Web: Responsive design, design systems\n\n**Portfolio**: Behance, Dribbble\n**Jobs**: UI/UX Designer ₹5–20 LPA\n**Resources**: Google UX Design Certificate (Coursera), Refactoring UI book";

    case "startup":
      return "Entrepreneurship guide:\n\n🚀 Problem → Validate → MVP → Iterate\n💻 Freelancing first: Upwork, Fiverr, LinkedIn\n💰 Funding: Bootstrapped → Angel → VC\n📋 Resources: Startup India (tax benefits), Y Combinator Startup School (free), NASSCOM 10,000 Startups\n\n**Build in public** on Twitter/LinkedIn for traction and community!";

    case "higherstudy":
      return "Higher studies options:\n\n🇮🇳 **M.Tech (India)**: GATE exam → IIT/NIT admissions\n🇮🇳 **MCA**: NIMCET → NIT MCA programs\n🌍 **MS abroad**: GRE 320+ + IELTS 7.0 → US/UK/Canada/Germany\n🎓 **MBA**: CAT (India) / GMAT (abroad)\n\n**MS universities (good ROI)**: Georgia Tech, UT Dallas, Arizona State, Northeastern, USC\n\n**Key tip**: Apply 12–18 months in advance. Strong SOP + LORs + GRE = strong application!";

    case "email":
      return "Use our **Email Generator** tab to create and send cold emails! 📧\n\nHR & Manager email contacts are **pre-filled** for each company. Just:\n1. Enter your profile details\n2. Click Generate Emails\n3. Expand any email → click 'Open in Email Client'\n4. Your email app opens with everything pre-filled — just hit send!\n\n**Tips for cold emails**: Short subject, personalized body, clear CTA, follow up in 5–7 days.";

    case "career":
      return "Not sure which career fits you? Take our **Career Assessment**! 🤔\n\nAnswer 5 questions about your interests and strengths → get matched to the best career paths:\n• Software Developer, Full Stack, Data Scientist, AI/ML Engineer\n• Cloud/DevOps, Cybersecurity, UI/UX Designer\n• Digital Marketer, Product Manager\n\nEach path includes a detailed roadmap, skills, certifications, and next steps!";

    default:
      return `Great question! Here's what I can help you with:\n\n🎯 **Careers**: BCA, BTech, MCA paths, career assessment\n💡 **Skills**: Python, Java, React, ML, Cloud, SQL — learning roadmaps\n🎓 **Scholarships**: Merit, need-based, women in tech\n💼 **Jobs & Internships**: Campus, off-campus, freelancing, cold emails\n📝 **Resume & Interview**: Writing tips, DSA prep, HR round\n💰 **Salaries**: Role-wise pay in India and abroad\n🎓 **Higher Studies**: GATE, GRE, MS, MCA, MBA\n🏆 **Certifications & Projects**: What to build and earn\n\nTry asking specifically: 'How to learn Python?', 'Best scholarships for BCA students?', 'How to get a software job?'`;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Route
// ──────────────────────────────────────────────────────────────────────────────
router.post("/message", (req, res) => {
  const body = SendChatMessageBody.parse(req.body);
  const { message } = body;

  const intent = detectIntent(message);
  const response = generateResponse(message, intent);

  const data = SendChatMessageResponse.parse({ response, intent });
  res.json(data);
});

export default router;

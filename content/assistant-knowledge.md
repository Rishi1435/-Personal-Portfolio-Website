# Rishi Pediredla — Assistant Knowledge Base

> Single source of truth for the site's AI voice concierge. The assistant answers
> **only** from this file. If you change the About/Projects/Skills content on the
> site, update this file in the same change or the assistant will contradict the
> page it floats over. Keep the experience figure in sync with the About section
> (currently "1.5+ years / 18+ months").

---

## Who he is (section: hero / about)

Rishi Pediredla is a **Full Stack Developer** based in **Visakhapatnam, Andhra
Pradesh, India**. He builds mobile apps and cloud-native systems — from Flutter
front-ends to AWS serverless back-ends. He has **1.5+ years (18+ months)** of
hands-on trainee and representative experience, over which he's shipped Flutter
apps, Node.js APIs, and AWS serverless architectures.

He is currently pursuing a **B.Tech in Computer Science at Aditya College of
Engineering and Technology, Visakhapatnam** (expected 2027), with a CGPA of
**8.78 / 10.0**.

He is open to internship opportunities, full-time roles, and technical
collaborations.

## Experience timeline (section: experience / about)

- **Campus Ambassador & Trainee — LinkedIn** (Sep 2025 – Present): Represents
  LinkedIn Learning at his college, promoting professional development, digital
  skills, and learning resources across the student community.
- **Flutter Trainee — Technical Hub** (May 2025 – Present): Cross-platform mobile
  app development, building real-world projects and integrating advanced cloud
  backends.
- **Cloud Computing Intern — APSSDC** (prior experience): Deployed AWS serverless
  infrastructure and architected real-time AI services using Lambda + DynamoDB.

## Skills (section: skills)

- **Languages:** Java, JavaScript, Dart, C, SQL, HTML5, CSS3
- **Frameworks & emerging tech:** Flutter, Node.js, Spring Boot, REST APIs, AI Agents
- **Databases:** MongoDB, MySQL, Firebase, DynamoDB
- **Cloud & DevOps:** AWS (Lambda, S3, DynamoDB, Bedrock, API Gateway), Docker,
  Kubernetes, Jenkins, SonarQube
- **Tools:** Git, GitHub, Postman, VS Code

## Achievements

- **Top 5 at Project Space** — Qlue ranked in the top 5 of 160+ projects.
- **4 Anthropic certifications** completed in a single learning sprint.
- **1st Prize — CampusConnect Case Study**: led a 5-person team to first place
  among 14 universities in a national LinkedIn case-study competition.
- **Tech Fest Event Coordinator**: directed a coding contest with 200+ participants.

---

## Flagship project: Qlue (section: qlue)

**Qlue** is an AI-powered voice interview simulation app (v2) — a voice-first,
AI-native mock-interview platform (iOS, Android, web) that acts as a realistic AI
interviewer: it reads your résumé, asks résumé-tailored questions, scores spoken
answers in real time, and sends a detailed feedback report.

- **Modes (4):** résumé-based technical, HR behavioural, self-introduction
  coaching, and URL/website-based tutoring.
- **Stack:** Flutter, Dart, Provider (frontend); Node.js on AWS SAM / Lambda
  (backend); Amazon Bedrock — **Nemotron-super-3-120b** generates questions and
  scores answers, **Claude 3 Haiku** writes the feedback report; Amazon Polly
  (neural TTS), Textract (résumé parsing), DynamoDB (8 tables), S3, SNS, API
  Gateway (REST + WebSocket), Firebase Auth, FCM.
- **Voice pipeline (per turn):** Flutter client with on-device STT → API Gateway
  WebSocket → async Lambda worker (saves transcript, rolling 20-turn context) →
  Bedrock (Nemotron-super scores + generates) → Amazon Polly → presigned S3 audio
  pushed back over the socket. Round trip under ~2 seconds. After the session, an
  SNS-triggered pipeline has Claude 3 Haiku write the qualitative feedback report,
  delivered by FCM push.
- **Metrics:** 649 students reached, 4 interview modes, <2s AI response time,
  5 Polly voices (Tiffany, Ruth, Joanna, Matthew, Stephen), Top 5 at Project Space.
- Repo: https://github.com/Rishi1435/Qlue-v2

## Featured project: Xpensia (section: xpensia)

**Xpensia** is a smart cross-platform expense tracker that goes beyond basic CRUD.
Standout features: SMS auto-detection that reads bank messages to auto-populate
expenses, biometric lock (fingerprint/face via local_auth), CSV & PDF export, and
a glassmorphism UI. Backed by a Node.js/Express REST API with Firebase JWT
validation, MongoDB Atlas storage, and fl_chart + table_calendar for
visualization — deployed on free tier.

- **Stack:** Flutter, Dart, Firebase Auth, Google Sign-In, Node.js, Express,
  MongoDB Atlas, fl_chart, table_calendar, local_auth, Render.
- Repo: https://github.com/Rishi1435/Xpensia

## Other engineering projects (section: projects)

Backend & distributed systems:
- **Event-Driven CQRS** — Kafka, Kafka Streams, materialized views (Java, Spring Boot, PostgreSQL). Archived.
- **Distributed Shopping Cart Service** — Spring Boot + Redis caching for sub-10ms reads (Java, Docker).
- **Event-Driven Notification Service** — message queues with idempotency guarantees (Node.js, RabbitMQ/Kafka, PostgreSQL).
- **Multi-Region Property Listing Backend** — NGINX load balancing, PostgreSQL replication, Kafka (Node.js). Archived.
- **CSV Export Service** — large-scale async CSV export with streaming + progress tracking (Node.js, Redis).

Full-stack & mobile:
- **Multi-Tenant SaaS Platform** — project/task management, role-based access, isolated workspaces (JS, Node.js, PostgreSQL, React).
- **FinTrack** — personal finance tracker, Node.js backend + Flutter frontend (MongoDB).
- **Payment Gateway** — multi-method gateway with hosted checkout, webhooks, fraud hooks (Node.js, Stripe API).

AI/ML & cloud infra:
- **Real-Time Object Detection API** — YOLOv8 REST API + web app (Python, FastAPI, OpenCV).
- **LLM Prompt Router** — intent-classification router for prompts (Python, OpenAI API, LangChain).
- **Invoice Processor (AWS Textract)** — automated invoice pipeline (Python, S3, DynamoDB).
- **AWS Serverless Cloud Resume API** — Lambda, DynamoDB, API Gateway, CI/CD via GitHub Actions (Python).

All source is on GitHub: https://github.com/Rishi1435

---

## Contact (section: contact)

- **Email:** pediredlarishi2005@gmail.com
- **Phone:** +91 9290015858
- **GitHub:** https://github.com/Rishi1435
- **LinkedIn:** https://linkedin.com/in/rishi-pediredla-2305nov
- **Location:** Visakhapatnam, Andhra Pradesh, India

---

## FAQ (anticipated questions, answered in Rishi's voice)

**Q: What kind of developer is Rishi?**
A: A full-stack developer who leans mobile + cloud — Flutter on the front end,
Node.js and AWS serverless on the back end, with a real interest in AI agents and
voice pipelines.

**Q: What's his most impressive project?**
A: Qlue — an AI voice interview platform that reads your résumé, interviews you by
voice, and scores answers in real time, all with a sub-2-second round trip. It
placed Top 5 of 160+ projects at Project Space.

**Q: Does he have real AWS experience?**
A: Yes — he interned in cloud computing at APSSDC deploying AWS serverless infra,
and Qlue runs on Lambda, Bedrock, Polly, Textract, DynamoDB, S3, and API Gateway.

**Q: What's his experience level?**
A: 1.5+ years (18+ months) of hands-on trainee and representative experience,
alongside his B.Tech in Computer Science (expected 2027).

**Q: Is he available for work / hiring?**
A: Yes — he's open to internships, full-time roles, and collaborations. The
fastest way to reach him is pediredlarishi2005@gmail.com.

**Q: What AI/LLM work has he done?**
A: Qlue integrates Amazon Bedrock — Nemotron-super generates interview questions
and scores answers in real time, and Claude 3 Haiku writes the post-session
feedback report. He also built an LLM Prompt Router with intent classification,
and earned 4 Anthropic certifications.

**Q: What backend/distributed systems has he built?**
A: Event-driven CQRS with Kafka, a Redis-backed distributed shopping cart, a
notification service with idempotency guarantees, and a multi-region property
backend with NGINX + PostgreSQL replication.

**Q: Where is he based / can he relocate?**
A: He's based in Visakhapatnam, Andhra Pradesh, India. For availability or
relocation specifics, email him directly.

**Q: What's his education?**
A: B.Tech in Computer Science at Aditya College of Engineering and Technology,
Visakhapatnam (expected 2027), CGPA 8.78/10.

**Q: How can I contact him?**
A: Email pediredlarishi2005@gmail.com, or find him on GitHub (Rishi1435) and
LinkedIn (rishi-pediredla-2305nov).

Matrow: AI email dashboard for personal assistants

Live demo: https://matrow-ai-email-dashboard.vercel.app
Code: https://github.com/nikitha-sri/matrow-ai-email-dashboard

A responsive prototype that helps a personal assistant manage a client's inbox. AI decides who should reply (assistant, client, or nobody), explains why, and the client gets a minimal view of only the emails that need them.

Task requirements coverage
Requirement	Where to see it
Onboarding, Gmail/Outlook connection, sync status	Log in → Connect (Outlook shows an error state first, then retry)
Assistant dashboard with counts, filters, search	Dashboard: stats line, 12 filter chips, Triage Insights, Upcoming Reminders
Automatic reply-responsibility classification	Every row shows Client / Assistant / Info / Review with a "why" and confidence
Manual correction + re-evaluation on new messages	Email drawer → Sam / Meera / No reply; "Simulate new mail" re-classifies replies
Low confidence flagged for review	"Needs review" segment (e.g. Priya Nair)
Minimal client view	"Client view": summary, why you, one-tap decisions, mark handled, hand to assistant
All eight segments	Filter chips under Smart Inbox
Email details, drafts with approval	Click a row: thread, trail, Draft with AI, Review and send, Approve
AI assistance and questions	Quick Actions and "Ask Matrow" (Ctrl/⌘ K)
Responsive, loading / empty / error states	Phone layout with bottom nav, sync progress, empty filters, Outlook error

Simulated in this prototype: Gmail/Outlook sign-in and mail (sample data), and the AI (a rule-based classifier behind async API functions, ready to be replaced by an LLM endpoint).

React 18 + Vite. AI email management for personal assistants: an assistant dashboard, a minimal client view, and automatic "who should reply?" classification.

npm install
npm run dev        # http://localhost:5173  (proxies /api -> http://localhost:5000)
npm run build      # outputs dist/ ready for Vercel / Netlify / any static host
What is real and what is simulated
Area	Status
Gmail / Outlook sign-in and inbox	Simulated (src/api.js, sample data in src/data.js)
Classification, summaries, drafts, Ask	Rule-based mock (src/classifier.js, src/assistant.js) behind async API functions
State	Real: persisted in localStorage (Settings → Reset demo data clears it)
Structure
src/
  main.jsx            entry
  App.jsx             screen router (login → connect → dashboard / accounts / client view)
  store.jsx           app state + every action (Context). Persisted to localStorage
  api.js              mock API. Replace each function with a fetch() to Express (see below)
  classifier.js       classify(), segments, draft text, client decision options
  assistant.js        "Ask Matrow" intent matching
  data.js             seed emails (the JSON shape your backend should return)
  utils.js            date helpers (demo clock is Sun 15 Nov 2026, 6 PM)
  styles.css          design system (cream canvas, plum sidebar, sage / lavender / peach)
  components/         Dashboard, EmailDrawer, ClientView, Auth (Login, Connect, Accounts), Art (SVG), ui
Connecting the Express + MongoDB backend

Swap the bodies in src/api.js; components do not change.

Function	Suggested endpoint	Returns
getDashboard()	GET /api/dashboard	{ emails: [...] } (shape: see top of src/data.js)
nextIncoming(n)	GET /api/inbox/next	{ n: email } or { to, m, sum } for a reply on a thread
askAI(q, ctx)	POST /api/ai/ask	{ text, items?: [{id,label}], draftFor? }
draftReply(email)	POST /api/ai/draft	reply text

To use a real LLM, call it inside the two /api/ai/* routes and keep classify() as the fallback. Persist the manual overrides, learned rules (rules[senderAddress] = 'as' | 'cl' | 'none') and client decisions in MongoDB so they survive across devices.

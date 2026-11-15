import { useEffect, useMemo, useState } from "react";
import {
  Home, Mail, Bot, BarChart3, Settings, Search, Bell, Heart, Sparkles,
  ArrowRight, Star, FileText, Send, CalendarClock, Zap, TrendingUp, CalendarDays,
  Circle, Reply, ListTodo, Flame,
} from "lucide-react";
import { getDashboard } from "./api";
import { Logo, Flower, BriefingRobot, PromoRobot, Plant } from "./Art";

const NAV = [
  { label: "Dashboard", icon: Home },
  { label: "Smart Inbox", icon: Mail },
  { label: "Client View", icon: FileText },
  { label: "AI Assistant", icon: Bot },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const FILTERS = [
  "All",
  "Priority",
  "Work",
  "Personal",
  "News",
  "Assistant to Reply",
  "Client to Reply",
  "No Reply Needed",
  "Action Required",
];

const CLASSIFICATIONS = [
  "Assistant to Reply",
  "Client to Reply",
  "No Reply Needed",
  "Action Required",
];

const initials = (name = "") => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

const classificationClass = (classification = "") =>
  classification.toLowerCase().replace(/\s+/g, "-");

function Sidebar({ user, active, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Logo />
        <h1>matrow.</h1>
        <p>A clearer day starts here.</p>
      </div>

      <nav>
        {NAV.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${active === label ? "is-active" : ""}`}
            onClick={() => onChange(label)}
          >
            <Icon size={22} strokeWidth={2.2} />
            {label}
          </button>
        ))}
      </nav>

      <div className="promo">
        <PromoRobot />
        <div className="promo-body">
          <p>Let AI handle the busy work!</p>
          <button className="pill-btn">Try Smart Actions <ArrowRight size={14} /></button>
        </div>
      </div>

      <div className="profile">
        <div className="avatar avatar--sm">{initials(user.name)}</div>
        <div>
          <strong>{user.name}</strong>
          <span>{user.plan}</span>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ query, onQuery, user }) {
  return (
    <header className="topbar">
      <label className="search">
        <Search size={24} strokeWidth={1.8} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search emails, tasks..."
        />
      </label>
      <div className="topbar-right">
        <button className="bell" aria-label="Notifications">
          <Bell size={28} strokeWidth={1.8} />
          <span className="badge">2</span>
        </button>
        <div className="avatar">{initials(user.name)}</div>
      </div>
    </header>
  );
}

function Greeting({ name }) {
  const hour = new Date().getHours();
  const word = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return (
    <section className="greeting">
      <div>
        <h2>
          Good {word}, {name}! <Sparkles className="spark" size={28} />
        </h2>
        <p>A clearer day starts here.</p>
      </div>
      <Flower />
      <div className="quote">“You’ve got this!” <Heart size={22} fill="#6B3F8C" color="#6B3F8C" /></div>
    </section>
  );
}

function EmailPulse({ pulse }) {
  const rows = [
    { label: "Priority", value: pulse.priority, icon: Flame, cls: "peach" },
    { label: "Replies", value: pulse.replies, icon: Reply, cls: "lilac" },
    { label: "Tasks", value: pulse.tasks, icon: ListTodo, cls: "sage" },
  ];
  return (
    <section className="card pulse">
      <div className="pulse-main">
        <div className="pulse-icon"><Mail size={44} strokeWidth={1.8} /></div>
        <div>
          <h3>Your Email Pulse</h3>
          <p className="pulse-count"><strong>{pulse.needAttention}</strong> emails need attention</p>
          <small>Your AI assistant has organized today’s priorities.</small>
        </div>
      </div>
      <ul className="pulse-list">
        {rows.map(({ label, value, icon: Icon, cls }) => (
          <li key={label}>
            <button className={`pulse-row ${cls}`}>
              <span className="pulse-dot"><Icon size={13} /></span>
              <span className="pulse-num">{String(value).padStart(2, "0")}</span>
              <span className="pulse-label">{label}</span>
              <ArrowRight size={17} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DailyBriefing({ text }) {
  return (
    <section className="card briefing">
      <div className="briefing-body">
        <h3><Sparkles size={22} /> AI Daily Briefing</h3>
        <p>{text}</p>
        <button className="dark-btn">View Details <ArrowRight size={16} /></button>
      </div>
      <div className="briefing-robot"><BriefingRobot /></div>
    </section>
  );
}

function EmailDetail({
  email,
  onUpdateClassification,
  onToggleImportant,
  onToggleUnread,
  onArchive,
  onMarkHandled,
}) {
  if (!email) return null;

  return (
    <section className="card email-detail">
      <div className="detail-head">
        <div>
          <p className="eyebrow">AI classification</p>
          <h4>{email.name}</h4>
        </div>
        <span className={`classification-badge ${classificationClass(email.classification)}`}>
          {email.classification}
        </span>
      </div>

      <h5>{email.subject}</h5>
      <p className="detail-summary">{email.summary}</p>

      <div className="detail-actions">
        <button className="mini-btn" onClick={() => onToggleImportant(email.id)}>
          {email.important ? "Remove priority" : "Mark important"}
        </button>
        <button className="mini-btn" onClick={() => onToggleUnread(email.id)}>
          {email.unread ? "Mark as read" : "Mark unread"}
        </button>
        <button className="mini-btn" onClick={() => onArchive(email.id)}>Archive</button>
        <button className="dark-btn dark-btn--small" onClick={() => onMarkHandled(email.id)}>Handled</button>
      </div>

      <label className="classification-editor">
        <span>Reply responsibility</span>
        <select
          value={email.classification}
          onChange={(event) => onUpdateClassification(email.id, event.target.value)}
        >
          {CLASSIFICATIONS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <div className="detail-grid">
        <div>
          <p className="meta-label">Why this matters</p>
          <p>{email.reason}</p>
        </div>
        <div>
          <p className="meta-label">Received</p>
          <p>{email.time}</p>
        </div>
      </div>

      <div className="conversation">
        {email.conversation?.map((msg, index) => (
          <div key={`${msg.from}-${index}`} className="message">
            <strong>{msg.from}</strong>
            <p>{msg.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SmartInbox({
  emails,
  filter,
  onFilter,
  onToggle,
  selected,
  onSelect,
  selectedEmail,
  onUpdateClassification,
  onToggleImportant,
  onToggleUnread,
  onArchive,
  onMarkHandled,
}) {
  return (
    <section className="card inbox">
      <div className="card-head">
        <h3><Mail size={34} strokeWidth={1.8} /> Smart Inbox</h3>
        <a href="#inbox" className="link">View all <ArrowRight size={15} /></a>
      </div>

      <div className="chips">
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? "is-on" : ""}`} onClick={() => onFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {emails.length === 0 ? (
        <p className="empty">No emails match this view.</p>
      ) : (
        <ul className="mail-list">
          {emails.map((m) => (
            <li
              key={m.id}
              className={`mail-row ${selectedEmail?.id === m.id ? "is-selected" : ""}`}
              onClick={() => onSelect(m.id)}
            >
              <span className="mail-flag">
                {m.starred || m.important ? (
                  <Star size={18} fill="#F5B731" color="#F5B731" />
                ) : (
                  <Circle size={10} fill={m.dot} color={m.dot} />
                )}
              </span>
              <span className="mail-avatar" style={{ background: m.avatarColor }}>{m.initials}</span>
              <div className="mail-text">
                <strong>{m.name}</strong>
                <span>{m.subject}</span>
              </div>
              <div className="mail-meta">
                <time>{m.time}</time>
                <span className={`classification-pill ${classificationClass(m.classification)}`}>{m.classification}</span>
              </div>
              <span className={`tag tag--${m.tag.toLowerCase()}`}>{m.tag}</span>
              <input
                type="checkbox"
                className="check"
                aria-label={`Select email from ${m.name}`}
                checked={selected.includes(m.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggle(m.id);
                }}
              />
            </li>
          ))}
        </ul>
      )}
      {selectedEmail && (
        <EmailDetail
          email={selectedEmail}
          onUpdateClassification={onUpdateClassification}
          onToggleImportant={onToggleImportant}
          onToggleUnread={onToggleUnread}
          onArchive={onArchive}
          onMarkHandled={onMarkHandled}
        />
      )}
    </section>
  );
}

function QuickActions({ onAction }) {
  const actions = [
    { label: "Summarize", sub: "This Email", icon: FileText },
    { label: "Draft a Reply", icon: Send },
    { label: "Set a Follow-up", icon: CalendarClock },
  ];
  return (
    <section className="card quick">
      <h3><Zap size={22} fill="#2E1F3B" /> Quick Actions</h3>
      <div className="quick-row">
        {actions.map(({ label, sub, icon: Icon }) => (
          <button key={label} className="quick-btn" onClick={() => onAction(label)}>
            <Icon size={22} strokeWidth={1.8} />
            {sub ? <span><b>{label}</b><br />{sub}</span> : <b>{label}</b>}
          </button>
        ))}
      </div>
    </section>
  );
}

function Productivity({ weekly, rate }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  return (
    <section className="card insights">
      <div className="card-head">
        <h3><TrendingUp size={30} strokeWidth={1.8} /> Productivity Insights</h3>
        <select className="select" defaultValue="This Week" aria-label="Time range">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="insights-body">
        <div className="bars">
          {weekly.map((d) => (
            <div key={d.day} className="bar-col">
              <div className="bar-track">
                {d.highlight && <span className="bar-tip">{d.value}%</span>}
                <div className="bar" style={{ height: `${d.value}%`, background: d.color }} />
              </div>
              <span>{d.day}</span>
            </div>
          ))}
        </div>

        <div className="ring">
          <svg viewBox="0 0 130 130" width="116" height="116">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="#E9E0D0" strokeWidth="9" />
            <circle
              cx="65" cy="65" r={radius} fill="none" stroke="#7A6A3E" strokeWidth="9"
              strokeLinecap="round" strokeDasharray={circ}
              strokeDashoffset={circ * (1 - rate.value / 100)}
              transform="rotate(-90 65 65)"
            />
          </svg>
          <div className="ring-num">{rate.value}<small>%</small></div>
          <p>Response<br />Rate <span className="up">↑ +{rate.change}%</span></p>
        </div>
      </div>
    </section>
  );
}

function Reminders({ items, onAction }) {
  return (
    <section className="reminders">
      <Plant />
      <div className="card reminders-card">
        <div className="card-head">
          <h3><CalendarDays size={24} strokeWidth={1.8} /> Upcoming Reminders</h3>
          <a href="#reminders" className="link">View all <ArrowRight size={14} /></a>
        </div>
        <ul>
          {items.map((r) => (
            <li key={r.id}>
              <span className="r-dot" style={{ background: r.color }} />
              <div>
                <strong>{r.title}</strong>
                <span>{r.when}</span>
              </div>
              <button className="soft-btn" onClick={() => onAction(r)}>{r.action}</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClientView({ emails, onOpenEmail, onMarkHandled }) {
  const clientEmails = emails.filter((email) => email.classification === "Client to Reply");

  return (
    <section className="card client-view">
      <div className="card-head client-head">
        <div>
          <p className="eyebrow">Client-facing view</p>
          <h3>Needs your attention</h3>
        </div>
        <button className="dark-btn" onClick={() => clientEmails.forEach(({ id }) => onMarkHandled(id))}>Mark all handled</button>
      </div>

      {clientEmails.length === 0 ? (
        <p className="empty">No client actions are pending.</p>
      ) : (
        <div className="client-list">
          {clientEmails.map((email) => (
            <article key={email.id} className="client-card">
              <div className="client-card-top">
                <div>
                  <strong>{email.name}</strong>
                  <span>{email.subject}</span>
                </div>
                <time>{email.time}</time>
              </div>
              <p className="client-summary">{email.summary}</p>
              <div className="client-meta">
                <span>{email.reason}</span>
              </div>
              <div className="client-actions">
                <button className="soft-btn" onClick={() => onOpenEmail(email.id)}>Open thread</button>
                <button className="dark-btn dark-btn--small" onClick={() => onMarkHandled(email.id)}>Handled</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Onboarding({ onComplete }) {
  return (
    <section className="card onboarding">
      <div className="onboarding-copy">
        <p className="eyebrow">Welcome</p>
        <h3>Connect your inbox and let AI manage the busy work.</h3>
        <p>
          Matrow brings together assistant workflows, client visibility, and intelligent reply ownership in one inbox.
        </p>
      </div>

      <div className="onboarding-grid">
        <div className="provider-card">
          <h4>Gmail</h4>
          <p>Secure inbox sync with thread history, labels, and AI triage.</p>
          <button className="dark-btn" onClick={onComplete}>Connect Gmail</button>
        </div>
        <div className="provider-card">
          <h4>Outlook / Microsoft</h4>
          <p>Connect work emails and calendars for assistant and client coordination.</p>
          <button className="dark-btn" onClick={onComplete}>Connect Outlook</button>
        </div>
      </div>

      <div className="status-row">
        <div className="status-pill"><span className="status-dot" /> Sync in progress</div>
        <div className="status-meta">Accounts connected: 2</div>
      </div>
    </section>
  );
}

function AIAssistantView({ emails, selectedEmail, onSelect }) {
  const [prompt, setPrompt] = useState("Summarize this conversation and suggest the best next action.");
  const [response, setResponse] = useState("I can summarize the latest email thread, flag key deadlines, and tell you whether the assistant or client should reply.");

  const runPrompt = (nextPrompt) => {
    setPrompt(nextPrompt);
    const match = selectedEmail;
    if (!match) {
      setResponse("Choose an email from the inbox to generate a useful assistant response.");
      return;
    }

    if (nextPrompt.toLowerCase().includes("reply")) {
      setResponse(`Draft reply for ${match.name}: "Thanks for the update. I’ve reviewed the details and will coordinate a response with the client before Friday. I’ll keep you posted on the next steps."`);
      return;
    }

    if (nextPrompt.toLowerCase().includes("who")) {
      setResponse(`${match.name} is asking for a decision that requires the client’s personal attention, so this should be classified as ${match.classification}.`);
      return;
    }

    setResponse(`${match.summary} The most important action is to ${match.classification === "Client to Reply" ? "prepare a client-facing update and confirm approval" : "coordinate the next follow-up while keeping the client informed"}.`);
  };

  return (
    <section className="card ai-view">
      <div className="card-head">
        <h3><Bot size={28} /> AI Assistant</h3>
        <span className="eyebrow">Operational inbox intelligence</span>
      </div>

      <div className="ai-layout">
        <div className="ai-sidebar">
          {emails.map((email) => (
            <button
              key={email.id}
              className={`ai-email ${selectedEmail?.id === email.id ? "is-selected" : ""}`}
              onClick={() => onSelect(email.id)}
            >
              <strong>{email.name}</strong>
              <span>{email.subject}</span>
              <small>{email.classification}</small>
            </button>
          ))}
        </div>

        <div className="ai-panel">
          <label className="assistant-field">
            <span>Ask the assistant</span>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} />
          </label>

          <div className="ai-actions">
            <button className="pill-btn" onClick={() => runPrompt("Summarize this conversation and list next actions.")}>Summarize</button>
            <button className="pill-btn" onClick={() => runPrompt("Who should reply to this email and why?")}>Responsibility</button>
            <button className="pill-btn" onClick={() => runPrompt("Draft a professional reply for this thread.")}>Draft Reply</button>
          </div>

          <div className="assistant-response">
            <h4>AI response</h4>
            <p>{response}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsView({ weekly, responseRate, emails }) {
  const totals = {
    total: emails.length,
    assistant: emails.filter((email) => email.classification === "Assistant to Reply").length,
    client: emails.filter((email) => email.classification === "Client to Reply").length,
    noReply: emails.filter((email) => email.classification === "No Reply Needed").length,
  };

  return (
    <section className="card analytics-view">
      <div className="card-head">
        <h3><BarChart3 size={28} /> Analytics</h3>
        <select className="select" defaultValue="This Week" aria-label="Analytics time range">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-box"><span>Total emails</span><strong>{totals.total}</strong></div>
        <div className="stat-box"><span>Assistant to reply</span><strong>{totals.assistant}</strong></div>
        <div className="stat-box"><span>Client to reply</span><strong>{totals.client}</strong></div>
        <div className="stat-box"><span>No reply needed</span><strong>{totals.noReply}</strong></div>
      </div>

      <div className="analytics-body">
        <div className="bars analytics-bars">
          {weekly.map((day) => (
            <div key={day.day} className="bar-col">
              <div className="bar-track">
                <div className="bar" style={{ height: `${day.value}%`, background: day.color }} />
              </div>
              <span>{day.day}</span>
            </div>
          ))}
        </div>

        <div className="ring-card">
          <div className="ring">
            <svg viewBox="0 0 130 130" width="116" height="116">
              <circle cx="65" cy="65" r={52} fill="none" stroke="#E9E0D0" strokeWidth="9" />
              <circle
                cx="65" cy="65" r={52} fill="none" stroke="#7A6A3E" strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - responseRate.value / 100)}
                transform="rotate(-90 65 65)"
              />
            </svg>
            <div className="ring-num">{responseRate.value}<small>%</small></div>
          </div>
          <p>Response rate</p>
        </div>
      </div>
    </section>
  );
}

function SettingsView() {
  const [settings, setSettings] = useState({
    gmail: true,
    outlook: true,
    notifications: true,
    aiSuggestions: true,
  });

  const toggle = (name) => setSettings((current) => ({ ...current, [name]: !current[name] }));

  return (
    <section className="card settings-view">
      <div className="card-head">
        <h3><Settings size={28} /> Settings</h3>
        <button className="dark-btn">Save changes</button>
      </div>

      <div className="settings-list">
        <div className="setting-row">
          <div>
            <strong>Gmail</strong>
            <p>Connected and syncing</p>
          </div>
          <button className={`toggle ${settings.gmail ? "on" : ""}`} onClick={() => toggle("gmail")}>
            <span />
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>Outlook</strong>
            <p>Connected and syncing</p>
          </div>
          <button className={`toggle ${settings.outlook ? "on" : ""}`} onClick={() => toggle("outlook")}>
            <span />
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>Smart notifications</strong>
            <p>Alert me about urgent client replies</p>
          </div>
          <button className={`toggle ${settings.notifications ? "on" : ""}`} onClick={() => toggle("notifications")}>
            <span />
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>AI suggestions</strong>
            <p>Enable recommended actions and automatic summaries</p>
          </div>
          <button className={`toggle ${settings.aiSuggestions ? "on" : ""}`} onClick={() => toggle("aiSuggestions")}>
            <span />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState("Dashboard");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    getDashboard().then((dashboard) => {
      setData(dashboard);
      setSelectedEmailId(dashboard.emails[0]?.id ?? null);
    }).catch((e) => setError(e.message));
  }, []);

  const visibleEmails = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.emails.filter((m) => {
      const categoryMatch = filter === "All" || m.category === filter || m.classification === filter;
      const searchMatch = !q || `${m.name} ${m.subject} ${m.summary}`.toLowerCase().includes(q);
      return categoryMatch && searchMatch;
    });
  }, [data, filter, query]);

  const selectedEmail = useMemo(
    () => data?.emails.find((email) => email.id === selectedEmailId) ?? data?.emails[0] ?? null,
    [data, selectedEmailId]
  );

  const pulse = useMemo(() => {
    if (!data) return { needAttention: 0, priority: 0, replies: 0, tasks: 0 };
    return {
      needAttention: data.emails.filter((email) => email.unread || email.classification === "Client to Reply" || email.classification === "Action Required").length,
      priority: data.emails.filter((email) => email.important || email.starred).length,
      replies: data.emails.filter((email) => email.classification === "Assistant to Reply" || email.classification === "Client to Reply").length,
      tasks: data.emails.filter((email) => email.classification === "Action Required").length,
    };
  }, [data]);

  const updateEmail = (emailId, updates) => {
    setData((current) => {
      if (!current) return current;
      return {
        ...current,
        emails: current.emails.map((email) =>
          email.id === emailId ? { ...email, ...updates } : email
        ),
      };
    });
  };

  const updateClassification = (emailId, classification) => {
    updateEmail(emailId, { classification });
  };

  const toggleSelected = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleQuickAction = (label) => {
    if (label === "Summarize" || label === "Draft a Reply") {
      setPage("AI Assistant");
      return;
    }
    if (label === "Set a Follow-up") {
      setPage("Dashboard");
      if (selectedEmail) {
        updateEmail(selectedEmail.id, { classification: "Action Required" });
      }
      return;
    }
    setPage("Dashboard");
  };

  const handleReminder = (r) => console.log("reminder action:", r.action, r.id);
  const handleOpenEmail = (id) => {
    setPage("Dashboard");
    setSelectedEmailId(id);
  };
  const handleMarkHandled = (id) => {
    updateClassification(id, "No Reply Needed");
  };
  const handleToggleImportant = (id) => {
    const email = data?.emails.find((item) => item.id === id);
    if (!email) return;
    updateEmail(id, { important: !email.important });
  };
  const handleToggleUnread = (id) => {
    const email = data?.emails.find((item) => item.id === id);
    if (!email) return;
    updateEmail(id, { unread: !email.unread });
  };
  const handleArchive = (id) => {
    const archived = data?.emails.filter((email) => email.id !== id);
    setData((current) => current ? { ...current, emails: archived } : current);
    if (selectedEmailId === id) {
      const nextEmail = archived[0] ?? null;
      setSelectedEmailId(nextEmail ? nextEmail.id : null);
    }
  };

  if (error) return <div className="state">Something went wrong: {error}</div>;
  if (!data) return <div className="state">Loading your day…</div>;

  if (!isOnboardingComplete) {
    return (
      <div className="shell shell--centered">
        <main className="main onboarding-shell">
          <TopBar query={query} onQuery={setQuery} user={data.user} />
          <Onboarding onComplete={() => setIsOnboardingComplete(true)} />
        </main>
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar user={data.user} active={page} onChange={setPage} />

      <main className="main">
        <TopBar query={query} onQuery={setQuery} user={data.user} />
        <Greeting name={data.user.firstName} />

        {page === "Client View" ? (
          <ClientView emails={data.emails} onOpenEmail={handleOpenEmail} onMarkHandled={handleMarkHandled} />
        ) : page === "AI Assistant" ? (
          <AIAssistantView emails={data.emails} selectedEmail={selectedEmail} onSelect={setSelectedEmailId} />
        ) : page === "Analytics" ? (
          <AnalyticsView weekly={data.weekly} responseRate={data.responseRate} emails={data.emails} />
        ) : page === "Settings" ? (
          <SettingsView />
        ) : page === "Smart Inbox" ? (
          <>
            <div className="row row--bottom single-col">
              <div className="col">
                <SmartInbox
                  emails={visibleEmails}
                  filter={filter}
                  onFilter={setFilter}
                  onToggle={toggleSelected}
                  selected={selected}
                  onSelect={setSelectedEmailId}
                  selectedEmail={selectedEmail}
                  onUpdateClassification={updateClassification}
                  onToggleImportant={handleToggleImportant}
                  onToggleUnread={handleToggleUnread}
                  onArchive={handleArchive}
                  onMarkHandled={handleMarkHandled}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="row row--top">
              <EmailPulse pulse={pulse} />
              <DailyBriefing text={data.briefing} />
            </div>

            <div className="row row--bottom">
              <div className="col">
                <SmartInbox
                  emails={visibleEmails}
                  filter={filter}
                  onFilter={setFilter}
                  onToggle={toggleSelected}
                  selected={selected}
                  onSelect={setSelectedEmailId}
                  selectedEmail={selectedEmail}
                  onUpdateClassification={updateClassification}
                  onToggleImportant={handleToggleImportant}
                  onToggleUnread={handleToggleUnread}
                  onArchive={handleArchive}
                  onMarkHandled={handleMarkHandled}
                />
                <QuickActions onAction={handleQuickAction} />
              </div>
              <div className="col">
                <Productivity weekly={data.weekly} rate={data.responseRate} />
                <Reminders items={data.reminders} onAction={handleReminder} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

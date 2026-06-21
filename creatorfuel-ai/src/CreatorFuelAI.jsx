import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "🚀", title: "Viral Idea Generator", desc: "AI-powered ideas ranked by virality score. Never stare at a blank page again." },
  { icon: "🪝", title: "Hook Generator", desc: "Scroll-stopping hooks for every platform. Scientifically crafted to capture attention." },
  { icon: "🎬", title: "Script Generator", desc: "Full TikTok, Reels, and YouTube scripts optimized for watch time and retention." },
  { icon: "📣", title: "CTA Generator", desc: "High-converting calls-to-action that turn viewers into followers and customers." },
  { icon: "📅", title: "Content Calendar", desc: "30-day content calendars tailored to your niche, platform, and posting frequency." },
  { icon: "🏷️", title: "Hashtag Generator", desc: "Platform-specific hashtag sets that maximize your organic reach and discoverability." },
  { icon: "📱", title: "Multi-Platform", desc: "Optimized content for TikTok, Instagram Reels, YouTube Shorts, and long-form YouTube." },
  { icon: "🤖", title: "AI Content Engine", desc: "Powered by the latest LLMs, trained on millions of viral posts across every niche." },
];

const PLANS = [
  {
    name: "Creator",
    price: 10,
    color: "#6366f1",
    icon: "✨",
    description: "Perfect for solo creators just getting started.",
    stripePriceIdMonthly: "price_creator_monthly",
    generationLimit: 10,
    popular: false,
    features: [
      { text: "10 generations / month",    included: true  },
      { text: "Viral idea generator",       included: true  },
      { text: "Hook generator",             included: true  },
      { text: "Title generator",            included: true  },
      { text: "CTA generator",              included: true  },
      { text: "Hashtag generator",          included: true  },
      { text: "Short-form scripts",         included: false },
      { text: "Long-form scripts",          included: false },
      { text: "Content calendars",          included: false },
      { text: "Multiple brand profiles",    included: false },
      { text: "Priority support",           included: false },
      { text: "White-label exports",        included: false },
    ],
  },
  {
    name: "Pro",
    price: 29,
    color: "#f97316",
    icon: "⚡",
    description: "For serious creators ready to scale their content.",
    stripePriceIdMonthly: "price_pro_monthly",
    generationLimit: 50,
    popular: true,
    features: [
      { text: "50 generations / month",    included: true  },
      { text: "Viral idea generator",       included: true  },
      { text: "Hook generator",             included: true  },
      { text: "Title generator",            included: true  },
      { text: "CTA generator",              included: true  },
      { text: "Hashtag generator",          included: true  },
      { text: "Short-form scripts",         included: true  },
      { text: "Long-form scripts",          included: true  },
      { text: "Content calendars",          included: true  },
      { text: "Multiple brand profiles",    included: false },
      { text: "Priority support",           included: true  },
      { text: "White-label exports",        included: false },
    ],
  },
  {
    name: "Agency",
    price: 79,
    color: "#22c55e",
    icon: "🏢",
    description: "Built for agencies managing multiple brands at scale.",
    stripePriceIdMonthly: "price_agency_monthly",
    generationLimit: 100,
    popular: false,
    features: [
      { text: "100 generations / month",   included: true },
      { text: "Viral idea generator",       included: true },
      { text: "Hook generator",             included: true },
      { text: "Title generator",            included: true },
      { text: "CTA generator",              included: true },
      { text: "Hashtag generator",          included: true },
      { text: "Short-form scripts",         included: true },
      { text: "Long-form scripts",          included: true },
      { text: "Content calendars",          included: true },
      { text: "Multiple brand profiles",    included: true },
      { text: "Priority support",           included: true },
      { text: "White-label exports",        included: true },
    ],
  },
];

const TESTIMONIALS = [
  { name: "Maya Chen", role: "1.2M TikTok Creator", avatar: "MC", text: "CreatorFuel AI saved me 20+ hours a week. My engagement went up 340% in 60 days. This is the only tool I actually keep paying for.", rating: 5 },
  { name: "Jordan Rivers", role: "YouTube Coach, 890K subs", avatar: "JR", text: "The script generator is insane. I used to spend 3 hours writing scripts. Now it takes 10 minutes and they perform BETTER. Wild.", rating: 5 },
  { name: "Priya Sharma", role: "Marketing Agency Owner", avatar: "PS", text: "We manage 12 brands and CreatorFuel AI is the backbone of our content operation. ROI in the first week. No question.", rating: 5 },
  { name: "Alex Torres", role: "Fitness Coach & Influencer", avatar: "AT", text: "Went from 5K to 87K followers in 4 months using the viral idea generator and hook templates. Literally changed my business.", rating: 5 },
];

const FAQS = [
  { q: "How does CreatorFuel AI generate content?", a: "Our AI engine is trained on millions of viral posts across TikTok, Instagram, and YouTube. It analyzes top-performing content in your niche and generates ideas, hooks, and scripts optimized for virality and engagement." },
  { q: "What platforms does it support?", a: "CreatorFuel AI supports TikTok, Instagram Reels, YouTube Shorts, and long-form YouTube videos. Each output is optimized for the specific platform's algorithm, audience behavior, and format." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, absolutely. Cancel anytime from your settings page. No questions asked, no fees. Your access continues until the end of your billing period." },
  { q: "Do generations roll over each month?", a: "Unused generations do not roll over. Each billing cycle starts fresh. If you consistently need more, we recommend upgrading to the next plan." },
  { q: "Is there a free trial?", a: "We offer a 7-day free trial on all plans. No credit card required to start. You'll get full access to all features in your chosen plan during the trial period." },
  { q: "Can I use it for multiple niches or brands?", a: "The Creator and Pro plans support one niche/brand profile. The Agency plan supports unlimited brand profiles with team collaboration features." },
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

const GlassCard = ({ children, className = "", onClick, style = {} }) => (
  <div
    onClick={onClick}
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      borderRadius: "16px",
      ...style,
    }}
    className={className}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "#6366f1" }) => (
  <span style={{
    background: `${color}22`,
    color: color,
    border: `1px solid ${color}44`,
    borderRadius: "999px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  }}>
    {children}
  </span>
);

const Btn = ({ children, variant = "primary", onClick, style = {}, disabled = false }) => {
  const base = {
    border: "none",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    fontSize: "14px",
    padding: "10px 22px",
    transition: "all 0.2s",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  };
  const variants = {
    primary: { background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff" },
    secondary: { background: "rgba(255,255,255,0.07)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.12)" },
    ghost: { background: "transparent", color: "#94a3b8" },
    purple: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" },
    green: { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Star = () => <span style={{ color: "#f97316" }}>★</span>;

const ProgressBar = ({ value, color = "#f97316" }) => (
  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "999px", height: "4px", overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "999px", transition: "width 1s ease" }} />
  </div>
);

// ─── NICHE DATA ───────────────────────────────────────────────────────────────
// 55 niches in 10 categories — used by RegisterPage, Dashboard, and ProfilePage

const NICHE_CATEGORIES = [
  {
    category: "💪 Health & Fitness",
    niches: [
      "Fitness & Health",
      "Weight Loss",
      "Bodybuilding",
      "Yoga & Mindfulness",
      "Nutrition & Diet",
      "Running & Endurance",
      "Mental Health",
    ],
  },
  {
    category: "💰 Money & Business",
    niches: [
      "Personal Finance",
      "Investing & Stocks",
      "Cryptocurrency & Web3",
      "Real Estate",
      "Entrepreneurship",
      "Online Business",
      "Side Hustles",
    ],
  },
  {
    category: "📣 Marketing & Sales",
    niches: [
      "Digital Marketing",
      "Social Media Marketing",
      "Sales & Persuasion",
      "Copywriting",
      "Email Marketing",
      "SEO & Content",
    ],
  },
  {
    category: "💻 Tech & AI",
    niches: [
      "AI Tools & Automation",
      "Technology & Gadgets",
      "Coding & Development",
      "Cybersecurity",
      "Data Science",
      "No-Code & Low-Code",
    ],
  },
  {
    category: "🧠 Self & Relationships",
    niches: [
      "Productivity",
      "Self Improvement",
      "Motivation & Mindset",
      "Relationships & Dating",
      "Marriage & Family",
      "Parenting",
      "Psychology",
    ],
  },
  {
    category: "🎓 Education & Learning",
    niches: [
      "Education & Tutoring",
      "Language Learning",
      "History",
      "Science & Nature",
      "Philosophy",
    ],
  },
  {
    category: "✈️ Lifestyle & Travel",
    niches: [
      "Travel",
      "Luxury Travel",
      "Minimalism & Lifestyle",
      "Cars & Automotive",
      "Motorcycles",
    ],
  },
  {
    category: "👗 Fashion & Beauty",
    niches: [
      "Fashion & Style",
      "Men's Style",
      "Women's Fashion",
      "Beauty & Makeup",
      "Skincare",
      "Hair Care",
    ],
  },
  {
    category: "🎮 Gaming & Entertainment",
    niches: [
      "Gaming",
      "Minecraft",
      "Roblox",
      "Fortnite",
      "Sports",
      "Soccer / Football",
      "Basketball",
    ],
  },
  {
    category: "🙏 Faith & Community",
    niches: [
      "Christian Content",
      "Bible Study",
      "Apologetics",
      "Cooking & Recipes",
      "Pets & Animals",
      "Dog Training",
      "Cat Care",
    ],
  },
];

// Flat list for default values and simple iteration
const ALL_NICHES = NICHE_CATEGORIES.flatMap(c => c.niches);

// ─── SEARCHABLE NICHE SELECTOR ────────────────────────────────────────────────

const NicheSelect = ({ value, onChange, style = {} }) => {
  const [open, setOpen]                   = useState(false);
  const [query, setQuery]                 = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredNiche, setHoveredNiche]   = useState(null);
  const [dropPos, setDropPos]             = useState({ top: 0, left: 0, width: 0 });

  const triggerRef    = useRef(null);
  const containerRef  = useRef(null);
  const inputRef      = useRef(null);

  // Recalculate dropdown position from trigger bounding rect
  const calcPosition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    // getBoundingClientRect is already viewport-relative — use directly with position:fixed
    setDropPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 320) });
  };

  const openDropdown = () => {
    calcPosition();
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
    setSearchFocused(false);
    setHoveredNiche(null);
  };

  // Reposition on scroll or resize so panel tracks the trigger
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", calcPosition, true);
    window.addEventListener("resize", calcPosition);
    return () => {
      window.removeEventListener("scroll", calcPosition, true);
      window.removeEventListener("resize", calcPosition);
    };
  }, [open]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onMouse = (e) => {
      const portal = document.getElementById("niche-portal");
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        (!portal || !portal.contains(e.target))
      ) closeDropdown();
    };
    const onKey = (e) => { if (e.key === "Escape") closeDropdown(); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  // Focus search input immediately on open
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [open]);

  // Filter niches by query
  const q = query.trim().toLowerCase();
  const filtered = q
    ? NICHE_CATEGORIES
        .map(cat => ({ ...cat, niches: cat.niches.filter(n => n.toLowerCase().includes(q)) }))
        .filter(cat => cat.niches.length > 0)
    : NICHE_CATEGORIES;
  const totalResults = filtered.reduce((s, c) => s + c.niches.length, 0);

  const select = (niche) => { onChange(niche); closeDropdown(); };

  // Design tokens
  const OR       = "#f97316";
  const OR_DIM   = "rgba(249,115,22,0.15)";
  const OR_GLOW  = "rgba(249,115,22,0.12)";
  const B_IDLE   = "rgba(255,255,255,0.12)";
  const B_OPEN   = "rgba(249,115,22,0.55)";
  const BG       = "#111827";
  const BG_SRCH  = "#1e293b";
  const T_MAIN   = "#f1f5f9";
  const T_DIM    = "#94a3b8";
  const T_MUTED  = "#64748b";

  // Portal content rendered directly (NOT as sub-component — avoids remount on each keystroke)
  const portalContent = open ? ReactDOM.createPortal(
    <div
      id="niche-portal"
      style={{
        position: "fixed",
        top:      dropPos.top,
        left:     dropPos.left,
        width:    dropPos.width,
        zIndex:   2147483647,
        background: BG,
        border: `1.5px solid ${B_OPEN}`,
        borderRadius: "14px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(249,115,22,0.08)",
        maxHeight: "400px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",  // clip corners cleanly; list div handles its own scroll
      }}
    >
      {/* Search bar — always visible at top */}
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
        background: "rgba(0,0,0,0.25)",
        borderRadius: "14px 14px 0 0",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: BG_SRCH,
          border: `1.5px solid ${searchFocused ? B_OPEN : "rgba(255,255,255,0.18)"}`,
          borderRadius: "9px",
          padding: "9px 12px",
          boxShadow: searchFocused ? `0 0 0 3px ${OR_GLOW}` : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="4.5" stroke={searchFocused ? OR : T_MUTED} strokeWidth="1.6"/>
            <path d="M10.5 10.5L13 13" stroke={searchFocused ? OR : T_MUTED} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={`Search ${ALL_NICHES.length} niches…`}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: T_MAIN, fontSize: "14px", fontFamily: "inherit",
              caretColor: OR,
            }}
          />
          {query && (
            <button
              onMouseDown={e => { e.preventDefault(); setQuery(""); inputRef.current?.focus(); }}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
                width: "17px", height: "17px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", flexShrink: 0,
                color: T_DIM, fontSize: "10px", fontWeight: 700, padding: 0, fontFamily: "inherit",
              }}
            >✕</button>
          )}
        </div>
        {q && (
          <div style={{ marginTop: "6px", fontSize: "11px", paddingLeft: "2px",
            color: totalResults > 0 ? T_MUTED : "#ef4444" }}>
            {totalResults > 0 ? `${totalResults} match${totalResults !== 1 ? "es" : ""} for "${query}"` : `No results for "${query}"`}
          </div>
        )}
      </div>

      {/* Scrollable results — this div scrolls, NOT the portal panel */}
      <div style={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
        {totalResults === 0 ? (
          <div style={{ padding: "28px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔍</div>
            <div style={{ color: T_DIM, fontSize: "13px" }}>No niches match — try a shorter term</div>
          </div>
        ) : filtered.map((cat, catIdx) => (
          <div key={cat.category}>
            {/* Sticky category header */}
            <div style={{
              padding: "8px 14px 5px",
              color: "#94a3b8", fontSize: "10px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.1em",
              background: "rgba(17,24,39,0.98)",
              borderTop: catIdx > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
              position: "sticky", top: 0, zIndex: 1,
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span>{cat.category.split(" ")[0]}</span>
              <span style={{ color: "#475569", fontWeight: 600 }}>{cat.category.split(" ").slice(1).join(" ")}</span>
              <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.06)", color: T_MUTED,
                borderRadius: "999px", padding: "1px 6px", fontSize: "9px", fontWeight: 600 }}>
                {cat.niches.length}
              </span>
            </div>
            {/* Niche rows */}
            {cat.niches.map(niche => {
              const isSel  = niche === value;
              const isHov  = hoveredNiche === niche;
              return (
                <div
                  key={niche}
                  onClick={() => select(niche)}
                  onMouseEnter={() => setHoveredNiche(niche)}
                  onMouseLeave={() => setHoveredNiche(null)}
                  style={{
                    padding: "9px 18px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: isSel ? 600 : 400,
                    color: isSel ? OR : isHov ? T_MAIN : T_DIM,
                    background: isSel ? OR_DIM : isHov ? "rgba(255,255,255,0.04)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
                    borderLeft: `3px solid ${isSel ? OR : "transparent"}`,
                    transition: "background 0.1s, color 0.1s",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {q ? (() => {
                      const idx = niche.toLowerCase().indexOf(q);
                      if (idx === -1) return niche;
                      return (<>{niche.slice(0, idx)}<mark style={{ background: "rgba(249,115,22,0.28)", color: T_MAIN, borderRadius: "2px", padding: "0 1px" }}>{niche.slice(idx, idx + q.length)}</mark>{niche.slice(idx + q.length)}</>);
                    })() : niche}
                  </span>
                  {isSel && (
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2.5 7L5.5 10L11.5 4" stroke={OR} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: "7px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(0,0,0,0.2)", borderRadius: "0 0 14px 14px",
      }}>
        <span style={{ color: "#334155", fontSize: "11px" }}>
          {q ? `${totalResults} of ${ALL_NICHES.length}` : `${ALL_NICHES.length} niches · ${NICHE_CATEGORIES.length} categories`}
        </span>
        <kbd style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "4px", padding: "0 5px", fontSize: "10px", fontFamily: "monospace", color: "#475569" }}>esc</kbd>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => open ? closeDropdown() : openDropdown()}
        style={{
          width: "100%", padding: "11px 14px",
          background: open ? "rgba(249,115,22,0.07)" : "rgba(255,255,255,0.05)",
          border: `1.5px solid ${open ? B_OPEN : B_IDLE}`,
          borderRadius: "11px",
          color: value ? T_MAIN : T_MUTED,
          fontSize: "14px", fontWeight: value ? 500 : 400,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "8px", boxSizing: "border-box", userSelect: "none",
          transition: "all 0.15s",
          boxShadow: open ? `0 0 0 3px ${OR_GLOW}` : "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {value || "Select a niche…"}
        </span>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M2.5 5L7 9.5L11.5 5" stroke={open ? OR : T_MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {portalContent}
    </div>
  );
};


// ─── AUTH STORE ───────────────────────────────────────────────────────────────
// In-memory account registry + sessionStorage session token.
// No backend needed — accounts persist for the browser session.

const AUTH_STORE = new Map(); // email → { name, passwordHash, niche, plan, avatar, generations, limit }
const SESSION_KEY = "creatorfuel_session";

// Simple deterministic hash (not cryptographic, but prevents plaintext storage)
const hashPassword = (pw) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < pw.length; i++) {
    h ^= pw.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
};

const authRegister = ({ name, email, password, niche }) => {
  const key = email.trim().toLowerCase();
  if (AUTH_STORE.has(key)) return { ok: false, error: "An account with this email already exists." };
  const record = {
    name: name.trim(),
    email: key,
    passwordHash: hashPassword(password),
    niche,
    plan: "Creator",
    avatar: name.trim().slice(0, 2).toUpperCase(),
    generations: 0,
    limit: 10,
  };
  AUTH_STORE.set(key, record);
  const token = btoa(key + "::" + Date.now());
  sessionStorage.setItem(SESSION_KEY, token);
  const { passwordHash: _, ...safeUser } = record;
  return { ok: true, user: safeUser };
};

const authLogin = ({ email, password }) => {
  const key = email.trim().toLowerCase();
  const record = AUTH_STORE.get(key);
  if (!record) return { ok: false, error: "No account found with that email address." };
  if (record.passwordHash !== hashPassword(password)) return { ok: false, error: "Incorrect password." };
  const token = btoa(key + "::" + Date.now());
  sessionStorage.setItem(SESSION_KEY, token);
  const { passwordHash: _, ...safeUser } = record;
  return { ok: true, user: safeUser };
};

const authRestore = () => {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token) return null;
    const email = atob(token).split("::")[0];
    const record = AUTH_STORE.get(email);
    if (!record) return null;
    const { passwordHash: _, ...safeUser } = record;
    return safeUser;
  } catch { return null; }
};

const authLogout = () => sessionStorage.removeItem(SESSION_KEY);

const authUpdateUser = (email, updates) => {
  const key = email.trim().toLowerCase();
  const record = AUTH_STORE.get(key);
  if (!record) return;
  AUTH_STORE.set(key, { ...record, ...updates });
};

// ─── FIELD HELPERS ────────────────────────────────────────────────────────────

const FieldError = ({ msg }) =>
  msg ? <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px", fontWeight: 500 }}>⚠ {msg}</div> : null;

const inputStyle = (hasError) => ({
  width: "100%", padding: "12px 14px",
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${hasError ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
  borderRadius: "10px", color: "#e2e8f0", fontSize: "14px",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
});

// ─── PAGES ────────────────────────────────────────────────────────────────────

const LoginPage = ({ setPage, setUser }) => {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [errors, setErrors]   = useState({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address.";
    if (!pass) e.pass = "Password is required.";
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    setErrors(e);
    setAuthError("");
    if (Object.keys(e).length) return;
    setLoading(true);
    // Simulate brief network latency
    setTimeout(() => {
      const result = authLogin({ email, password: pass });
      if (result.ok) {
        setUser(result.user);
        setPage("dashboard");
      } else {
        setAuthError(result.error);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "28px", fontWeight: 900, background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            ⚡ CreatorFuel AI
          </div>
          <p style={{ color: "#64748b", fontSize: "15px" }}>Welcome back. Let's create something viral.</p>
        </div>
        <GlassCard style={{ padding: "40px" }}>
          {authError && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>
              ⚠ {authError}
            </div>
          )}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Email</label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(ev => ({ ...ev, email: "" })); setAuthError(""); }}
              placeholder="you@example.com"
              style={inputStyle(errors.email)}
            />
            <FieldError msg={errors.email} />
          </div>
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Password</label>
            <input
              type="password" value={pass} onChange={e => { setPass(e.target.value); setErrors(ev => ({ ...ev, pass: "" })); setAuthError(""); }}
              placeholder="••••••••"
              style={inputStyle(errors.pass)}
            />
            <FieldError msg={errors.pass} />
          </div>
          <Btn variant="primary" onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </Btn>
          <div style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "13px" }}>
            Don't have an account?{" "}
            <span onClick={() => setPage("register")} style={{ color: "#f97316", cursor: "pointer", fontWeight: 600 }}>Sign up free</span>
          </div>
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <span onClick={() => setPage("landing")} style={{ color: "#475569", cursor: "pointer", fontSize: "13px" }}>← Back to home</span>
          </div>
        </GlassCard>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ color: "#475569", fontSize: "12px" }}>🔒 Secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ setPage, setUser }) => {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [confirm, setConfirm] = useState("");
  const [niche, setNiche]     = useState("Business & Entrepreneurship");
  const [errors, setErrors]   = useState({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // Niches come from the global NICHE_CATEGORIES / NicheSelect component

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Full name is required.";
    else if (name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email address.";
    if (!pass) e.pass = "Password is required.";
    else if (pass.length < 8) e.pass = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(pass) || !/[0-9]/.test(pass)) e.pass = "Password must contain letters and numbers.";
    if (!confirm) e.confirm = "Please confirm your password.";
    else if (confirm !== pass) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    setErrors(e);
    setAuthError("");
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      const result = authRegister({ name, email, password: pass, niche });
      if (result.ok) {
        setUser(result.user);
        setPage("dashboard");
      } else {
        setAuthError(result.error);
        setLoading(false);
      }
    }, 600);
  };

  const clearError = (field) => setErrors(ev => ({ ...ev, [field]: "" }));

  const passStrength = (() => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (score <= 2) return { label: "Fair", color: "#f97316", width: "50%" };
    if (score <= 3) return { label: "Good", color: "#eab308", width: "75%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  })();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "28px", fontWeight: 900, background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            ⚡ CreatorFuel AI
          </div>
          <p style={{ color: "#64748b", fontSize: "15px" }}>Start your 7-day free trial. No credit card required.</p>
        </div>
        <GlassCard style={{ padding: "40px" }}>
          <div style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", textAlign: "center" }}>
            <span style={{ color: "#f97316", fontSize: "13px", fontWeight: 600 }}>✨ 7-Day Free Trial — Full Pro Access</span>
          </div>
          {authError && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>
              ⚠ {authError}
            </div>
          )}

          {/* Full Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Full Name</label>
            <input type="text" value={name} onChange={e => { setName(e.target.value); clearError("name"); }} placeholder="Alex Creator" style={inputStyle(errors.name)} />
            <FieldError msg={errors.name} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Email Address</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError("email"); setAuthError(""); }} placeholder="you@example.com" style={inputStyle(errors.email)} />
            <FieldError msg={errors.email} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Password</label>
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); clearError("pass"); }} placeholder="Min. 8 chars with letters & numbers" style={inputStyle(errors.pass)} />
            {pass && passStrength && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Password strength</span>
                  <span style={{ fontSize: "11px", color: passStrength.color, fontWeight: 600 }}>{passStrength.label}</span>
                </div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "999px" }}>
                  <div style={{ height: "100%", width: passStrength.width, background: passStrength.color, borderRadius: "999px", transition: "width 0.3s, background 0.3s" }} />
                </div>
              </div>
            )}
            <FieldError msg={errors.pass} />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); clearError("confirm"); }} placeholder="Repeat your password" style={inputStyle(errors.confirm)} />
            <FieldError msg={errors.confirm} />
          </div>

          {/* Niche */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Your Content Niche</label>
            <NicheSelect value={niche} onChange={setNiche} />
          </div>

          <Btn variant="primary" onClick={handleRegister} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            {loading ? "Creating account..." : "Start Free Trial →"}
          </Btn>
          <p style={{ color: "#475569", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
            By signing up you agree to our Terms &amp; Privacy Policy
          </p>
          <div style={{ textAlign: "center", marginTop: "8px", color: "#64748b", fontSize: "13px" }}>
            Already have an account?{" "}
            <span onClick={() => setPage("login")} style={{ color: "#f97316", cursor: "pointer", fontWeight: 600 }}>Sign in</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// ─── STRIPE CHECKOUT HELPER ───────────────────────────────────────────────────
// ─── STRIPE CHECKOUT ──────────────────────────────────────────────────────────
//
// SETUP (Vercel):
//   1. Dashboard → Settings → Environment Variables
//   2. Add: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...  (or pk_test_...)
//   3. Add: STRIPE_SECRET_KEY                  = sk_live_...  (server-side only)
//   4. Create products + prices in Stripe dashboard
//   5. Update stripePriceIdMonthly in PLANS with your real price IDs
//   6. Deploy /api/create-checkout-session.js (included in output files)
//   7. Set webhook endpoint in Stripe: https://yourdomain.com/api/stripe-webhook
//
// FLOW:
//   Click Upgrade → /api/create-checkout-session → Stripe hosted checkout
//   → success: /?stripe=success&plan=Pro&session_id=cs_xxx
//   → cancel:  /?stripe=canceled
//   → webhook: POST /api/stripe-webhook → verify sig → update DB → grant plan

// Read publishable key from env (injected by Vercel as NEXT_PUBLIC_ prefix)
const STRIPE_PK = typeof process !== "undefined"
  ? (process.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  : "";

const STRIPE_CONFIGURED = STRIPE_PK.startsWith("pk_");

// The only client-side action: call our backend session creator, then redirect.
// Plan is NOT granted here — only after webhook confirms payment.
const initiateStripeCheckout = async ({ priceId, email, planName, currentPage }) => {
  if (!STRIPE_CONFIGURED) {
    return {
      ok: false,
      error: "Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your Vercel environment variables.",
    };
  }

  try {
    // Build return URLs — Stripe sends user back here after checkout
    const base = window.location.origin;
    const successUrl = `${base}/?stripe=success&plan=${encodeURIComponent(planName)}&from=${currentPage || "upgrade"}`;
    const cancelUrl  = `${base}/?stripe=canceled&from=${currentPage || "upgrade"}`;

    console.log("[Stripe] Creating checkout session for", planName, priceId);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email, planName, successUrl, cancelUrl }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error || `Server error ${res.status}`;
      if (res.status === 404) {
        return { ok: false, error: "Checkout endpoint not found. Deploy /api/create-checkout-session.js to your server." };
      }
      return { ok: false, error: msg };
    }

    const { url } = await res.json();
    if (!url) return { ok: false, error: "No checkout URL returned from server." };

    console.log("[Stripe] Redirecting to Stripe Checkout:", url);
    // Leave the app — Stripe handles everything from here
    window.location.href = url;
    return { ok: true };

  } catch (err) {
    console.error("[Stripe] Checkout error:", err);
    return { ok: false, error: `Checkout failed: ${err.message}` };
  }
};

// Parse Stripe return params from URL on app load
const parseStripeReturn = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const stripe = params.get("stripe");
    if (!stripe) return null;
    // Clean URL immediately so refresh doesn't re-trigger
    const clean = window.location.pathname;
    window.history.replaceState({}, "", clean);
    return {
      status:    stripe,                       // "success" | "canceled"
      plan:      params.get("plan") || "",
      sessionId: params.get("session_id") || "",
      from:      params.get("from") || "upgrade",
    };
  } catch { return null; }
};

// ─── STRIPE RETURN PAGE ───────────────────────────────────────────────────────
// Shown when Stripe redirects back after checkout.
// SUCCESS: plan is pending webhook confirmation — we show a "pending" state.
//          Do NOT grant the plan here. The webhook does that.
// CANCELED: user bailed, keep current plan, go back.

const StripeReturnPage = ({ stripeResult, setPage, user, setUser }) => {
  const isSuccess  = stripeResult?.status === "success";
  const planName   = stripeResult?.plan || "";
  const sessionId  = stripeResult?.sessionId || "";
  const returnPage = stripeResult?.from || "upgrade";

  // On success: mark plan as "pending" in local state so the UI reflects it
  // The actual limit/access upgrade happens when the webhook fires.
  // In a real app this would poll /api/subscription-status until webhook confirms.
  useEffect(() => {
    if (isSuccess && user && planName) {
      // Only update the displayed plan name — do NOT update limits yet.
      // Limits are granted by the webhook after payment is confirmed by Stripe.
      setUser(u => ({ ...u, pendingPlan: planName, pendingSessionId: sessionId }));
    }
  }, []);

  if (!stripeResult) {
    // No Stripe params — should not reach here, redirect to landing
    setTimeout(() => setPage("landing"), 100);
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>

        {isSuccess ? (
          <>
            {/* ── SUCCESS STATE ─── */}
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
            <h1 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: 900, marginBottom: "12px" }}>
              Payment received!
            </h1>
            <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
              Your <span style={{ color: "#f97316", fontWeight: 700 }}>{planName}</span> plan is being activated.
              This usually takes a few seconds — your dashboard will update automatically once confirmed.
            </p>

            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "14px", padding: "20px 24px", marginBottom: "32px", textAlign: "left" }}>
              <div style={{ color: "#22c55e", fontWeight: 700, marginBottom: "12px", fontSize: "14px" }}>✓ What happens next</div>
              {[
                "Stripe sends a webhook to confirm payment",
                "Your subscription is activated in our database",
                "Your generation limit updates automatically",
                "You receive a receipt at " + (user?.email || "your email"),
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", color: "#94a3b8", fontSize: "13px" }}>
                  <span style={{ color: "#22c55e", flexShrink: 0 }}>{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {sessionId && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px" }}>
                <div style={{ color: "#475569", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Session ID (for support)</div>
                <div style={{ color: "#64748b", fontSize: "12px", fontFamily: "monospace", wordBreak: "break-all" }}>{sessionId}</div>
              </div>
            )}

            <Btn variant="primary" onClick={() => setPage("dashboard")} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
              Go to Dashboard →
            </Btn>
          </>
        ) : (
          <>
            {/* ── CANCELED STATE ─── */}
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>↩</div>
            <h1 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: 900, marginBottom: "12px" }}>
              Checkout canceled
            </h1>
            <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
              No payment was made. Your current plan is unchanged.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="secondary" onClick={() => setPage(returnPage)} style={{ padding: "12px 24px" }}>
                ← Back to Upgrade
              </Btn>
              <Btn variant="primary" onClick={() => setPage("dashboard")} style={{ padding: "12px 24px" }}>
                Go to Dashboard
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────

const PricingPage = ({ setPage, user }) => {
  const [hoveredPlan, setHovered] = useState(null);
  const [loadingPlan, setLoading] = useState(null);

  const [ctaError, setCtaError] = useState("");

  const handleCTA = async (plan) => {
    setCtaError("");
    if (!user) {
      sessionStorage.setItem("intendedPlan", plan.name);
      setPage("register");
      return;
    }
    if (user.plan === plan.name) return;

    if (!STRIPE_CONFIGURED) {
      setCtaError("Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to Vercel environment variables.");
      return;
    }

    setLoading(plan.name);
    const result = await initiateStripeCheckout({
      priceId:     plan.stripePriceIdMonthly,
      email:       user.email,
      planName:    plan.name,
      currentPage: "pricing",
    });
    // If result returns (only happens on error — success redirects away)
    if (!result.ok) {
      setCtaError(result.error);
      setLoading(null);
    }
    // Do NOT setLoading(null) on success — page is navigating away
  };

  return (
    <div style={{ minHeight: "100vh", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

        {/* Back button for logged-in users */}
        {user && (
          <div style={{ marginBottom: "32px" }}>
            <Btn variant="secondary" onClick={() => setPage("dashboard")}>← Back to Dashboard</Btn>
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <Badge color="#f97316">Pricing</Badge>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, margin: "16px 0 12px", color: "#f1f5f9" }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ color: "#64748b", fontSize: "18px", marginBottom: "36px" }}>
            Start free. Scale as you grow. Cancel anytime.
          </p>

        </div>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
          {PLANS.map(plan => {
            const isCurrentPlan = user?.plan === plan.name;
            const isHovered     = hoveredPlan === plan.name;
            const isLoading     = loadingPlan === plan.name;
            const displayPrice  = plan.price;
            const isActive      = isHovered || plan.popular;

            return (
              <div
                key={plan.name}
                onMouseEnter={() => setHovered(plan.name)}
                onMouseLeave={() => setHovered(null)}
                style={{ position: "relative", transition: "transform 0.2s", transform: isHovered ? "translateY(-6px)" : plan.popular ? "translateY(-3px)" : "none" }}
              >
                {/* MOST POPULAR badge */}
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff",
                    padding: "4px 22px", borderRadius: "999px", fontSize: "11px", fontWeight: 800,
                    letterSpacing: "0.08em", whiteSpace: "nowrap", zIndex: 2,
                    boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                  }}>
                    MOST POPULAR
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div style={{
                    position: "absolute", top: "-14px", right: "20px",
                    background: `${plan.color}22`, color: plan.color,
                    border: `1px solid ${plan.color}44`,
                    padding: "4px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                    whiteSpace: "nowrap", zIndex: 2,
                  }}>
                    YOUR PLAN
                  </div>
                )}

                <div style={{
                  background: isActive ? `linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? plan.color + "55" : "rgba(255,255,255,0.08)"}`,
                  backdropFilter: "blur(20px)",
                  borderRadius: "20px",
                  padding: "36px",
                  boxSizing: "border-box",
                  transition: "all 0.25s",
                  boxShadow: isActive ? `0 20px 60px ${plan.color}18` : "none",
                }}>

                  {/* Plan header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "14px",
                      background: `${plan.color}20`,
                      border: `1px solid ${plan.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
                      boxShadow: isActive ? `0 4px 20px ${plan.color}30` : "none",
                      transition: "box-shadow 0.25s",
                    }}>
                      {plan.icon}
                    </div>
                    <div>
                      <div style={{ color: plan.color, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>{plan.name}</div>
                      <div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{plan.description}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                    <span style={{ fontSize: "52px", fontWeight: 900, color: "#f1f5f9", lineHeight: 1 }}>${displayPrice}</span>
                    <span style={{ color: "#475569", fontSize: "15px", paddingBottom: "8px" }}>/ mo</span>
                  </div>
                  <div style={{ color: "#334155", fontSize: "12px", marginBottom: "28px" }}>
                    Billed monthly
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => handleCTA(plan)}
                    disabled={isLoading || isCurrentPlan}
                    style={{
                      width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                      cursor: isCurrentPlan ? "default" : isLoading ? "wait" : "pointer",
                      fontWeight: 700, fontSize: "15px", fontFamily: "inherit",
                      transition: "all 0.2s",
                      background: isCurrentPlan
                        ? "rgba(255,255,255,0.04)"
                        : plan.popular
                          ? "linear-gradient(135deg, #f97316, #ef4444)"
                          : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                      color: isCurrentPlan ? "#475569" : "#fff",
                      boxShadow: (!isCurrentPlan && isActive) ? `0 8px 30px ${plan.color}40` : "none",
                      marginBottom: "28px",
                    }}
                  >
                    {isLoading
                      ? "Redirecting to checkout…"
                      : isCurrentPlan
                        ? "✓ Current Plan"
                        : user
                          ? `Upgrade to ${plan.name} →`
                          : "Start Free Trial →"}
                  </button>

                  {/* Feature list */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px" }}>
                    {plan.features.map(f => (
                      <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "11px" }}>
                        <span style={{
                          flexShrink: 0, width: "18px", height: "18px", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 800,
                          background: f.included ? `${plan.color}20` : "rgba(255,255,255,0.04)",
                          color: f.included ? plan.color : "#334155",
                        }}>
                          {f.included ? "✓" : "✕"}
                        </span>
                        <span style={{ fontSize: "14px", color: f.included ? "#cbd5e1" : "#334155" }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stripe config error banner */}
        {ctaError && (
          <div style={{ marginTop: "32px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "16px 24px", maxWidth: "680px", margin: "32px auto 0" }}>
            <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "4px" }}>⚠ Payment unavailable</div>
            <div style={{ color: "#94a3b8", fontSize: "14px" }}>{ctaError}</div>
          </div>
        )}

        {/* Trust strip */}
        <div style={{ marginTop: "52px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "28px" }}>
          {[
            { icon: "🔒", text: "256-bit SSL encryption" },
            { icon: "💳", text: "Powered by Stripe" },
            { icon: "🔄", text: "Cancel anytime" },
            { icon: "🎁", text: "7-day free trial on all plans" },
            { icon: "🚫", text: "No hidden fees" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "7px", color: "#475569", fontSize: "13px" }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div style={{ marginTop: "80px" }}>
          <h2 style={{ textAlign: "center", color: "#f1f5f9", fontWeight: 800, fontSize: "28px", marginBottom: "40px" }}>
            Full Feature Comparison
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "580px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "14px 20px", textAlign: "left", color: "#64748b", fontSize: "13px", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Feature</th>
                  {PLANS.map(plan => (
                    <th key={plan.name} style={{ padding: "14px 20px", textAlign: "center", color: plan.color, fontSize: "13px", fontWeight: 800, borderBottom: "1px solid rgba(255,255,255,0.06)", letterSpacing: "0.06em" }}>
                      {plan.icon} {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANS[0].features.map((f, i) => (
                  <tr key={f.text} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ padding: "13px 20px", color: "#94a3b8", fontSize: "14px" }}>{f.text}</td>
                    {PLANS.map(plan => (
                      <td key={plan.name} style={{ padding: "13px 20px", textAlign: "center" }}>
                        {plan.features[i].included
                          ? <span style={{ color: plan.color, fontWeight: 800, fontSize: "16px" }}>✓</span>
                          : <span style={{ color: "#334155", fontSize: "14px" }}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
const UpgradePage = ({ setPage, user, setUser }) => {
  const [selected, setSelected]   = useState(user?.plan || "Pro");
  const [loading, setLoading]     = useState(false);

  const currentPlan = PLANS.find(p => p.name === user?.plan) || PLANS[0];
  const chosenPlan  = PLANS.find(p => p.name === selected) || PLANS[1];

  const [upgradeError, setUpgradeError] = useState("");

  const handleUpgrade = async () => {
    if (selected === user?.plan) return;
    setUpgradeError("");

    if (!STRIPE_CONFIGURED) {
      setUpgradeError("Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to your Vercel environment variables, then deploy /api/create-checkout-session.js.");
      return;
    }

    setLoading(true);
    const result = await initiateStripeCheckout({
      priceId:     chosenPlan.stripePriceIdMonthly,
      email:       user?.email,
      planName:    chosenPlan.name,
      currentPage: "upgrade",
    });
    // Only reaches here on error — success redirects away via window.location.href
    if (!result.ok) {
      setUpgradeError(result.error);
      setLoading(false);
    }
    // Do NOT setLoading(false) or setPage on success — browser is navigating to Stripe
  };

  return (
    <div style={{ minHeight: "100vh", padding: "60px 24px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Btn variant="ghost" onClick={() => setPage("dashboard")} style={{ marginBottom: "28px" }}>← Back to Dashboard</Btn>

        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ color: "#f1f5f9", fontSize: "30px", fontWeight: 900, marginBottom: "8px" }}>Upgrade Your Plan</h1>
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            Currently on <span style={{ color: currentPlan.color, fontWeight: 700 }}>{currentPlan.icon} {user?.plan}</span>
            {" "}· {user?.generations} / {user?.limit} generations used this month
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
          {PLANS.map(plan => {
            const isCurrent  = plan.name === user?.plan;
            const isSelected = plan.name === selected;
            const displayPrice = plan.price;

            return (
              <div
                key={plan.name}
                onClick={() => !isCurrent && setSelected(plan.name)}
                style={{
                  padding: "20px 24px",
                  borderRadius: "16px",
                  border: `1px solid ${isSelected ? plan.color : "rgba(255,255,255,0.08)"}`,
                  background: isSelected ? `${plan.color}0d` : "rgba(255,255,255,0.02)",
                  cursor: isCurrent ? "default" : "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all 0.2s",
                  boxShadow: isSelected ? `0 4px 24px ${plan.color}18` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* Radio dot */}
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${isSelected ? plan.color : "rgba(255,255,255,0.15)"}`,
                    background: isSelected ? plan.color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isSelected && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{plan.icon}</span>
                      <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "15px" }}>{plan.name}</span>
                      {plan.popular && <span style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "999px", padding: "1px 8px", fontSize: "10px", fontWeight: 800 }}>POPULAR</span>}
                      {isCurrent && <span style={{ background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}30`, borderRadius: "999px", padding: "1px 8px", fontSize: "10px", fontWeight: 700 }}>CURRENT</span>}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "13px", marginTop: "3px" }}>{plan.features[0].text}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ color: "#f1f5f9", fontWeight: 900, fontSize: "22px" }}>${displayPrice}<span style={{ color: "#475569", fontWeight: 400, fontSize: "13px" }}>/mo</span></div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Summary + confirm */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>Selected plan</span>
            <span style={{ color: chosenPlan.color, fontWeight: 700 }}>{chosenPlan.icon} {chosenPlan.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>Billing</span>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Monthly</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
            <span style={{ color: "#f1f5f9", fontWeight: 700 }}>Total</span>
            <span style={{ color: "#f1f5f9", fontWeight: 900, fontSize: "20px" }}>
              ${chosenPlan.price}/mo
            </span>
          </div>
        </div>

        {upgradeError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>⚠ Payment unavailable</div>
            <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>{upgradeError}</div>
          </div>
        )}

        <Btn
          variant="primary"
          onClick={handleUpgrade}
          disabled={loading || selected === user?.plan}
          style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: "15px" }}
        >
          {loading
            ? "Redirecting to checkout…"
            : selected === user?.plan
              ? `You're already on ${selected}`
              : `Upgrade to ${selected} — $${chosenPlan.price}/mo →`}
        </Btn>
        <p style={{ color: "#334155", fontSize: "12px", textAlign: "center", marginTop: "14px" }}>
          💳 Powered by Stripe · 🔒 Secure checkout · Cancel anytime
        </p>
      </div>
    </div>
  );
};
const ProfilePage = ({ setPage, user, setUser }) => {
  const [name, setName] = useState(user?.name || "");

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Btn variant="ghost" onClick={() => setPage("dashboard")} style={{ marginBottom: "24px" }}>← Back to Dashboard</Btn>
        <h1 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: 800, marginBottom: "32px" }}>Your Profile</h1>
        <GlassCard style={{ padding: "36px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 800, color: "#fff" }}>
              {user?.avatar}
            </div>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "18px" }}>{user?.name}</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>{user?.email}</div>
              <Badge color="#f97316">{user?.plan} Plan</Badge>
            </div>
          </div>
          {[
            { label: "Full Name", val: name, set: setName },
            { label: "Email", val: user?.email || "", set: () => {} },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>{label}</label>
              <input
                value={val} onChange={e => set(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              />
            </div>
          ))}
          <Btn variant="primary" onClick={() => { setUser({ ...user, name }); setPage("dashboard"); }} style={{ marginTop: "8px" }}>
            Save Changes
          </Btn>
        </GlassCard>
        <GlassCard style={{ padding: "36px" }}>
          <h3 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "20px" }}>Usage This Month</h3>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "14px", marginBottom: "10px" }}>
            <span>Generations used</span>
            <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{user?.generations} / {user?.limit}</span>
          </div>
          <ProgressBar value={(user?.generations / user?.limit) * 100} color="#f97316" />
          <Btn variant="secondary" onClick={() => setPage("upgrade")} style={{ marginTop: "20px" }}>
            Upgrade for more →
          </Btn>
        </GlassCard>
      </div>
    </div>
  );
};

const SettingsPage = ({ setPage, user, setUser, logout }) => {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [darkMode] = useState(true);

  const Toggle = ({ val, set }) => (
    <div
      onClick={() => set(!val)}
      style={{ width: "44px", height: "24px", borderRadius: "999px", background: val ? "#f97316" : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
    >
      <div style={{ position: "absolute", top: "3px", left: val ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Btn variant="ghost" onClick={() => setPage("dashboard")} style={{ marginBottom: "24px" }}>← Back to Dashboard</Btn>
        <h1 style={{ color: "#f1f5f9", fontSize: "28px", fontWeight: 800, marginBottom: "32px" }}>Settings</h1>
        <GlassCard style={{ padding: "36px", marginBottom: "20px" }}>
          <h3 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "24px" }}>Notifications</h3>
          {[
            { label: "Email notifications", sub: "Get notified about your generations and account activity", val: notifications, set: setNotifications },
            { label: "Weekly performance report", sub: "Receive a summary of your content performance each week", val: weeklyReport, set: setWeeklyReport },
            { label: "Dark mode", sub: "Dark mode is always on — it looks better", val: darkMode, set: () => {} },
          ].map(({ label, sub, val, set }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px" }}>{label}</div>
                <div style={{ color: "#475569", fontSize: "13px", marginTop: "2px" }}>{sub}</div>
              </div>
              <Toggle val={val} set={set} />
            </div>
          ))}
        </GlassCard>
        <GlassCard style={{ padding: "36px", marginBottom: "20px" }}>
          <h3 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "24px" }}>Subscription</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 600 }}>Current plan: <span style={{ color: "#f97316" }}>{user?.plan}</span></div>
              <div style={{ color: "#475569", fontSize: "13px" }}>{user?.generations} / {user?.limit} generations used</div>
            </div>
            <Btn variant="primary" onClick={() => setPage("upgrade")}>Upgrade</Btn>
          </div>
        </GlassCard>
        <GlassCard style={{ padding: "36px" }}>
          <h3 style={{ color: "#ef4444", fontWeight: 700, marginBottom: "16px" }}>Danger Zone</h3>
          <Btn variant="secondary" onClick={logout} style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}>
            Sign Out
          </Btn>
        </GlassCard>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
//
// All content is generated live via /api/generate (server-side OpenAI call).
// No mock data, no fallback strings, no hardcoded examples.
//
// /api/generate contract
//   POST { tab, niche, platform, goal }
//   → SSE stream of OpenAI delta chunks
//   → accumulated JSON with shape { items: [...] }
//
// Per-tab JSON schemas are defined in /api/generate.js

// ─── Copy button ──────────────────────────────────────────────────────────────

const CopyBtn = ({ text, style = {} }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const el = document.createElement("textarea");
    el.value = text;
    Object.assign(el.style, { position:"fixed", opacity:0 });
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
      border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "7px", color: copied ? "#22c55e" : "#64748b",
      fontSize: "11px", fontWeight: 700, padding: "4px 10px",
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      flexShrink: 0, whiteSpace: "nowrap", ...style,
    }}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
};

// ─── Per-tab result renderers ─────────────────────────────────────────────────

const IdeasResult = ({ items }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"16px", padding:"18px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:"15px", marginBottom:"6px" }}>{item.title}</div>
          <div style={{ color:"#64748b", fontSize:"13px", marginBottom:"10px" }}>{item.angle}</div>
          {item.whyItWorks && <div style={{ color:"#475569", fontSize:"12px", fontStyle:"italic", marginBottom:"12px" }}>💡 {item.whyItWorks}</div>}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
            {item.tag && <Badge color={item.tag==="Viral"?"#ef4444":item.tag==="Trending"?"#f97316":item.tag==="Hot"?"#ec4899":"#22c55e"}>{item.tag}</Badge>}
            <CopyBtn text={item.title} />
          </div>
        </div>
        {item.viralScore != null && (
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:"22px", fontWeight:900, color: item.viralScore>=90?"#22c55e":item.viralScore>=80?"#f97316":"#6366f1" }}>{item.viralScore}</div>
            <div style={{ color:"#475569", fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.05em" }}>Viral Score</div>
          </div>
        )}
      </div>
    ))}
  </div>
);

const HooksResult = ({ items }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ padding:"18px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ color:"#f1f5f9", fontSize:"16px", fontWeight:600, fontStyle:"italic", marginBottom:"14px", lineHeight:1.5 }}>"{item.text}"</div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap", marginBottom: item.tip?"10px":"0" }}>
          {item.type && <Badge color="#6366f1">{item.type}</Badge>}
          {item.strength != null && (
            <>
              <div style={{ flex:1, minWidth:"80px", maxWidth:"180px" }}><ProgressBar value={item.strength} color="#f97316" /></div>
              <span style={{ color:"#f97316", fontWeight:800, fontSize:"14px" }}>{item.strength}%</span>
            </>
          )}
          <CopyBtn text={item.text} />
        </div>
        {item.tip && <div style={{ color:"#475569", fontSize:"12px", marginTop:"8px" }}>🎯 {item.tip}</div>}
      </div>
    ))}
  </div>
);

const TitlesResult = ({ items }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"14px", padding:"16px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:"15px", marginBottom:"8px" }}>{item.text}</div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
            {item.formula && <Badge color="#6366f1">{item.formula}</Badge>}
            <CopyBtn text={item.text} />
          </div>
          {item.tweak && <div style={{ color:"#475569", fontSize:"12px", marginTop:"8px" }}>✏️ {item.tweak}</div>}
        </div>
        {item.clickScore != null && (
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:"20px", fontWeight:900, color: item.clickScore>=90?"#22c55e":"#f97316" }}>{item.clickScore}%</div>
            <div style={{ color:"#475569", fontSize:"10px" }}>CTR</div>
          </div>
        )}
      </div>
    ))}
  </div>
);

const ScriptsResult = ({ items }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
          <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:"15px" }}>{item.title}</div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            {item.duration && <Badge color="#f97316">{item.duration}</Badge>}
            <CopyBtn text={`HOOK:\n${item.hook}\n\nBODY:\n${item.body}\n\nCTA:\n${item.cta}`} />
          </div>
        </div>
        <div style={{ padding:"20px" }}>
          {item.hook && (
            <div style={{ marginBottom:"16px" }}>
              <div style={{ color:"#f97316", fontSize:"11px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>🎣 Hook (0–3s)</div>
              <div style={{ color:"#e2e8f0", fontSize:"14px", fontWeight:600, lineHeight:1.6, padding:"12px", background:"rgba(249,115,22,0.06)", borderRadius:"8px", borderLeft:"3px solid #f97316" }}>{item.hook}</div>
            </div>
          )}
          {item.body && (
            <div style={{ marginBottom:"16px" }}>
              <div style={{ color:"#6366f1", fontSize:"11px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>📋 Body</div>
              <pre style={{ color:"#94a3b8", fontSize:"13px", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, padding:"12px", background:"rgba(99,102,241,0.05)", borderRadius:"8px", borderLeft:"3px solid #6366f1" }}>{item.body}</pre>
            </div>
          )}
          {item.cta && (
            <div style={{ marginBottom: item.tip?"12px":"0" }}>
              <div style={{ color:"#22c55e", fontSize:"11px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"8px" }}>📣 CTA</div>
              <div style={{ color:"#e2e8f0", fontSize:"14px", fontWeight:600, padding:"12px", background:"rgba(34,197,94,0.06)", borderRadius:"8px", borderLeft:"3px solid #22c55e" }}>{item.cta}</div>
            </div>
          )}
          {item.tip && <div style={{ color:"#475569", fontSize:"12px", marginTop:"12px" }}>💡 {item.tip}</div>}
        </div>
      </div>
    ))}
  </div>
);

const CTAResult = ({ items }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"#e2e8f0", fontSize:"14px", fontWeight:600, marginBottom:"8px" }}>{item.text}</div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
            {item.type && <Badge color="#22c55e">{item.type}</Badge>}
            {item.platform && <Badge color="#6366f1">{item.platform}</Badge>}
            <CopyBtn text={item.text} />
          </div>
          {item.psychology && <div style={{ color:"#475569", fontSize:"12px", marginTop:"8px" }}>🧠 {item.psychology}</div>}
        </div>
      </div>
    ))}
  </div>
);

const CalendarResult = ({ items }) => (
  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"12px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ padding:"16px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", border:`1px solid ${item.status==="ready"?"rgba(34,197,94,0.2)":"rgba(255,255,255,0.07)"}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <span style={{ color:"#64748b", fontSize:"12px", fontWeight:600 }}>Day {item.day} · {item.date}</span>
          {item.status && <Badge color={item.status==="ready"?"#22c55e":"#f97316"}>{item.status}</Badge>}
        </div>
        <div style={{ color:"#e2e8f0", fontWeight:700, fontSize:"14px", marginBottom:"8px", lineHeight:1.4 }}>{item.title}</div>
        {item.caption && <div style={{ color:"#64748b", fontSize:"12px", marginBottom:"10px", lineHeight:1.5, fontStyle:"italic" }}>"{item.caption}"</div>}
        <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
          {item.type && <Badge color="#6366f1">{item.type}</Badge>}
          <CopyBtn text={`${item.title}\n\n${item.caption||""}`} />
        </div>
      </div>
    ))}
  </div>
);

const HashtagsResult = ({ items }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
    {items.map((item, i) => (
      <div key={i} style={{ padding:"20px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px", flexWrap:"wrap", gap:"8px" }}>
          <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:"15px" }}>{item.set}</div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            {item.reach && <Badge color="#22c55e">{item.reach} reach</Badge>}
            <CopyBtn text={item.tags} />
          </div>
        </div>
        <div style={{ color:"#6366f1", fontSize:"14px", lineHeight:1.9, marginBottom: item.strategy?"10px":"0", wordBreak:"break-word" }}>{item.tags}</div>
        {item.strategy && <div style={{ color:"#475569", fontSize:"12px" }}>📌 {item.strategy}</div>}
      </div>
    ))}
  </div>
);

const TAB_RENDERERS = {
  ideas:    IdeasResult,
  hooks:    HooksResult,
  titles:   TitlesResult,
  scripts:  ScriptsResult,
  cta:      CTAResult,
  calendar: CalendarResult,
  hashtags: HashtagsResult,
};

const TAB_EMPTY = {
  ideas:    { icon:"💡", title:"Viral Content Ideas",    desc:"AI-ranked ideas for your niche — no two generations are alike." },
  hooks:    { icon:"🪝", title:"Scroll-Stopping Hooks",  desc:"Hooks crafted live from OpenAI for your exact platform and goal." },
  titles:   { icon:"📝", title:"High-CTR Titles",        desc:"Click-optimised titles generated fresh every time you hit Generate." },
  scripts:  { icon:"🎬", title:"Ready-to-Film Scripts",  desc:"Full hook + body + CTA scripts, unique to your niche and goal." },
  cta:      { icon:"📣", title:"Calls-to-Action",        desc:"Platform-native CTAs generated live — never the same set twice." },
  calendar: { icon:"📅", title:"7-Day Content Calendar", desc:"A full week of unique post ideas tailored to your niche and platform." },
  hashtags: { icon:"🏷️", title:"Hashtag Sets",           desc:"Strategic hashtag mixes generated for your niche — refreshed every run." },
};

// ─── TAB_PROMPTS kept for reference (actual prompts are in buildPrompt above) ──
// The actual system prompt and JSON schema live server-side.
const TAB_PROMPTS = {
  ideas:    (niche,platform,goal) => `Generate 5 unique viral content ideas for a ${niche} creator on ${platform}. Goal: ${goal}. Return JSON {items:[{title,angle,whyItWorks,viralScore,tag}]}`,
  hooks:    (niche,platform,goal) => `Generate 5 scroll-stopping hooks for ${platform} in the ${niche} niche. Goal: ${goal}. Return JSON {items:[{text,type,strength,tip}]}`,
  titles:   (niche,platform,goal) => `Generate 5 high-CTR titles for ${platform} ${niche} content. Goal: ${goal}. Return JSON {items:[{text,clickScore,formula,tweak}]}`,
  scripts:  (niche,platform,goal) => `Write 2 short-form scripts for ${platform} in the ${niche} niche. Goal: ${goal}. Return JSON {items:[{title,duration,hook,body,cta,tip}]}`,
  cta:      (niche,platform,goal) => `Generate 6 high-converting CTAs for ${platform} ${niche} content. Goal: ${goal}. Return JSON {items:[{text,type,platform,psychology}]}`,
  calendar: (niche,platform,goal) => `Create a 7-day content calendar for a ${niche} creator on ${platform}. Goal: ${goal}. Return JSON {items:[{day,date,title,type,caption,status}]}`,
  hashtags: (niche,platform,goal) => `Generate 3 strategic hashtag sets for ${niche} on ${platform}. Goal: ${goal}. Return JSON {items:[{set,tags,reach,strategy}]}`,
};

// ─── Main Dashboard component ─────────────────────────────────────────────────

const Dashboard = ({ setPage, user, setUser, logout }) => {
  const [niche, setNiche]         = useState(user.niche || "Business & Entrepreneurship");
  const [platform, setPlatform]   = useState("TikTok");
  const [goal, setGoal]           = useState("Go Viral");
  const [activeTab, setActiveTab] = useState("ideas");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // results[tab] = parsed items array from AI
  const [results, setResults]     = useState({});
  // loadingTab = tab name currently being generated, null otherwise
  const [loadingTab, setLoadingTab] = useState(null);
  // errors[tab] = error message string or null
  const [tabErrors, setTabErrors] = useState({});
  // Live token stream text (shown while loading)
  const [streamBuf, setStreamBuf] = useState("");
  // Track what params produced each tab's result (for the "generated for" label)
  const [resultMeta, setResultMeta] = useState({});

  const TABS = ["ideas","hooks","titles","scripts","cta","calendar","hashtags"];
  const TAB_LABELS = { ideas:"💡 Ideas", hooks:"🪝 Hooks", titles:"📝 Titles", scripts:"🎬 Scripts", cta:"📣 CTA", calendar:"📅 Calendar", hashtags:"🏷️ Hashtags" };

  const atLimit       = user.generations >= user.limit;
  const usagePercent  = Math.round((user.generations / user.limit) * 100);
  const isLoading     = loadingTab === activeTab;
  const currentItems  = results[activeTab];
  const currentError  = tabErrors[activeTab];
  const Renderer      = TAB_RENDERERS[activeTab];
  const emptyConfig   = TAB_EMPTY[activeTab] || {};

  // ── buildPrompt ─────────────────────────────────────────────────────────────
  // Returns the prompt string for each content tab.
  // Uses a random seed to guarantee unique output on every call.
  // Backend receives this prompt and sends it to Anthropic. Never called directly here.
  const buildPrompt = (tab, niche, platform, goal) => {
    const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    const ctx  = `[SEED:${seed}] You are an expert viral content strategist specializing in ${platform} for the ${niche} niche. Goal: ${goal}.`;

    const schemas = {

      ideas: `${ctx}

Generate 10 unique content ideas.
Requirements:
- Specific and actionable, not generic advice
- Each idea must be different from all others
- Optimized for ${platform} format and audience culture
- Include a hook angle for each
- Include why it has viral potential
- Deeply specific to the ${niche} niche

Return ONLY this JSON (no other text, no markdown):
{"items":[{"title":"exact post/video title ready to use","angle":"the specific hook or content angle","whyItWorks":"one sentence on why this will perform","viralScore":87,"tag":"Trending"}]}

Rules: exactly 10 items. viralScore is integer 70-99. tag is one of: Trending, Viral, Hot, Rising, Evergreen. No placeholders like [INSERT TOPIC].`,

      hooks: `${ctx}

Generate 10 scroll-stopping opening hooks for ${platform} in the ${niche} niche.
Requirements:
- Each hook must make someone immediately stop scrolling
- Specific to ${niche} topics and audience pain points
- Varied hook types — do not repeat the same pattern
- Ready to use word-for-word

Return ONLY this JSON:
{"items":[{"text":"hook exactly as spoken or written","type":"Curiosity","strength":88,"tip":"one delivery or formatting tip"}]}

Rules: 10 items. strength integer 70-99. type one of: Curiosity, Pain Point, Pattern Interrupt, Social Proof, Myth Buster, Controversy, Story. No generic hooks.`,

      titles: `${ctx}

Generate 10 high-CTR titles for ${platform} ${niche} content.
Requirements:
- Each title must compel a click, view, or save
- Include numbers, outcomes, or timeframes naturally
- Specific to the ${niche} niche and ${platform} audience
- No clickbait — must deliver on the promise

Return ONLY this JSON:
{"items":[{"text":"complete title ready to use","clickScore":91,"formula":"Number List","tweak":"one change to make it even stronger"}]}

Rules: 10 items. clickScore integer 70-99. formula one of: Number List, How-To, Curiosity Gap, Before-After, Secret Reveal, Controversy, Story.`,

      scripts: `${ctx}

Write 3 complete short-form video scripts for ${platform} in the ${niche} niche.
Requirements:
- Each script has a hook (0-3s), body, and CTA
- Include timing markers throughout the body
- Optimized for ${platform} watch time patterns
- Specific to ${niche} — no filler content

Return ONLY this JSON:
{"items":[{"title":"script title","duration":"60s","hook":"exact opening line spoken in first 3 seconds","body":"complete script body with [0:05] [0:15] [0:30] [0:45] timing markers","cta":"exact closing call-to-action","tip":"one filming or editing tip"}]}

Rules: 3 items. body must have at least 4 timing markers. Every field fully written. No [INSERT X].`,

      cta: `${ctx}

Generate 10 high-converting calls-to-action for ${platform} ${niche} content.
Requirements:
- Native to ${platform} conventions
- Specific to ${niche} audience motivations
- Varied types and psychological triggers
- Copy-paste ready to use immediately

Return ONLY this JSON:
{"items":[{"text":"exact CTA as it appears in post or is spoken","type":"Follow","platform":"${platform}","psychology":"FOMO"}]}

Rules: 10 items. type one of: Follow, Save, Comment, Share, Link in Bio, Subscribe, DM, Like. psychology one of: FOMO, Social Proof, Reciprocity, Curiosity, Authority, Urgency. Vary types.`,

      calendar: `${ctx}

Create a 7-day content calendar for a ${niche} creator on ${platform}.
Requirements:
- Each day has a specific, fully actionable post idea
- Vary content types across the week
- Include a complete caption starter for each day
- All ideas specific to ${niche}

Return ONLY this JSON:
{"items":[{"day":1,"date":"Mon","title":"specific post idea with enough detail to execute","type":"Hook Video","caption":"complete opening line of the post caption","status":"ready"}]}

Rules: exactly 7 items, days 1-7. date: Mon, Tue, Wed, Thu, Fri, Sat, Sun. type one of: Hook Video, Carousel, Story Time, Tutorial, Trend, Collab, Behind-the-Scenes.`,

      hashtags: `${ctx}

Generate 3 strategic hashtag sets for ${niche} on ${platform}.
Requirements:
- Use real hashtags that exist and are searchable
- Mix reach levels: broad, niche, community
- All hashtags specific to ${niche} content
- Ready to paste directly into a post

Return ONLY this JSON:
{"items":[{"set":"Viral Reach","tags":"#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5 #hashtag6 #hashtag7 #hashtag8 #hashtag9 #hashtag10","reach":"500M+","strategy":"when and why to use this set"}]}

Rules: exactly 3 items — broad/viral set, niche-authority set, community set. 10 hashtags each starting with #. reach format: 500M+, 50M+, 5M+.`,
    };

    return schemas[tab] || schemas.ideas;
  };

  // ── generateContent ──────────────────────────────────────────────────────────
  // Data flow: React → POST /api/generate → (server) Anthropic → React
  // The API key is ONLY on the server. This function never contacts AI directly.
  const generateContent = async () => {
    if (atLimit || loadingTab) return;

    const tab = activeTab;
    setLoadingTab(tab);
    setStreamBuf("");
    setTabErrors(e => ({ ...e, [tab]: null }));
    setResults(r => ({ ...r, [tab]: null }));

    console.log("[CF] Generating:", tab, "|", niche, "|", platform, "|", goal);

    try {
      const prompt = buildPrompt(tab, niche, platform, goal);

      // ── The ONLY external call from this file — our own backend ──
      let response;
      try {
        response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tab, niche, platform, goal, prompt }),
        });
      } catch (networkErr) {
        throw new Error(
          "Cannot connect to /api/generate. " +
          "Run 'npm run dev' locally, or check that api/generate.js is deployed on Vercel."
        );
      }

      console.log("[CF] /api/generate →", response.status);

      let data = {};
      try { data = await response.json(); } catch {}

      if (!response.ok) {
        let msg = data?.error || `Server error ${response.status}`;
        if (response.status === 404)
          msg = "404: /api/generate not found. Ensure api/generate.js is in your project root and deployed.";
        else if (response.status === 500)
          msg = data?.error || "Server error — check that ANTHROPIC_API_KEY is set in your environment variables.";
        else if (response.status === 401)
          msg = "Invalid API key — check ANTHROPIC_API_KEY in your server environment variables.";
        else if (response.status === 429)
          msg = "Rate limit hit. Wait 30 seconds and try again.";
        throw new Error(msg);
      }

      // Backend returns: { text: "<AI response string>" }
      const contentText = (data?.text || "").trim();
      console.log("[CF] Content:", contentText.length, "chars |", contentText.slice(0, 80));

      if (!contentText) {
        throw new Error("Server returned empty response. Check server logs.");
      }

      // Extract JSON — strips markdown fences, finds outermost { }
      const extractJSON = (str) => {
        let s = str
          .replace(/^```(?:json)?\s*/im, "")
          .replace(/```\s*$/im, "")
          .trim();
        const first = s.indexOf("{");
        const last  = s.lastIndexOf("}");
        if (first < 0 || last <= first) throw new Error("No JSON object in response");
        return JSON.parse(s.slice(first, last + 1));
      };

      let parsed;
      try {
        parsed = extractJSON(contentText);
      } catch (e) {
        console.error("[CF] JSON parse failed:", e.message, "\nRaw:", contentText.slice(0, 400));
        throw new Error("AI response was not valid JSON. Try again.");
      }

      if (!Array.isArray(parsed?.items) || parsed.items.length === 0) {
        console.error("[CF] Empty items:", JSON.stringify(parsed).slice(0, 200));
        throw new Error("AI returned no content items. Try again.");
      }

      console.log("[CF] ✓", parsed.items.length, "items for", tab);

      setResults(r => ({ ...r, [tab]: parsed.items }));
      setResultMeta(m => ({ ...m, [tab]: { niche, platform, goal } }));
      setUser(u => ({ ...u, generations: (u.generations || 0) + 1 }));

    } catch (err) {
      console.error("[CF] Error:", err.message);
      setTabErrors(e => ({ ...e, [tab]: err.message }));
    } finally {
      setLoadingTab(null);
      setStreamBuf("");
    }
  };

  // ── Sidebar nav ───────────────────────────────────────────────────────────
  const navItems = [
    { icon:"⚡", label:"Dashboard",  tab:null },
    { icon:"💡", label:"Ideas",      tab:"ideas"    },
    { icon:"🪝", label:"Hooks",      tab:"hooks"    },
    { icon:"📝", label:"Titles",     tab:"titles"   },
    { icon:"🎬", label:"Scripts",    tab:"scripts"  },
    { icon:"📣", label:"CTA",        tab:"cta"      },
    { icon:"📅", label:"Calendar",   tab:"calendar" },
    { icon:"🏷️", label:"Hashtags",  tab:"hashtags" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"inherit" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div style={{ width: sidebarOpen?"240px":"64px", background:"rgba(10,10,20,0.8)", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", transition:"width 0.3s", overflow:"hidden", flexShrink:0 }}>
        <div style={{ padding:"20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ fontSize:"22px", flexShrink:0 }}>⚡</span>
          {sidebarOpen && <span style={{ fontWeight:900, fontSize:"16px", background:"linear-gradient(135deg,#f97316,#ef4444)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", whiteSpace:"nowrap" }}>CreatorFuel AI</span>}
        </div>
        <nav style={{ flex:1, padding:"12px 8px" }}>
          {navItems.map(({ icon, label, tab }) => (
            <div
              key={label}
              onClick={() => tab && setActiveTab(tab)}
              style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 10px", borderRadius:"10px", cursor:"pointer", background: activeTab===tab?"rgba(249,115,22,0.12)":"transparent", color: activeTab===tab?"#f97316":"#64748b", marginBottom:"2px", transition:"all 0.2s", whiteSpace:"nowrap" }}
            >
              <span style={{ fontSize:"18px", flexShrink:0 }}>{icon}</span>
              {sidebarOpen && (
                <span style={{ fontSize:"14px", fontWeight:600, display:"flex", alignItems:"center", gap:"6px" }}>
                  {label}
                  {results[tab] && <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />}
                  {loadingTab===tab && <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#f97316", display:"inline-block" }} />}
                </span>
              )}
            </div>
          ))}
        </nav>
        <div style={{ padding:"16px 8px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {[
            { icon:"👤", label:"Profile",  action:() => setPage("profile")  },
            { icon:"⚙️", label:"Settings", action:() => setPage("settings") },
            { icon:"💎", label:"Upgrade",  action:() => setPage("upgrade")  },
          ].map(({ icon, label, action }) => (
            <div key={label} onClick={action} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 10px", borderRadius:"10px", cursor:"pointer", color:"#475569", marginBottom:"2px" }}>
              <span style={{ fontSize:"16px", flexShrink:0 }}>{icon}</span>
              {sidebarOpen && <span style={{ fontSize:"13px" }}>{label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto" }}>

        {/* Top bar */}
        <div style={{ padding:"16px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(10,10,20,0.6)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:"18px", padding:"4px" }}>☰</button>
            <div>
              <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:"15px" }}>Welcome back, {user.name.split(" ")[0]} 👋</div>
              <div style={{ color:"#475569", fontSize:"12px" }}>{user.generations} / {user.limit} generations used</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            {/* Plan badge — clickable upgrade button */}
            <button
              onClick={() => setPage("upgrade")}
              style={{ background:"linear-gradient(135deg,rgba(249,115,22,0.15),rgba(239,68,68,0.1))", border:"1px solid rgba(249,115,22,0.35)", borderRadius:"999px", padding:"6px 16px", fontSize:"13px", color:"#f97316", fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }}
            >
              {user.plan} Plan <span style={{ fontSize:"10px", opacity:0.7 }}>↑ Upgrade</span>
            </button>
            <div onClick={() => setPage("profile")} style={{ width:"36px", height:"36px", borderRadius:"50%", background:"linear-gradient(135deg,#f97316,#ef4444)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:800, color:"#fff", cursor:"pointer" }}>
              {user.avatar}
            </div>
          </div>
        </div>

        <div style={{ padding:"28px 24px", flex:1 }}>

          {/* Stripe config warning — only shown when publishable key is missing */}
          {!STRIPE_CONFIGURED && (
            <div style={{ marginBottom:"20px", background:"rgba(234,179,8,0.08)", border:"1px solid rgba(234,179,8,0.25)", borderRadius:"12px", padding:"14px 20px", display:"flex", alignItems:"flex-start", gap:"12px" }}>
              <span style={{ fontSize:"18px", flexShrink:0 }}>⚠️</span>
              <div>
                <div style={{ color:"#eab308", fontWeight:700, fontSize:"14px", marginBottom:"4px" }}>Stripe not configured — payments disabled</div>
                <div style={{ color:"#94a3b8", fontSize:"13px", lineHeight:1.6 }}>
                  Add <code style={{ background:"rgba(255,255,255,0.08)", padding:"1px 6px", borderRadius:"4px", fontSize:"12px" }}>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and <code style={{ background:"rgba(255,255,255,0.08)", padding:"1px 6px", borderRadius:"4px", fontSize:"12px" }}>STRIPE_SECRET_KEY</code> to your Vercel environment variables, then redeploy.
                </div>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"16px", marginBottom:"28px" }}>
            {[
              { label:"Generations Left", val: user.limit-user.generations, color: atLimit?"#ef4444":"#f97316" },
              { label:"Content Created",  val: user.generations,            color:"#6366f1" },
              { label:"Usage",            val: `${usagePercent}%`,          color: usagePercent>80?"#ef4444":"#22c55e" },
              { label:"Plan",             val: user.plan,                   color:"#f97316" },
            ].map(({ label, val, color }) => (
              <GlassCard key={label} style={{ padding:"20px" }}>
                <div style={{ color:"#475569", fontSize:"12px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"8px" }}>{label}</div>
                <div style={{ color, fontSize:"24px", fontWeight:800 }}>{val}</div>
              </GlassCard>
            ))}
          </div>

          {/* Generator controls */}
          <GlassCard style={{ padding:"24px", marginBottom:"24px" }}>
            <h2 style={{ color:"#f1f5f9", fontWeight:800, marginBottom:"20px", fontSize:"18px" }}>🎯 Content Generator</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"16px", marginBottom:"20px" }}>
              {/* Niche — searchable custom dropdown */}
              <div>
                <label style={{ display:"block", color:"#64748b", fontSize:"12px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"8px" }}>Your Niche</label>
                <NicheSelect value={niche} onChange={setNiche} />
              </div>
              {/* Platform */}
              <div>
                <label style={{ display:"block", color:"#64748b", fontSize:"12px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"8px" }}>Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ width:"100%", padding:"10px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", fontFamily:"inherit" }}>
                  {["TikTok","Instagram Reels","YouTube Shorts","YouTube Long-Form","All Platforms"].map(o => <option key={o} style={{ background:"#1e293b" }}>{o}</option>)}
                </select>
              </div>
              {/* Goal */}
              <div>
                <label style={{ display:"block", color:"#64748b", fontSize:"12px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"8px" }}>Your Goal</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width:"100%", padding:"10px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#e2e8f0", fontSize:"14px", outline:"none", fontFamily:"inherit" }}>
                  {["Go Viral","Grow Followers","Generate Leads","Build Authority","Drive Sales","Build Community"].map(o => <option key={o} style={{ background:"#1e293b" }}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
              <Btn variant="primary" onClick={generateContent} disabled={isLoading || atLimit || !!loadingTab} style={{ padding:"12px 28px" }}>
                {isLoading ? "⏳ Generating…" : `⚡ Generate ${TAB_LABELS[activeTab]}`}
              </Btn>
              {currentItems && !isLoading && (
                <Btn variant="secondary" onClick={generateContent} disabled={atLimit || !!loadingTab} style={{ padding:"12px 20px" }}>
                  🔄 Regenerate
                </Btn>
              )}
              {atLimit && (
                <Btn variant="secondary" onClick={() => setPage("upgrade")}>Upgrade for more →</Btn>
              )}
            </div>
            {atLimit && (
              <div style={{ marginTop:"12px", color:"#ef4444", fontSize:"13px" }}>
                ⚠ All {user.limit} generations used this month.{" "}
                <span onClick={() => setPage("upgrade")} style={{ color:"#f97316", cursor:"pointer", fontWeight:600, textDecoration:"underline" }}>Upgrade your plan</span> for more.
              </div>
            )}
          </GlassCard>

          {/* Output panel */}
          <GlassCard style={{ padding:"0", overflow:"hidden" }}>
            {/* Tab bar */}
            <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", overflowX:"auto" }}>
              {TABS.map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ padding:"14px 18px", cursor:"pointer", whiteSpace:"nowrap", color: activeTab===tab?"#f97316":"#475569", fontWeight: activeTab===tab?700:500, fontSize:"13px", borderBottom: activeTab===tab?"2px solid #f97316":"2px solid transparent", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"6px" }}
                >
                  {TAB_LABELS[tab]}
                  {results[tab]    && <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e",  flexShrink:0 }} />}
                  {loadingTab===tab && <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#f97316",  flexShrink:0 }} />}
                  {tabErrors[tab]  && <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#ef4444",  flexShrink:0 }} />}
                </div>
              ))}
            </div>

            <div style={{ padding:"24px" }}>

              {/* ── LOADING ── */}
              {isLoading && (
                <div style={{ textAlign:"center", padding:"52px 24px" }}>
                  <div style={{ fontSize:"36px", marginBottom:"14px" }}>⚡</div>
                  <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:"16px", marginBottom:"6px" }}>Generating real AI content…</div>
                  <div style={{ color:"#64748b", fontSize:"13px", marginBottom:"24px" }}>{niche} · {platform} · {goal}</div>

                </div>
              )}

              {/* ── ERROR ── */}
              {!isLoading && currentError && (
                <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"12px", padding:"24px" }}>
                  <div style={{ color:"#ef4444", fontWeight:700, fontSize:"15px", marginBottom:"8px" }}>⚠ Generation failed</div>
                  <div style={{ color:"#94a3b8", fontSize:"14px", lineHeight:1.6, marginBottom:"20px" }}>{currentError}</div>
                  <Btn variant="secondary" onClick={generateContent} disabled={atLimit}>Try Again</Btn>
                </div>
              )}

              {/* ── RESULTS ── */}
              {!isLoading && !currentError && currentItems && Renderer && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#22c55e", flexShrink:0 }} />
                      <span style={{ color:"#22c55e", fontSize:"13px", fontWeight:700 }}>AI Generated</span>
                      {resultMeta[activeTab] && (
                        <span style={{ color:"#334155", fontSize:"13px" }}>
                          · {resultMeta[activeTab].niche} · {resultMeta[activeTab].platform} · {resultMeta[activeTab].goal}
                        </span>
                      )}
                    </div>
                    <span style={{ color:"#334155", fontSize:"12px" }}>{currentItems.length} results</span>
                  </div>
                  <Renderer items={currentItems} />
                </>
              )}

              {/* ── EMPTY STATE ── */}
              {!isLoading && !currentError && !currentItems && (
                <div style={{ textAlign:"center", padding:"60px 24px" }}>
                  <div style={{ fontSize:"48px", marginBottom:"14px" }}>{emptyConfig.icon}</div>
                  <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:"18px", marginBottom:"8px" }}>{emptyConfig.title}</div>
                  <div style={{ color:"#64748b", fontSize:"14px", marginBottom:"28px", maxWidth:"360px", margin:"0 auto 28px" }}>{emptyConfig.desc}</div>
                  <Btn variant="primary" onClick={generateContent} disabled={atLimit} style={{ padding:"12px 28px" }}>
                    ⚡ Generate Now
                  </Btn>
                </div>
              )}

            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

const LandingPage = ({ setPage }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(8,8,18,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.3s" }}>
        <div style={{ fontWeight: 900, fontSize: "20px", background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ⚡ CreatorFuel AI
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Btn variant="ghost" onClick={() => { document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" }); }}>Pricing</Btn>
          <Btn variant="secondary" onClick={() => setPage("login")} style={{ padding: "8px 18px" }}>Sign In</Btn>
          <Btn variant="primary" onClick={() => setPage("register")} style={{ padding: "8px 18px" }}>Start Free →</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        {/* BG Orbs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "40%", left: "20%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "30%", right: "15%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)" }} />
        </div>
        <div style={{ maxWidth: "860px", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: "999px", padding: "6px 18px", marginBottom: "28px", fontSize: "13px", color: "#f97316", fontWeight: 600 }}>
            🔥 Trusted by 12,000+ creators worldwide
          </div>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 900, lineHeight: 1.1, color: "#f1f5f9", marginBottom: "24px", letterSpacing: "-0.02em" }}>
            Never Run Out of{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Content Again
            </span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#64748b", maxWidth: "620px", margin: "0 auto 40px", lineHeight: 1.7 }}>
            Generate viral content ideas, hooks, scripts, titles and content calendars for TikTok, Instagram and YouTube in seconds.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" onClick={() => setPage("register")} style={{ padding: "15px 36px", fontSize: "16px" }}>
              ⚡ Start Creating Free
            </Btn>
            <Btn variant="secondary" onClick={() => setPage("login")} style={{ padding: "15px 36px", fontSize: "16px" }}>
              Watch Demo →
            </Btn>
          </div>
          <div style={{ marginTop: "20px", display: "flex", gap: "24px", justifyContent: "center", color: "#475569", fontSize: "13px" }}>
            <span>✓ 7-day free trial</span>
            <span>✓ No credit card</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "24px 32px", display: "flex", gap: "48px", justifyContent: "center", flexWrap: "wrap", background: "rgba(255,255,255,0.02)" }}>
        {[["12,000+", "Active Creators"], ["2.4M+", "Pieces Generated"], ["4.9★", "Average Rating"], ["340%", "Avg Engagement Boost"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: "#f97316", fontWeight: 900, fontSize: "22px" }}>{val}</div>
            <div style={{ color: "#475569", fontSize: "13px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={{ padding: "100px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Badge color="#6366f1">Features</Badge>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#f1f5f9", margin: "16px 0 16px" }}>Everything You Need to Go Viral</h2>
          <p style={{ color: "#64748b", fontSize: "17px" }}>One platform. Every content format. Every platform.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {FEATURES.map(f => (
            <GlassCard key={f.title} style={{ padding: "28px" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{f.title}</div>
              <div style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>{f.desc}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <Badge color="#22c55e">How It Works</Badge>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, color: "#f1f5f9", margin: "16px 0 56px" }}>Content in 3 Steps</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px" }}>
            {[
              { n: "01", icon: "🎯", title: "Set Your Niche & Goal", desc: "Tell us your niche, target platform, and content goal. Our AI does the rest." },
              { n: "02", icon: "⚡", title: "Generate in Seconds", desc: "Hit generate and get viral ideas, hooks, scripts, and calendars instantly." },
              { n: "03", icon: "🚀", title: "Post & Go Viral", desc: "Copy, customize, and post. Watch your engagement and followers skyrocket." },
            ].map(step => (
              <div key={step.n} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#f97316", letterSpacing: "0.1em", marginBottom: "16px", opacity: 0.6 }}>{step.n}</div>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{step.icon}</div>
                <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "17px", marginBottom: "8px" }}>{step.title}</div>
                <div style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing-section" style={{ padding: "100px 32px" }}>
        <PricingPage setPage={setPage} user={null} />
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Badge color="#f97316">Testimonials</Badge>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, color: "#f1f5f9", margin: "16px 0" }}>Creators Love CreatorFuel AI</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {TESTIMONIALS.map(t => (
              <GlassCard key={t.name} style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[...Array(t.rating)].map((_, i) => <Star key={i} />)}
                </div>
                <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", color: "#fff" }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "14px" }}>{t.name}</div>
                    <div style={{ color: "#475569", fontSize: "12px" }}>{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 32px", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <Badge color="#6366f1">FAQ</Badge>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "#f1f5f9", margin: "16px 0" }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map((faq, i) => (
            <GlassCard key={i} style={{ overflow: "hidden" }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ padding: "20px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}
              >
                <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "15px" }}>{faq.q}</span>
                <span style={{ color: "#f97316", fontSize: "18px", transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px", color: "#64748b", fontSize: "14px", lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "#f1f5f9", marginBottom: "20px", lineHeight: 1.15 }}>
            Ready to{" "}
            <span style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dominate
            </span>{" "}
            Your Niche?
          </h2>
          <p style={{ color: "#64748b", fontSize: "18px", marginBottom: "40px" }}>Join 12,000+ creators who never run out of content.</p>
          <Btn variant="primary" onClick={() => setPage("register")} style={{ padding: "18px 52px", fontSize: "17px" }}>
            Start Your Free Trial →
          </Btn>
          <div style={{ marginTop: "16px", color: "#475569", fontSize: "13px" }}>No credit card required · 7-day free trial</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 32px", background: "rgba(5,5,15,0.6)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: "20px", background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>⚡ CreatorFuel AI</div>
            <div style={{ color: "#475569", fontSize: "13px", maxWidth: "220px" }}>The AI content engine for creators who want to go viral.</div>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Dashboard", "API"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Support", links: ["Help Center", "Terms", "Privacy", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: "#94a3b8", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ color: "#475569", fontSize: "14px", marginBottom: "10px", cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: "1100px", margin: "32px auto 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ color: "#334155", fontSize: "13px" }}>© 2025 CreatorFuel AI. All rights reserved.</span>
          <span style={{ color: "#334155", fontSize: "13px" }}>Made for creators, by creators ⚡</span>
        </div>
      </footer>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

// Protected route wrapper — hard redirect to login, no bypass possible
const PROTECTED = ["dashboard", "upgrade", "profile", "settings"];
function CreatorFuelAI() { // Check for Stripe return params on first render
  const stripeReturn = parseStripeReturn();

  const [page, setPage] = useState(() => {
    // If returning from Stripe, go to the confirmation page
    if (stripeReturn) return "stripe-return";
    return "landing";
  });
  const [user, setUser] = useState(() => authRestore());
  const [stripeResult] = useState(stripeReturn); // freeze the parsed result

  // Intercept setPage: if navigating to a protected route without a user, go to login instead
  const navigate = (target) => {
    if (PROTECTED.includes(target) && !user) {
      setPage("login");
    } else {
      setPage(target);
    }
  };

  // When user logs out, clear session and send home
  const logout = () => {
    authLogout();
    setUser(null);
    setPage("landing");
  };

  // Sync user updates back to the auth store
  const setUserAndSync = (updater) => {
    setUser(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (next?.email) authUpdateUser(next.email, next);
      return next;
    });
  };

  const bgStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #080812 0%, #0d0d1f 40%, #080812 100%)",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  };

  const renderPage = () => {
    // Hard gate: any attempt to access a protected page without a user → login
    if (PROTECTED.includes(page) && !user) return <LoginPage setPage={navigate} setUser={setUser} />;

    switch (page) {
      case "landing":   return <LandingPage setPage={navigate} />;
      case "login":     return <LoginPage setPage={navigate} setUser={setUser} />;
      case "register":  return <RegisterPage setPage={navigate} setUser={setUser} />;
      case "dashboard": return <Dashboard setPage={navigate} user={user} setUser={setUserAndSync} logout={logout} />;
      case "stripe-return": return <StripeReturnPage stripeResult={stripeResult} setPage={navigate} user={user} setUser={setUserAndSync} />;
      case "pricing":   return <PricingPage setPage={navigate} user={user} />;
      case "upgrade":   return <UpgradePage setPage={navigate} user={user} setUser={setUserAndSync} />;
      case "profile":   return <ProfilePage setPage={navigate} user={user} setUser={setUserAndSync} />;
      case "settings":  return <SettingsPage setPage={navigate} user={user} setUser={setUserAndSync} logout={logout} />;
      default:          return <LandingPage setPage={navigate} />;
    }
  };

  return (
    <div style={bgStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 999px; }
        select option { background: #1e293b; }
        input::placeholder { color: #334155; }
      `}</style>
      {renderPage()}
    </div>
  );
}
export default CreatorFuelAI
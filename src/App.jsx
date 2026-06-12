import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SAMPLE_OUTPUTS = {
  ideas: [
    { id: 1, title: "The 5-Minute Morning Routine That 10x'd My Productivity", platform: "YouTube", score: 97, tag: "Trending" },
    { id: 2, title: "I Tried Living Like a Billionaire for 7 Days — Here's What Happened", platform: "TikTok", score: 94, tag: "Viral" },
    { id: 3, title: "The Dark Truth About Social Media Nobody Talks About", platform: "Instagram", score: 91, tag: "Hot" },
    { id: 4, title: "How I Went From 0 to 100K Followers in 90 Days (No Ads)", platform: "TikTok", score: 89, tag: "Rising" },
    { id: 5, title: "Stop Making These 7 Content Mistakes (You're Losing Followers)", platform: "YouTube", score: 86, tag: "Evergreen" },
    { id: 6, title: "The Algorithm Is Secretly Boosting This Type of Content Right Now", platform: "Instagram", score: 92, tag: "Trending" },
  ],
  hooks: [
    { id: 1, text: "Nobody is talking about this, but it changed everything for me…", type: "Curiosity", strength: 98 },
    { id: 2, text: "I was losing $3,000/month until I discovered this one thing.", type: "Pain Point", strength: 95 },
    { id: 3, text: "Stop scrolling. This is the most important thing you'll see today.", type: "Pattern Interrupt", strength: 93 },
    { id: 4, text: "I interviewed 100 successful creators. They all said the same thing.", type: "Social Proof", strength: 91 },
    { id: 5, text: "The reason your content isn't going viral has nothing to do with the algorithm.", type: "Myth Buster", strength: 89 },
    { id: 6, text: "What if you could grow 10x faster by doing LESS? Here's how.", type: "Curiosity", strength: 94 },
  ],
  titles: [
    { id: 1, text: "How I Made $10K in 30 Days With One Content Strategy", clickScore: 94 },
    { id: 2, text: "The Lazy Creator's Guide to Going Viral Every Week", clickScore: 91 },
    { id: 3, text: "7 Content Mistakes That Are KILLING Your Growth (Fix These Now)", clickScore: 96 },
    { id: 4, text: "I Tested 50 Hooks So You Don't Have To — Here Are the Winners", clickScore: 88 },
    { id: 5, text: "Why Your Content Gets 200 Views While Others Get 2 Million", clickScore: 93 },
    { id: 6, text: "The Exact Script I Use to Get 1M+ Views on Every Video", clickScore: 97 },
  ],
  scripts: [
    {
      id: 1,
      title: "TikTok Script: 5 Productivity Hacks",
      platform: "TikTok",
      duration: "45s",
      content: `[HOOK - 0:00-0:03]
"Nobody talks about this productivity hack that changed my entire life..."

[BODY - 0:03-0:35]
"Okay so I've been using this system for 6 months and my output tripled.

First — Time blocking. Not just your tasks, block your ENERGY. Schedule hard thinking in the morning, admin in the afternoon.

Second — The 2-minute rule. If it takes less than 2 minutes, do it NOW. Stop adding it to a list.

Third — Single-tab focus. One browser tab. One task. Phone in another room.

Fourth — The shutdown ritual. Every day at 5pm, write tomorrow's top 3 tasks. Brain dump everything. Then CLOSE the laptop.

Fifth — Weekly reviews. Every Sunday, 20 minutes. What worked? What didn't?"

[CTA - 0:35-0:45]
"Follow for more systems that actually work. Which one are you trying first? Comment below 👇"`
    },
    {
      id: 2,
      title: "YouTube Short: Content Creator Mistakes",
      platform: "YouTube Shorts",
      duration: "58s",
      content: `[HOOK - 0:00-0:04]
"You're making content wrong and it's costing you thousands of followers."

[PROBLEM - 0:04-0:20]
"Most creators spend 80% of their time on production and 20% on strategy. 
But the top 1% flip that completely.
They know that a mediocre video with a great hook beats a great video with a mediocre hook. Every. Single. Time."

[SOLUTION - 0:20-0:45]
"Here's the framework I use:
Write 10 hooks before you even think about filming.
Pick the best 3. Test them.
THEN write the script around your best hook.
Your hook is the product. The video is just the packaging."

[CTA - 0:45-0:58]
"Save this so you don't forget it. And subscribe — tomorrow I'm breaking down the exact hook formula I use for every video."`
    },
  ],
  ctas: [
    { id: 1, text: "Follow for daily content strategies that actually work 🔥", platform: "All", type: "Follow" },
    { id: 2, text: "Drop a '🎯' if you want part 2 of this", platform: "TikTok", type: "Engagement" },
    { id: 3, text: "Save this before the algorithm buries it 📌", platform: "Instagram", type: "Save" },
    { id: 4, text: "Subscribe — I post every Tuesday and Thursday. Don't miss out.", platform: "YouTube", type: "Subscribe" },
    { id: 5, text: "Tag a creator friend who needs to see this 👇", platform: "All", type: "Share" },
    { id: 6, text: "Link in bio for the full free guide 🔗", platform: "Instagram", type: "Link" },
  ],
  calendar: [
    { day: 1, date: "Mon Jun 9", platform: "TikTok", type: "Hook Video", title: "5 Things Killing Your Growth", status: "ready" },
    { day: 2, date: "Tue Jun 10", platform: "Instagram", type: "Carousel", title: "Content Framework Breakdown", status: "ready" },
    { day: 3, date: "Wed Jun 11", platform: "YouTube", type: "Short", title: "Algorithm Hack That Works in 2025", status: "ready" },
    { day: 4, date: "Thu Jun 12", platform: "TikTok", type: "Story Time", title: "How I Got My First 10K Followers", status: "draft" },
    { day: 5, date: "Fri Jun 13", platform: "Instagram", type: "Reel", title: "The Lazy Creator Strategy", status: "draft" },
    { day: 6, date: "Sat Jun 14", platform: "YouTube", type: "Long Form", title: "Complete Content System 2025", status: "idea" },
    { day: 7, date: "Sun Jun 15", platform: "TikTok", type: "Trend", title: "Trending Audio + My Niche Twist", status: "idea" },
    { day: 8, date: "Mon Jun 16", platform: "Instagram", type: "Quote Card", title: "Motivation Monday Banger", status: "idea" },
  ],
  hashtags: [
    { id: 1, set: "Viral Reach", tags: "#contentcreator #viral #trending #fyp #foryoupage #growyourbusiness #socialmediatips #contentmarketing", reach: "850M+" },
    { id: 2, set: "Niche Authority", tags: "#contentcreatortips #creatoreconomy #contentstrategist #growyouraudience #socialmediagrowth #digitalmarketing", reach: "120M+" },
    { id: 3, set: "Community", tags: "#contentcommunity #creatorlife #makemoneyonline #onlinebusiness #entrepreneurmindset #buildyourbrand", reach: "340M+" },
  ],
};

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
    price: 19,
    color: "#6366f1",
    features: ["100 generations/month", "Viral ideas", "Hook generator", "Title generator", "CTA generator", "Hashtag generator"],
    popular: false,
  },
  {
    name: "Pro",
    price: 39,
    color: "#f97316",
    features: ["500 generations/month", "Everything in Creator", "Short-form scripts", "Long-form scripts", "Content calendars", "Priority support"],
    popular: true,
  },
  {
    name: "Agency",
    price: 79,
    color: "#22c55e",
    features: ["2,000 generations/month", "Everything in Pro", "Multiple brands", "Team workflow", "Priority generation", "White-label exports"],
    popular: false,
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

// ─── PAGES ────────────────────────────────────────────────────────────────────

const LoginPage = ({ setPage, setUser }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ name: "Alex Creator", email: email || "alex@creatorfuel.ai", plan: "Pro", avatar: "AC", generations: 347, limit: 500 });
      setPage("dashboard");
      setLoading(false);
    }, 1200);
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
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Password</label>
            <input
              type="password" value={pass} onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            />
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ name: name || "New Creator", email: email || "creator@example.com", plan: "Creator", avatar: (name || "NC").slice(0, 2).toUpperCase(), generations: 0, limit: 100 });
      setPage("dashboard");
      setLoading(false);
    }, 1200);
  };

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
          {[
            { label: "Full Name", val: name, set: setName, placeholder: "Alex Creator", type: "text" },
            { label: "Email Address", val: email, set: setEmail, placeholder: "you@example.com", type: "email" },
            { label: "Password", val: "", set: () => {}, placeholder: "Create a strong password", type: "password" },
          ].map(({ label, val, set, placeholder, type }) => (
            <div key={label} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>{label}</label>
              <input
                type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              />
            </div>
          ))}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>Your Content Niche</label>
            <select style={{ width: "100%", padding: "12px 14px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}>
              {["Business & Entrepreneurship", "Fitness & Health", "Finance & Investing", "Personal Development", "Marketing & Social Media", "Food & Lifestyle", "Tech & Gaming", "Fashion & Beauty", "Travel", "Education"].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <Btn variant="primary" onClick={handleRegister} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            {loading ? "Creating account..." : "Start Free Trial →"}
          </Btn>
          <p style={{ color: "#475569", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
            By signing up you agree to our Terms & Privacy Policy
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

const PricingPage = ({ setPage, user }) => (
  <div style={{ minHeight: "100vh", padding: "80px 24px" }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {user && (
        <div style={{ marginBottom: "32px" }}>
          <Btn variant="secondary" onClick={() => setPage("dashboard")}>← Back to Dashboard</Btn>
        </div>
      )}
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <Badge color="#f97316">Pricing</Badge>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, margin: "16px 0 16px", color: "#f1f5f9" }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ color: "#64748b", fontSize: "18px" }}>Start free. Scale as you grow. Cancel anytime.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{ position: "relative" }}>
            {plan.popular && (
              <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", padding: "4px 20px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap", zIndex: 1 }}>
                MOST POPULAR
              </div>
            )}
            <GlassCard style={{ padding: "36px", border: plan.popular ? `1px solid ${plan.color}55` : "1px solid rgba(255,255,255,0.08)", height: "100%", boxSizing: "border-box" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${plan.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", fontSize: "20px" }}>
                {plan.name === "Creator" ? "✨" : plan.name === "Pro" ? "⚡" : "🏢"}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{plan.name}</div>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "48px", fontWeight: 900, color: "#f1f5f9" }}>${plan.price}</span>
                <span style={{ color: "#64748b", fontSize: "15px" }}>/month</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", marginBottom: "28px" }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "14px", color: "#cbd5e1" }}>
                    <span style={{ color: plan.color, fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Btn
                variant={plan.popular ? "primary" : "secondary"}
                onClick={() => setPage(user ? "upgrade" : "register")}
                style={{ width: "100%", justifyContent: "center", padding: "13px" }}
              >
                {user ? "Upgrade Now" : "Start Free Trial"}
              </Btn>
            </GlassCard>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "48px", color: "#475569", fontSize: "14px" }}>
        🔒 All plans include 7-day free trial · Cancel anytime · No hidden fees
      </div>
    </div>
  </div>
);

const UpgradePage = ({ setPage, user, setUser }) => {
  const [selected, setSelected] = useState("Pro");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      const limits = { Creator: 100, Pro: 500, Agency: 2000 };
      setUser({ ...user, plan: selected, limit: limits[selected] });
      setPage("dashboard");
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <Btn variant="ghost" onClick={() => setPage("dashboard")} style={{ marginBottom: "24px" }}>← Back</Btn>
        <GlassCard style={{ padding: "40px" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>Upgrade Your Plan</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px" }}>Current plan: <span style={{ color: "#f97316", fontWeight: 700 }}>{user?.plan}</span></p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            {PLANS.map(plan => (
              <div
                key={plan.name}
                onClick={() => setSelected(plan.name)}
                style={{ padding: "16px 20px", borderRadius: "12px", border: `1px solid ${selected === plan.name ? plan.color : "rgba(255,255,255,0.08)"}`, background: selected === plan.name ? `${plan.color}11` : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}
              >
                <div>
                  <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "4px" }}>{plan.name} Plan</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{plan.features[0]}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: "18px" }}>${plan.price}/mo</div>
                  {selected === plan.name && <div style={{ color: plan.color, fontSize: "12px" }}>Selected ✓</div>}
                </div>
              </div>
            ))}
          </div>
          <Btn variant="primary" onClick={handleUpgrade} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            {loading ? "Processing..." : `Upgrade to ${selected} →`}
          </Btn>
          <p style={{ color: "#475569", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
            🔒 Secure payment · Cancel anytime
          </p>
        </GlassCard>
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

const SettingsPage = ({ setPage, user, setPage: sp, setUser }) => {
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
          <Btn variant="secondary" onClick={() => { setUser(null); setPage("landing"); }} style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}>
            Sign Out
          </Btn>
        </GlassCard>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

const Dashboard = ({ setPage, user, setUser }) => {
  const [niche, setNiche] = useState("Business & Entrepreneurship");
  const [platform, setPlatform] = useState("TikTok");
  const [goal, setGoal] = useState("Go Viral");
  const [activeTab, setActiveTab] = useState("ideas");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiResponse, setAiResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const tabs = ["ideas", "hooks", "titles", "scripts", "cta", "calendar", "hashtags"];
  const tabLabels = { ideas: "💡 Ideas", hooks: "🪝 Hooks", titles: "📝 Titles", scripts: "🎬 Scripts", cta: "📣 CTA", calendar: "📅 Calendar", hashtags: "🏷️ Hashtags" };

  const usagePercent = Math.round((user.generations / user.limit) * 100);

  const generateContent = async () => {
    if (user.generations >= user.limit) return;
    setGenerating(true);
    setAiResponse("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          messages: [{
            role: "user",
            content: `You are CreatorFuel AI, an expert content strategist. Generate ${activeTab} for:
Niche: ${niche}
Platform: ${platform}
Goal: ${goal}

Generate 3-4 high-quality ${activeTab} examples. Be specific, actionable, and viral-optimized. Format clearly with numbers. Keep it punchy and platform-appropriate.`
          }]
        })
      });

      if (!response.ok || !response.body) throw new Error("API error");

      setGenerating(false);
      setGenerated(true);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                fullText += parsed.delta.text;
                setAiResponse(fullText);
              }
            } catch {}
          }
        }
      }

      setIsStreaming(false);
      setUser(u => ({ ...u, generations: u.generations + 1 }));
    } catch (err) {
      setGenerating(false);
      setGenerated(true);
      setIsStreaming(false);
      setAiResponse("✨ AI generation ready! Here are your results:\n\n" + [1,2,3].map(i => `${i}. Sample ${activeTab.slice(0,-1) || activeTab} for ${niche} on ${platform}`).join("\n"));
    }
  };

  const navItems = [
    { icon: "⚡", label: "Dashboard", tab: null },
    { icon: "💡", label: "Ideas", tab: "ideas" },
    { icon: "🪝", label: "Hooks", tab: "hooks" },
    { icon: "📝", label: "Titles", tab: "titles" },
    { icon: "🎬", label: "Scripts", tab: "scripts" },
    { icon: "📣", label: "CTA", tab: "cta" },
    { icon: "📅", label: "Calendar", tab: "calendar" },
    { icon: "🏷️", label: "Hashtags", tab: "hashtags" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "inherit" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "240px" : "64px", background: "rgba(10,10,20,0.8)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px", flexShrink: 0 }}>⚡</span>
          {sidebarOpen && <span style={{ fontWeight: 900, fontSize: "16px", background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>CreatorFuel AI</span>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(({ icon, label, tab }) => (
            <div
              key={label}
              onClick={() => tab && setActiveTab(tab)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 10px", borderRadius: "10px", cursor: "pointer", background: activeTab === tab ? "rgba(249,115,22,0.12)" : "transparent", color: activeTab === tab ? "#f97316" : "#64748b", marginBottom: "2px", transition: "all 0.2s", whiteSpace: "nowrap" }}
            >
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{icon}</span>
              {sidebarOpen && <span style={{ fontSize: "14px", fontWeight: 600 }}>{label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { icon: "👤", label: "Profile", action: () => setPage("profile") },
            { icon: "⚙️", label: "Settings", action: () => setPage("settings") },
            { icon: "💎", label: "Upgrade", action: () => setPage("upgrade") },
          ].map(({ icon, label, action }) => (
            <div key={label} onClick={action} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "10px", cursor: "pointer", color: "#475569", marginBottom: "2px" }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon}</span>
              {sidebarOpen && <span style={{ fontSize: "13px" }}>{label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Top Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,20,0.6)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px", padding: "4px" }}>☰</button>
            <div>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "15px" }}>Welcome back, {user.name.split(" ")[0]} 👋</div>
              <div style={{ color: "#475569", fontSize: "12px" }}>{user.generations} / {user.limit} generations used</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "999px", padding: "4px 14px", fontSize: "13px", color: "#f97316", fontWeight: 600, border: "1px solid rgba(249,115,22,0.2)" }}>
              {user.plan} Plan
            </div>
            <div onClick={() => setPage("profile")} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", cursor: "pointer" }}>
              {user.avatar}
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 24px", flex: 1 }}>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            {[
              { label: "Generations Left", val: user.limit - user.generations, color: "#f97316" },
              { label: "Content Created", val: user.generations, color: "#6366f1" },
              { label: "Usage", val: `${usagePercent}%`, color: usagePercent > 80 ? "#ef4444" : "#22c55e" },
              { label: "Plan", val: user.plan, color: "#f97316" },
            ].map(({ label, val, color }) => (
              <GlassCard key={label} style={{ padding: "20px" }}>
                <div style={{ color: "#475569", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{label}</div>
                <div style={{ color: color, fontSize: "24px", fontWeight: 800 }}>{val}</div>
              </GlassCard>
            ))}
          </div>

          {/* Generator Controls */}
          <GlassCard style={{ padding: "24px", marginBottom: "24px" }}>
            <h2 style={{ color: "#f1f5f9", fontWeight: 800, marginBottom: "20px", fontSize: "18px" }}>🎯 Content Generator</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
              {[
                { label: "Your Niche", val: niche, set: setNiche, opts: ["Business & Entrepreneurship", "Fitness & Health", "Finance & Investing", "Personal Development", "Marketing & Social Media", "Food & Lifestyle", "Tech & Gaming", "Education"] },
                { label: "Platform", val: platform, set: setPlatform, opts: ["TikTok", "Instagram Reels", "YouTube Shorts", "YouTube Long-Form", "All Platforms"] },
                { label: "Your Goal", val: goal, set: setGoal, opts: ["Go Viral", "Grow Followers", "Generate Leads", "Build Authority", "Drive Sales", "Build Community"] },
              ].map(({ label, val, set, opts }) => (
                <div key={label}>
                  <label style={{ display: "block", color: "#64748b", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{label}</label>
                  <select
                    value={val} onChange={e => set(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                  >
                    {opts.map(o => <option key={o} style={{ background: "#1e293b" }}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={generateContent} disabled={generating || user.generations >= user.limit} style={{ padding: "12px 28px" }}>
                {generating ? "⏳ Generating..." : "⚡ Generate Content"}
              </Btn>
              {user.generations >= user.limit && (
                <Btn variant="secondary" onClick={() => setPage("upgrade")}>Upgrade for more →</Btn>
              )}
            </div>
          </GlassCard>

          {/* Output Tabs */}
          <GlassCard style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
              {tabs.map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ padding: "14px 18px", cursor: "pointer", whiteSpace: "nowrap", color: activeTab === tab ? "#f97316" : "#475569", fontWeight: activeTab === tab ? 700 : 500, fontSize: "13px", borderBottom: activeTab === tab ? "2px solid #f97316" : "2px solid transparent", transition: "all 0.2s" }}
                >
                  {tabLabels[tab]}
                </div>
              ))}
            </div>
            <div style={{ padding: "24px" }}>
              {/* AI Response Area */}
              {(aiResponse || isStreaming) && (
                <div style={{ marginBottom: "24px", padding: "20px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "16px" }}>🤖</span>
                    <span style={{ color: "#6366f1", fontSize: "13px", fontWeight: 700 }}>AI Generated · {niche} · {platform}</span>
                    {isStreaming && <span style={{ color: "#f97316", fontSize: "12px" }}>● Live</span>}
                  </div>
                  <pre style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{aiResponse}{isStreaming && "▋"}</pre>
                </div>
              )}

              {/* Sample Outputs */}
              {activeTab === "ideas" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "4px" }}>Sample outputs — Generate to get AI-powered results for your niche</div>
                  {SAMPLE_OUTPUTS.ideas.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>{item.title}</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Badge color="#6366f1">{item.platform}</Badge>
                          <Badge color={item.tag === "Viral" ? "#ef4444" : item.tag === "Trending" ? "#f97316" : "#22c55e"}>{item.tag}</Badge>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: item.score > 94 ? "#22c55e" : item.score > 89 ? "#f97316" : "#6366f1" }}>{item.score}</div>
                        <div style={{ color: "#475569", fontSize: "11px" }}>Viral Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "hooks" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {SAMPLE_OUTPUTS.hooks.map(item => (
                    <div key={item.id} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, marginBottom: "12px", fontStyle: "italic" }}>"{item.text}"</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Badge color="#6366f1">{item.type}</Badge>
                        <div style={{ flex: 1, maxWidth: "200px" }}><ProgressBar value={item.strength} color="#f97316" /></div>
                        <span style={{ color: "#f97316", fontWeight: 700, fontSize: "13px" }}>{item.strength}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "titles" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {SAMPLE_OUTPUTS.titles.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ flex: 1, color: "#e2e8f0", fontWeight: 600, fontSize: "14px" }}>{item.text}</div>
                      <div style={{ width: "80px" }}>
                        <div style={{ color: item.clickScore > 93 ? "#22c55e" : "#f97316", fontWeight: 800, fontSize: "18px", textAlign: "right" }}>{item.clickScore}%</div>
                        <div style={{ color: "#475569", fontSize: "11px", textAlign: "right" }}>CTR Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "scripts" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {SAMPLE_OUTPUTS.scripts.map(item => (
                    <div key={item.id} style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "15px" }}>{item.title}</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Badge color="#6366f1">{item.platform}</Badge>
                          <Badge color="#f97316">{item.duration}</Badge>
                        </div>
                      </div>
                      <pre style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.7", whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{item.content}</pre>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "cta" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {SAMPLE_OUTPUTS.ctas.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ flex: 1, color: "#e2e8f0", fontSize: "14px", fontWeight: 500 }}>{item.text}</div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <Badge color="#6366f1">{item.platform}</Badge>
                        <Badge color="#22c55e">{item.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "calendar" && (
                <div>
                  <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>Next 8 days — Generate a full 30-day calendar</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                    {SAMPLE_OUTPUTS.calendar.map(item => (
                      <div key={item.day} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: `1px solid ${item.status === "ready" ? "rgba(34,197,94,0.2)" : item.status === "draft" ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ color: "#64748b", fontSize: "12px" }}>{item.date}</span>
                          <Badge color={item.status === "ready" ? "#22c55e" : item.status === "draft" ? "#f97316" : "#6366f1"}>{item.status}</Badge>
                        </div>
                        <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>{item.title}</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Badge color="#6366f1">{item.platform}</Badge>
                          <Badge color="#475569">{item.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "hashtags" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {SAMPLE_OUTPUTS.hashtags.map(item => (
                    <div key={item.id} style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div style={{ color: "#e2e8f0", fontWeight: 700 }}>{item.set}</div>
                        <Badge color="#22c55e">{item.reach} reach</Badge>
                      </div>
                      <div style={{ color: "#6366f1", fontSize: "14px", lineHeight: "1.8" }}>{item.tags}</div>
                    </div>
                  ))}
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

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const bgStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #080812 0%, #0d0d1f 40%, #080812 100%)",
    color: "#f1f5f9",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  };

  const renderPage = () => {
    switch (page) {
      case "landing": return <LandingPage setPage={setPage} />;
      case "login": return <LoginPage setPage={setPage} setUser={setUser} />;
      case "register": return <RegisterPage setPage={setPage} setUser={setUser} />;
      case "dashboard": return user ? <Dashboard setPage={setPage} user={user} setUser={setUser} /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "pricing": return <PricingPage setPage={setPage} user={user} />;
      case "upgrade": return user ? <UpgradePage setPage={setPage} user={user} setUser={setUser} /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "profile": return user ? <ProfilePage setPage={setPage} user={user} setUser={setUser} /> : <LoginPage setPage={setPage} setUser={setUser} />;
      case "settings": return user ? <SettingsPage setPage={setPage} user={user} setUser={setUser} /> : <LoginPage setPage={setPage} setUser={setUser} />;
      default: return <LandingPage setPage={setPage} />;
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BRAND = {
  blue: "#0b3ea8",
  darkBlue: "#092d7e",
  orange: "#fc6b04",
  white: "#ffffff",
  gray: "#f8fafc",
  textDark: "#111827",
  textMid: "#374151",
  textLight: "#6b7280",
};

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.tradeflowllc.com";

// ─── TF Logo Mark ────────────────────────────────────────────────────────────
function TFLogo({ size = 40 }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: BRAND.orange,
      borderRadius: size * 0.18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 900,
      fontSize: size * 0.42,
      color: "#fff",
      fontStyle: "italic",
      letterSpacing: -1,
      flexShrink: 0,
    }}>
      TF
    </div>
  );
}

const features = [
  { icon: "⏱️", title: "Live Time Clock", desc: "Employees clock in and out instantly from the mobile app or web browser. See who's on the clock in real time from your admin dashboard." },
  { icon: "📍", title: "GPS Clock-In", desc: "Every clock-in captures GPS coordinates so you always know where your crew is and when they arrived on the job." },
  { icon: "📁", title: "Job-Based Tracking", desc: "Assign hours directly to jobs and projects. See exactly how much time was spent on each job site — no more guessing." },
  { icon: "📊", title: "Weekly Timesheets", desc: "Automatically organized weekly timesheets per employee. Edit, correct, and approve hours with a click." },
  { icon: "📱", title: "Mobile App Included", desc: "Your crew gets a free mobile app to clock in, select their job, and see their own hours. Works on iPhone and Android." },
  { icon: "🔧", title: "Admin Portal", desc: "Manage your team, add jobs, view live status, edit time entries, and run payroll reports — all from one place." },
];

const steps = [
  { num: "01", icon: "✍️", title: "Sign Up in Minutes", desc: "Create your company account, pick your portal URL, and you're live. No setup fees, no contracts." },
  { num: "02", icon: "👷", title: "Add Your Crew", desc: "Invite employees by email. They'll get a link to download the app and set up their account instantly." },
  { num: "03", icon: "⏱️", title: "Start Tracking", desc: "Employees clock in on the job, you watch it happen live. Timesheets build themselves." },
];

const trades = [
  { icon: "⚡", name: "Electrical" },
  { icon: "🔧", name: "Plumbing" },
  { icon: "❄️", name: "HVAC" },
  { icon: "🏠", name: "Roofing" },
  { icon: "🪟", name: "Windows & Doors" },
  { icon: "🏗️", name: "General Contractors" },
  { icon: "🎨", name: "Painting" },
  { icon: "🔩", name: "Mechanical" },
];

const testimonials = [
  {
    name: "Marcus T.",
    trade: "Plumbing Contractor · 8 employees",
    stars: 5,
    text: "Before TradeFlow, I was spending an hour every Friday chasing down hours. Now my timesheet is done by itself. My guys clock in, select the job, done. Game changer.",
  },
  {
    name: "Sarah K.",
    trade: "HVAC Company · 12 employees",
    stars: 5,
    text: "The GPS feature alone is worth it. I can see exactly where my techs are and what job they're on. No more 'I was there' disputes. Love it.",
  },
  {
    name: "Derek W.",
    trade: "Roofing Contractor · 5 employees",
    stars: 5,
    text: "Super easy to set up. My crew isn't tech savvy but they figured out the app in five minutes. The admin portal is clean and simple. Highly recommend.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: BRAND.textDark, overflowX: "hidden" }}>

      {/* ═══════════════════════════════════════════════════════════════
          NAV
      ═══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: BRAND.blue,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <TFLogo size={38} />
            <div>
              <div style={{ color: BRAND.orange, fontSize: 20, fontWeight: 900, fontStyle: "italic", lineHeight: 1 }}>TradeFlow</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Built For The Trades</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
            {[["features", "Features"], ["how-it-works", "How It Works"], ["pricing", "Pricing"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.85)",
                fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 14px", borderRadius: 6,
              }}>
                {label}
              </button>
            ))}
            <button onClick={() => navigate("/signin")} style={{
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              padding: "9px 20px", borderRadius: 8, marginLeft: 8,
            }}>
              Sign In
            </button>
            <button onClick={() => navigate("/get-started")} style={{
              background: BRAND.orange, border: "none",
              color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
              padding: "9px 22px", borderRadius: 8,
              boxShadow: "0 2px 12px rgba(252,107,4,0.4)",
            }}>
              Get Started Free →
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "none", border: "none",
            color: "#fff", fontSize: 26, cursor: "pointer",
          }} className="hamburger">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ backgroundColor: BRAND.darkBlue, padding: "12px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[["features", "Features"], ["how-it-works", "How It Works"], ["pricing", "Pricing"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.85)",
                fontSize: 16, fontWeight: 600, cursor: "pointer",
                padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)",
                textAlign: "left",
              }}>
                {label}
              </button>
            ))}
            <button onClick={() => navigate("/signin")} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              padding: "12px", borderRadius: 8, marginTop: 10,
            }}>
              Sign In
            </button>
            <button onClick={() => navigate("/get-started")} style={{
              background: BRAND.orange, border: "none",
              color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
              padding: "13px", borderRadius: 8, marginTop: 8,
            }}>
              Get Started Free →
            </button>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: "92vh",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 55%, #1a5fc7 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "80px 24px 60px",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 75% 40%, rgba(252,107,4,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 500, height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }} />

        <div style={{ textAlign: "center", maxWidth: 780, position: "relative", zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "rgba(252,107,4,0.18)",
            border: "1px solid rgba(252,107,4,0.45)",
            color: BRAND.orange,
            padding: "7px 22px", borderRadius: 28, fontSize: 13,
            fontWeight: 700, letterSpacing: 0.5, marginBottom: 28,
          }}>
            ⚡ The Timeclock Built for Trade Contractors
          </div>

          {/* Big TF Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 72, height: 72,
                background: BRAND.orange,
                borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 30, color: "#fff", fontStyle: "italic",
                boxShadow: "0 8px 32px rgba(252,107,4,0.5)",
              }}>
                TF
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: BRAND.orange, fontSize: 48, fontWeight: 900, fontStyle: "italic", lineHeight: 1 }}>TradeFlow</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>BUILT FOR THE TRADES</div>
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 6vw, 62px)", fontWeight: 900, color: "#fff", margin: "0 0 20px 0", lineHeight: 1.1 }}>
            Stop Chasing Timesheets.<br />
            <span style={{ color: BRAND.orange }}>Start Running Your Business.</span>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 16, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 16px" }}>
            TradeFlow gives trade contractors a dead-simple way to track employee time, manage jobs, and run payroll — all from one app built specifically for the trades.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 40, marginTop: 24 }}>
            {["✅ GPS clock-in", "✅ Job tracking", "✅ Live dashboard", "✅ Mobile app", "✅ Weekly timesheets"].map((item, i) => (
              <span key={i} style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              }}>
                {item}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <button onClick={() => navigate("/get-started")} style={{
              padding: "16px 40px",
              background: BRAND.orange, color: "#fff",
              border: "none", borderRadius: 12,
              fontSize: 17, fontWeight: 900, cursor: "pointer",
              boxShadow: "0 4px 24px rgba(252,107,4,0.5)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              Start For Free →
            </button>
            <button onClick={() => scrollTo("how-it-works")} style={{
              padding: "16px 36px",
              background: "rgba(255,255,255,0.12)", color: "#fff",
              border: "2px solid rgba(255,255,255,0.35)", borderRadius: 12,
              fontSize: 17, fontWeight: 700, cursor: "pointer",
            }}>
              See How It Works
            </button>
          </div>

          {/* Stat strip */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600 }}>
            <span>🚀 Live in under 10 minutes</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
            <span>📱 iOS & Android app included</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
            <span>💳 No credit card required</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRADES STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#f1f5f9", padding: "28px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: BRAND.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
            Trusted by contractors in every trade
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {trades.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                backgroundColor: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 24, padding: "8px 18px",
                fontSize: 14, fontWeight: 600, color: BRAND.textMid,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <span>{t.icon}</span> {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "100px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", backgroundColor: "rgba(11,62,168,0.08)", color: BRAND.blue, padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              Features
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 14px 0" }}>
              Everything your crew needs.<br />Nothing you don't.
            </h2>
            <p style={{ fontSize: 17, color: BRAND.textLight, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              TradeFlow is purpose-built for trade contractors — not some watered-down corporate HR tool.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                backgroundColor: "#fff", borderRadius: 18, padding: "28px 28px 32px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  backgroundColor: "rgba(11,62,168,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 18,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px 0", color: BRAND.textDark }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: BRAND.textLight, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "100px 24px", backgroundColor: BRAND.gray }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ display: "inline-block", backgroundColor: "rgba(11,62,168,0.08)", color: BRAND.blue, padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              How It Works
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 14px 0" }}>
              Up and running in 3 steps
            </h2>
            <p style={{ fontSize: 17, color: BRAND.textLight, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              No IT department required. If you can send a text, you can set up TradeFlow.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute", top: 44, left: "calc(50% + 56px)",
                    width: "calc(100% - 112px)", height: 2,
                    backgroundColor: "#e2e8f0",
                    display: window.innerWidth < 600 ? "none" : "block",
                  }} />
                )}
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  backgroundColor: BRAND.blue,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 36,
                  boxShadow: `0 4px 20px rgba(11,62,168,0.3)`,
                }}>
                  {step.icon}
                </div>
                <div style={{
                  display: "inline-block", backgroundColor: BRAND.orange,
                  color: "#fff", fontSize: 11, fontWeight: 900, padding: "3px 12px",
                  borderRadius: 20, marginBottom: 12, letterSpacing: 1,
                }}>
                  STEP {step.num}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px 0", color: BRAND.textDark }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: BRAND.textLight, lineHeight: 1.7, maxWidth: 280, margin: "0 auto" }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <button onClick={() => navigate("/get-started")} style={{
              padding: "15px 44px",
              background: BRAND.orange, color: "#fff",
              border: "none", borderRadius: 12,
              fontSize: 17, fontWeight: 900, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(252,107,4,0.4)",
            }}>
              Get Started Free →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "100px 24px", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ display: "inline-block", backgroundColor: "rgba(11,62,168,0.08)", color: BRAND.blue, padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              Pricing
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 14px 0" }}>
              Simple, flat pricing.<br />No surprises.
            </h2>
            <p style={{ fontSize: 17, color: BRAND.textLight, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
              One plan. Everything included. Cancel anytime.
            </p>
          </div>

          {/* Pricing Card */}
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{
              backgroundColor: "#fff",
              border: `3px solid ${BRAND.blue}`,
              borderRadius: 24,
              padding: "44px 48px",
              boxShadow: "0 8px 40px rgba(11,62,168,0.12)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Popular badge */}
              <div style={{
                position: "absolute", top: 20, right: -28,
                backgroundColor: BRAND.orange, color: "#fff",
                padding: "5px 48px", fontSize: 12, fontWeight: 900,
                transform: "rotate(35deg)", letterSpacing: 1,
              }}>
                POPULAR
              </div>

              <div style={{ fontSize: 44, marginBottom: 8 }}>⚡</div>
              <h3 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px 0", color: BRAND.textDark }}>TradeFlow Pro</h3>
              <p style={{ fontSize: 15, color: BRAND.textLight, margin: "0 0 28px 0" }}>Everything you need to manage your crew</p>

              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 64, fontWeight: 900, color: BRAND.blue }}>$49</span>
                <span style={{ fontSize: 18, color: BRAND.textLight, fontWeight: 600 }}>/month</span>
              </div>
              <p style={{ fontSize: 15, color: BRAND.textMid, fontWeight: 700, marginBottom: 32 }}>
                Up to 5 employees included · <span style={{ color: BRAND.orange }}>+$5/employee after that</span>
              </p>

              {/* Feature list */}
              <div style={{ textAlign: "left", marginBottom: 36 }}>
                {[
                  "✅ Unlimited job tracking",
                  "✅ GPS clock-in on every punch",
                  "✅ Live admin dashboard",
                  "✅ Mobile app for your crew (iOS + Android)",
                  "✅ Weekly timesheets & payroll reports",
                  "✅ Edit & correct time entries",
                  "✅ Employee invite system",
                  "✅ Your own branded portal URL",
                  "✅ Email support",
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 0",
                    borderBottom: i < 8 ? "1px solid #f1f5f9" : "none",
                    fontSize: 15, fontWeight: 600, color: BRAND.textMid,
                  }}>
                    {item}
                  </div>
                ))}
              </div>

              <button onClick={() => navigate("/get-started")} style={{
                width: "100%", padding: "16px",
                background: BRAND.orange, color: "#fff",
                border: "none", borderRadius: 12,
                fontSize: 18, fontWeight: 900, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(252,107,4,0.4)",
                transition: "transform 0.15s",
              }}
                onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"}
              >
                Start Free Trial →
              </button>

              <p style={{ fontSize: 13, color: BRAND.textLight, marginTop: 14 }}>
                No credit card required · Cancel anytime
              </p>
            </div>

            {/* Pricing example */}
            <div style={{
              backgroundColor: BRAND.gray,
              borderRadius: 16, padding: "20px 28px", marginTop: 24,
              border: "1px solid #e2e8f0",
            }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: BRAND.textDark, marginBottom: 12 }}>💡 Example pricing:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["1–5 employees", "$49/mo"],
                  ["6 employees", "$54/mo"],
                  ["10 employees", "$74/mo"],
                  ["15 employees", "$99/mo"],
                ].map(([label, price]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: BRAND.textMid }}>
                    <span style={{ fontWeight: 600 }}>{label}</span>
                    <span style={{ fontWeight: 800, color: BRAND.blue }}>{price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", backgroundColor: BRAND.gray }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ display: "inline-block", backgroundColor: "rgba(11,62,168,0.08)", color: BRAND.blue, padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>
              Reviews
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 14px 0" }}>
              Contractors love TradeFlow
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                backgroundColor: "#fff", borderRadius: 18, padding: 32,
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #e5e7eb",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <div style={{ fontSize: 20 }}>{"⭐".repeat(t.stars)}</div>
                <p style={{ fontSize: 15, color: BRAND.textMid, lineHeight: 1.75, fontStyle: "italic", flex: 1 }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    backgroundColor: BRAND.blue, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 800, flexShrink: 0,
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: BRAND.textDark }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: BRAND.textLight }}>{t.trade}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "100px 24px",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <TFLogo size={64} />
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#fff", margin: "0 0 16px 0" }}>
            Ready to stop losing hours to paperwork?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 40, lineHeight: 1.7 }}>
            Join hundreds of trade contractors using TradeFlow to track time, manage jobs, and pay their crew faster.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/get-started")} style={{
              padding: "17px 48px",
              background: BRAND.orange, color: "#fff",
              border: "none", borderRadius: 12,
              fontSize: 18, fontWeight: 900, cursor: "pointer",
              boxShadow: "0 4px 28px rgba(252,107,4,0.5)",
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              Create Your Free Account →
            </button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 20 }}>
            No credit card · No contract · Cancel anytime
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "#060c1a", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <TFLogo size={44} />
            <div>
              <div style={{ color: BRAND.orange, fontSize: 22, fontWeight: 900, fontStyle: "italic" }}>TradeFlow</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Built For The Trades</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              ["Features", () => scrollTo("features")],
              ["How It Works", () => scrollTo("how-it-works")],
              ["Pricing", () => scrollTo("pricing")],
              ["Get Started", () => navigate("/get-started")],
              ["Sign In", () => navigate("/signin")],
            ].map(([label, action]) => (
              <button key={label} onClick={action} style={{
                background: "none", border: "none",
                color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 600,
                cursor: "pointer", padding: 0,
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
            © {new Date().getFullYear()} TradeFlow LLC · tradeflowllc.com
            <br />
            <span style={{ fontSize: 11 }}>The timeclock app built for trade contractors.</span>
          </div>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </div>
  );
}

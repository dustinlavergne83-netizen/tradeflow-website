import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BRAND = {
  blue: "#0b3ea8",
  darkBlue: "#092d7e",
  orange: "#fc6b04",
};

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.tradeflowllc.com";
const CLOVER_PUBLIC_KEY = import.meta.env.VITE_CLOVER_PUBLIC_KEY || "";

const TRADE_TYPES = [
  "Electrical", "Plumbing", "HVAC", "Roofing", "Framing / Carpentry",
  "Painting", "Flooring", "Concrete / Masonry", "Landscaping",
  "Windows & Doors", "General Contractor", "Mechanical", "Other",
];

function TFLogo({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size,
      background: BRAND.orange,
      borderRadius: size * 0.18,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.42,
      color: "#fff", fontStyle: "italic", letterSpacing: -1, flexShrink: 0,
    }}>
      TF
    </div>
  );
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

export default function GetStarted() {
  const navigate = useNavigate();

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);   // 1 = account info, 2 = payment, 3 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Account form ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    companyName: "",
    slug: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    tradeType: "",
  });
  const [slugEdited, setSlugEdited] = useState(false);

  // ── Clover payment state ──────────────────────────────────────────────────
  const [sdkReady, setSdkReady] = useState(false);
  const [cloverObj, setCloverObj] = useState(null); // { instance, card }
  const [cardError, setCardError] = useState("");
  const cardMountRef = useRef(null);

  // ── Load Clover SDK when reaching step 2 ─────────────────────────────────
  useEffect(() => {
    if (step !== 2) return;
    if (window.Clover) { setSdkReady(true); return; }

    const existing = document.getElementById("clover-sdk");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "clover-sdk";
    script.src = "https://checkout.clover.com/sdk.js";
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setError("Failed to load payment SDK. Please refresh and try again.");
    document.head.appendChild(script);
  }, [step]);

  // ── Mount Clover card element once SDK is ready ───────────────────────────
  useEffect(() => {
    if (!sdkReady || step !== 2) return;
    if (!CLOVER_PUBLIC_KEY) {
      setError("Payment system not configured. Please contact support.");
      return;
    }

    const tid = setTimeout(() => {
      if (!cardMountRef.current || cloverObj) return;
      try {
        const cloverInstance = new window.Clover(CLOVER_PUBLIC_KEY);
        const elements = cloverInstance.elements();
        const cardElement = elements.create("CARD", {
          styles: {
            body: {
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "15px",
              color: "#111827",
            },
          },
        });
        cardElement.mount("#clover-card-element");
        setCloverObj({ instance: cloverInstance, card: cardElement });
      } catch (e) {
        console.error("Clover init error:", e);
        setError("Failed to initialize payment form. Please refresh and try again.");
      }
    }, 150);

    return () => clearTimeout(tid);
  }, [sdkReady, step]);

  // ── Form helpers ──────────────────────────────────────────────────────────
  function handleCompanyNameChange(e) {
    const name = e.target.value;
    const newSlug = slugEdited ? form.slug : slugify(name);
    setForm(f => ({ ...f, companyName: name, slug: newSlug }));
  }

  function handleSlugChange(e) {
    setSlugEdited(true);
    setForm(f => ({ ...f, slug: slugify(e.target.value) }));
  }

  function set(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  // ── Step 1 → Step 2: validate account info ────────────────────────────────
  async function handleContinueToPayment(e) {
    e.preventDefault();
    setError("");

    if (!form.companyName.trim()) { setError("Company name is required."); return; }
    if (!form.slug.trim() || form.slug.length < 3) { setError("Portal URL must be at least 3 characters."); return; }
    if (!form.firstName.trim()) { setError("First name is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (!form.tradeType) { setError("Please select your trade type."); return; }

    // Check slug availability early
    setLoading(true);
    try {
      const { data: existingCo } = await supabase
        .from("companies")
        .select("id")
        .eq("slug", form.slug)
        .maybeSingle();

      if (existingCo) {
        setError("That portal URL is already taken. Please choose a different one.");
        return;
      }
      // Check email not already in use
      setStep(2);
    } catch (err) {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: tokenize card → edge function → create account ────────────────
  async function handleStartTrial(e) {
    e.preventDefault();
    setError("");
    setCardError("");

    if (!cloverObj) {
      setError("Payment form not ready. Please wait a moment and try again.");
      return;
    }

    setLoading(true);
    try {
      // 1. Tokenize card via Clover SDK.
      // isMultipayToken: true is required — without it, Clover issues a
      // single-use token that /v1/customers (card-on-file for later
      // recurring billing) rejects with a generic "Please provide a valid
      // source or token" error. Confirmed via Clover's own developer
      // community: https://community.clover.com/questions/34645
      const result = await cloverObj.instance.createToken({ isMultipayToken: true });

      if (result.errors && Object.keys(result.errors).length > 0) {
        const msgs = Object.values(result.errors).join(" · ");
        setCardError(msgs);
        setLoading(false);
        return;
      }

      // Extract token — Clover SDK returns token in different shapes
      const cardToken =
        result?.token?.token_value ||
        result?.token?.id ||
        result?.token;

      if (!cardToken) {
        setError("Card tokenization failed. Please check your card details and try again.");
        setLoading(false);
        return;
      }

      // 2. Call Supabase Edge Function — creates account + stores card in Clover
      const { data, error: fnError } = await supabase.functions.invoke(
        "save-card-for-trial",
        {
          body: {
            cardToken,
            companyName: form.companyName.trim(),
            slug: form.slug,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.toLowerCase().trim(),
            password: form.password,
            phone: form.phone.trim() || null,
            tradeType: form.tradeType,
          },
        }
      );

      if (fnError) {
        // supabase-js's FunctionsHttpError always carries the generic
        // message "Edge Function returned a non-2xx status code" — the
        // actual { success:false, error:"..." } body the function sent
        // back only lives on fnError.context (a Response object), and
        // must be parsed out explicitly or the real reason is hidden.
        let detail = "";
        try {
          const body = await fnError.context?.json?.();
          detail = body?.error || "";
        } catch (_) { /* context wasn't JSON — fall through to generic */ }
        throw new Error(detail || fnError.message || "Account creation failed.");
      }
      if (!data?.success) throw new Error(data?.error || "Account creation failed.");

      // 3. Sign in automatically so they have a session
      await supabase.auth.signInWithPassword({
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      // 4. Show success — send them straight to the app's own login page
      // (not this marketing site's /signin) so the "Account created!"
      // welcome banner (Login.tsx's ?welcome=1 handling) actually fires.
      // The Supabase session created above lives on this site's origin and
      // does not carry over to app.tradeflowllc.com, so they still sign in
      // once more there — same as any returning user.
      setStep(3);
      setTimeout(() => {
        window.location.href = `${APP_URL}/login?welcome=1`;
      }, 4000);

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Shared styles
  // ─────────────────────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #d1d5db", borderRadius: 10,
    fontSize: 15, color: "#111", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    WebkitAppearance: "none",
  };
  const labelStyle = {
    display: "block", fontSize: 13, fontWeight: 700,
    color: "#374151", marginBottom: 6,
  };

  // ── STEP 3: Success ───────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          backgroundColor: "#fff", borderRadius: 24,
          padding: "52px 40px", maxWidth: 520, width: "100%",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111", margin: "0 0 12px 0" }}>
            You're in! Free trial started.
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7, margin: "0 0 24px 0" }}>
            Your 14-day free trial is active. Taking you to your dashboard now…
          </p>

          <div style={{
            backgroundColor: "#f0fdf4", border: "2px solid #86efac",
            borderRadius: 14, padding: "18px 20px", marginBottom: 20,
          }}>
            <p style={{ fontSize: 13, color: "#166534", fontWeight: 700, margin: "0 0 4px 0" }}>
              ✅ Account created &amp; card saved
            </p>
            <p style={{ fontSize: 13, color: "#15803d", margin: 0 }}>
              Signed up as <strong>{form.email}</strong>
            </p>
          </div>

          <div style={{
            backgroundColor: "#fff7ed", border: "1px solid #fed7aa",
            borderRadius: 12, padding: "14px 18px", marginBottom: 24,
          }}>
            <p style={{ fontSize: 13, color: "#92400e", fontWeight: 700, margin: "0 0 4px 0" }}>
              💳 Billing info
            </p>
            <p style={{ fontSize: 13, color: "#b45309", margin: 0, lineHeight: 1.6 }}>
              No charge today. Your card will be billed <strong>$49/mo</strong> (+ $5/employee after 5) when your 14-day trial ends.
            </p>
          </div>

          <a
            href={`${APP_URL}/login?welcome=1`}
            style={{
              display: "block", padding: "15px",
              background: BRAND.orange, color: "#fff",
              borderRadius: 12, fontSize: 16, fontWeight: 900,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(252,107,4,0.4)",
            }}
          >
            Sign In to Your Dashboard →
          </a>
        </div>
      </div>
    );
  }

  // ── STEP 2: Payment ───────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
        display: "flex", flexDirection: "column",
      }}>
        {/* Nav */}
        <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <TFLogo size={34} />
            <span style={{ color: BRAND.orange, fontSize: 18, fontWeight: 900, fontStyle: "italic" }}>TradeFlow</span>
          </div>
          <button
            onClick={() => { setStep(1); setError(""); setCloverObj(null); setSdkReady(false); }}
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              padding: "8px 20px", borderRadius: 8,
            }}
          >
            ← Back
          </button>
        </nav>

        {/* Progress steps */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 24px 24px", gap: 0 }}>
          <StepIndicator num={1} label="Your Info" active={false} done />
          <StepConnector done />
          <StepIndicator num={2} label="Payment" active done={false} />
        </div>

        {/* Card */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 24px 48px" }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: 24,
            padding: "36px 32px", maxWidth: 520, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💳</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: "0 0 8px 0" }}>
                Start Your Free Trial
              </h1>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                Enter your card to get started. <strong>No charge for 14 days.</strong>
              </p>
            </div>

            {/* Trial info banner */}
            <div style={{
              background: "#f0fdf4", border: "1.5px solid #86efac",
              borderRadius: 12, padding: "14px 16px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#374151", fontWeight: 600 }}>🆓 14-day free trial</span>
                  <span style={{ color: "#166534", fontWeight: 800 }}>$0.00 today</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#374151", fontWeight: 600 }}>📅 After trial ends</span>
                  <span style={{ color: "#374151", fontWeight: 700 }}>$49/mo</span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", paddingTop: 4, borderTop: "1px solid #d1fae5" }}>
                  Up to 5 employees included · +$5/employee after that · Cancel anytime
                </div>
              </div>
            </div>

            <form onSubmit={handleStartTrial} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Clover embedded card form */}
              <div>
                <label style={labelStyle}>Card Information</label>
                <div
                  id="clover-card-element"
                  ref={cardMountRef}
                  style={{
                    border: "1.5px solid #d1d5db",
                    borderRadius: 10,
                    padding: "4px 2px",
                    minHeight: 52,
                    backgroundColor: "#fff",
                  }}
                />
                {!sdkReady && (
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: "6px 0 0", textAlign: "center" }}>
                    ⏳ Loading secure payment form…
                  </p>
                )}
                {cardError && (
                  <p style={{ fontSize: 13, color: "#dc2626", margin: "6px 0 0", fontWeight: 600 }}>
                    ⚠️ {cardError}
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 16, flexWrap: "wrap",
                fontSize: 12, color: "#9ca3af", fontWeight: 600,
              }}>
                <span>🔒 256-bit SSL</span>
                <span>🛡️ PCI Compliant</span>
                <span>💳 Clover Secure Payments</span>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: "12px 16px",
                  backgroundColor: "#fee2e2", border: "1px solid #fca5a5",
                  borderRadius: 10, color: "#dc2626", fontSize: 14, fontWeight: 600,
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !sdkReady}
                style={{
                  padding: "16px",
                  background: loading || !sdkReady ? "#9ca3af" : BRAND.orange,
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 17, fontWeight: 900,
                  cursor: loading || !sdkReady ? "default" : "pointer",
                  boxShadow: loading || !sdkReady ? "none" : "0 4px 20px rgba(252,107,4,0.4)",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "⏳ Creating your account..." : "🚀 Start Free Trial — No Charge Today"}
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0 }}>
                By starting your trial you agree to be billed $49/mo after 14 days unless you cancel.
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 1: Account Info ──────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
      display: "flex", flexDirection: "column",
    }}>
      {/* Nav */}
      <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <TFLogo size={34} />
          <span style={{ color: BRAND.orange, fontSize: 18, fontWeight: 900, fontStyle: "italic" }}>TradeFlow</span>
        </div>
        <button onClick={() => navigate("/signin")} style={{
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          padding: "8px 20px", borderRadius: 8,
        }}>
          Sign In
        </button>
      </nav>

      {/* Progress steps */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 24px 24px", gap: 0 }}>
        <StepIndicator num={1} label="Your Info" active done={false} />
        <StepConnector done={false} />
        <StepIndicator num={2} label="Payment" active={false} done={false} />
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "0 24px 48px" }}>
        <div style={{
          backgroundColor: "#fff", borderRadius: 24,
          padding: "36px 32px", maxWidth: 560, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111", margin: "0 0 8px 0" }}>
              Create Your TradeFlow Account
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>
              Get your crew on the clock in minutes. 14-day free trial.
            </p>
          </div>

          <form onSubmit={handleContinueToPayment} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Company Name */}
            <div>
              <label style={labelStyle}>Company Name *</label>
              <input
                type="text"
                value={form.companyName}
                onChange={handleCompanyNameChange}
                placeholder="Smith Plumbing LLC"
                required
                autoComplete="organization"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Portal URL */}
            <div>
              <label style={labelStyle}>Your Portal URL *</label>
              <div style={{
                display: "flex", alignItems: "center",
                border: "1.5px solid #d1d5db", borderRadius: 10, overflow: "hidden",
              }}>
                <span style={{
                  padding: "12px 10px 12px 14px",
                  backgroundColor: "#f3f4f6", color: "#6b7280",
                  fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                  borderRight: "1px solid #d1d5db", flexShrink: 0,
                }}>
                  app.tradeflowllc.com/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="smith-plumbing"
                  required
                  style={{
                    flex: 1, padding: "12px 14px", border: "none",
                    fontSize: 15, color: BRAND.blue, fontWeight: 700, outline: "none",
                    minWidth: 0,
                  }}
                />
              </div>
              {form.slug && (
                <p style={{ fontSize: 12, color: "#6b7280", margin: "5px 0 0 2px" }}>
                  Your crew signs in at:{" "}
                  <strong style={{ color: BRAND.blue }}>app.tradeflowllc.com/{form.slug}</strong>
                </p>
              )}
            </div>

            {/* Owner Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text" value={form.firstName} onChange={set("firstName")}
                  placeholder="John" required autoComplete="given-name"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = BRAND.blue}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text" value={form.lastName} onChange={set("lastName")}
                  placeholder="Smith" autoComplete="family-name"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = BRAND.blue}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Work Email *</label>
              <input
                type="email" value={form.email} onChange={set("email")}
                placeholder="john@smithplumbing.com" required autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password *</label>
              <input
                type="password" value={form.password} onChange={set("password")}
                placeholder="At least 8 characters" required autoComplete="new-password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input
                type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
                placeholder="Re-enter your password" required autoComplete="new-password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel" value={form.phone} onChange={set("phone")}
                placeholder="(555) 555-5555" autoComplete="tel"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Trade Type */}
            <div>
              <label style={labelStyle}>Trade Type *</label>
              <select
                value={form.tradeType} onChange={set("tradeType")}
                required
                style={{ ...inputStyle, backgroundColor: "#fff" }}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              >
                <option value="">Select your trade...</option>
                {TRADE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "12px 16px",
                backgroundColor: "#fee2e2", border: "1px solid #fca5a5",
                borderRadius: 10, color: "#dc2626", fontSize: 14, fontWeight: 600,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "16px",
                background: loading ? "#9ca3af" : BRAND.orange,
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 17, fontWeight: 900,
                cursor: loading ? "default" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(252,107,4,0.4)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳ Checking..." : "Continue to Payment →"}
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0 }}>
              No charge for 14 days · Cancel anytime
            </p>
          </form>

          <div style={{ borderTop: "1px solid #f3f4f6", marginTop: 20, paddingTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Already have an account?{" "}
              <button onClick={() => navigate("/signin")} style={{
                background: "none", border: "none",
                color: BRAND.blue, fontWeight: 700, cursor: "pointer", fontSize: 14,
              }}>
                Sign In →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step indicator components ─────────────────────────────────────────────────
function StepIndicator({ num, label, active, done }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        backgroundColor: done ? "#16a34a" : active ? BRAND.orange : "rgba(255,255,255,0.25)",
        border: `2px solid ${done ? "#16a34a" : active ? BRAND.orange : "rgba(255,255,255,0.4)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 900, color: "#fff",
      }}>
        {done ? "✓" : num}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
    </div>
  );
}

function StepConnector({ done }) {
  return (
    <div style={{
      width: 60, height: 2, alignSelf: "flex-start", marginTop: 15,
      backgroundColor: done ? "#16a34a" : "rgba(255,255,255,0.25)",
    }} />
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BRAND = {
  blue: "#0b3ea8",
  darkBlue: "#092d7e",
  orange: "#fc6b04",
};

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.tradeflowllc.com";

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

  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    slug: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    tradeType: "",
  });

  const [slugEdited, setSlugEdited] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.companyName.trim()) { setError("Company name is required."); return; }
    if (!form.slug.trim() || form.slug.length < 3) { setError("Portal URL must be at least 3 characters."); return; }
    if (!form.firstName.trim()) { setError("First name is required."); return; }
    if (!form.email.trim()) { setError("Email is required."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!form.tradeType) { setError("Please select your trade type."); return; }

    setLoading(true);
    try {
      // 1. Check if slug is taken
      const { data: existingCo } = await supabase
        .from("companies")
        .select("id")
        .eq("slug", form.slug)
        .maybeSingle();

      if (existingCo) {
        setError("That portal URL is already taken. Please choose a different one.");
        setLoading(false);
        return;
      }

      // 2. Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.toLowerCase().trim(),
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
          }
        }
      });

      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to create account. Please try again.");

      // 3. Create company record (starts 14-day trial)
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const { data: company, error: coError } = await supabase
        .from("companies")
        .insert({
          name: form.companyName.trim(),
          slug: form.slug,
          primary_color: BRAND.orange,
          subscription_status: "trial",
          subscription_tier: "basic",
          trial_ends_at: trialEndsAt,
        })
        .select()
        .single();

      if (coError) throw coError;

      // 4. Create employee record (admin role)
      const { error: empError } = await supabase
        .from("employees")
        .insert({
          user_id: userId,
          company_id: company.id,
          email: form.email.toLowerCase().trim(),
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim() || null,
          role: "admin",
          is_active: true,
        });

      if (empError) throw empError;

      // 5. Embed company_id into the user's JWT metadata for RLS policies
      await supabase.auth.updateUser({
        data: { company_id: company.id },
      });

      // Success!
      setCreatedSlug(form.slug);
      setStep(2);

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #d1d5db", borderRadius: 10,
    fontSize: 15, color: "#111", outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block", fontSize: 13, fontWeight: 700,
    color: "#374151", marginBottom: 6,
  };

  // ── Step 2: Success ──────────────────────────────────────────────────────
  if (step === 2) {
    const portalUrl = `${APP_URL}/${createdSlug}`;
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ backgroundColor: "#fff", borderRadius: 24, padding: "52px 44px", maxWidth: 520, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111", margin: "0 0 12px 0" }}>
            You're all set!
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7, margin: "0 0 28px 0" }}>
            Your TradeFlow portal is ready. Share this link with your crew so they know where to sign in.
          </p>

          <div style={{
            backgroundColor: "#f0f9ff", border: "2px solid #bae6fd",
            borderRadius: 14, padding: "18px 20px", marginBottom: 28,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 6px 0" }}>Your Portal URL</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: BRAND.blue, margin: 0, wordBreak: "break-all" }}>
              {portalUrl}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <a
              href={portalUrl}
              style={{
                display: "block", padding: "15px",
                background: BRAND.orange, color: "#fff",
                borderRadius: 12, fontSize: 16, fontWeight: 900,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(252,107,4,0.4)",
              }}
            >
              Go to My Portal →
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(portalUrl);
                alert("Portal URL copied to clipboard!");
              }}
              style={{
                padding: "13px", background: "#f8fafc",
                border: "1.5px solid #e2e8f0", borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#374151",
              }}
            >
              📋 Copy Portal URL
            </button>
          </div>

          <div style={{
            marginTop: 28, padding: "16px 20px",
            backgroundColor: "#fff7ed", borderRadius: 12,
            border: "1px solid #fed7aa",
          }}>
            <p style={{ fontSize: 13, color: "#92400e", fontWeight: 700, margin: "0 0 4px 0" }}>📧 Check your email</p>
            <p style={{ fontSize: 13, color: "#b45309", margin: 0, lineHeight: 1.6 }}>
              We sent a confirmation to <strong>{form.email}</strong>. Confirm your email to fully activate your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 1: Signup Form ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`, display: "flex", flexDirection: "column" }}>

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

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 48px" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: 24, padding: "40px 40px", maxWidth: 560, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "0 0 8px 0" }}>
              Create Your TradeFlow Account
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>
              Get your crew on the clock in minutes. No credit card needed.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Company Name */}
            <div>
              <label style={labelStyle}>Company Name *</label>
              <input
                type="text"
                value={form.companyName}
                onChange={handleCompanyNameChange}
                placeholder="Smith Plumbing LLC"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {/* Portal URL */}
            <div>
              <label style={labelStyle}>Your Portal URL *</label>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #d1d5db", borderRadius: 10, overflow: "hidden", backgroundColor: "#fff" }}>
                <span style={{ padding: "12px 12px 12px 14px", backgroundColor: "#f3f4f6", color: "#6b7280", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", borderRight: "1px solid #d1d5db" }}>
                  app.tradeflowllc.com/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="smith-plumbing"
                  required
                  style={{ flex: 1, padding: "12px 14px", border: "none", fontSize: 15, color: BRAND.blue, fontWeight: 700, outline: "none" }}
                />
              </div>
              {form.slug && (
                <p style={{ fontSize: 12, color: "#6b7280", margin: "5px 0 0 2px" }}>
                  Your crew will sign in at: <strong style={{ color: BRAND.blue }}>app.tradeflowllc.com/{form.slug}</strong>
                </p>
              )}
            </div>

            {/* Owner Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="John" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = BRAND.blue}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="Smith" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = BRAND.blue}
                  onBlur={e => e.target.style.borderColor = "#d1d5db"} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Work Email *</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="john@smithplumbing.com" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="At least 8 characters" required style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="(555) 555-5555" style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"} />
            </div>

            {/* Trade Type */}
            <div>
              <label style={labelStyle}>Trade Type *</label>
              <select value={form.tradeType} onChange={set("tradeType")} required style={{ ...inputStyle, backgroundColor: "#fff" }}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}>
                <option value="">Select your trade...</option>
                {TRADE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "12px 16px", backgroundColor: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, color: "#dc2626", fontSize: 14, fontWeight: 600 }}>
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
                fontSize: 17, fontWeight: 900, cursor: loading ? "default" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(252,107,4,0.4)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳ Creating your account..." : "Create My Account →"}
            </button>

            <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", margin: 0 }}>
              No credit card required · Cancel anytime
            </p>
          </form>

          <div style={{ borderTop: "1px solid #f3f4f6", marginTop: 24, paddingTop: 20, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              Already have an account?{" "}
              <button onClick={() => navigate("/signin")} style={{ background: "none", border: "none", color: BRAND.blue, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                Sign In →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

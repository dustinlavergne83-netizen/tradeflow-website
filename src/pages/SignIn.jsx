import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BRAND = {
  blue: "#0b3ea8",
  darkBlue: "#092d7e",
  orange: "#fc6b04",
};

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.tradeflowllc.com";

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

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authError) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Look up their employee record to find their company slug
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication failed.");

      const { data: emp } = await supabase
        .from("employees")
        .select("company_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!emp?.company_id) {
        // No company — redirect to app root
        window.location.href = APP_URL;
        return;
      }

      // Get company slug
      const { data: company } = await supabase
        .from("companies")
        .select("slug")
        .eq("id", emp.company_id)
        .maybeSingle();

      if (company?.slug) {
        // Admin/supervisor → go to dashboard; employee → go to clock
        if (emp.role === "admin" || emp.role === "supervisor") {
          window.location.href = `${APP_URL}/${company.slug}/dashboard`;
        } else {
          window.location.href = `${APP_URL}/${company.slug}/clock`;
        }
      } else {
        window.location.href = APP_URL;
      }

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "13px 14px",
    border: "1.5px solid #d1d5db", borderRadius: 10,
    fontSize: 15, color: "#111", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };

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
        <button onClick={() => navigate("/get-started")} style={{
          background: BRAND.orange, border: "none",
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          padding: "8px 20px", borderRadius: 8,
        }}>
          Get Started Free
        </button>
      </nav>

      {/* Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          backgroundColor: "#fff", borderRadius: 24,
          padding: "44px 40px", maxWidth: 440, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <TFLogo size={52} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#111", margin: "0 0 8px 0" }}>
              Sign in to TradeFlow
            </h1>
            <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>
              You'll be redirected to your company portal
            </p>
          </div>

          <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@smithplumbing.com"
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = BRAND.blue}
                onBlur={e => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            {error && (
              <div style={{
                padding: "12px 16px",
                backgroundColor: "#fee2e2", border: "1px solid #fca5a5",
                borderRadius: 10, color: "#dc2626", fontSize: 14, fontWeight: 600,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "15px",
                background: loading ? "#9ca3af" : BRAND.blue,
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 900,
                cursor: loading ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳ Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{
            borderTop: "1px solid #f3f4f6",
            marginTop: 24, paddingTop: 20,
            textAlign: "center",
          }}>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
              Don't have an account?{" "}
              <button onClick={() => navigate("/get-started")} style={{
                background: "none", border: "none",
                color: BRAND.orange, fontWeight: 700,
                cursor: "pointer", fontSize: 14,
              }}>
                Get Started Free →
              </button>
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#d1d5db", marginTop: 20 }}>
            Powered by <strong style={{ color: BRAND.orange }}>TradeFlow</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

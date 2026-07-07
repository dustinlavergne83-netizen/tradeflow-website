import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BRAND = {
  blue: "#0b3ea8",
  darkBlue: "#092d7e",
  orange: "#fc6b04",
};

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

export default function CancelSubscription() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);  // 1 = sign in, 2 = confirm, 3 = done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null); // { name, slug, status, trial_ends_at }
  const [confirmed, setConfirmed] = useState(false);

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #d1d5db", borderRadius: 10,
    fontSize: 15, color: "#111", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    WebkitAppearance: "none",
  };

  // ── Step 1: Authenticate + fetch subscription info ────────────────────────
  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign in
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      if (authError) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      // Get employee → company
      const { data: { user } } = await supabase.auth.getUser();
      const { data: emp } = await supabase
        .from("employees")
        .select("company_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!emp?.company_id) {
        setError("No company found for this account.");
        return;
      }

      if (emp.role !== "admin") {
        setError("Only the account admin can cancel the subscription.");
        return;
      }

      const { data: company } = await supabase
        .from("companies")
        .select("id, name, slug, subscription_status, trial_ends_at, card_brand, card_last4")
        .eq("id", emp.company_id)
        .maybeSingle();

      if (!company) {
        setError("Could not find your company details.");
        return;
      }

      if (company.subscription_status === "canceled") {
        setError("This subscription is already canceled.");
        return;
      }

      setCompanyInfo(company);
      setStep(2);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Confirm cancellation ──────────────────────────────────────────
  async function handleCancel(e) {
    e.preventDefault();
    if (!confirmed) {
      setError("Please check the box to confirm you want to cancel.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "cancel-subscription",
        { body: { companyId: companyInfo.id } }
      );

      if (fnError) throw new Error(fnError.message);
      if (!data?.success) throw new Error(data?.error || "Cancellation failed.");

      await supabase.auth.signOut();
      setStep(3);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 3: Canceled confirmation ─────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          backgroundColor: "#fff", borderRadius: 24,
          padding: "52px 40px", maxWidth: 500, width: "100%",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "0 0 12px 0" }}>
            Subscription Canceled
          </h1>
          <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, margin: "0 0 28px 0" }}>
            Your TradeFlow subscription has been canceled. You won't be charged again.
            Your account will remain accessible until the current period ends.
          </p>
          <div style={{
            backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
            borderRadius: 12, padding: "16px 20px", marginBottom: 28,
            fontSize: 14, color: "#6b7280", lineHeight: 1.6,
          }}>
            If you change your mind, you can always sign up again at{" "}
            <a href="/get-started" style={{ color: BRAND.blue, fontWeight: 700 }}>
              tradeflowllc.com/get-started
            </a>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "13px 32px",
              background: BRAND.blue, color: "#fff",
              border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 800, cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: Confirm cancellation ──────────────────────────────────────────
  if (step === 2 && companyInfo) {
    const isTrial = companyInfo.subscription_status === "trial";
    const trialDate = companyInfo.trial_ends_at
      ? new Date(companyInfo.trial_ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : null;

    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
        display: "flex", flexDirection: "column",
      }}>
        <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
            <TFLogo size={34} />
            <span style={{ color: BRAND.orange, fontSize: 18, fontWeight: 900, fontStyle: "italic" }}>TradeFlow</span>
          </div>
        </nav>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 48px" }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: 24,
            padding: "40px 36px", maxWidth: 520, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>⚠️</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: "0 0 8px 0" }}>
                Cancel Your Subscription?
              </h1>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                You're about to cancel <strong>{companyInfo.name}</strong>
              </p>
            </div>

            {/* Current plan info */}
            <div style={{
              background: "#f8fafc", border: "1.5px solid #e5e7eb",
              borderRadius: 12, padding: "16px 20px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>Status</span>
                  <span style={{
                    fontWeight: 800,
                    color: isTrial ? "#b45309" : "#166534",
                    background: isTrial ? "#fff7ed" : "#f0fdf4",
                    padding: "2px 10px", borderRadius: 20, fontSize: 12,
                  }}>
                    {isTrial ? "Free Trial" : "Active"}
                  </span>
                </div>
                {isTrial && trialDate && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>Trial ends</span>
                    <span style={{ fontWeight: 700, color: "#111" }}>{trialDate}</span>
                  </div>
                )}
                {companyInfo.card_last4 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>Card on file</span>
                    <span style={{ fontWeight: 700, color: "#111" }}>
                      {companyInfo.card_brand} ···· {companyInfo.card_last4}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#6b7280", fontWeight: 600 }}>After cancellation</span>
                  <span style={{ fontWeight: 700, color: "#dc2626" }}>No future charges</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCancel} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Confirmation checkbox */}
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                cursor: "pointer", padding: "14px 16px",
                border: `2px solid ${confirmed ? "#dc2626" : "#e5e7eb"}`,
                borderRadius: 12, background: confirmed ? "#fff5f5" : "#fff",
                transition: "all 0.15s",
              }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  style={{ marginTop: 2, width: 16, height: 16, accentColor: "#dc2626", flexShrink: 0 }}
                />
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                  I understand that canceling will stop my subscription and I won't be billed again.
                  My access will continue until the current period ends.
                </span>
              </label>

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
                disabled={loading || !confirmed}
                style={{
                  padding: "14px",
                  background: loading || !confirmed ? "#9ca3af" : "#dc2626",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 16, fontWeight: 900,
                  cursor: loading || !confirmed ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "⏳ Canceling..." : "Cancel My Subscription"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  padding: "13px",
                  background: "#fff", color: BRAND.blue,
                  border: `2px solid ${BRAND.blue}`, borderRadius: 12,
                  fontSize: 15, fontWeight: 800, cursor: "pointer",
                }}
              >
                Never mind — Keep My Subscription
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 1: Sign in to verify ─────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 100%)`,
      display: "flex", flexDirection: "column",
    }}>
      <nav style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <TFLogo size={34} />
          <span style={{ color: BRAND.orange, fontSize: 18, fontWeight: 900, fontStyle: "italic" }}>TradeFlow</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{
          backgroundColor: "#fff", borderRadius: 24,
          padding: "44px 36px", maxWidth: 440, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🔐</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: "0 0 8px 0" }}>
              Cancel Subscription
            </h1>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Sign in as the account admin to cancel your TradeFlow subscription.
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@smithplumbing.com"
                required autoComplete="email"
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
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required autoComplete="current-password"
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
                padding: "14px",
                background: loading ? "#9ca3af" : BRAND.blue,
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 900,
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "⏳ Verifying..." : "Continue →"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "13px", background: "none",
                color: "#6b7280", border: "1.5px solid #e5e7eb",
                borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              Cancel — Go Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

const BRAND = {
  blue: "#0b3ea8",
  orange: "#fc6b04",
  textDark: "#111827",
  textMid: "#374151",
};

/**
 * Shared layout for static legal/support pages (Privacy, Terms, Data
 * Deletion). Keeps the header/back-link/typography consistent without
 * depending on the full marketing Landing page.
 */
export default function LegalPage({ title, updated, children }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: BRAND.blue,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
            marginBottom: 32,
          }}
        >
          ← Back to TradeFlow
        </button>

        <h1 style={{ color: BRAND.blue, fontSize: 32, fontWeight: 900, marginBottom: 4 }}>
          {title}
        </h1>
        {updated && (
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 32 }}>
            Last updated: {updated}
          </p>
        )}

        <div style={{ color: BRAND.textMid, fontSize: 15, lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function H2({ children }) {
  return (
    <h2 style={{ color: BRAND.orange, fontSize: 19, fontWeight: 800, marginTop: 32, marginBottom: 10 }}>
      {children}
    </h2>
  );
}

export function P({ children }) {
  return <p style={{ color: "#374151", marginBottom: 14 }}>{children}</p>;
}

export function Ul({ children }) {
  return <ul style={{ color: "#374151", marginBottom: 14, paddingLeft: 22 }}>{children}</ul>;
}

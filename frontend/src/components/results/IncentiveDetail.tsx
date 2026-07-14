import { IncentiveResult, FCIResult } from "@/lib/types";
import { AlertCircle, Calculator, Check, Info } from "lucide-react";

export default function IncentiveDetail({ incentive, fciResult }: { incentive: IncentiveResult, fciResult: FCIResult }) {
  const formatCr = (val: number) => `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>{incentive.name}</h2>
            {incentive.eligible ? (
              <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>✓ Eligible</span>
            ) : (
              <span className="badge" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>✗ Not Eligible</span>
            )}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Policy Reference: <strong>{incentive.policy_section}</strong>
          </div>
        </div>
        
        {incentive.eligible && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 4 }}>Total Amount</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-primary)", lineHeight: 1 }}>
              {incentive.amount > 0 ? formatCr(incentive.amount) : "Qualitative"}
            </div>
            {incentive.duration_years && incentive.annual_amount && (
              <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginTop: 8 }}>
                {formatCr(incentive.annual_amount)} / yr for {incentive.duration_years} yrs
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        padding: 16, 
        background: incentive.eligible ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
        color: incentive.eligible ? "#10b981" : "#ef4444",
        border: incentive.eligible ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: "var(--radius-md)", 
        marginBottom: 32, 
        fontSize: "0.95rem", 
        lineHeight: 1.6 
      }}>
        {incentive.reason}
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Calculator size={18} /> Calculation Breakdown
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {incentive.calculation_steps.length > 0 ? (
            incentive.calculation_steps.map((step, idx) => {
              let formattedStep = step;
              // Highlight labels before colons
              formattedStep = formattedStep.replace(/^([^:]+):/g, '<strong style="color: var(--text-primary); font-weight: 600;">$1:</strong>');
              // Highlight currency values in primary accent (blue)
              formattedStep = formattedStep.replace(/(₹[0-9.,]+(?: Cr| Lakhs| \/ yr| \/ month)?)/g, '<strong style="color: var(--accent-primary);">$1</strong>');
              // Highlight percentages in purple
              formattedStep = formattedStep.replace(/([0-9.,]+%)/g, '<strong style="color: #8b5cf6;">$1</strong>');
              // Highlight capping and limits in amber/orange
              formattedStep = formattedStep.replace(/(Cap Applied|Maximum allowed|capped at|exceeds limit|limit of)/gi, '<strong style="color: #d97706;">$1</strong>');
              // Mute mathematical operators
              formattedStep = formattedStep.replace(/ (\+|x|=|\-) /g, ' <span style="color: var(--text-tertiary); font-weight: bold;">$1</span> ');

              return (
                <div key={idx} style={{ display: "flex", gap: 16, background: "var(--bg-secondary)", padding: "14px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-secondary)", boxShadow: "var(--shadow-sm)", alignItems: "center" }}>
                  <div style={{ background: "var(--bg-accent)", color: "var(--accent-primary)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: formattedStep }} />
                </div>
              );
            })
          ) : (
            <div style={{ color: "var(--text-tertiary)", fontStyle: "italic", padding: 24, background: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>No calculation steps available.</div>
          )}
        </div>
      </div>

      {incentive.cap_applied && (
        <div style={{ display: "flex", gap: 12, padding: "16px", background: "rgba(217, 119, 6, 0.1)", color: "#d97706", borderRadius: "var(--radius-md)", marginBottom: 24 }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "0.9rem" }}>
            <strong>Policy Cap Applied:</strong> The calculated value exceeded the maximum limit defined in the policy and was capped. See calculation steps for details.
          </span>
        </div>
      )}

      {incentive.disclaimers.length > 0 && (
        <div>
          <h3 style={{ fontSize: "1.05rem", display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "var(--text-secondary)" }}>
            <Info size={16} /> Important Notes
          </h3>
          <ul style={{ paddingLeft: 24, fontSize: "0.85rem", color: "var(--text-tertiary)", display: "flex", flexDirection: "column", gap: 8 }}>
            {incentive.disclaimers.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

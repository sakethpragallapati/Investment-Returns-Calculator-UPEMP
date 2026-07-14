"use client";

import { CalculateRequest, CalculateResponse } from "@/lib/types";
import { TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react";

export default function FCIBreakdownView({ 
  fciResult, 
  requestData 
}: { 
  fciResult: CalculateResponse["fci_result"];
  requestData: CalculateRequest | null;
}) {
  const formatCr = (val: number) => `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;

  return (
    <div className="animate-fade-in-up">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <TrendingUp size={28} style={{ color: "var(--accent-primary)" }} />
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>Fixed Capital Investment Calculation Ledger</h2>
      </div>

      <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 32 }}>
        The Fixed Capital Investment is the foundational base upon which all state subsidies are calculated. Strict caps are applied to ensure subsidies target actual manufacturing machinery rather than inflated real estate costs.
      </p>

      {/* Math Formula Card */}
      <div style={{ 
        background: "var(--bg-secondary)", 
        padding: "24px 32px", 
        borderRadius: "var(--radius-lg)", 
        borderLeft: "4px solid var(--accent-primary)",
        marginBottom: 32
      }}>
        <div style={{ fontSize: "0.85rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 12, letterSpacing: "1px" }}>
          Engine Formula Applied
        </div>
        <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "1.4rem", color: "var(--text-primary)", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 16 }}>
          Fixed Capital Investment = M<sub>New</sub> + M<sub>Refurb</sub> + min( B, 0.10 × Final_Fixed_Capital_Investment )
        </div>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "0.9rem", color: "var(--text-secondary)", borderTop: "1px dashed var(--border-secondary)", paddingTop: 16 }}>
          <span><strong style={{ color: "var(--text-primary)" }}>M<sub>New</sub></strong> = New Machinery</span>
          <span><strong style={{ color: "var(--text-primary)" }}>M<sub>Refurb</sub></strong> = Refurbished Machinery (Max 40% of New)</span>
          <span><strong style={{ color: "var(--text-primary)" }}>B</strong> = Building Cost</span>
        </div>
      </div>

      {/* Input vs Output Table */}
      <div style={{ border: "1px solid var(--border-secondary)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        
        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "var(--bg-secondary)", padding: "16px 24px", borderBottom: "1px solid var(--border-secondary)", fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>
          <div>Investment Component</div>
          <div style={{ textAlign: "right" }}>Raw Input</div>
          <div style={{ textAlign: "right" }}>Computed Eligible</div>
        </div>

        {/* Machinery Row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "var(--bg-card)", padding: "20px 24px", borderBottom: "1px solid var(--border-secondary)", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem", marginBottom: 4 }}>Plant & Machinery</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>New + Government of India Evaluated Refurbished</div>
          </div>
          <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1.1rem", color: "var(--text-secondary)" }}>
            {requestData ? formatCr(requestData.new_machinery + requestData.refurbished_machinery) : "-"}
          </div>
          <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1.2rem", fontWeight: 700, color: "#10b981" }}>
            {formatCr(fciResult.calculated_fci - fciResult.building_included)}
          </div>
        </div>

        {/* Building Row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "var(--bg-card)", padding: "20px 24px", borderBottom: "1px solid var(--border-secondary)", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.05rem", marginBottom: 4 }}>Building Construction</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
              {fciResult.building_capped ? (
                <><AlertTriangle size={14} color="#ef4444" /> Capped at 10% of total Fixed Capital Investment</>
              ) : (
                <><ShieldCheck size={14} color="#10b981" /> Fully Eligible</>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1.1rem", color: fciResult.building_capped ? "#ef4444" : "var(--text-secondary)", textDecoration: fciResult.building_capped ? "line-through" : "none" }}>
            {requestData ? formatCr(requestData.building_cost) : "-"}
          </div>
          <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1.2rem", fontWeight: 700, color: fciResult.building_capped ? "#f59e0b" : "#10b981" }}>
            {formatCr(fciResult.building_included)}
          </div>
        </div>

        {/* Total Row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "rgba(59, 130, 246, 0.05)", padding: "24px", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--accent-primary)", fontSize: "1.2rem" }}>Final Computed Fixed Capital Investment</div>
          </div>
          <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1.2rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            {requestData ? formatCr(requestData.building_cost + requestData.new_machinery + requestData.refurbished_machinery) : "-"}
          </div>
          <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-primary)" }}>
            {formatCr(fciResult.calculated_fci)}
          </div>
        </div>

      </div>

      {fciResult.calculation_steps && fciResult.calculation_steps.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            Step-by-Step Mathematical Derivation
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fciResult.calculation_steps.map((step, idx) => {
              let formattedStep = step;
              // Reusing the same highlighting logic from IncentiveDetail
              formattedStep = formattedStep.replace(/^([^:]+):/g, '<strong style="color: var(--text-primary); font-weight: 600;">$1:</strong>');
              formattedStep = formattedStep.replace(/(₹[0-9.,]+(?: Cr| Lakhs| \/ yr| \/ month)?)/g, '<strong style="color: var(--accent-primary);">$1</strong>');
              formattedStep = formattedStep.replace(/([0-9.,]+%)/g, '<strong style="color: #8b5cf6;">$1</strong>');
              formattedStep = formattedStep.replace(/(Cap Applied|capped at|exceeds limit|limit of)/gi, '<strong style="color: #d97706;">$1</strong>');
              formattedStep = formattedStep.replace(/ (\+|x|=|\-) /g, ' <span style="color: var(--text-tertiary); font-weight: bold;">$1</span> ');

              return (
                <div key={idx} style={{ display: "flex", gap: 16, background: "var(--bg-secondary)", padding: "14px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-secondary)", boxShadow: "var(--shadow-sm)", alignItems: "center" }}>
                  <div style={{ background: "var(--bg-accent)", color: "var(--accent-primary)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: formattedStep }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

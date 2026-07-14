"use client";

import { useState } from "react";
import { IncentiveResult } from "@/lib/types";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function EligibilityGrid({ incentives, onCardClick }: { incentives: IncentiveResult[], onCardClick: (name: string) => void }) {
  const [showMissed, setShowMissed] = useState(false);
  const formatCr = (val: number) => `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;

  const eligible = incentives.filter(inc => inc.eligible);
  const ineligible = incentives.filter(inc => !inc.eligible);

  return (
    <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      
      {/* SECTION 1: UNLOCKED INCENTIVES */}
      <div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#10b981", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={20} />
          Unlocked Incentives ({eligible.length})
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {eligible.map(inc => (
            <div
              key={inc.name}
              className="card"
              style={{ padding: 20, cursor: "pointer", display: "flex", flexDirection: "column", gap: 12, border: "1px solid var(--border-secondary)", borderTop: "3px solid #10b981" }}
              onClick={() => onCardClick(inc.name)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, paddingRight: 12, color: "var(--text-primary)" }}>{inc.name}</h4>
              </div>
              
              <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                {inc.amount > 0 ? formatCr(inc.amount) : "Qualitative Benefits"}
              </div>
              
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "auto", lineHeight: 1.5 }}>
                {inc.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MISSED OPPORTUNITIES */}
      {ineligible.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-secondary)" }}>
          <button 
            onClick={() => setShowMissed(!showMissed)}
            style={{ 
              width: "100%", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "16px 20px", 
              background: "var(--bg-tertiary)",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontWeight: 500,
              transition: "background 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
            onMouseOut={(e) => e.currentTarget.style.background = "var(--bg-tertiary)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <XCircle size={18} />
              <span>Missed Opportunities ({ineligible.length})</span>
            </div>
            {showMissed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showMissed && (
            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr", gap: 12, background: "var(--bg-card)" }} className="animate-fade-in">
              {ineligible.map(inc => (
                <div 
                  key={inc.name}
                  onClick={() => onCardClick(inc.name)}
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "12px 16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "background 0.2s ease, transform 0.2s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-secondary)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ paddingRight: 24 }}>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{inc.name}</h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{inc.reason}</p>
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", flexShrink: 0 }}>
                    ₹0.00 Cr
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

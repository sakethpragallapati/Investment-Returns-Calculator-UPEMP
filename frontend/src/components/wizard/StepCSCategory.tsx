import { CalculateRequest, CSCategory, FocusSector, AnchorRange, FOCUS_SECTOR_LABELS, ANCHOR_RANGE_LABELS } from "@/lib/types";
import { AlertCircle, Target, Network, Shield, Check } from "lucide-react";

interface StepProps {
  data: CalculateRequest;
  updateData: (fields: Partial<CalculateRequest>) => void;
}

export default function StepCSCategory({ data, updateData }: StepProps) {
  return (
    <div className="animate-fade-in stagger-children">
      <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Additional Capital Subsidy Category</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
        Select if your unit falls into a Focus Area or acts as an Anchor Unit. These provide additional Capital Subsidy on top of the base 15%.
      </p>

      <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: "rgba(217, 119, 6, 0.1)", color: "#d97706", borderRadius: "var(--radius-md)", marginBottom: 32 }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: "0.9rem" }}>
          <strong>Mutually Exclusive:</strong> You can only claim benefits under <strong>one</strong> of these categories (either Focus Area or Anchor Unit), not both.
        </span>
      </div>

      <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24, alignItems: "stretch" }}>
        
        {/* Base / None Option */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 32,
            cursor: "pointer",
            borderWidth: 2,
            borderColor: data.cs_category === "NONE" ? "var(--border-focus)" : "var(--border-secondary)",
            background: data.cs_category === "NONE" ? "var(--bg-accent)" : "var(--bg-card)",
            transition: "all 0.3s ease",
            transform: data.cs_category === "NONE" ? "translateY(-4px)" : "none",
            boxShadow: data.cs_category === "NONE" ? "var(--shadow-lg)" : "var(--shadow-sm)",
          }}
          onClick={() => updateData({ cs_category: "NONE", focus_sector: undefined, anchor_range: undefined })}
        >
          <div style={{ marginBottom: 24 }}>
            <Shield size={32} style={{ color: "var(--text-secondary)", marginBottom: 16 }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>Standard Plan</h3>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
              15%<span style={{ fontSize: "1rem", color: "var(--text-tertiary)", fontWeight: 500 }}> Base Capital Subsidy</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", minHeight: 44 }}>
              The standard capital subsidy available to all eligible units.
            </p>
          </div>
          
          <button 
            className={data.cs_category === "NONE" ? "btn-primary" : "btn-secondary"}
            style={{ width: "100%", marginBottom: 32, pointerEvents: "none" }}
          >
            {data.cs_category === "NONE" ? "Selected" : "Select Standard"}
          </button>

          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 16 }}>Everything included:</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "#10b981", flexShrink: 0, marginTop: 3 }} /> <span>Flat 15% on Eligible Machinery & Building</span></li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "#10b981", flexShrink: 0, marginTop: 3 }} /> <span>Eligible for Mega Project Bonus</span></li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "#10b981", flexShrink: 0, marginTop: 3 }} /> <span>Eligible for Bundelkhand Bonus</span></li>
            </ul>
          </div>
        </div>

        {/* Focus Area Option */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 32,
            cursor: "pointer",
            borderWidth: 2,
            borderColor: data.cs_category === "FOCUS_AREA" ? "var(--accent-primary)" : "var(--border-secondary)",
            background: data.cs_category === "FOCUS_AREA" ? "var(--bg-accent)" : "var(--bg-card)",
            transition: "all 0.3s ease",
            transform: data.cs_category === "FOCUS_AREA" ? "translateY(-4px)" : "none",
            boxShadow: data.cs_category === "FOCUS_AREA" ? "var(--shadow-lg)" : "var(--shadow-sm)",
          }}
          onClick={() => updateData({ cs_category: "FOCUS_AREA", focus_sector: data.focus_sector || "DRONES", anchor_range: undefined })}
        >
          <div style={{ marginBottom: 24 }}>
            <Target size={32} style={{ color: "var(--accent-primary)", marginBottom: 16 }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>Focus Area</h3>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
              +5%<span style={{ fontSize: "1rem", color: "var(--text-tertiary)", fontWeight: 500 }}> Bonus</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", minHeight: 44 }}>
              Additional subsidy for operating in specialized high-tech sectors.
            </p>
          </div>
          
          <button 
            className={data.cs_category === "FOCUS_AREA" ? "btn-primary" : "btn-secondary"}
            style={{ width: "100%", marginBottom: 32, pointerEvents: "none" }}
          >
            {data.cs_category === "FOCUS_AREA" ? "Selected" : "Select Focus Area"}
          </button>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 16 }}>Includes everything in Standard, plus:</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 24 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: 3 }} /> <span>Extra 5% Capital Subsidy</span></li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: 3 }} /> <span>Total Capital Subsidy reaches up to 20%</span></li>
            </ul>

            {/* In-card selector */}
            {data.cs_category === "FOCUS_AREA" && (
              <div className="animate-fade-in" style={{ marginTop: "auto" }} onClick={(e) => e.stopPropagation()}>
                <label className="label" style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Select Specific Sector</label>
                <select
                  className="input-field"
                  style={{ background: "var(--bg-primary)", borderColor: "var(--border-focus)" }}
                  value={data.focus_sector || "DRONES"}
                  onChange={(e) => updateData({ focus_sector: e.target.value as FocusSector })}
                >
                  {(Object.keys(FOCUS_SECTOR_LABELS) as FocusSector[]).map((k) => (
                    <option key={k} value={k}>{FOCUS_SECTOR_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Anchor Unit Option */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 32,
            cursor: "pointer",
            borderWidth: 2,
            borderColor: data.cs_category === "ANCHOR_UNIT" ? "var(--accent-tertiary)" : "var(--border-secondary)",
            background: data.cs_category === "ANCHOR_UNIT" ? "var(--bg-accent)" : "var(--bg-card)",
            transition: "all 0.3s ease",
            transform: data.cs_category === "ANCHOR_UNIT" ? "translateY(-4px)" : "none",
            boxShadow: data.cs_category === "ANCHOR_UNIT" ? "var(--shadow-lg)" : "var(--shadow-sm)",
          }}
          onClick={() => updateData({ cs_category: "ANCHOR_UNIT", anchor_range: data.anchor_range || "1_TO_5", focus_sector: undefined })}
        >
          <div style={{ marginBottom: 24 }}>
            <Network size={32} style={{ color: "var(--accent-tertiary)", marginBottom: 16 }} />
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>Anchor Unit</h3>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>
              Up to +5%<span style={{ fontSize: "1rem", color: "var(--text-tertiary)", fontWeight: 500 }}> Bonus</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", minHeight: 44 }}>
              Bonus for large units guaranteeing to bring multiple ancillary units.
            </p>
          </div>
          
          <button 
            className={data.cs_category === "ANCHOR_UNIT" ? "btn-primary" : "btn-secondary"}
            style={{ 
              width: "100%", 
              marginBottom: 32, 
              pointerEvents: "none", 
              background: data.cs_category === "ANCHOR_UNIT" ? "var(--accent-tertiary)" : undefined 
            }}
          >
            {data.cs_category === "ANCHOR_UNIT" ? "Selected" : "Select Anchor Unit"}
          </button>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 16 }}>Includes everything in Standard, plus:</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 24 }}>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "var(--accent-tertiary)", flexShrink: 0, marginTop: 3 }} /> <span>Tiered Capital Subsidy bonus (1.5% to 5%)</span></li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><Check size={16} style={{ color: "var(--accent-tertiary)", flexShrink: 0, marginTop: 3 }} /> <span>Requires 40% raw material sourcing</span></li>
            </ul>

            {/* In-card selector */}
            {data.cs_category === "ANCHOR_UNIT" && (
              <div className="animate-fade-in" style={{ marginTop: "auto" }} onClick={(e) => e.stopPropagation()}>
                <label className="label" style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>Number of Ancillary Units</label>
                <select
                  className="input-field"
                  style={{ background: "var(--bg-primary)", borderColor: "var(--accent-tertiary)" }}
                  value={data.anchor_range || "1_TO_5"}
                  onChange={(e) => updateData({ anchor_range: e.target.value as AnchorRange })}
                >
                  {(Object.keys(ANCHOR_RANGE_LABELS) as AnchorRange[]).map((k) => (
                    <option key={k} value={k}>{ANCHOR_RANGE_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import { CalculateRequest, ParkType } from "@/lib/types";
import { Info, Factory, Cpu, Building2 } from "lucide-react";

interface StepProps {
  data: CalculateRequest;
  updateData: (fields: Partial<CalculateRequest>) => void;
}

export default function StepInvestment({ data, updateData }: StepProps) {
  const entityType = data.semiconductor_enabled ? "SEMICONDUCTOR" : data.park_enabled ? "PARK" : "STANDARD";

  const setEntityType = (type: "STANDARD" | "SEMICONDUCTOR" | "PARK") => {
    if (type === "SEMICONDUCTOR") {
      updateData({ semiconductor_enabled: true, park_enabled: false });
    } else if (type === "PARK") {
      updateData({ semiconductor_enabled: false, park_enabled: true });
    } else {
      updateData({ semiconductor_enabled: false, park_enabled: false });
    }
  };

  return (
    <div className="animate-fade-in stagger-children">
      <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Project Classification & Investment</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
        Select your project type and enter your core investment details to calculate your Fixed Capital Investment.
      </p>

      {/* Entity Classification */}
      <div style={{ marginBottom: 40 }}>
        <label className="label" style={{ fontSize: "1.05rem", marginBottom: 12, display: "block", color: "var(--text-primary)" }}>Project Classification</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {/* Standard */}
          <div
            className={`card ${entityType === "STANDARD" ? "active" : ""}`}
            style={{ padding: 16, cursor: "pointer", border: entityType === "STANDARD" ? "2px solid var(--accent-primary)" : "1px solid var(--border-secondary)", display: "flex", gap: 12, alignItems: "center" }}
            onClick={() => setEntityType("STANDARD")}
          >
            <div style={{ color: entityType === "STANDARD" ? "var(--accent-primary)" : "var(--text-secondary)" }}><Factory size={24} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>Standard Manufacturing</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Default eligibility</div>
            </div>
          </div>

          {/* Semiconductor */}
          <div
            className={`card ${entityType === "SEMICONDUCTOR" ? "active" : ""}`}
            style={{ padding: 16, cursor: "pointer", border: entityType === "SEMICONDUCTOR" ? "2px solid #a855f7" : "1px solid var(--border-secondary)", display: "flex", gap: 12, alignItems: "center" }}
            onClick={() => setEntityType("SEMICONDUCTOR")}
          >
            <div style={{ color: entityType === "SEMICONDUCTOR" ? "#a855f7" : "var(--text-secondary)" }}><Cpu size={24} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>Semiconductor / FAB</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Specialized tech limits</div>
            </div>
          </div>

          {/* Park Developer */}
          <div
            className={`card ${entityType === "PARK" ? "active" : ""}`}
            style={{ padding: 16, cursor: "pointer", border: entityType === "PARK" ? "2px solid #f59e0b" : "1px solid var(--border-secondary)", display: "flex", gap: 12, alignItems: "center" }}
            onClick={() => setEntityType("PARK")}
          >
            <div style={{ color: entityType === "PARK" ? "#f59e0b" : "var(--text-secondary)" }}><Building2 size={24} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>Park Developer (EMC)</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Infrastructure benefits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Fields based on Entity Type */}
      {entityType === "SEMICONDUCTOR" && (
        <div className="card animate-fade-in-up" style={{ padding: 24, marginBottom: 40, borderLeft: "4px solid #a855f7" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 16, color: "var(--text-primary)" }}>Semiconductor Unit Details</h3>
          <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div className="form-group">
              <label className="label">Government of India-Approved Capital Subsidy (₹ Cr)</label>
              <input type="number" className="input-field" value={data.goi_approved_cs || ""} onChange={(e) => updateData({ goi_approved_cs: Number(e.target.value) })} min="0" placeholder="e.g. 500" />
            </div>
            <div className="form-group">
              <label className="label">Land Purchase (Acres)</label>
              <input type="number" className="input-field" value={data.semiconductor_land_acres || ""} onChange={(e) => updateData({ semiconductor_land_acres: Number(e.target.value) })} min="0" placeholder="e.g. 50" />
            </div>
            <div className="form-group">
              <label className="label">ETP Setup Cost (₹ Cr)</label>
              <input type="number" className="input-field" value={data.etp_cost || ""} onChange={(e) => updateData({ etp_cost: Number(e.target.value) })} min="0" placeholder="e.g. 10" />
            </div>
          </div>
        </div>
      )}

      {entityType === "PARK" && (
        <div className="card animate-fade-in-up" style={{ padding: 24, marginBottom: 40, borderLeft: "4px solid #f59e0b" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 16, color: "var(--text-primary)" }}>Developer / PIA Details</h3>
          <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div className="form-group">
              <label className="label">Park Type</label>
              <select className="input-field" value={data.park_type || "EMC"} onChange={(e) => updateData({ park_type: e.target.value as ParkType })}>
                <option value="EMC">Electronics Manufacturing Cluster (EMC)</option>
                <option value="PRIVATE_ESDM">Private ESDM Park</option>
              </select>
            </div>
            {data.park_type === "PRIVATE_ESDM" && (
              <div className="form-group animate-fade-in">
                <label className="label">Annual Interest Paid on Park Loan (₹ Cr/year)</label>
                <input type="number" className="input-field" value={data.park_annual_interest || ""} onChange={(e) => updateData({ park_annual_interest: Number(e.target.value) })} min="0" />
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ height: 1, background: "var(--border-secondary)", marginBottom: 40 }}></div>

      <h3 style={{ fontSize: "1.2rem", marginBottom: 20, color: "var(--text-primary)" }}>Capital Investment Layout</h3>
      <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="form-group" style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <label className="label">Land Cost (₹ Cr)</label>
          <input
            type="number"
            className="input-field"
            value={data.land_cost || ""}
            onChange={(e) => updateData({ land_cost: Number(e.target.value) })}
            min="0"
            placeholder="e.g. 50"
          />
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "flex", gap: 4, alignItems: "center", marginTop: 4 }}>
            <Info size={12} /> Excluded from Fixed Capital Investment, used for Land Subsidy.
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <label className="label">Building Cost (₹ Cr)</label>
          <input
            type="number"
            className="input-field"
            value={data.building_cost || ""}
            onChange={(e) => updateData({ building_cost: Number(e.target.value) })}
            min="0"
            placeholder="e.g. 80"
          />
        </div>

        <div className="form-group" style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <label className="label">New Plant & Machinery (₹ Cr)</label>
          <input
            type="number"
            className="input-field"
            value={data.new_machinery || ""}
            onChange={(e) => updateData({ new_machinery: Number(e.target.value) })}
            min="0"
            placeholder="e.g. 400"
          />
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "flex", gap: 4, alignItems: "center", marginTop: 4 }}>
            <Info size={12} /> 100% included in Fixed Capital Investment. Must be &gt; 0.
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
          <label className="label">Refurbished Machinery (₹ Cr)</label>
          <input
            type="number"
            className="input-field"
            value={data.refurbished_machinery || ""}
            onChange={(e) => updateData({ refurbished_machinery: Number(e.target.value) })}
            min="0"
            placeholder="e.g. 300"
          />
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", display: "flex", gap: 4, alignItems: "center", marginTop: 4 }}>
            <Info size={12} /> Must toggle 'Government of India Evaluated' below to be included in Fixed Capital Investment.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <div className="toggle-wrapper">
            <button
              type="button"
              className={`toggle ${data.is_goi_evaluated ? "active" : ""}`}
              onClick={() => updateData({ is_goi_evaluated: !data.is_goi_evaluated })}
              aria-label="Toggle Government of India Evaluated"
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Is the refurbished machinery Government of India Evaluated?</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              Required to include refurbished machinery in Fixed Capital Investment (capped at 40%). Available for first 20 investors only.
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <div className="toggle-wrapper">
            <button
              type="button"
              className={`toggle ${data.is_rented_building ? "active" : ""}`}
              onClick={() => updateData({ is_rented_building: !data.is_rented_building })}
              aria-label="Toggle Rented Building"
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Are you operating from a Rented / Plug & Play building?</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
              If yes, Capital Subsidy is disbursed over 5 years regardless of investment size.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

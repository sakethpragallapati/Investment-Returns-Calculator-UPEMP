import { useState } from "react";
import { CalculateRequest, StampDutyTxnType, STAMP_DUTY_TXN_LABELS } from "@/lib/types";
import { Check, ShieldCheck, Factory, Lightbulb, Zap, Users, Key, Truck, Landmark, AlertTriangle } from "lucide-react";

interface StepProps {
  data: CalculateRequest;
  updateData: (fields: Partial<CalculateRequest>) => void;
}

function IncentiveCard({ 
  title, 
  description, 
  icon, 
  enabled, 
  disabled = false,
  disabledReason = "",
  onToggle, 
  children 
}: { 
  title: string, 
  description: string,
  icon: React.ReactNode,
  enabled: boolean, 
  disabled?: boolean,
  disabledReason?: string,
  onToggle: () => void, 
  children: React.ReactNode 
}) {
  const isActive = enabled && !disabled;

  return (
    <div 
      className={`card ${isActive ? "active" : ""}`} 
      style={{ 
        position: "relative",
        border: isActive ? "2px solid var(--accent-primary)" : "1px solid var(--border-secondary)",
        boxShadow: isActive ? "0 0 15px rgba(59, 130, 246, 0.15)" : "none",
        backgroundColor: isActive ? "rgba(59, 130, 246, 0.03)" : "transparent",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: disabled ? "not-allowed" : "pointer"
      }}
      onClick={() => !disabled && onToggle()}
    >
      <div 
        style={{ padding: 20, display: "flex", flexDirection: "column" }}
      >
        {/* Header Row: Icon, Title, Toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12, opacity: disabled ? 0.5 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: isActive ? "var(--accent-primary)" : "var(--text-secondary)", display: "flex", alignItems: "center" }}>
              {icon}
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{title}</h3>
          </div>
          
          <div className="toggle-wrapper" style={{ pointerEvents: disabled ? "none" : "auto" }} onClick={(e) => { e.stopPropagation(); if(!disabled) onToggle(); }}>
            <button
              type="button"
              className={`toggle ${isActive ? "active" : ""}`}
              disabled={disabled}
            />
          </div>
        </div>
        
        {/* Description Paragraph */}
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4, opacity: disabled ? 0.5 : 1 }}>
          {description}
        </p>
        
        {/* Warning Tag pinned to bottom */}
        {disabled && (
          <div style={{ marginTop: 16, alignSelf: "flex-start" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600 }}>
              <AlertTriangle size={14} /> {disabledReason}
            </div>
          </div>
        )}
      </div>
      
      {/* Smoothly expanding content area */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isActive ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div 
            style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-secondary)", padding: isActive ? "20px" : "0 20px" }} 
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
      
      <style>{`
        .toggle:disabled {
          background-color: var(--border-secondary) !important;
          opacity: 1 !important;
        }
        .toggle:disabled::after {
          background-color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
}

export default function StepOptional({ data, updateData }: StepProps) {
  // Strict Estimated FCI Calculation based on UPEMP 2020 rules
  const mNew = data.new_machinery || 0;
  const mRefurb = (data.is_goi_evaluated ? data.refurbished_machinery : 0) || 0;
  const bRaw = data.building_cost || 0;
  const mTotal = mNew + mRefurb;
  const fciUncapped = mTotal + bRaw;
  const fciCapped = mTotal / 0.9;
  const estimatedFCI = bRaw > 0.1 * fciUncapped ? fciCapped : fciUncapped;

  const isFciOver200 = estimatedFCI > 200;

  // Auto-disable if FCI goes over 200 while they are enabled
  if (isFciOver200 && (data.interest_subsidy_enabled || data.lease_rental_enabled)) {
    updateData({ interest_subsidy_enabled: false, lease_rental_enabled: false });
  }

  return (
    <div className="animate-fade-in stagger-children">
      <h2 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Optional Details & Financial Ledgers</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        Select the specific financial incentives that align with your operational roadmap. Ineligible options are automatically disabled based on your Fixed Capital Investment (est. ₹{estimatedFCI.toFixed(2)} Cr).
      </p>

      {/* 1. Operational Expenses (OpEx) */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, marginTop: 40, borderBottom: "1px solid var(--border-secondary)", paddingBottom: 8 }}>
        Operational Expenses (OpEx)
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24, alignItems: "flex-start" }}>
        
        {/* Interest Subsidy */}
        <IncentiveCard
          title="Interest Subsidy"
          description="Reimbursement on interest paid for capital loans."
          icon={<Landmark size={24} />}
          enabled={data.interest_subsidy_enabled}
          disabled={isFciOver200}
          disabledReason="FCI Limit Exceeded (> ₹200 Cr)"
          onToggle={() => updateData({ interest_subsidy_enabled: !data.interest_subsidy_enabled })}
        >
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="label">Loan Type</label>
            <select className="input-field" value={data.interest_subsidy_loan_100_fci ? "100_FCI" : "CUSTOM"} onChange={(e) => updateData({ interest_subsidy_loan_100_fci: e.target.value === "100_FCI" })}>
              <option value="CUSTOM">Custom Loan Amount</option>
              <option value="100_FCI">100% of Fixed Capital Investment</option>
            </select>
          </div>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {!data.interest_subsidy_loan_100_fci && (
              <div className="form-group animate-fade-in">
                <label className="label">Loan Amount (₹ Cr)</label>
                <input type="number" className="input-field" value={data.loan_amount || ""} onChange={(e) => updateData({ loan_amount: Number(e.target.value) })} min="0" placeholder="e.g. 100" />
              </div>
            )}
            <div className="form-group animate-fade-in">
              <label className="label">Interest Rate (% p.a.)</label>
              <input type="number" className="input-field" value={data.interest_rate || ""} onChange={(e) => updateData({ interest_rate: Number(e.target.value) })} min="0" placeholder="e.g. 10" />
            </div>
          </div>
        </IncentiveCard>

        {/* Electricity Duty */}
        <IncentiveCard
          title="Electricity Duty Exemption"
          description="Exemption from electricity duty for 10 years."
          icon={<Zap size={24} />}
          enabled={data.electricity_duty_enabled}
          onToggle={() => updateData({ electricity_duty_enabled: !data.electricity_duty_enabled })}
        >
          <div className="form-group">
            <label className="label">Expected Annual Electricity Duty (₹ Lakhs/year)</label>
            <input type="number" className="input-field" value={data.annual_electricity_duty || ""} onChange={(e) => updateData({ annual_electricity_duty: Number(e.target.value) })} min="0" placeholder="Optional for value estimate" />
          </div>
        </IncentiveCard>

        {/* Lease Rental */}
        <IncentiveCard
          title="Lease Rental Reimbursement"
          description="Reimbursement of rental costs for leased facilities."
          icon={<Key size={24} />}
          enabled={data.lease_rental_enabled}
          disabled={isFciOver200}
          disabledReason="FCI Limit Exceeded (> ₹200 Cr)"
          onToggle={() => updateData({ lease_rental_enabled: !data.lease_rental_enabled })}
        >
          <div className="form-group">
            <label className="label">Annual Lease Rental (₹ Lakhs/year)</label>
            <input type="number" className="input-field" value={data.annual_lease_rental || ""} onChange={(e) => updateData({ annual_lease_rental: Number(e.target.value) })} min="0" placeholder="e.g. 50" />
          </div>
        </IncentiveCard>
      </div>

      {/* 2. Infrastructure & Logistics */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, marginTop: 40, borderBottom: "1px solid var(--border-secondary)", paddingBottom: 8 }}>
        Infrastructure & Logistics
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24, alignItems: "flex-start" }}>
        
        {/* Stamp Duty */}
        <IncentiveCard
          title="Stamp Duty Exemption"
          description="100% or 50% exemption on land purchase/lease transactions."
          icon={<Factory size={24} />}
          enabled={data.stamp_duty_enabled}
          onToggle={() => updateData({ stamp_duty_enabled: !data.stamp_duty_enabled, stamp_duty_txn_type: data.stamp_duty_enabled ? undefined : "INDIVIDUAL_PURCHASE" })}
        >
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="label">Transaction Type</label>
            <select className="input-field" value={data.stamp_duty_txn_type || "INDIVIDUAL_PURCHASE"} onChange={(e) => updateData({ stamp_duty_txn_type: e.target.value as StampDutyTxnType })}>
              {(Object.keys(STAMP_DUTY_TXN_LABELS) as StampDutyTxnType[]).map((k) => (
                <option key={k} value={k}>{STAMP_DUTY_TXN_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Stamp Duty Amount (₹ Lakhs)</label>
            <input type="number" className="input-field" value={data.stamp_duty_amount || ""} onChange={(e) => updateData({ stamp_duty_amount: Number(e.target.value) })} min="0" placeholder="e.g. 50" />
          </div>
        </IncentiveCard>

        {/* Land Subsidy */}
        <IncentiveCard
          title="Land Subsidy"
          description="Direct subsidy on land purchased from state agencies."
          icon={<ShieldCheck size={24} />}
          enabled={data.land_subsidy_enabled}
          onToggle={() => updateData({ land_subsidy_enabled: !data.land_subsidy_enabled })}
        >
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="label">Land Purchase Cost (₹ Cr)</label>
              <input type="number" className="input-field" value={data.land_purchase_cost || ""} onChange={(e) => updateData({ land_purchase_cost: Number(e.target.value) })} min="0" placeholder="e.g. 20" />
            </div>
            <div className="form-group">
              <label className="label">Total Project Cost (₹ Cr)</label>
              <input type="number" className="input-field" value={data.total_project_cost || ""} onChange={(e) => updateData({ total_project_cost: Number(e.target.value) })} min="0" placeholder="e.g. 500" />
            </div>
          </div>
        </IncentiveCard>

        {/* Logistics */}
        <IncentiveCard
          title="Logistics Subsidy"
          description="Reimbursement on relocating manufacturing equipment."
          icon={<Truck size={24} />}
          enabled={data.logistics_enabled}
          onToggle={() => updateData({ logistics_enabled: !data.logistics_enabled })}
        >
          <div className="form-group">
            <label className="label">Transport Cost for Plant Relocation (₹ Cr)</label>
            <input type="number" className="input-field" value={data.transport_cost || ""} onChange={(e) => updateData({ transport_cost: Number(e.target.value) })} min="0" placeholder="e.g. 5" />
          </div>
        </IncentiveCard>
      </div>

      {/* 3. Workforce & Innovation */}
      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, marginTop: 40, borderBottom: "1px solid var(--border-secondary)", paddingBottom: 8 }}>
        Workforce & Innovation
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24, alignItems: "flex-start" }}>
        
        {/* EPF */}
        <IncentiveCard
          title="Employees' Provident Fund"
          description="Employer EPF contribution reimbursed for specialized demographics."
          icon={<Users size={24} />}
          enabled={data.epf_enabled}
          onToggle={() => updateData({ epf_enabled: !data.epf_enabled })}
        >
          <div className="form-group">
            <label className="label">Eligible Employees Count (UP Domicile: Women/SC/ST/Divyangjan)</label>
            <input type="number" className="input-field" value={data.eligible_epf_employees || ""} onChange={(e) => updateData({ eligible_epf_employees: Number(e.target.value) })} min="0" placeholder="e.g. 100" />
          </div>
        </IncentiveCard>

        {/* Patent Cost */}
        <IncentiveCard
          title="Patent Cost Reimbursement"
          description="Reimbursement for filing domestic and international patents."
          icon={<Lightbulb size={24} />}
          enabled={data.patent_enabled}
          onToggle={() => updateData({ patent_enabled: !data.patent_enabled })}
        >
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="label">Domestic Patents Cost (₹ Lakhs)</label>
              <input type="number" className="input-field" value={data.domestic_patent_cost || ""} onChange={(e) => updateData({ domestic_patent_cost: Number(e.target.value) })} min="0" placeholder="Total cost" />
            </div>
            <div className="form-group">
              <label className="label">International Patents Cost (₹ Lakhs)</label>
              <input type="number" className="input-field" value={data.international_patent_cost || ""} onChange={(e) => updateData({ international_patent_cost: Number(e.target.value) })} min="0" placeholder="Total cost" />
            </div>
          </div>
        </IncentiveCard>
      </div>

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { BookOpen, ShieldCheck, Landmark, Briefcase, FileText, CheckCircle, TrendingUp, AlertTriangle } from "lucide-react";

export default function PolicyRulesPage() {
  const [activeSection, setActiveSection] = useState("fci");

  const sections = [
    { id: "fci", title: "Fixed Capital Investment Calculation Rules" },
    { id: "base-capital", title: "Base Capital Subsidy" },
    { id: "mega-bonus", title: "Mega Project Bonus" },
    { id: "core-capping", title: "Core Capping Limits" },
    { id: "focus-area", title: "Focus Area Add-ons" },
    { id: "anchor-unit", title: "Anchor Unit Multipliers" },
    { id: "interest-reimbursement", title: "Interest Reimbursement" },
    { id: "stamp-duty", title: "Stamp Duty Framework" },
    { id: "fiscal-ledger", title: "Fiscal Reimbursements" },
  ];

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Reusable Math Component for Ledger Typesetting
  const MathBlock = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      background: "var(--bg-secondary)",
      padding: "24px 32px",
      borderRadius: "var(--radius-md)",
      borderLeft: "4px solid var(--accent-primary)",
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: "1.3rem",
      color: "var(--text-primary)",
      marginBottom: "32px",
      letterSpacing: "0.5px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {children}
    </div>
  );

  const VarTable = ({ rows }: { rows: { sym: React.ReactNode, name: string, desc: string }[] }) => (
    <div style={{ overflowX: "auto", marginBottom: 48, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-secondary)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
        <thead>
          <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-secondary)" }}>
            <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--text-secondary)", width: "15%", fontWeight: 700 }}>Variable</th>
            <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--text-secondary)", width: "35%", fontWeight: 700 }}>Parameter Represented</th>
            <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--text-secondary)", width: "50%", fontWeight: 700 }}>Policy Inclusions & Exclusions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i !== rows.length - 1 ? "1px solid var(--border-secondary)" : "none" }}>
              <td style={{ padding: "16px 24px", fontFamily: "'Times New Roman', serif", fontSize: "1.2rem", fontStyle: "italic", fontWeight: 700, color: "var(--accent-primary)" }}>{r.sym}</td>
              <td style={{ padding: "16px 24px", fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</td>
              <td style={{ padding: "16px 24px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const NavItem = ({ id, label, isSub = false }: { id: string, label: string, isSub?: boolean }) => (
    <button 
      onClick={() => scrollToSection(id)} 
      style={{ 
        textAlign: "left", 
        width: "100%", 
        padding: isSub ? "10px 16px 10px 40px" : "12px 16px", 
        background: activeSection === id ? "var(--accent-primary)" : "transparent", 
        color: activeSection === id ? "#fff" : "var(--text-secondary)", 
        fontWeight: activeSection === id ? 700 : 500,
        borderRadius: "var(--radius-md)",
        border: "none", 
        cursor: "pointer", 
        display: "block",
        marginBottom: 4,
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => { if(activeSection !== id) e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
      onMouseLeave={(e) => { if(activeSection !== id) e.currentTarget.style.background = "transparent" }}
    >
      {label}
    </button>
  );

  const StatWidget = ({ title, value, subtext, color = "#10b981", icon: Icon }: any) => (
    <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-secondary)", padding: "20px", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>{title}</div>
        <Icon size={16} color={color} />
      </div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: color, lineHeight: 1.1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: "0.9rem", color: "var(--text-tertiary)" }}>{subtext}</div>
    </div>
  );

  return (
    <div className="animate-fade-in-up" style={{ background: "var(--bg-primary)", minHeight: "calc(100vh - 64px)", padding: "40px 0" }}>
      {/* 
        GFG Inspired Layout: 
        - Wider max-width (1600px)
        - Distinct solid sidebars to anchor the page and remove floating empty space
        - 3-column grid (Left Nav, Center Content, Right Widgets)
      */}
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 32px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40, borderBottom: "1px solid var(--border-secondary)", paddingBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "rgba(59, 130, 246, 0.1)", borderRadius: "var(--radius-lg)", color: "var(--accent-primary)" }}>
              <FileText size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.1 }}>Policy Rules & Documentation</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: 8 }}>
                Financial ledger mapping of all core mathematical formulas and constraints of UPEMP 2020.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Column GFG Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 340px", gap: 40, alignItems: "start" }}>
          
          {/* Left Panel: Solid Anchored Index (GFG Style) */}
          <div style={{ position: "sticky", top: 100, background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", padding: "24px 16px", border: "1px solid var(--border-secondary)", height: "calc(100vh - 120px)", overflowY: "auto" }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: 16, paddingLeft: 16 }}>Documentation Index</h3>
            
            <NavItem id="fci" label="Fixed Capital Investment Calculation Rules" />
            
            <div style={{ margin: "24px 0 8px 16px", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px" }}>I. Capital Benefits</div>
            <NavItem id="base-capital" label="Base Capital Subsidy" isSub />
            <NavItem id="mega-bonus" label="Mega Project Bonus" isSub />
            <NavItem id="core-capping" label="Core Capping Limits" isSub />
            <NavItem id="focus-area" label="Focus Area Add-ons" isSub />
            <NavItem id="anchor-unit" label="Anchor Unit Multipliers" isSub />

            <div style={{ margin: "24px 0 8px 16px", fontSize: "0.8rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px" }}>II. Operational Subsidies</div>
            <NavItem id="interest-reimbursement" label="Interest Reimbursement" isSub />
            <NavItem id="stamp-duty" label="Stamp Duty Framework" isSub />
            <NavItem id="fiscal-ledger" label="Fiscal Reimbursements" isSub />
          </div>

          {/* Center Canvas: Active Reading Region */}
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 100, background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: "40px", border: "1px solid var(--border-secondary)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            
            {/* Section: FCI */}
            <div id="fci" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 24, color: "var(--text-primary)" }}>Fixed Capital Investment Calculation</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: 32 }}>
                Fixed Capital Investment acts as the foundational metric for all downstream state incentives. The policy applies strict mathematical limiters to prevent capital inflation and ensure subsidies are proportionate to genuine manufacturing infrastructure.
              </p>

              <MathBlock>
                <span style={{ fontWeight: "bold" }}>Eligible Fixed Capital Investment</span> = M<sub>New</sub> + M<sub>Refurb</sub> + min( B, 0.10 × Final_Fixed_Capital_Investment )
              </MathBlock>

              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>Variable Parameter Definitions</h3>
              <VarTable rows={[
                { sym: <span>M<sub>New</sub></span>, name: "New Plant & Machinery", desc: "Included at 100% value without structural limits." },
                { sym: <span>M<sub>Refurb</sub></span>, name: "Refurbished Machinery", desc: "Capped tightly at 40% of final computed Fixed Capital Investment. Only eligible if Government of India evaluated." },
                { sym: <span>B</span>, name: "Building Cost", desc: "Capped at 10% of final computed Fixed Capital Investment." }
              ]} />

              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 16, marginTop: 40, color: "var(--text-primary)" }}>Explanatory Static Ledger</h3>
              
              {/* Premium Static Ledger Layout */}
              <div style={{ border: "1px solid var(--border-secondary)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", background: "var(--bg-secondary)" }}>
                <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: "20px 32px", borderBottom: "1px solid var(--border-secondary)", fontWeight: 700, color: "var(--accent-primary)", letterSpacing: "1px" }}>
                  [INVESTMENT HYPOTHETICAL INPUTS]
                </div>
                <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, borderBottom: "1px solid var(--border-secondary)", background: "var(--bg-card)" }}>
                  <div><div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Raw Building Cost</div><div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#ef4444" }}>₹80.00 Cr</div></div>
                  <div><div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>New Machinery</div><div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#10b981" }}>₹400.00 Cr</div></div>
                  <div><div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Refurbished</div><div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#10b981" }}>₹300.00 Cr <br/><span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 500 }}>(Government of India Evaluated)</span></div></div>
                </div>
                
                <div style={{ background: "rgba(245, 158, 11, 0.05)", padding: "20px 32px", borderBottom: "1px solid var(--border-secondary)", fontWeight: 700, color: "#d97706", letterSpacing: "1px" }}>
                  [STEP 1: FIXED CAPITAL INVESTMENT CALCULATION RUN]
                </div>
                <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-secondary)", background: "var(--bg-card)" }}>
                  <div style={{ marginBottom: 12, fontSize: "1.05rem" }}><span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Formula Applied:</span> Case 2 Matrix (Building Cap Triggered)</div>
                  <div style={{ marginBottom: 20, fontSize: "1.05rem" }}><span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Math:</span> Fixed Capital Investment = (400.00 + 300.00) / 0.90</div>
                  <div style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: 16, color: "var(--text-primary)" }}>Resulting Computed Fixed Capital Investment: ₹777.78 Cr</div>
                  <ul style={{ paddingLeft: 24, color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.8 }}>
                    <li><strong style={{ color: "var(--text-primary)" }}>Building Value Capped:</strong> From ₹80.00 Cr down to ₹77.78 Cr (10% Cap applied)</li>
                    <li><strong style={{ color: "var(--text-primary)" }}>Refurbished Included:</strong> ₹300.00 Cr (Under the 40% cap limit of ₹311.11 Cr)</li>
                  </ul>
                </div>

                <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "20px 32px", borderBottom: "1px solid var(--border-secondary)", fontWeight: 700, color: "#10b981", letterSpacing: "1px" }}>
                  [STEP 2: SUBSIDY DISTRIBUTION]
                </div>
                <div style={{ padding: "24px 32px", background: "var(--bg-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: "1.1rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Base Capital Subsidy (15%)</span>
                    <span style={{ fontWeight: 700 }}>₹116.67 Cr</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: "1.1rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Focus Area Incentive (5%)</span>
                    <span style={{ fontWeight: 700 }}>₹38.89 Cr</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--border-secondary)", paddingTop: 24, fontWeight: 800, fontSize: "1.4rem" }}>
                    <span>TOTAL APPROVED BASE VALUE:</span>
                    <span style={{ color: "#10b981" }}>₹155.56 Cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Capital Benefits Matrix */}
            
            <div id="base-capital" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>Base Capital Subsidy</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 24 }}>15% baseline calculation logic applied to calculated FCI across all standard manufacturing tiers.</p>
              <MathBlock>
                Base_CS = 0.15 × Eligible_FCI
              </MathBlock>
            </div>

            <div id="mega-bonus" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>Mega Project Bonus</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 24 }}>Mathematical logic rules demonstrating the additional 10% allocation condition for systems exceeding ₹1000 Cr in capital block investment alongside a minimum threshold of 3000 verified jobs.</p>
              <MathBlock>
                Mega_Bonus = 0.10 × max(0, Eligible_FCI - 1000)
              </MathBlock>
              <VarTable rows={[
                { sym: <span>Eligible_FCI</span>, name: "Eligible Fixed Capital Investment", desc: "The final computed FCI after building/refurb caps." },
                { sym: <span>Condition</span>, name: "Employment Threshold", desc: "Must verify at least 3,000 localized jobs created." }
              ]} />
            </div>

            <div id="core-capping" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>Core Capping Limits</h3>
              <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: 32, borderRadius: "var(--radius-lg)" }}>
                <h4 style={{ color: "#ef4444", fontWeight: 800, fontSize: "1.4rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}><ShieldCheck size={24}/> Strict ₹250 Cr Ceiling Logic</h4>
                <p style={{ color: "var(--text-primary)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                  Executed immediately prior to accounting for multiplier bonuses. The sum of Base Capital Subsidy + Mega Project Bonus cannot exceed an absolute cap of ₹250 Cr.
                </p>
              </div>
            </div>

            <div id="focus-area" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>Focus Area Sector Add-ons</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 24 }}>Standalone data panel listing the 5% multiplier eligibility across specific target sectors.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{ padding: 24, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--accent-primary)", fontWeight: 700, fontSize: "1.1rem" }}>Defense Electronics</div>
                <div style={{ padding: 24, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--accent-primary)", fontWeight: 700, fontSize: "1.1rem" }}>Medical Electronics</div>
                <div style={{ padding: 24, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--accent-primary)", fontWeight: 700, fontSize: "1.1rem" }}>Drones & Components</div>
                <div style={{ padding: 24, background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--accent-primary)", fontWeight: 700, fontSize: "1.1rem" }}>Internet of Things (IoT)</div>
              </div>
            </div>

            <div id="anchor-unit" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>Anchor Unit Multipliers</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 24 }}>Escalation tables outlining the localized ancillary clustering multipliers.</p>
              <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.05rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(16, 185, 129, 0.05)", borderBottom: "2px solid var(--border-secondary)" }}>
                      <th style={{ padding: "20px 24px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 700 }}>Ancillary Investment Attracted</th>
                      <th style={{ padding: "20px 24px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 700 }}>Additional Subsidy Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border-secondary)" }}>
                      <td style={{ padding: "20px 24px", fontWeight: 700 }}>Min. ₹100 Cr</td>
                      <td style={{ padding: "20px 24px", color: "#10b981", fontWeight: 800 }}>+ 1.5%</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-secondary)" }}>
                      <td style={{ padding: "20px 24px", fontWeight: 700 }}>Min. ₹200 Cr</td>
                      <td style={{ padding: "20px 24px", color: "#10b981", fontWeight: 800 }}>+ 2.5%</td>
                    </tr>
                    <tr style={{ borderBottom: "none" }}>
                      <td style={{ padding: "20px 24px", fontWeight: 700 }}>Min. ₹300 Cr</td>
                      <td style={{ padding: "20px 24px", color: "#10b981", fontWeight: 800 }}>+ 5.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section: Operational Subsidies Registry */}
            
            <div id="interest-reimbursement" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                <Landmark size={28} className="text-blue-500" /> Interest Reimbursement Engine
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 24 }}>Detailed rule mapping showcasing the 5% per annum loan rebate calculation logic.</p>
              <div style={{ background: "var(--bg-secondary)", padding: 32, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 16, fontSize: "1.1rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
                  <li><strong style={{ color: "var(--accent-primary)" }}>Restriction:</strong> Strictly restricted to setups under a ₹200 Cr gross investment layout.</li>
                  <li><strong style={{ color: "var(--accent-primary)" }}>Rate:</strong> 5% per annum on the outstanding term loan.</li>
                  <li><strong style={{ color: "var(--accent-primary)" }}>Cap:</strong> ₹1 Cr annually across a 7-year execution frame (Max ₹7 Cr).</li>
                </ul>
              </div>
            </div>

            <div id="stamp-duty" style={{ scrollMarginTop: 100, paddingBottom: 56, borderBottom: "2px dashed var(--border-secondary)", marginBottom: 56 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                <FileText size={28} className="text-blue-500" /> Stamp Duty Framework
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: 24 }}>Two-tier framework matrix detailing execution layouts for land acquisition.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{ padding: 32, background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-primary)", marginBottom: 12 }}>100% Layout</div>
                  <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Direct land acquisitions (initial purchase).</p>
                </div>
                <div style={{ padding: 32, background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-primary)", marginBottom: 12 }}>50% Layout</div>
                  <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Customized execution for configurations bound to long-term operational leases spanning at least 10 years.</p>
                </div>
              </div>
            </div>

            <div id="fiscal-ledger" style={{ scrollMarginTop: 100 }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 24, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                <Briefcase size={28} className="text-blue-500" /> Fiscal Reimbursements Ledger
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8, color: "var(--text-primary)" }}>Patent Cost Reimbursements</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>Capped limit per patent classification.</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "monospace", color: "var(--accent-primary)", fontWeight: 800, fontSize: "1.3rem" }}>
                    ₹5L (Dom) / ₹10L (Intl)
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8, color: "var(--text-primary)" }}>EPF Reimbursement Engine</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>100% tracking for localized demographics, capped at ₹2k/mo.</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "monospace", color: "var(--accent-primary)", fontWeight: 800, fontSize: "1.3rem" }}>
                    ₹1 Cr / year (5 Yrs)
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8, color: "var(--text-primary)" }}>Lease Rentals</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>25% coverage mapping for investment bounds &lt; ₹200 Cr.</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "monospace", color: "var(--accent-primary)", fontWeight: 800, fontSize: "1.3rem" }}>
                    Max ₹25 Lakhs / yr
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-secondary)" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 8, color: "var(--text-primary)" }}>Logistics Reimbursement</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>50% transport subsidy mapping for plant relocations.</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "monospace", color: "var(--accent-primary)", fontWeight: 800, fontSize: "1.3rem" }}>
                    Cap ₹2 Cr
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Panel: Individual Widget Cards (GFG Style) */}
          <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-tertiary)", fontWeight: 700, marginBottom: 16 }}>Policy Hard Caps</h3>
            
            <StatWidget 
              title="Global Incentive Cap" 
              value="100%" 
              subtext="of Computed FCI" 
              icon={ShieldCheck} 
            />
            
            <StatWidget 
              title="Core Capital Cap" 
              value="₹250 Cr" 
              subtext="Max ceiling prior to bonuses" 
              icon={TrendingUp} 
              color="#3b82f6"
            />
            
            <StatWidget 
              title="Interest Subsidy" 
              value="₹7 Cr" 
              subtext="Max ₹1 Cr/yr for 7 yrs" 
              icon={Landmark}
              color="#f59e0b"
            />
            
            <StatWidget 
              title="EPF Reimbursement" 
              value="₹5 Cr" 
              subtext="Max ₹1 Cr/yr for 5 yrs" 
              icon={Briefcase}
              color="#8b5cf6"
            />
            
            <StatWidget 
              title="Patent Limit" 
              value="100%" 
              subtext="₹5L (Dom) / ₹10L (Intl)" 
              icon={CheckCircle}
              color="#ec4899"
            />

            <div style={{ marginTop: 24, padding: 20, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)" }}>
               <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#ef4444", fontWeight: 700 }}>
                 <AlertTriangle size={18} /> Important Note
               </div>
               <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                 The UPEMP 2020 caps strictly apply to state subsidies. Central schemes like PLI are processed independently.
               </p>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}

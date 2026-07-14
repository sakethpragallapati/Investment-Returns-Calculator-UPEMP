"use client";

import { useState, useEffect } from "react";
import { CalculateRequest, CalculateResponse } from "@/lib/types";
import { Download, Info, PieChart, TrendingUp, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Custom hook for number animation
function useCountUp(endValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * endValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

export default function HeroSummary({ requestData, response }: { requestData: CalculateRequest | null, response: CalculateResponse }) {
  const animatedTotal = useCountUp(response.final_total, 2000);
  
  const formatCr = (val: number) => `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("UPEMP 2020 Incentive Assessment Report", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 26, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Green
    doc.text(`Total Estimated Benefits: Rs. ${response.final_total.toFixed(2)} Cr`, pageWidth / 2, 38, { align: "center" });
    doc.setTextColor(0, 0, 0);

    // Section: Input Profile
    doc.setFontSize(12);
    doc.text("1. Investment Profile Summary", 14, 52);
    
    if (requestData) {
      autoTable(doc, {
        startY: 56,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        head: [['Parameter', 'Value']],
        body: [
          ['Building Cost', `Rs. ${requestData.building_cost} Cr`],
          ['New Machinery', `Rs. ${requestData.new_machinery} Cr`],
          ['Refurbished Machinery', `Rs. ${requestData.refurbished_machinery} Cr`],
          ['Region', requestData.region],
          ['Employment Generated', `${requestData.employment_count} Jobs`],
        ],
        margin: { left: 14, right: 14 }
      });
    }

    // Section: FCI Breakdown
    const fciY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : 56;
    doc.setFontSize(12);
    doc.text("2. Fixed Capital Investment Ledger", 14, fciY);

    autoTable(doc, {
      startY: fciY + 4,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      head: [['Component', 'Computed Value', 'Notes']],
      body: [
        ['Eligible Machinery', `Rs. ${(response.fci_result.calculated_fci - response.fci_result.building_included).toFixed(2)} Cr`, 'New + Refurbished (Capped if applicable)'],
        ['Eligible Building', `Rs. ${response.fci_result.building_included.toFixed(2)} Cr`, response.fci_result.building_capped ? 'Capped at 10% of Fixed Capital Investment' : 'Fully eligible'],
        ['Final Computed Fixed Capital Investment', `Rs. ${response.fci_result.calculated_fci.toFixed(2)} Cr`, 'Base for incentives'],
      ],
      margin: { left: 14, right: 14 }
    });

    // Section: Eligible Incentives
    const eligible = response.incentives.filter(i => i.eligible);
    let incY = (doc as any).lastAutoTable.finalY + 12;
    
    if (incY > doc.internal.pageSize.height - 40) {
      doc.addPage();
      incY = 20;
    }

    doc.setFontSize(12);
    doc.text("3. Unlocked Incentives Breakdown", 14, incY);

    autoTable(doc, {
      startY: incY + 4,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Green header
      head: [['Incentive Name', 'Amount', 'Details']],
      body: eligible.map(inc => [
        inc.name.replace(/₹/g, 'Rs. '), 
        inc.amount > 0 ? `Rs. ${inc.amount.toFixed(2)} Cr` : 'Qualitative', 
        inc.reason.replace(/₹/g, 'Rs. ')
      ]),
      margin: { left: 14, right: 14 }
    });

    // Section: Missed Opportunities
    const missed = response.incentives.filter(i => !i.eligible);
    if (missed.length > 0) {
      let missedY = (doc as any).lastAutoTable.finalY + 12;
      
      if (missedY > doc.internal.pageSize.height - 40) {
        doc.addPage();
        missedY = 20;
      }

      doc.setFontSize(12);
      doc.text("4. Missed Opportunities", 14, missedY);

      autoTable(doc, {
        startY: missedY + 4,
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }, // Red header
        head: [['Incentive Name', 'Reason for Ineligibility']],
        body: missed.map(inc => [inc.name.replace(/₹/g, 'Rs. '), inc.reason.replace(/₹/g, 'Rs. ')]),
        margin: { left: 14, right: 14 }
      });
    }

    // Section: Detailed Mathematical Derivations
    doc.addPage();
    let detailY = 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("5. Detailed Mathematical Derivations", 14, detailY);
    detailY += 8;

    // FCI Derivation
    doc.setFontSize(11);
    doc.setTextColor(59, 130, 246);
    doc.text("Fixed Capital Investment Calculation", 14, detailY);
    doc.setTextColor(0, 0, 0);
    
    autoTable(doc, {
      startY: detailY + 4,
      theme: 'plain',
      body: response.fci_result.calculation_steps.map((step, idx) => [`${idx + 1}.`, step.replace(/₹/g, 'Rs. ')]),
      columnStyles: {
        0: { cellWidth: 10, fontStyle: 'bold', textColor: [59, 130, 246] },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 14, right: 14 }
    });

    // Eligible Incentives Derivation
    eligible.forEach(inc => {
      let y = (doc as any).lastAutoTable.finalY + 12;
      if (y > doc.internal.pageSize.height - 40) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(16, 185, 129);
      doc.text(`${inc.name.replace(/₹/g, 'Rs. ')} Calculation`, 14, y);
      doc.setTextColor(0, 0, 0);

      if (inc.calculation_steps && inc.calculation_steps.length > 0) {
        autoTable(doc, {
          startY: y + 4,
          theme: 'plain',
          body: inc.calculation_steps.map((step, idx) => [`${idx + 1}.`, step.replace(/₹/g, 'Rs. ')]),
          columnStyles: {
            0: { cellWidth: 10, fontStyle: 'bold', textColor: [16, 185, 129] },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 14, right: 14 }
        });
      } else {
        autoTable(doc, {
          startY: y + 4,
          theme: 'plain',
          body: [['', 'No detailed steps available.']],
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 'auto', fontStyle: 'italic', textColor: [150, 150, 150] }
          },
          margin: { left: 14, right: 14 }
        });
      }
    });

    doc.save("UPEMC_Incentive_Report.pdf");
  };

  const pct = Math.min(Number(response.total_as_pct_of_fci) || 0, 100);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <section style={{ 
      position: "relative",
      background: "var(--gradient-card)", 
      padding: "80px 0", 
      borderBottom: "1px solid var(--border-secondary)",
      overflow: "hidden"
    }}>
      {/* Ambient Glassmorphism Glows */}
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "140%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: "40%", height: "100%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="container-main" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}>
          
          {/* LEFT: Total Returns */}
          <div className="animate-fade-in-up">
            <div style={{ display: "inline-flex", padding: "6px 16px", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: 30, fontSize: "0.85rem", fontWeight: 600, marginBottom: 24, textTransform: "uppercase", letterSpacing: "1px" }}>
              UPEMP 2020 Estimate
            </div>
            <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 12, lineHeight: 1.1, color: "var(--text-primary)" }}>
              Total Estimated Benefits
            </h1>
            
            {/* Gradient Animated Text */}
            <div style={{ 
              fontSize: "4.5rem", 
              fontWeight: 800, 
              marginBottom: 20, 
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.2))"
            }}>
              {formatCr(animatedTotal)}
            </div>
            
            {response.fci_cap_applied && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(220, 38, 38, 0.1)", color: "#f87171", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", fontWeight: 500 }}>
                <Info size={16} /> 
                Capped at 100% of Fixed Capital Investment. (Uncapped total: {formatCr(response.grand_total)})
              </div>
            )}

            <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
              <button className="btn-primary" onClick={generatePDF} style={{ padding: "14px 28px", fontSize: "1rem", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <Download size={20} />
                Download PDF Report
              </button>
            </div>
          </div>

          {/* RIGHT: Premium Stat Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* FCI Card */}
            <div className="glass-card premium-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", borderRadius: "var(--radius-lg)", transition: "all 0.3s ease", cursor: "default" }}>
              <div>
                <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={16} style={{ color: "#8b5cf6" }} />
                  Fixed Capital Investment
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>{formatCr(response.fci_result.calculated_fci)}</div>
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Eligible Count Card */}
              <div className="glass-card premium-card" style={{ padding: 24, border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", borderRadius: "var(--radius-lg)", transition: "all 0.3s ease" }}>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={16} style={{ color: "#10b981" }} />
                  Eligible Subsidies
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "baseline", gap: 4 }}>
                  {response.eligible_count} 
                  <span style={{ fontSize: "1rem", color: "var(--text-tertiary)", fontWeight: 500 }}>/ 14</span>
                </div>
              </div>

              {/* Progress Ring Card */}
              <div className="glass-card premium-card" style={{ padding: 24, border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s ease" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <PieChart size={16} style={{ color: "#60a5fa" }} />
                    ROI
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {response.total_as_pct_of_fci}%
                  </div>
                </div>
                
                {/* SVG Progress Ring */}
                <div style={{ width: 80, height: 80, position: "relative" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle 
                      cx="40" cy="40" r={radius} fill="none" 
                      stroke="#3b82f6" strokeWidth="6" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />
                  </svg>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <style>{`
        .premium-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.2) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </section>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalculateRequest, CalculateResponse } from "@/lib/types";
import { calculateIncentives } from "@/lib/api";
import HeroSummary from "@/components/results/HeroSummary";
import EligibilityGrid from "@/components/results/EligibilityGrid";
import IncentiveDetail from "@/components/results/IncentiveDetail";
import FCIBreakdownView from "@/components/results/FCIBreakdownView";
import FinancialProjections from "@/components/results/FinancialProjections";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q");

  const [requestData, setRequestData] = useState<CalculateRequest | null>(null);
  const [response, setResponse] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    let activeQ = q;

    if (!activeQ) {
      const savedQ = localStorage.getItem("upemc_last_calculation");
      if (savedQ) {
        activeQ = savedQ;
      } else {
        router.replace("/calculator");
        return;
      }
    } else {
      localStorage.setItem("upemc_last_calculation", activeQ);
    }

    try {
      const decoded = atob(activeQ);
      const data = JSON.parse(decoded) as CalculateRequest;
      setRequestData(data);
      fetchData(data);
    } catch (err) {
      localStorage.removeItem("upemc_last_calculation");
      router.replace("/calculator");
    }
  }, [q, router]);

  const fetchData = async (data: CalculateRequest) => {
    setLoading(true);
    setError("");
    try {
      const res = await calculateIncentives(data);
      setResponse(res);
      // set the FCI tab active by default
      setActiveTab("fci-breakdown");
    } catch (err: any) {
      setError(err.message || "Failed to calculate incentives.");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Loader2 size={48} className="animate-spin" style={{ color: "var(--accent-primary)", marginBottom: 16, animation: "spin 1s linear infinite" }} />
        <h2 style={{ fontSize: "1.2rem", fontWeight: 500 }}>Calculating 13+ Incentives...</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Applying UPEMP 2020 rules and caps</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="container-main section-spacing" style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", padding: 24, background: "rgba(220, 38, 38, 0.1)", borderRadius: "var(--radius-lg)", color: "var(--accent-danger)", marginBottom: 24 }}>
          <AlertTriangle size={48} />
        </div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: 16 }}>Calculation Error</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{error}</p>
        <button className="btn-primary" onClick={() => router.push("/calculator")}>
          <ArrowLeft size={16} /> Return to Calculator
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <HeroSummary requestData={requestData} response={response} />

      <div className="container-main section-spacing" style={{ paddingBottom: 24 }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: 24, fontWeight: 700 }}>Eligibility Overview</h2>
        <EligibilityGrid 
          incentives={response.incentives} 
          onCardClick={(name) => {
            setActiveTab(name);
            document.getElementById("detail-section")?.scrollIntoView({ behavior: "smooth" });
          }} 
        />
      </div>

      <div className="container-main" style={{ paddingBottom: 48 }} id="detail-section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          {/* Main Content Area */}
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 24, fontWeight: 700 }}>Detailed Breakdowns</h2>
            <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", minHeight: 600 }}>
              {/* Vertical Tabs */}
              <div style={{ width: 280, borderRight: "1px solid var(--border-secondary)", background: "var(--bg-tertiary)", overflowY: "auto" }}>
                <button
                  key="fci-breakdown"
                  onClick={() => setActiveTab("fci-breakdown")}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "16px 20px",
                    border: "none",
                    borderBottom: "1px solid var(--border-secondary)",
                    background: activeTab === "fci-breakdown" ? "var(--bg-card)" : "transparent",
                    color: activeTab === "fci-breakdown" ? "var(--accent-primary)" : "var(--text-primary)",
                    fontWeight: activeTab === "fci-breakdown" ? 700 : 500,
                    cursor: "pointer",
                    borderLeft: activeTab === "fci-breakdown" ? "4px solid var(--accent-primary)" : "4px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span style={{ fontSize: "0.95rem" }}>Fixed Capital Investment Calculation Ledger</span>
                  <span style={{ fontSize: "0.85rem", color: "#3b82f6", fontWeight: 700 }}>★</span>
                </button>
                {response.incentives.map(inc => (
                  <button
                    key={inc.name}
                    onClick={() => setActiveTab(inc.name)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "16px 20px",
                      border: "none",
                      borderBottom: "1px solid var(--border-secondary)",
                      background: activeTab === inc.name ? "var(--bg-card)" : "transparent",
                      color: activeTab === inc.name ? "var(--accent-primary)" : "var(--text-primary)",
                      fontWeight: activeTab === inc.name ? 600 : 400,
                      cursor: "pointer",
                      borderLeft: activeTab === inc.name ? "4px solid var(--accent-primary)" : "4px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{inc.name}</span>
                    {inc.eligible ? (
                      <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>✓</span>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 700 }}>✗</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, padding: 32, overflowY: "auto", background: "var(--bg-card)" }}>
                {activeTab === "fci-breakdown" ? (
                  <FCIBreakdownView fciResult={response.fci_result} requestData={requestData} />
                ) : activeTab ? (
                  <IncentiveDetail 
                    incentive={response.incentives.find(i => i.name === activeTab)!} 
                    fciResult={response.fci_result}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div style={{ background: "var(--bg-secondary)", padding: "64px 0" }}>
        <div className="container-main" style={{ maxWidth: 1400 }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: 32, fontWeight: 700 }}>Financial Projections</h2>
          <FinancialProjections requestData={requestData} response={response} />
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px 0", textAlign: "center" }}>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

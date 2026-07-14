"use client";

import Link from "next/link";
import {
  Calculator,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  Cpu,
  IndianRupee,
  Coins,
  Anchor,
  Target,
  Percent,
  FileSignature,
  Lightbulb,
  Map,
  Users,
  Key,
  Truck,
  Factory,
  GraduationCap
} from "lucide-react";

const features = [
  {
    icon: <Calculator size={24} />,
    title: "13+ Incentives Covered",
    desc: "Capital Subsidy, Interest Subsidy, Land Subsidy, Stamp Duty, Patents, Employees' Provident Fund, and more.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Transparent Calculations",
    desc: "Step-by-step mathematical breakdowns showing exactly how each subsidy is computed.",
  },
  {
    icon: <FileText size={24} />,
    title: "PDF Export",
    desc: "Download a branded, detailed report of all your eligible incentives.",
  },
  {
    icon: <Shield size={24} />,
    title: "Policy Compliant",
    desc: "Strict implementation of all UPEMP 2020 rules, caps, and eligibility criteria.",
  },
  {
    icon: <Zap size={24} />,
    title: "Instant Results",
    desc: "Real-time calculations — no waiting, no submissions, no sign-ups required.",
  },
  {
    icon: <IndianRupee size={24} />,
    title: "Sensitivity Analysis",
    desc: "See how adjusting your investment unlocks additional bonuses and subsidies.",
  },
];

const incentivesList = [
  { name: "Capital Subsidy", icon: <Coins size={18} />, color: "#10b981" },
  { name: "Anchor Unit Bonus", icon: <Anchor size={18} />, color: "#3b82f6" },
  { name: "Focus Area Bonus", icon: <Target size={18} />, color: "#8b5cf6" },
  { name: "Interest Subsidy", icon: <Percent size={18} />, color: "#f59e0b" },
  { name: "Stamp Duty Exemption", icon: <FileSignature size={18} />, color: "#ec4899" },
  { name: "Patent Reimbursement", icon: <Lightbulb size={18} />, color: "#eab308" },
  { name: "Land Subsidy", icon: <Map size={18} />, color: "#14b8a6" },
  { name: "Electricity Exemption", icon: <Zap size={18} />, color: "#f97316" },
  { name: "Employees' Provident Fund Reimbursement", icon: <Users size={18} />, color: "#06b6d4" },
  { name: "Lease Rental", icon: <Key size={18} />, color: "#64748b" },
  { name: "Logistics Subsidy", icon: <Truck size={18} />, color: "#6366f1" },
  { name: "Semiconductor Benefits", icon: <Cpu size={18} />, color: "#a855f7" },
  { name: "ESDM Park Incentives", icon: <Factory size={18} />, color: "#f43f5e" },
  { name: "Skill Development", icon: <GraduationCap size={18} />, color: "#2dd4bf" },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 0 100px",
          background: "var(--gradient-hero)",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        <div
          className="container-main animate-fade-in-up"
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              fontSize: "0.85rem",
              fontWeight: 500,
              marginBottom: 24,
              backdropFilter: "blur(4px)",
            }}
          >
            <Cpu size={14} />
            UP Electronics Manufacturing Policy 2020
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 20,
              maxWidth: 700,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            UPEMP Incentive
            <br />
            Calculator
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              opacity: 0.9,
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Instantly calculate all eligible subsidies and incentives for your
            electronics manufacturing investment in Uttar Pradesh.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/calculator"
              className="btn-primary"
              style={{
                padding: "14px 36px",
                fontSize: "1rem",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
              }}
            >
              Start Calculating
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/policy-rules"
              className="btn-secondary"
              style={{
                borderColor: "rgba(255,255,255,0.4)",
                color: "white",
                background: "rgba(255, 255, 255, 0.1)"
              }}
            >
              <BookOpen size={16} />
              View Policy Rules
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="section-spacing" style={{ background: "var(--bg-secondary)" }}>
        <div className="container-main">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>
              Why Use This Calculator?
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Get a comprehensive view of all incentives available under UPEMP 2020
            </p>
          </div>

          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-primary)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Incentives Checklist ── */}
      <section className="section-spacing">
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>
                All Incentives, One Calculator
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: 32,
                  lineHeight: 1.7,
                }}
              >
                The UPEMP 2020 policy offers a comprehensive package of financial
                incentives for electronics manufacturers. Our calculator covers every
                single one — with eligibility checks, mathematical breakdowns, and
                disbursement schedules.
              </p>
              <Link href="/calculator" className="btn-primary">
                Calculate Your Incentives
                <ArrowRight size={16} />
              </Link>
            </div>

            <div
              className="stagger-children"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {incentivesList.map((item, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 20px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-card)",
                    border: `1px solid var(--border-secondary)`,
                    borderLeft: `4px solid ${item.color}`,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    transition: "all 0.3s ease",
                    cursor: "default",
                    boxShadow: "var(--shadow-sm)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateX(6px)";
                    e.currentTarget.style.background = "var(--bg-card-hover)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.background = "var(--bg-card)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: 38, 
                    height: 38, 
                    borderRadius: "50%", 
                    background: `${item.color}15`, 
                    color: item.color,
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "64px 0",
          background: "var(--bg-tertiary)",
          textAlign: "center",
        }}
      >
        <div className="container-main">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Building2
              size={48}
              style={{ color: "var(--accent-primary)" }}
            />
          </div>
          <h2
            style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 12 }}
          >
            Ready to Estimate Your Incentives?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: 480,
              margin: "0 auto 28px",
            }}
          >
            No sign-up required. Enter your investment details and get a complete
            breakdown in seconds.
          </p>
          <Link href="/calculator" className="btn-primary" style={{ padding: "14px 40px" }}>
            Start Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function BookOpen({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

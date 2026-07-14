"use client";

import { useState, useEffect, useMemo } from "react";
import { CalculateRequest, CalculateResponse } from "@/lib/types";
import { calculateIncentives } from "@/lib/api";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Cell,
  LabelList
} from "recharts";
import { Loader2, AlertTriangle } from "lucide-react";

export default function FinancialProjections({ 
  requestData, 
  response 
}: { 
  requestData: CalculateRequest | null, 
  response: CalculateResponse | null 
}) {
  // Sensitivity state
  const [sensitivityData, setSensitivityData] = useState<any[]>([]);
  const [loadingSensitivity, setLoadingSensitivity] = useState(false);
  const [sensitivityKeys, setSensitivityKeys] = useState<string[]>([]);

  // Desaturated Pastel Colors for Dark Theme (Professional Fintech Look)
  const COLORS = [
    "#a78bfa", // Muted Purple
    "#60a5fa", // Muted Blue
    "#34d399", // Muted Emerald
    "#fbbf24", // Muted Amber
    "#f472b6", // Muted Pink
    "#2dd4bf", // Muted Teal
    "#bef264", // Muted Lime
    "#fb7185", // Muted Rose
  ];

  useEffect(() => {
    if (sensitivityData.length === 0 && requestData) {
      const fetchSensitivity = async () => {
        setLoadingSensitivity(true);
        try {
          // Start close to 0 to eliminate empty voids on the left side of the chart
          const multipliers = [0.01, 0.25, 0.5, 0.75, 1, 1.5, 2.0];
          const keysSet = new Set<string>();
          
          const promises = multipliers.map(async (m) => {
            // Adjust new_machinery to simulate FCI change
            const newData = { ...requestData, new_machinery: requestData.new_machinery * m };
            const res = await calculateIncentives(newData);
            
            const dataPoint: any = {
              fci: res.fci_result.calculated_fci,
              multiplier: m
            };

            res.incentives.forEach(inc => {
              if (inc.eligible && inc.amount > 0) {
                dataPoint[inc.name] = inc.amount;
                keysSet.add(inc.name);
              }
            });
            return dataPoint;
          });
          const results = await Promise.all(promises);
          
          // Ensure all keys exist on all data points with at least 0
          const finalKeys = Array.from(keysSet);
          const formattedResults = results.map(r => {
            finalKeys.forEach(k => {
              if (r[k] === undefined) r[k] = 0;
            });
            return r;
          });

          setSensitivityKeys(finalKeys);
          setSensitivityData(formattedResults.sort((a, b) => a.fci - b.fci));
        } catch (err) {
          console.error("Failed to fetch sensitivity data", err);
        } finally {
          setLoadingSensitivity(false);
        }
      };
      fetchSensitivity();
    }
  }, [requestData, sensitivityData.length]);

  const formatCr = (val: number) => `₹${val.toFixed(2)} Cr`;
  const formatSmartTooltip = (val: number, name: string) => {
    const num = Number(val) || 0;
    if (num > 0 && num < 1) {
      return [`₹${(num * 100).toFixed(0)} Lakhs`, name];
    }
    return [formatCr(num), name];
  };

  // Waterfall Chart Preparation
  const waterfallData = useMemo(() => {
    if (!response || !requestData) return [];

    // 1. Gross Cost (FCI includes mach+bldg. If land_cost exists, add it if not in FCI)
    // Actually, land_cost is explicitly excluded from FCI.
    const grossCost = response.fci_result.calculated_fci + (requestData.land_cost || 0);
    
    // 2. Build Subsidies Array (stepping down)
    // Filter out 0 or extremely negligible amounts to reduce visual noise
    const activeSubsidies = response.incentives.filter(i => i.eligible && i.amount > 0.05);
    
    let currentTotal = grossCost;
    const wfData = [];
    
    // Push Gross Project Cost
    wfData.push({
      shortName: "Gross Cost",
      name: "Gross Investment",
      isGross: true,
      amount: grossCost,
      transparent: 0,
      visible: grossCost,
      color: "rgba(244, 63, 94, 1)", // Bright Rose/Red for emphasis
      valueLabel: formatCr(grossCost)
    });

    // Short name mapping for X-Axis to prevent diagonal text clutter
    const getShortName = (name: string) => {
      if (name.includes("Capital Subsidy")) return "Cap. Subsidy";
      if (name.includes("Additional CS")) return "Mega Bonus";
      if (name.includes("Interest")) return "Interest";
      if (name.includes("Electricity")) return "Electricity";
      if (name.includes("Lease")) return "Lease";
      if (name.includes("Stamp Duty")) return "Stamp Duty";
      if (name.includes("Land")) return "Land Subsidy";
      if (name.includes("Logistics")) return "Logistics";
      if (name.includes("EPF")) return "EPF";
      if (name.includes("Patent")) return "Patent";
      return name.split(" ")[0];
    };

    // Push each subsidy
    activeSubsidies.forEach(sub => {
      const start = currentTotal - sub.amount;
      wfData.push({
        shortName: getShortName(sub.name),
        name: sub.name,
        isSubsidy: true,
        amount: sub.amount,
        transparent: start,
        visible: sub.amount,
        color: "rgba(16, 185, 129, 0.5)", // Desaturated/Muted Emerald Green for steps
        valueLabel: `-${formatCr(sub.amount)}`
      });
      currentTotal = start;
    });

    // 3. Final Net Cost
    wfData.push({
      shortName: "Net Cost",
      name: "Effective Net Cost",
      isNet: true,
      amount: currentTotal,
      transparent: 0,
      visible: currentTotal,
      color: "rgba(6, 182, 212, 1)", // Bright Cyan-Blue for emphasis
      valueLabel: formatCr(currentTotal)
    });

    return wfData;
  }, [response, requestData]);

  if (!response || !response.disbursement_schedule || response.disbursement_schedule.length === 0) {
    return (
      <div className="card" style={{ padding: 24, height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
        No time-bound disbursement data available for this scenario.
      </div>
    );
  }

  const schedule = response.disbursement_schedule;
  const maxYears = Math.max(...schedule.map(s => s.years));
  const components = Array.from(new Set(schedule.map(s => s.component)));
  const primaryKey = components.find(c => c.includes("Capital Subsidy")) || components[0];
  const secondaryKeys = components.filter(c => c !== primaryKey);

  // Base Chart Data (Yearly Pivot)
  const chartData: any[] = [];
  
  for (let year = 1; year <= maxYears; year++) {
    const dataPoint: any = { year: `Year ${year}` };
    
    schedule.forEach(s => {
      if (year <= s.years) {
        dataPoint[s.component] = s.annual_amount;
      }
    });
    // Ensure 0 if no value
    components.forEach(c => {
      if (dataPoint[c] === undefined) dataPoint[c] = 0;
    });
    
    chartData.push(dataPoint);
  }

  // Custom Tooltip for Waterfall
  const WaterfallTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      // payload[0] is the transparent bar, payload[1] is the visible bar
      const data = payload[1]?.payload || payload[0]?.payload; 
      if (!data) return null;
      
      return (
        <div style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: 8, padding: "12px 16px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)", fontVariantNumeric: "tabular-nums" }}>
          <p style={{ margin: "0 0 8px 0", fontWeight: 600, color: "#f8fafc" }}>{data.name}</p>
          <p style={{ margin: 0, color: data.color, fontWeight: 700, fontSize: "1.05rem" }}>
            {data.isSubsidy ? "Subsidy Applied: " : ""}{data.valueLabel}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend for Area Chart
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "center",
        columnGap: "24px", 
        rowGap: "12px", 
        paddingTop: "16px",
        marginTop: "8px"
      }}>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 10, height: 10, backgroundColor: entry.color, borderRadius: 2 }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Custom Tooltip for Area Chart (Single Column Ledger Style)
  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // 1. Filter out zero values
      const activeSubsidies = payload.filter((entry: any) => entry.value > 0);
      
      // 2. Calculate total
      const total = activeSubsidies.reduce((sum: number, entry: any) => sum + entry.value, 0);

      return (
        <div style={{ 
          backgroundColor: "rgba(15, 23, 42, 0.95)", // bg-slate-900/95
          backdropFilter: "blur(8px)", 
          border: "1px solid rgba(255, 255, 255, 0.05)", 
          borderRadius: 8, 
          padding: "12px 16px", 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)", 
          minWidth: 250,
          fontVariantNumeric: "tabular-nums"
        }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: 700, color: "#f8fafc", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: 6 }}>
            FCI Simulated: {formatCr(label)}
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {activeSubsidies.map((entry: any, index: number) => (
              <div key={`item-${index}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#cbd5e1" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: entry.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem" }}>{entry.name}</span>
                </div>
                <span style={{ fontWeight: 600, color: "#f8fafc", fontSize: "0.85rem", whiteSpace: "nowrap", marginLeft: 16 }}>
                  {formatCr(entry.value)}
                </span>
              </div>
            ))}
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid rgba(255, 255, 255, 0.1)", color: "#f8fafc", fontWeight: 700 }}>
            <span style={{ fontSize: "0.9rem" }}>Total Payout</span>
            <span style={{ fontSize: "0.9rem" }}>{formatCr(total)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
      
      {/* TOP ROW: Disbursement & Sensitivity Area Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, width: "100%" }}>
        
        {/* CHART 1: Disbursement Timeline */}
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", border: "1px solid rgba(255, 255, 255, 0.03)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)", fontVariantNumeric: "tabular-nums" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Disbursement Timeline</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 20 }}>Year-over-year capital flow of core incentives.</p>
          <div style={{ flex: 1, minHeight: 450 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={{ stroke: "var(--border-primary)" }} tickLine={false} label={{ value: "Disbursement Year", position: "insideBottom", offset: -15, fill: "var(--text-secondary)", fontSize: 13 }} />
                <YAxis yAxisId="left" tickCount={6} tickFormatter={(val) => `₹${val}Cr`} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: "Capital Subsidy (₹ Cr)", angle: -90, position: "insideLeft", offset: -15, fill: "var(--text-secondary)", fontSize: 13, style: { textAnchor: 'middle' } }} />
                {secondaryKeys.length > 0 && (
                  <YAxis yAxisId="right" tickCount={6} orientation="right" tickFormatter={(val) => `₹${val.toFixed(2)}Cr`} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: "Other Subsidies (₹ Cr)", angle: 90, position: "insideRight", offset: -15, fill: "var(--text-secondary)", fontSize: 13, style: { textAnchor: 'middle' } }} />
                )}
                <Tooltip formatter={formatSmartTooltip} contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-secondary)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                <Bar yAxisId="left" dataKey={primaryKey} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                {secondaryKeys.map((k, i) => (
                  <Line key={k} yAxisId="right" type="monotone" dataKey={k} stroke={COLORS[(i + 1) % COLORS.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Capital Allocation Ledger (Waterfall) */}
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", border: "1px solid rgba(255, 255, 255, 0.03)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)", fontVariantNumeric: "tabular-nums" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Capital Allocation Ledger</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 20 }}>
            Nominal account bridging Gross Project Cost down to Effective Net Cost.
          </p>
          
          <div style={{ flex: 1, minHeight: 450 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterfallData}
                margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
                barCategoryGap="15%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fill: "var(--text-primary)", fontSize: 11, fontWeight: 600 }} 
                  axisLine={{ stroke: "var(--border-primary)" }} 
                  tickLine={false} 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  tickFormatter={(val) => `₹${val}Cr`} 
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<WaterfallTooltip />} cursor={{ fill: 'var(--border-primary)', opacity: 0.2 }} />
                
                <Bar dataKey="transparent" stackId="a" fill="rgba(0,0,0,0)" />
                <Bar dataKey="visible" stackId="a" radius={4}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="visible" fill="#ffffff" fontSize={11} position="top" formatter={(val: number) => val > 0 ? `₹${val.toFixed(2)}Cr` : ''} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Subsidy Composition Scale */}
      <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", border: "1px solid rgba(255, 255, 255, 0.03)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)", fontVariantNumeric: "tabular-nums" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Subsidy Composition Scale (Area Chart)</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 32, maxWidth: 800 }}>
          Visualizing policy caps and total payout distribution as Fixed Capital Investment grows.
        </p>
        
        <div style={{ height: 450, width: "100%" }}>
          {loadingSensitivity ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-primary)", marginBottom: 12, animation: "spin 1s linear infinite" }} />
              <p style={{ color: "var(--text-secondary)" }}>Simulating investment tiers...</p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensitivityData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis 
                  dataKey="fci" 
                  type="number" 
                  domain={[0, 'auto']} 
                  tickCount={6}
                  tickFormatter={(val) => `₹${val}Cr`} 
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
                  axisLine={{ stroke: "var(--border-primary)" }} 
                  tickLine={false}
                  height={50}
                  name="Fixed Capital Investment"
                  label={{ value: "Fixed Capital Investment (₹ Cr)", position: "insideBottom", offset: -5, fill: "var(--text-secondary)", fontSize: 13 }}
                />
                <YAxis 
                  tickFormatter={(val) => `₹${val}Cr`} 
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  label={{ value: "Cumulative Subsidy Payout (₹ Cr)", angle: -90, position: "insideLeft", offset: -15, fill: "var(--text-secondary)", fontSize: 13, style: { textAnchor: 'middle' } }}
                />
                <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: 'var(--border-primary)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Legend content={renderCustomLegend} />
                {sensitivityKeys.map((key, i) => (
                  <Area 
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.6}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
    </div>
  );
}

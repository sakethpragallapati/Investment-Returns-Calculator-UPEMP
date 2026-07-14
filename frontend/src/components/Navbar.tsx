"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Calculator, BarChart3, BookOpen } from "lucide-react";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: null },
    { href: "/calculator", label: "Calculator", icon: <Calculator size={16} /> },
    { href: "/policy-rules", label: "Policy Rules", icon: <BookOpen size={16} /> },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--glass-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-secondary)",
      }}
    >
      <div
        className="container-main"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--text-primary)",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--gradient-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 800,
            }}
          >
            UP
          </div>
          <span>UPEMC Calculator</span>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--bg-accent)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-card)",
              cursor: "pointer",
              color: "var(--text-secondary)",
              marginLeft: 8,
              transition: "all 0.2s ease",
            }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

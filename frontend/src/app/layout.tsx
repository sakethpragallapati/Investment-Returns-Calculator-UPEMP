import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "UPEMP 2020 Incentive Calculator",
  description:
    "Calculate all 13+ incentives under the UP Electronics Manufacturing Policy 2020. Get instant estimates for Capital Subsidy, Interest Subsidy, Land Subsidy, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 64px)" }}>{children}</main>
          <footer
            style={{
              padding: "32px 0",
              borderTop: "1px solid var(--border-secondary)",
              background: "var(--bg-secondary)",
            }}
          >
            <div
              className="container-main"
              style={{
                textAlign: "center",
                fontSize: "0.8rem",
                color: "var(--text-tertiary)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <p>
                Based on the UP Electronics Manufacturing Policy (UPEMP) 2020.
                All calculations are estimates only.
              </p>
              <p>
                Actual subsidy is subject to evaluation by Financial
                Institutions / Banks / Financial Consultants or a committee
                constituted by the State Government.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

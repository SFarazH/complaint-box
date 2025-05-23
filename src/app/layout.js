import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/auth-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pookie Complaint Box",
  description: "A cute complaint box for your special someone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#FDF2F8",
                  color: "#DB2777",
                  border: "1px solid #FBCFE8",
                  borderRadius: "12px",
                  padding: "16px",
                  fontWeight: "500",
                },
                success: {
                  iconTheme: {
                    primary: "#DB2777",
                    secondary: "#FDF2F8",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#E11D48",
                    secondary: "#FDF2F8",
                  },
                },
              }}
            />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

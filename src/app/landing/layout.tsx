import "@/styles/landing.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SenAI - Landing Page",
  description: "SenAI Landing page built with Next JS and Typescript",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-[#0a0a23] text-white">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

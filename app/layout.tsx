import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "人格光谱｜16 型人格倾向测试",
  description: "48 道原创题目，从四个维度量化你的自然偏好，并获得完整人格解析。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

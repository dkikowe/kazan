import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/admin/Sidebar";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Админ-панель",
  description: "Административная панель сайта",
};

// Указываем, что этот layout не должен наследовать корневой layout
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";
export const preferredRegion = "auto";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

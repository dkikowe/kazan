"use client";

import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Sidebar from "@/components/admin/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const token = Cookies.get("admin_token");
  const isLoginPage = pathname === "/admin";

  // Если это страница логина или нет токена, показываем только содержимое
  if (isLoginPage || !token) {
    return <>{children}</>;
  }

  // Иначе показываем полный layout с сайдбаром
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

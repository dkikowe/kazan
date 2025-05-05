"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  TagIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Главная", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Категории", href: "/admin/categories", icon: TagIcon },
  { name: "Экскурсии", href: "/admin/excursions", icon: CalendarIcon },

  { name: "Группы", href: "/admin/groups", icon: UserGroupIcon },
  {
    name: "Заявки",
    href: "/admin/bookings",
    icon: ClipboardDocumentCheckIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white w-64">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold">Админ-панель</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => (window.location.href = "/admin")}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
          Выйти
        </button>
      </div>
    </div>
  );
}

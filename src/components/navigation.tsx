"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, List, Home, Settings, Users } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Главное меню</SidebarGroupLabel>
        <SidebarMenu>
          <Link href="/admin">
            <SidebarMenuButton
              isActive={pathname === "/admin"}
              tooltip="Главная"
            >
              <Home className="h-4 w-4" />
              <span>Главная</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Экскурсии</SidebarGroupLabel>
        <SidebarMenu>
          <Link href="/admin/excursions">
            <SidebarMenuButton
              isActive={pathname === "/admin/excursions"}
              tooltip="Список экскурсий"
            >
              <List className="h-4 w-4" />
              <span>Список экскурсий</span>
            </SidebarMenuButton>
          </Link>
          <Link href="/admin/excursion-products">
            <SidebarMenuButton
              isActive={pathname === "/admin/excursion-products"}
              tooltip="Товары экскурсий"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Товары экскурсий</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Управление</SidebarGroupLabel>
        <SidebarMenu>
          <Link href="/admin/users">
            <SidebarMenuButton
              isActive={pathname === "/admin/users"}
              tooltip="Пользователи"
            >
              <Users className="h-4 w-4" />
              <span>Пользователи</span>
            </SidebarMenuButton>
          </Link>
          <Link href="/admin/settings">
            <SidebarMenuButton
              isActive={pathname === "/admin/settings"}
              tooltip="Настройки"
            >
              <Settings className="h-4 w-4" />
              <span>Настройки</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

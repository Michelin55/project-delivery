"use client"

import type * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, Home, LayoutDashboard, ListTodo, BarChart2 } from "lucide-react"

// Simplified AppSidebarProps as role/user selection is now in the main header
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentRole: "developer" | "project_manager" | "executive"
}

export function AppSidebar({ currentRole, ...props }: AppSidebarProps) {
  const navItems = {
    developer: [
      { title: "My Dashboard", icon: Home, url: "#" },
      { title: "My Tasks", icon: ListTodo, url: "#" },
    ],
    project_manager: [
      { title: "Dashboard", icon: LayoutDashboard, url: "#" },
      { title: "Projects Overview", icon: BarChart2, url: "#" },
      { title: "Milestones", icon: ListTodo, url: "#" },
    ],
    executive: [
      { title: "Executive Summary", icon: BarChart3, url: "#" },
      { title: "Project Performance", icon: BarChart2, url: "#" },
    ],
  }

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto py-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-6 lg:p-8 text-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems[currentRole].map((item) => (
                <SidebarMenuItem key={item.title} className="border-b border-white/30">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Removed Role/User Selectors and User Profile from here */}
        {/* These are now handled directly in app/page.tsx header for desktop */}
      </SidebarContent>
    </Sidebar>
  )
}

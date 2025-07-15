"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeveloperDashboard } from "../components/developer-dashboard.tsx"
import { ProjectManagerDashboard } from "../components/project-manager-dashboard.tsx"
import { ExecutiveDashboard } from "../components/executive-dashboard.tsx"
import { BarChart3 } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppSidebar } from "../components/app-sidebar.tsx" // Ensure this import is correct

export type Task = {
  id: number
  title: string
  description: string
  progress: number
  assignedTo: number
  dueDate: string
  milestoneId: number
}

export type Milestone = {
  id: number
  title: string
  projectId: number
  dueDate: string
  tasks: Task[]
}

export type Project = {
  id: number
  name: string
  description: string
  status: string
  milestones: Milestone[]
}

// Mock data
const initialData = {
  users: [
    { id: 1, name: "Alice Johnson", role: "developer", email: "alice@company.com" },
    { id: 2, name: "Bob Smith", role: "developer", email: "bob@company.com" },
    { id: 3, name: "Carol Davis", role: "developer", email: "carol@company.com" },
    { id: 4, name: "David Wilson", role: "project_manager", email: "david@company.com" },
    { id: 5, name: "Eva Brown", role: "executive", email: "eva@company.com" },
  ],
  projects: [
    {
      id: 1,
      name: "E-commerce Platform Redesign",
      description: "Complete overhaul of the customer-facing e-commerce platform",
      status: "active",
      milestones: [
        {
          id: 1,
          title: "UI/UX Design Phase",
          projectId: 1,
          dueDate: "2024-02-15",
          tasks: [
            {
              id: 1,
              title: "Create wireframes for product pages",
              description: "Design wireframes for all product listing and detail pages",
              progress: 85,
              assignedTo: 1,
              dueDate: "2024-02-10",
              milestoneId: 1,
            },
            {
              id: 2,
              title: "Design checkout flow",
              description: "Create user-friendly checkout process design",
              progress: 60,
              assignedTo: 2,
              dueDate: "2024-02-12",
              milestoneId: 1,
            },
            {
              id: 3,
              title: "Mobile responsive design",
              description: "Ensure all designs work perfectly on mobile devices",
              progress: 30,
              assignedTo: 1,
              dueDate: "2024-02-14",
              milestoneId: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Frontend Development",
          projectId: 1,
          dueDate: "2024-03-20",
          tasks: [
            {
              id: 4,
              title: "Implement product catalog",
              description: "Build the product listing and filtering functionality",
              progress: 45,
              assignedTo: 2,
              dueDate: "2024-03-05",
              milestoneId: 2,
            },
            {
              id: 5,
              title: "Shopping cart functionality",
              description: "Develop add to cart, remove items, and cart management",
              progress: 20,
              assignedTo: 3,
              dueDate: "2024-03-10",
              milestoneId: 2,
            },
            {
              id: 6,
              title: "Payment integration",
              description: "Integrate with payment gateway and handle transactions",
              progress: 0,
              assignedTo: 1,
              dueDate: "2024-03-18",
              milestoneId: 2,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Native mobile application for iOS and Android",
      status: "active",
      milestones: [
        {
          id: 3,
          title: "Core Features",
          projectId: 2,
          dueDate: "2024-03-30",
          tasks: [
            {
              id: 7,
              title: "User authentication system",
              description: "Implement login, registration, and password recovery",
              progress: 100,
              assignedTo: 3,
              dueDate: "2024-01-25",
              milestoneId: 3,
            },
            {
              id: 8,
              title: "Push notifications",
              description: "Set up push notification system for user engagement",
              progress: 75,
              assignedTo: 2,
              dueDate: "2024-02-20",
              milestoneId: 3,
            },
            {
              id: 9,
              title: "Offline data sync",
              description: "Enable app to work offline and sync when connected",
              progress: 40,
              assignedTo: 1,
              dueDate: "2024-03-25",
              milestoneId: 3,
            },
          ],
        },
        {
          id: 4,
          title: "Testing & Deployment",
          projectId: 2,
          dueDate: "2024-04-15",
          tasks: [
            {
              id: 10,
              title: "Unit testing implementation",
              description: "Write comprehensive unit tests for all components",
              progress: 25,
              assignedTo: 3,
              dueDate: "2024-04-05",
              milestoneId: 4,
            },
            {
              id: 11,
              title: "App store submission",
              description: "Prepare and submit app to iOS App Store and Google Play",
              progress: 0,
              assignedTo: 2,
              dueDate: "2024-04-12",
              milestoneId: 4,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Data Analytics Dashboard",
      description: "Internal dashboard for business intelligence and reporting",
      status: "active",
      milestones: [
        {
          id: 5,
          title: "Backend Infrastructure",
          projectId: 3,
          dueDate: "2024-02-28",
          tasks: [
            {
              id: 12,
              title: "Database schema design",
              description: "Design efficient database structure for analytics data",
              progress: 90,
              assignedTo: 1,
              dueDate: "2024-01-30",
              milestoneId: 5,
            },
            {
              id: 13,
              title: "API development",
              description: "Create RESTful APIs for data retrieval and manipulation",
              progress: 70,
              assignedTo: 3,
              dueDate: "2024-02-25",
              milestoneId: 5,
            },
            {
              id: 14,
              title: "Data processing pipeline",
              description: "Set up automated data processing and ETL workflows",
              progress: 55,
              assignedTo: 2,
              dueDate: "2024-02-26",
              milestoneId: 5,
            },
          ],
        },
      ],
    },
  ],
}

export default function ProjectDashboard() {
  const [data, setData] = useState(initialData)
  const [currentRole, setCurrentRole] = useState<"developer" | "project_manager" | "executive">("developer")
  const [currentUserId, setCurrentUserId] = useState(1)

  const currentUser = data.users.find((user) => user.id === currentUserId)
  const roleUsers = data.users.filter((user) => user.role === currentRole)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "developer":
        return "bg-blue-500"
      case "project_manager":
        return "bg-emerald-500"
      case "executive":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleRoleChange = (newRole: "developer" | "project_manager" | "executive") => {
    setCurrentRole(newRole)
    // Set the first user of the selected role as current user
    const firstUserOfRole = data.users.find((user) => user.role === newRole)
    if (firstUserOfRole) {
      setCurrentUserId(firstUserOfRole.id)
    }
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case "developer":
        return <DeveloperDashboard data={data} setData={setData} currentUserId={currentUserId} />
      case "project_manager":
        return <ProjectManagerDashboard data={data} setData={setData} />
      case "executive":
        return <ExecutiveDashboard data={data} />
      default:
        return <DeveloperDashboard data={data} setData={setData} currentUserId={currentUserId} />
    }
  }

  return (
    <SidebarProvider>
      {/* AppSidebar is now configured as an offcanvas mobile drawer */}
      <AppSidebar currentRole={currentRole} />
      <SidebarInset className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
        {/* Modern Header with Glass Effect */}
        <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-4">
                {/* SidebarTrigger for mobile view */}
                <SidebarTrigger className="md:hidden -ml-1" />
                
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Project Dashboard
                  </h1>
                  <p className="text-xs text-gray-500">Real-time project insights</p>
                </div>
              </div>

              {/* Navigation Controls for Desktop and Mobile */}
              <div className="flex items-center gap-3 flex-wrap justify-end">
                {/* Role Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 hidden sm:block">Role:</span>
                  <Select value={currentRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-36 h-9 border-gray-200 bg-white/50 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200 bg-white/95 backdrop-blur-md">
                      <SelectItem value="developer">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          Developer
                        </div>
                      </SelectItem>
                      <SelectItem value="project_manager">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          Manager
                        </div>
                      </SelectItem>
                      <SelectItem value="executive">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          Executive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Selector */}

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="block text-right">
                    <div className="text-sm font-medium text-gray-900">{currentUser?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{currentRole.replace("_", " ")}</div>
                  </div>
                  <div className="relative">
                    <div
                      className={`h-8 w-8 rounded-full ${getRoleColor(currentRole)} flex items-center justify-center ring-2 ring-white shadow-sm`}
                    >
                      <span className="text-xs font-medium text-white">
                        {currentUser?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content with Modern Layout */}
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">{renderDashboard()}</div>

       
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

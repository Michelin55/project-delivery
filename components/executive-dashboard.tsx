"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  Target,
  Zap,
  Activity,
} from "lucide-react"
import type { Project, Milestone } from "@/app/page"

interface ExecutiveDashboardProps {
  data: {
    users: any[]
    projects: Project[]
  }
}

export function ExecutiveDashboard({ data }: ExecutiveDashboardProps) {
  const calculateMilestoneProgress = (milestone: Milestone) => {
    if (milestone.tasks.length === 0) return 0
    const totalProgress = milestone.tasks.reduce((sum, task) => sum + task.progress, 0)
    return Math.round(totalProgress / milestone.tasks.length)
  }

  const calculateProjectProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0
    const totalProgress = project.milestones.reduce((sum, milestone) => sum + calculateMilestoneProgress(milestone), 0)
    return Math.round(totalProgress / project.milestones.length)
  }

  const getExecutiveMetrics = () => {
    const allTasks = data.projects.flatMap((p) => p.milestones.flatMap((m) => m.tasks))
    const allMilestones = data.projects.flatMap((p) => p.milestones)

    const completedTasks = allTasks.filter((t) => t.progress === 100).length
    const overdueTasks = allTasks.filter((t) => new Date(t.dueDate) < new Date() && t.progress < 100).length

    const deliveredMilestones = allMilestones.filter((m) => calculateMilestoneProgress(m) === 100).length

    const milestonesDeliveryRate =
      allMilestones.length > 0 ? Math.round((deliveredMilestones / allMilestones.length) * 100) : 0

    const averageProjectProgress =
      data.projects.length > 0
        ? Math.round(data.projects.reduce((sum, p) => sum + calculateProjectProgress(p), 0) / data.projects.length)
        : 0

    return {
      totalProjects: data.projects.length,
      totalMilestones: allMilestones.length,
      deliveredMilestones,
      milestonesDeliveryRate,
      totalTasks: allTasks.length,
      completedTasks,
      overdueTasks,
      averageProjectProgress,
      taskCompletionRate: allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0,
    }
  }

  const metrics = getExecutiveMetrics()

  // Enhanced chart data
  const projectProgressData = data.projects.map((project) => ({
    name: project.name.length > 20 ? project.name.substring(0, 20) + "..." : project.name,
    progress: calculateProjectProgress(project),
    milestones: project.milestones.length,
    completedMilestones: project.milestones.filter((m) => calculateMilestoneProgress(m) === 100).length,
  }))

  const taskStatusData = [
    { name: "Completed", value: metrics.completedTasks, color: "#10b981" }, // emerald-500
    {
      name: "In Progress",
      value: metrics.totalTasks - metrics.completedTasks - metrics.overdueTasks,
      color: "#3b82f6", // blue-500
    },
    { name: "Overdue", value: metrics.overdueTasks, color: "#ef4444" }, // red-500
  ]

  const milestoneStatusData = [
    { name: "Delivered", value: metrics.deliveredMilestones, color: "#10b981" }, // emerald-500
    { name: "In Progress", value: metrics.totalMilestones - metrics.deliveredMilestones, color: "#f59e0b" }, // amber-500
  ]

  // Team performance data
  const teamPerformanceData = data.users
    .filter((user) => user.role === "developer")
    .map((developer) => {
      const developerTasks = data.projects.flatMap((p) =>
        p.milestones.flatMap((m) => m.tasks.filter((t) => t.assignedTo === developer.id)),
      )
      const completedTasks = developerTasks.filter((t) => t.progress === 100).length
      const totalTasks = developerTasks.length
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      return {
        name: developer.name.split(" ")[0],
        completionRate,
        totalTasks,
        completedTasks,
      }
    })

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold">Executive Overview</h1>
              <p className="text-blue-100 text-sm lg:text-base">Strategic insights and performance metrics</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{metrics.averageProjectProgress}%</div>
                <div className="text-xs text-blue-200">Avg Progress</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Milestone Delivery</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{metrics.milestonesDeliveryRate}%</div>
            <p className="text-xs text-emerald-600 mt-1">
              {metrics.deliveredMilestones} of {metrics.totalMilestones} delivered
            </p>
            <div className="flex items-center pt-2">
              {metrics.milestonesDeliveryRate >= 70 ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`text-xs ml-1 font-medium ${metrics.milestonesDeliveryRate >= 70 ? "text-emerald-600" : "text-red-600"}`}
              >
                {metrics.milestonesDeliveryRate >= 70 ? "On track" : "At risk"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100/50 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Overdue Tasks</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{metrics.overdueTasks}</div>
            <p className="text-xs text-red-600 mt-1">
              {Math.round((metrics.overdueTasks / metrics.totalTasks) * 100)}% of total tasks
            </p>
            <div className="flex items-center pt-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600 ml-1 font-medium">Needs attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Project Progress</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{metrics.averageProjectProgress}%</div>
            <Progress value={metrics.averageProjectProgress} className="mt-2 h-2" />
            <p className="text-xs text-blue-600 mt-1">Across {metrics.totalProjects} projects</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Task Completion</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{metrics.taskCompletionRate}%</div>
            <p className="text-xs text-purple-600 mt-1">
              {metrics.completedTasks} of {metrics.totalTasks} completed
            </p>
            <div className="flex items-center pt-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-purple-600 ml-1 font-medium">Team efficiency</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Project Progress Chart */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Project Progress</CardTitle>
            <CardDescription className="text-gray-600">Current status across all active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "progress" ? `${value}%` : value,
                    name === "progress" ? "Progress" : "Milestones",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="progress" fill="url(#progressGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* purple-500 */}
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Task Distribution</CardTitle>
            <CardDescription className="text-gray-600">Overview of all tasks across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Team Performance</CardTitle>
            <CardDescription className="text-gray-600">Task completion rates by developer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "completionRate" ? `${value}%` : value,
                    name === "completionRate" ? "Completion Rate" : "Total Tasks",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="completionRate" fill="url(#teamGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="teamGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
                    <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Milestone Status */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Milestone Status</CardTitle>
            <CardDescription className="text-gray-600">Delivered vs In Progress milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={milestoneStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {milestoneStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Summary Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Project Summary</h3>
            <p className="text-sm text-gray-600 mt-1">Detailed overview of all active projects</p>
          </div>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {data.projects.length} Active Projects
          </Badge>
        </div>

        <div className="grid gap-6">
          {data.projects.map((project) => {
            const projectProgress = calculateProjectProgress(project)
            const completedMilestones = project.milestones.filter((m) => calculateMilestoneProgress(m) === 100).length
            const projectTasks = project.milestones.flatMap((m) => m.tasks)
            const overdueTasks = projectTasks.filter((t) => new Date(t.dueDate) < new Date() && t.progress < 100).length

            return (
              <Card
                key={project.id}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg font-bold text-gray-900">{project.name}</CardTitle>
                      <CardDescription className="text-gray-600">{project.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={projectProgress >= 70 ? "default" : "secondary"}
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {projectProgress}% Complete
                      </Badge>
                      {overdueTasks > 0 && (
                        <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                          {overdueTasks} Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Overall Progress</div>
                      <div className="relative h-3 bg-gray-200 rounded-full">
                        <Progress value={projectProgress} className="h-full absolute top-0 left-0" />
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${projectProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{projectProgress}% complete</div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Milestones</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {completedMilestones}/{project.milestones.length}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">milestones delivered</div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Tasks</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {projectTasks.filter((t) => t.progress === 100).length}/{projectTasks.length}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">tasks completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

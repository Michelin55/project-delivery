"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calendar, Clock, CheckCircle2, AlertCircle, PlayCircle, PauseCircle, TrendingUp, Target } from "lucide-react"
import type { Task, Project, Milestone } from "@/app/page"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox" // Import Checkbox
import { Label } from "@/components/ui/label" // Import Label for accessibility

interface DeveloperDashboardProps {
  data: {
    users: any[]
    projects: Project[]
  }
  setData: (data: any) => void
  currentUserId: number
}

export function DeveloperDashboard({ data, setData, currentUserId }: DeveloperDashboardProps) {
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const { toast } = useToast()

  // Get all tasks assigned to current user
  const myTasks = data.projects.flatMap((project) =>
    project.milestones.flatMap((milestone) =>
      milestone.tasks
        .filter((task) => task.assignedTo === currentUserId)
        .map((task) => ({
          ...task,
          projectName: project.name,
          milestoneName: milestone.title,
        })),
    ),
  )

  const getStatusInfo = (progress: number) => {
    if (progress === 0)
      return { label: "Not Started", color: "bg-gray-500", icon: PauseCircle, ring: "ring-gray-500/20" }
    if (progress < 50) return { label: "In Progress", color: "bg-blue-500", icon: PlayCircle, ring: "ring-blue-500/20" }
    if (progress < 100)
      return { label: "Almost Done", color: "bg-amber-500", icon: AlertCircle, ring: "ring-amber-500/20" }
    return { label: "Delivered", color: "bg-emerald-500", icon: CheckCircle2, ring: "ring-emerald-500/20" }
  }

  const updateTaskProgress = (taskId: number, newProgress: number) => {
    setData((prevData: any) => ({
      ...prevData,
      projects: prevData.projects.map((project: Project) => ({
        ...project,
        milestones: project.milestones.map((milestone: Milestone) => ({
          ...milestone,
          tasks: milestone.tasks.map((task: Task) => (task.id === taskId ? { ...task, progress: newProgress } : task)),
        })),
      })),
    }))
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const completedTasks = myTasks.filter((task) => task.progress === 100).length
  const inProgressTasks = myTasks.filter((task) => task.progress > 0 && task.progress < 100).length
  const overdueTasks = myTasks.filter((task) => isOverdue(task.dueDate) && task.progress < 100).length

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tasks</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{myTasks.length}</div>
            <p className="text-xs text-blue-600 mt-1">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Completed</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{completedTasks}</div>
            <p className="text-xs text-emerald-600 mt-1">Tasks delivered</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">In Progress</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{inProgressTasks}</div>
            <p className="text-xs text-amber-600 mt-1">Active work</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Overdue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{overdueTasks}</div>
            <p className="text-xs text-red-600 mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">Track and update your assigned work</p>
          </div>
          <Badge variant="outline" className="hidden sm:flex bg-gray-50 text-gray-700 border-gray-200">
            {myTasks.length} tasks
          </Badge>
        </div>

        {myTasks.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No tasks assigned</p>
              <p className="text-sm text-gray-400 mt-1">Check back later for new assignments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:gap-6">
            {myTasks.map((task) => {
              const statusInfo = getStatusInfo(task.progress)
              const StatusIcon = statusInfo.icon
              const isTaskOverdue = isOverdue(task.dueDate) && task.progress < 100

              return (
                <Card
                  key={task.id}
                  className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    isTaskOverdue
                      ? "border-red-200 bg-gradient-to-r from-red-50/50 to-transparent"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">{task.title}</CardTitle>
                          <div className={`h-2 w-2 rounded-full ${statusInfo.color} ring-4 ${statusInfo.ring}`} />
                        </div>
                        <CardDescription className="text-gray-600 line-clamp-2">{task.description}</CardDescription>

                        {/* Task Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className={isTaskOverdue ? "text-red-600 font-medium" : ""}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1">
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-700 font-medium">{task.projectName}</span>
                          </div>
                          <div className="hidden md:flex items-center gap-1">
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-700 font-medium">{task.milestoneName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${statusInfo.color} text-white shadow-sm`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        {isTaskOverdue && (
                          <Badge variant="destructive" className="text-xs bg-red-50 text-red-700 border-red-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">{task.progress}%</span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full">
                        <Progress value={task.progress} className="h-full absolute top-0 left-0" />
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`task-${task.id}-complete`}
                          checked={task.progress === 100}
                          onCheckedChange={(checked) => {
                            updateTaskProgress(task.id, checked ? 100 : 0)
                            toast({
                              title: checked ? "Task completed!" : "Task marked as incomplete.",
                              description: checked
                                ? "Congratulations on finishing this task."
                                : "Task progress reset to 0%.",
                            })
                          }}
                          disabled={editingTask === task.id} // Disable checkbox when slider is open
                        />
                        <Label
                          htmlFor={`task-${task.id}-complete`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as Complete
                        </Label>
                      </div>

                      {editingTask === task.id ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingTask(null)
                            toast({
                              title: "Task progress updated.",
                              description: "Your changes have been saved.",
                            })
                          }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                        >
                          Save Changes
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTask(task.id)}
                          disabled={task.progress === 100} // Disable if already 100% and checkbox is checked
                          className="border-gray-300 hover:bg-gray-50 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors"
                        >
                          Adjust Progress
                        </Button>
                      )}
                    </div>

                    {editingTask === task.id && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Update Progress</label>
                          <Slider
                            value={[task.progress]}
                            onValueChange={(value) => updateTaskProgress(task.id, value[0])}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

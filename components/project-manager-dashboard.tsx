"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BarChart3, CheckCircle2, Clock, AlertTriangle, Target, Zap, Loader2 } from "lucide-react"
import type { Project, Milestone } from "@/app/page"
import { useToast } from "@/components/ui/use-toast"

interface ProjectManagerDashboardProps {
  data: {
    users: any[]
    projects: Project[]
  }
  setData: (data: any) => void
}

export function ProjectManagerDashboard({ data, setData }: ProjectManagerDashboardProps) {
  const [newTaskDialog, setNewTaskDialog] = useState(false)
  const [newMilestoneDialog, setNewMilestoneDialog] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const { toast } = useToast()

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    milestoneId: 1,
  })

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    projectId: 1,
    dueDate: "",
  })

  const developers = data.users.filter((user) => user.role === "developer")

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

  const addTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the task.",
        variant: "destructive",
      })
      return
    }

    setIsAddingTask(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const taskId = Math.max(...data.projects.flatMap((p) => p.milestones.flatMap((m) => m.tasks.map((t) => t.id)))) + 1

    setData((prevData: any) => ({
      ...prevData,
      projects: prevData.projects.map((project: Project) => ({
        ...project,
        milestones: project.milestones.map((milestone: Milestone) =>
          milestone.id === newTask.milestoneId
            ? {
                ...milestone,
                tasks: [
                  ...milestone.tasks,
                  {
                    id: taskId,
                    title: newTask.title,
                    description: newTask.description,
                    progress: 0,
                    assignedTo: Number.parseInt(newTask.assignedTo),
                    dueDate: newTask.dueDate,
                    milestoneId: newTask.milestoneId,
                  },
                ],
              }
            : milestone,
        ),
      })),
    }))

    setNewTask({ title: "", description: "", assignedTo: "", dueDate: "", milestoneId: 1 })
    setNewTaskDialog(false)
    setIsAddingTask(false)

    toast({
      title: "Task created.",
      description: "Your task has been successfully created.",
    })
  }

  const addMilestone = async () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the milestone.",
        variant: "destructive",
      })
      return
    }

    setIsAddingMilestone(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const milestoneId = Math.max(...data.projects.flatMap((p) => p.milestones.map((m) => m.id))) + 1

    setData((prevData: any) => ({
      ...prevData,
      projects: prevData.projects.map((project: Project) =>
        project.id === newMilestone.projectId
          ? {
              ...project,
              milestones: [
                ...project.milestones,
                {
                  id: milestoneId,
                  title: newMilestone.title,
                  projectId: newMilestone.projectId,
                  dueDate: newMilestone.dueDate,
                  tasks: [],
                },
              ],
            }
          : project,
      ),
    }))

    setNewMilestone({ title: "", projectId: 1, dueDate: "" })
    setNewMilestoneDialog(false)
    setIsAddingMilestone(false)

    toast({
      title: "Milestone created.",
      description: "Your milestone has been successfully created.",
    })
  }

  const getOverallStats = () => {
    const allTasks = data.projects.flatMap((p) => p.milestones.flatMap((m) => m.tasks))
    const completedTasks = allTasks.filter((t) => t.progress === 100).length
    const overdueTasks = allTasks.filter((t) => new Date(t.dueDate) < new Date() && t.progress < 100).length
    const totalMilestones = data.projects.flatMap((p) => p.milestones).length
    const completedMilestones = data.projects
      .flatMap((p) => p.milestones)
      .filter((m) => calculateMilestoneProgress(m) === 100).length

    return {
      totalTasks: allTasks.length,
      completedTasks,
      overdueTasks,
      totalMilestones,
      completedMilestones,
    }
  }

  const stats = getOverallStats()

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Projects</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{data.projects.length}</div>
            <p className="text-xs text-purple-600 mt-1">Active projects</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tasks</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalTasks}</div>
            <p className="text-xs text-blue-600 mt-1">All assignments</p>
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
            <div className="text-2xl font-bold text-emerald-900">{stats.completedTasks}</div>
            <p className="text-xs text-emerald-600 mt-1">Tasks done</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Overdue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.overdueTasks}</div>
            <p className="text-xs text-red-600 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Milestones</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {stats.completedMilestones}/{stats.totalMilestones}
            </div>
            <p className="text-xs text-amber-600 mt-1">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Modern Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Dialog open={newMilestoneDialog} onOpenChange={setNewMilestoneDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Create New Milestone</DialogTitle>
              <DialogDescription className="text-gray-600">
                Add a new milestone to track project progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="milestone-title" className="text-sm font-medium text-gradient-blue-purple">
                  Milestone Title
                </Label>
                <Input
                  id="milestone-title"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="Enter milestone name"
                  className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="milestone-project" className="text-sm font-medium text-gradient-blue-purple">
                  Project
                </Label>
                <Select
                  value={newMilestone.projectId.toString()}
                  onValueChange={(value) => setNewMilestone({ ...newMilestone, projectId: Number.parseInt(value) })}
                >
                  <SelectTrigger
                    id="milestone-project"
                    className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                  >
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    {data.projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="milestone-due" className="text-sm font-medium text-gradient-blue-purple">
                  Due Date
                </Label>
                <Input
                  id="milestone-due"
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={addMilestone}
                disabled={isAddingMilestone}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
              >
                {isAddingMilestone ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Milestone"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent text-gray-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Create New Task</DialogTitle>
              <DialogDescription className="text-gray-600">Assign a new task to a team member.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="task-title" className="text-sm font-medium text-gradient-blue-purple">
                  Task Title
                </Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task name"
                  className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="task-description" className="text-sm font-medium text-gradient-blue-purple">
                  Description
                </Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the task"
                  className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="task-milestone" className="text-sm font-medium text-gradient-blue-purple">
                  Milestone
                </Label>
                <Select
                  value={newTask.milestoneId.toString()}
                  onValueChange={(value) => setNewTask({ ...newTask, milestoneId: Number.parseInt(value) })}
                >
                  <SelectTrigger
                    id="task-milestone"
                    className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                  >
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    {data.projects.flatMap((project) =>
                      project.milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id.toString()}>
                          {project.name} - {milestone.title}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-assignee" className="text-sm font-medium text-gradient-blue-purple">
                  Assign to
                </Label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                >
                  <SelectTrigger
                    id="task-assignee"
                    className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                  >
                    <SelectValue placeholder="Select developer" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id.toString()}>
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due" className="text-sm font-medium text-gradient-blue-purple">
                  Due Date
                </Label>
                <Input
                  id="task-due"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 border-transparent bg-gradient-to-br from-blue-50 to-purple-50/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all duration-200"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={addTask}
                disabled={isAddingTask}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
              >
                {isAddingTask ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modern Tabs */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 bg-gray-100 rounded-lg p-1 shadow-inner">
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=active]:font-semibold transition-all duration-200 text-gray-600"
          >
            Projects Overview
          </TabsTrigger>
          <TabsTrigger
            value="milestones"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=active]:font-semibold transition-all duration-200 text-gray-600"
          >
            Milestone Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-6">
            {data.projects.map((project) => {
              const projectProgress = calculateProjectProgress(project)
              const completedMilestones = project.milestones.filter((m) => calculateMilestoneProgress(m) === 100).length

              return (
                <Card
                  key={project.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold text-gray-900">{project.name}</CardTitle>
                        <CardDescription className="text-gray-600">{project.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {completedMilestones}/{project.milestones.length} Milestones
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-bold text-gray-900">{projectProgress}%</span>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full">
                        <Progress value={projectProgress} className="h-full absolute top-0 left-0" />
                        <div
                          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${projectProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {project.milestones.map((milestone) => {
                        const milestoneProgress = calculateMilestoneProgress(milestone)
                        return (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
                          >
                            <div className="space-y-1 flex-1">
                              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                              <p className="text-sm text-gray-500">
                                {milestone.tasks.length} tasks • Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{milestoneProgress}%</div>
                                <Progress value={milestoneProgress} className="w-20 h-1.5 mt-1" />
                              </div>
                              {milestoneProgress === 100 && (
                                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div className="grid gap-6">
            {data.projects.flatMap((project) =>
              project.milestones.map((milestone) => {
                const milestoneProgress = calculateMilestoneProgress(milestone)
                const overdueTasks = milestone.tasks.filter(
                  (t) => new Date(t.dueDate) < new Date() && t.progress < 100,
                ).length

                return (
                  <Card
                    key={milestone.id}
                    className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg font-bold text-gray-900">{milestone.title}</CardTitle>
                          <CardDescription>
                            <span className="font-medium text-gray-700">{project.name}</span> • Due:{" "}
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={milestoneProgress === 100 ? "default" : "secondary"}
                            className="bg-emerald-50 text-emerald-700 border-emerald-200" // Consistent emerald color
                          >
                            {milestoneProgress}% Complete
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
                      <div className="space-y-3">
                        {milestone.tasks.map((task) => {
                          const assignedUser = data.users.find((u) => u.id === task.assignedTo)
                          const isOverdue = new Date(task.dueDate) < new Date() && task.progress < 100

                          return (
                            <div
                              key={task.id}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 shadow-sm ${
                                isOverdue
                                  ? "border-red-200 bg-gradient-to-r from-red-50/50 to-transparent"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="space-y-1 flex-1">
                                <h5 className="font-medium text-gray-900">{task.title}</h5>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">{assignedUser?.name}</span> • Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900">{task.progress}%</div>
                                  <Progress value={task.progress} className="w-16 h-1.5 mt-1" />
                                </div>
                                {isOverdue && (
                                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-red-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              }),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

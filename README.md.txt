 Project Delivery Status Dashboard
A role-based internal dashboard built with Next.js,  Tailwind CSS and shadcn/ui  to visualize project delivery status. Supports three user views: Developer, Project Manager, and Executive— each with tailored functionality and data representation.
Setup Instructions
1. **Clone the repository**
```bash
git clone https://github.com/your-username/project-dashboard.git
cd project-dashboard
2, Install dependencies
npm install
# or
yarn install
3. Start the development server
npm run dev
# or
yarn dev
4.Open in browser
Visit: http://localhost:3000
Design Decisions & Assumptions
📐 Architecture
- Separated dashboards for each role (developer, project_manager, executive)
- Local state management using useState for simulating updates
- Static JSON structure mimics Projects → Milestones → Tasks
 UI/UX
- Used shadcn/ui components and TailwindCSS for a consistent, modern interface
- Role-switching handled via header toggle
- Status indicators, progress bars, and color-coded cards enhance readability
- Responsive layout across devices
Assumptions
- Fixed roles (no auth logic)
- Static, in-memory data only (no backend or persistence)
- Milestone progress is averaged from task completion
- Limited to 3 projects for demonstration clarity
AI Prompts Used
✅ Successful Prompts
“Hi! I’m building a Project Delivery Status Dashboard using ReactJS and I’d love your help designing and structuring the frontend. Goal:Create a role-based dashboard for internal project tracking that reflects milestone and task statuses. This will serve three different user types: Developer, Project Manager, and Executive.No backend is needed. All data should be stored in memory as a static JSON object, but I want to simulate dynamic behavior (e.g., task creation and updates during the session). and Here's how each user role should work:1. Developer ViewDisplay a list of assigned tasks.Each task shows:TitleDescriptionProgress bar (0–100%)Status label based on progress:0% = Not Started1–49% = In Progress50–99% = Almost Done100% = DeliveredDue dateDevelopers can update task progress in real-time (local state only).2. Project Manager ViewSee all projects and their milestones.Each milestone:Has a title and overall progress based on task completion.Includes tasks that can be assigned to developers.PMs can:Add/edit tasks and milestonesAssign tasks to developersView summary by project3. Executive ViewRead-only dashboard for project summaries.Key metrics include:% of delivered milestonesNumber of overdue tasksVisual charts (progress bars, pie charts, KPI cards)Focus on clarity and quick insight act as a frontend developer”
→ Resulted in the initial layout and component plan.

“Let the responsive navigation design for a project delivery status dashboard that adapts based on screen size:Mobile View (≤700px):Show a hamburger menu icon on the top-left corner.When tapped, the menu should slide in from the left (drawer-style) containing navigation links (e.g., Developer View, PM View, Executive View).Ensure smooth animation and accessible toggle button.Tablet & Desktop View (>768px):Display the navigation links openly (either horizontally on the top or vertically on the left).No toggle button needed — the full menu should be visible by default.Navigation Behavior:The layout must remain clean and readable.The role views (Developer, PM, Executive) should be clearly selectable.The navigation component should be reusable across pages.Bonus Details to Include:Use icons for each role for better visual cues.Keep menu persistent on desktop but closable on mobile.Follow modern design standards (e.g., Material UI, Tailwind CSS, or ShadCN)”
→ This refined setup ensures a highly responsive, intuitive, and visually appealing navigation experience for your Project Delivery Status Dashboard..

“Style sidebar menu items with gradient hover, full-row highlight, and bottom border separators.”
→ Improved sidebar interaction and clarity.
"Enhance the dashboard with modern UI structure and responsive design patterns. Let me update the components with contemporary design principles.

```Update the `DeveloperDashboard` to replace the "Mark Complete" button with a more intuitive checkbox for task completion and adjust the UI for a cleaner look. I'll also ensure the "Add Milestone" and "Add Task" buttons in the `ProjectManagerDashboard` maintain a consistent, modern gradient style."
 →Checkbox was added next to each task, allowing users to directly mark a task as 100% complete or incomplete.
 "Update Progress" button will now be labeled "Adjust Progress" and will reveal the slider for granular progress control. The "Mark Complete" button inside the slider section will be removed as its functionality is now handled by the checkbox..
❌ Failed Prompt
“build a role-based frontend Project Delivery Status Dashboard using React with local static JSON (no backend). It supports Developers, Project Managers, and Executives, each with different views and permissions with component structure and reusability , use context, reducer, or a state library Role-based rendering best practices.How to cleanly simulate dynamic task creation and milestone updates using static in-memory data. UX ideas to improve clarity of milestone status (e.g., 0–100% progress → status labels)Any missed edge cases, accessibility gaps, or patterns to better simulate a real-world dashboard?"
Why it failed: Too Broad and Overloaded
This prompt asks for too many unrelated things at once, including:
App structure and architecture, State management strategy, Role-based access patterns, UX improvements, Simulated interactivity, Accessibility patterns, Edge case analysis
❗ AI tools (like vo.dev or ChatGPT) work best with focused, atomic prompts. Mixing design, logic, architecture, UX, and auditing in one shot overwhelms the model and returns either incomplete output or generic advice.
💬 Reflection Questions
1. What was the most challenging part?
Although i can't really say a challenge but i would say quality constructive prompt.
2. How did you ensure role-specific needs were met?
- Mapped role expectations:
- Developer: task tracking & updates
- PM: full CRUD control and progress oversight
- Executive: KPIs, charts, and summaries
- Each view was tailored accordingly.

3. What would you improve with more time?
- Add drag-and-drop task reordering
- Implement Gantt chart views
- Support custom dashboards per user
- Add offline support & mobile optimization
4. How would you scale it for enterprise?
- integrate backend API with database
- Add auth & RBAC per user
- Implement state libraries 
- Use pagination, real-time sync, and caching
🛠️ Tech Stack
Framework: Next.js 14 (App Router)
Language: Javascript
UI: shadcn/ui + TailwindCSS
Charts: Recharts
Icons: Lucide React
State: React hooks
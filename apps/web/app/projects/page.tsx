import { ProjectCard } from "@/components/dashboard/project-card"
import { SearchBar } from "@/components/dashboard/search-bar"
import { SubNav } from "@/components/dashboard/sub-nav"
import { TopNav } from "@/components/dashboard/top-nav"

// 示例项目数据
const projects = [
  {
    id: "1",
    name: "mouse-coding",
    url: "mc-ipl.dev",
    status: "success" as const,
    updatedAt: "2小时前",
    updatedBy: "main",
  },
  {
    id: "2",
    name: "qwerty-learner",
    url: "qwerty-learner-snowy-six.vercel.app",
    status: "success" as const,
    updatedAt: "3月23日",
    updatedBy: "main",
  },
  {
    id: "3",
    name: "dashboard-ui",
    url: "dashboard-ui.vercel.app",
    status: "success" as const,
    updatedAt: "1天前",
    updatedBy: "main",
  },
  {
    id: "4",
    name: "api-service",
    url: "api-service.vercel.app",
    status: "error" as const,
    updatedAt: "3小时前",
    updatedBy: "dev",
  },
  {
    id: "5",
    name: "marketing-site",
    url: "marketing-site.vercel.app",
    status: "success" as const,
    updatedAt: "1周前",
    updatedBy: "main",
  },
  {
    id: "6",
    name: "docs-portal",
    url: "docs-portal.vercel.app",
    status: "success" as const,
    updatedAt: "2天前",
    updatedBy: "main",
  },
]

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <SubNav />
      <SearchBar />

      <div className="p-4">
        <h2 className="mb-4 text-lg font-medium">项目</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "概览", href: "/dashboard" },
  { name: "集成", href: "/dashboard/integrations" },
  { name: "活动", href: "/dashboard/activity" },
  { name: "域名", href: "/dashboard/domains" },
  { name: "使用情况", href: "/dashboard/usage" },
  { name: "监控", href: "/dashboard/monitoring" },
  { name: "可观测性", href: "/dashboard/observability" },
  { name: "存储", href: "/dashboard/storage" },
  { name: "标记", href: "/dashboard/flags" },
  { name: "AI", href: "/dashboard/ai" },
  { name: "支持", href: "/dashboard/support" },
  { name: "设置", href: "/dashboard/settings" },
]

export function SubNav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-border">
      <nav className="flex overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center border-b-2 px-4 text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "border-primary text-primary" : "border-transparent text-muted-foreground",
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

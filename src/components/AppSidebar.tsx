import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, LayoutDashboard, PenLine, Settings, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Sparkles },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "New entry", url: "/editor/new", icon: PenLine },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-sage flex items-center justify-center shadow-soft shrink-0">
            <BookOpen className="h-4.5 w-4.5 text-foreground" strokeWidth={2} />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-lg text-ink">My Diary</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">est. today</span>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              Journal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} className="rounded-xl">
                    <NavLink
                      to={item.url}
                      className={({ isActive: a }) =>
                        `flex items-center gap-3 px-3 py-2.5 transition-colors ${
                          a ? "bg-sage-soft text-ink font-medium" : "text-ink-muted hover:text-ink hover:bg-muted"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="p-4">
          <div className="rounded-2xl bg-beige-soft p-4 border border-border/50">
            <p className="font-serif text-sm text-ink leading-snug">
              "Write hard and clear about what hurts."
            </p>
            <p className="text-[11px] text-ink-muted mt-2">— Hemingway</p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

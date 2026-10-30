import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Building2,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  FileStack,
  Globe2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/admin/applications", label: "طلبات التقديم", icon: FileStack },
  { to: "/admin/universities", label: "الجامعات", icon: GraduationCap },
  { to: "/admin/institutes", label: "المعاهد", icon: Building2 },
  { to: "/admin/countries", label: "الدول", icon: Globe2 },
  { to: "/admin/programs", label: "التخصصات", icon: BookOpen },
  { to: "/admin/faq", label: "الأسئلة الشائعة", icon: MessageSquare },
  { to: "/admin/gallery", label: "معرض الطلاب", icon: Images },
  { to: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
];

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition",
              isActive
                ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )
          }
        >
          <link.icon className="h-4 w-4 shrink-0" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // دالة معالجة تسجيل الخروج للتأكد من تنظيف الجلسة وإعادة التوجيه
  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5" dir="rtl">
        <div className="max-w-md rounded-[var(--radius)] border border-border/70 bg-card p-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-primary">لوحة الإدارة خاصة بالمشرفين</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            الحساب الحالي لا يملك صلاحية الوصول. سجّل الدخول بحساب مشرف، أو تواصل مع مالك المكتب لمنحك الصلاحية.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button asChild className="bg-primary">
              <Link to="/">العودة إلى الموقع</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="ms-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar p-4 lg:flex border-l border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border bg-white shadow-sm">
              <img
                src="/logo.jpeg"
                alt="لوحة شكور"
                className="h-full w-full object-contain [image-rendering:-webkit-optimize-contrast]"
              />
            </div>
            <span className="leading-tight text-right">
              <span className="block font-heading text-sm font-bold text-sidebar-foreground">لوحة شكور</span>
              <span className="block text-[10px] text-sidebar-foreground/60">إدارة المحتوى والطلبات</span>
            </span>
          </Link>

          <div className="mt-4 flex-1 overflow-y-auto no-scrollbar">
            <SidebarLinks />
          </div>

          <div className="mt-2 border-t border-sidebar-border pt-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              عرض الموقع
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              تسجيل الخروج
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur lg:px-8">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-sidebar p-4" dir="rtl">
                  <div className="mt-6 flex flex-col gap-1 text-right">
                    <SidebarLinks onNavigate={() => setOpen(false)} />
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground mt-4 border-t border-sidebar-border pt-3"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      تسجيل الخروج
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
              <span className="font-heading text-sm font-bold text-primary">مرحبًا، {user.full_name || user.name || "مشرف"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/" target="_blank">
                  <ExternalLink className="ms-1.5 h-3.5 w-3.5" />
                  معاينة الموقع
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => navigate("/")}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="p-4 lg:p-8 text-right">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
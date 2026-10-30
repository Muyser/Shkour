import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogIn, Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, waLink } from "@/lib/site";

// مكون شعار الهوية (مكون داخلي للملف)
function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <img
          src="/logo.jpeg"
          alt="مكتب شكور"
          className="h-full w-full object-contain [image-rendering:-webkit-optimize-contrast]"
        />
      </div>
      <span className="leading-tight text-right">
        <span className="block font-heading text-base sm:text-lg font-bold text-slate-900">شكور</span>
        <span className="block text-[10px] sm:text-[11px] tracking-wide text-slate-500">
          للتقديمات التعليمية
        </span>
      </span>
    </Link>
  );
}

// التصدير الافتراضي الوحيد لملف الهيدر
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md" dir="rtl">
      <div className="container-page flex h-16 sm:h-[76px] items-center justify-between gap-4">
        <Brand />

        {/* قائمة التنقل الرئيسية */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "font-bold text-[#0d8274]"
                    : "text-slate-700 hover:text-[#0d8274]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* أزرار الإجراءات على اليسار */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* زر تسجيل الدخول */}
          <Button asChild variant="ghost" size="sm" className="hidden rounded-full text-slate-700 hover:text-[#0d8274] md:inline-flex">
            <Link to="/login?returnTo=/admin">
              <LogIn className="me-1.5 h-4 w-4" />
              تسجيل الدخول
            </Link>
          </Button>

          {/* زر التواصل عبر الواتساب (مخفي في الهواتف الصغيرة) */}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#20bd5a] transition duration-200"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* قائمة الموبايل Sidebar */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu className="h-5 w-5 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[300px] bg-white p-5 sm:p-6" dir="rtl">
              <div className="mt-2 flex flex-col gap-1">
                <Brand />
                <div className="my-4 h-px bg-slate-100" />
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#0d8274]/10 font-bold text-[#0d8274]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full rounded-2xl">
                    <Link to="/login?returnTo=/admin" onClick={() => setOpen(false)}>
                      <LogIn className="me-2 h-4 w-4" />
                      تسجيل الدخول
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-2xl bg-[#0d8274] text-white hover:bg-[#0b6e62]">
                    <Link to="/universities" onClick={() => setOpen(false)}>
                      ابدأ التقديم الآن
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
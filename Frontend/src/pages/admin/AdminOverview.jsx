import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Loader2 } from "lucide-react";
import StatusBadge from "@/components/site/StatusBadge";
import { formatDate } from "@/lib/site";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CARDS = [
  { key: "applications", label: "إجمالي الطلبات", tone: "bg-primary text-primary-foreground" },
  { key: "new", label: "طلبات جديدة", tone: "bg-gold/15 text-gold-foreground" },
  { key: "reviewing", label: "قيد المراجعة", tone: "bg-secondary text-primary" },
  { key: "accepted", label: "طلبات مقبولة", tone: "bg-mint text-mint-foreground" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${API_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "فشل تحميل إحصائيات لوحة التحكم");
        }

        setStats(data.stats);
        setRecent(data.recent);
        setNotifications(data.notifications);
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="mr-2 text-sm text-muted-foreground">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-right" dir="rtl">
        خطأ: {error}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary">نظرة عامة</h1>
        <p className="mt-1 text-xs text-muted-foreground">ملخص سريع لحالة الموقع وطلبات الطلاب من قاعدة البيانات.</p>
      </div>

      {/* بطاقات الإحصائيات الرئيسية - 2 في كل صف على الهواتف المحمولة */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card.key} className={`rounded-2xl p-3.5 sm:p-5 ${card.tone}`}>
            <p className="text-[11px] sm:text-xs opacity-80">{card.label}</p>
            <p className="mt-1 sm:mt-2 font-heading text-xl sm:text-3xl font-bold">{stats?.[card.key] || 0}</p>
          </div>
        ))}
      </div>

      {/* بطاقات البيانات الإضافية - 2 في كل صف على الهواتف المحمولة */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {[
          { label: "المؤسسات", value: stats?.institutions },
          { label: "الدول", value: stats?.countries },
          { label: "التخصصات", value: stats?.programs },
          { label: "الخدمات", value: stats?.services },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-3.5 sm:p-5 shadow-sm">
            <p className="text-[11px] sm:text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-heading text-lg sm:text-2xl font-bold text-primary">{item.value || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm sm:text-base font-bold text-primary">أحدث الطلبات</h2>
            <Link to="/admin/applications" className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-gold-foreground">
              كل الطلبات
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
          <div className="mt-3 sm:mt-4 divide-y divide-border/70">
            {recent.length ? (
              recent.map((item) => (
                <Link
                  key={item.id}
                  to={`/admin/applications/${item.id}`}
                  className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3 transition hover:bg-secondary/40 rounded-xl px-1"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-medium text-primary">{item.student_name}</p>
                    <p className="truncate text-[10px] sm:text-[11px] text-muted-foreground">
                      {item.institution_name} · {item.program || "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-[10px] text-muted-foreground">{formatDate(item.created_date)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="py-6 text-center text-xs sm:text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-sm sm:text-base font-bold text-primary">
            <Bell className="h-4 w-4 text-gold" />
            الإشعارات
          </h2>
          <div className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
            {notifications.length ? (
              notifications.map((item) => (
                <div key={item.id} className="rounded-2xl bg-secondary/50 p-3">
                  <p className="text-xs font-semibold text-primary">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{item.body}</p>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-muted-foreground">لا توجد إشعارات.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
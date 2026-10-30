import { useEffect, useState } from "react";
import { Loader2, Save, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FIELDS = [
  { name: "whatsapp_number", label: "رقم واتساب (بصيغة دولية بدون +)", ltr: true, help: "يُستخدم في كل أزرار واتساب بالموقع." },
  { name: "phone", label: "رقم الهاتف", ltr: true },
  { name: "email", label: "البريد الإلكتروني", ltr: true },
];

const DEFAULTS = {
  whatsapp_number: "250794420606",
  phone: "",
  email: "",
};

export default function AdminSettings() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // حالات نموذج تغيير كلمة المرور
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [changingPass, setChangingPass] = useState(false);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        const existing = data?.items?.[0] || null;
        if (existing) {
          setForm({
            whatsapp_number: existing.whatsapp_number || "250794420606",
            phone: existing.phone || "",
            email: existing.email || "",
          });
        }
      })
      .catch(() => {
        toast({ title: "خطأ", description: "فشل تحميل الإعدادات", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "فشل الحفظ");

      toast({ title: "نجاح", description: "تم حفظ الإعدادات بنجاح" });
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({ title: "تنبيه", description: "الرجاء إدخال كلمة المرور الحالية والجديدة", variant: "destructive" });
      return;
    }

    setChangingPass(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "فشل تغيير كلمة المرور");

      toast({ title: "نجاح", description: "تم تغيير كلمة المرور بنجاح" });
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 text-right" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary">إعدادات الموقع</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">بيانات التواصل الأساسية وإدارة الأمان.</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="gap-2 bg-primary rounded-2xl text-xs sm:text-sm py-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>

      {/* قسم معلومات التواصل */}
      <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-primary">معلومات التواصل</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label className="text-xs text-foreground/80">{field.label}</Label>
              <Input
                value={form[field.name] || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                dir={field.ltr ? "ltr" : undefined}
                className={`rounded-2xl h-10 text-xs sm:text-sm ${field.ltr ? "text-left" : "text-right"}`}
              />
              {field.help ? <p className="text-[10px] text-muted-foreground">{field.help}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {/* قسم تغيير كلمة المرور */}
      <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="font-heading text-base font-bold text-primary flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> تغيير كلمة المرور
        </h2>
        <form onSubmit={handleChangePassword} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">كلمة المرور الحالية</Label>
            <Input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="rounded-2xl h-10 text-xs sm:text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground/80">كلمة المرور الجديدة</Label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="rounded-2xl h-10 text-xs sm:text-sm"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end mt-2">
            <Button type="submit" disabled={changingPass} variant="outline" className="gap-2 rounded-2xl text-xs sm:text-sm h-10">
              {changingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {changingPass ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
            </Button>
          </div>
        </form>
      </section>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} className="gap-2 bg-primary rounded-2xl text-xs sm:text-sm py-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }

      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data));

      window.location.href = returnTo && returnTo !== "/" ? returnTo : "/admin";
    } catch (err) {
      setError(err.message || "تعذر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="w-full px-3 sm:px-0">
      <AuthLayout
        icon={LogIn}
        title="مرحباً بك مجدداً"
        subtitle="تسجيل الدخول إلى لوحة التحكم"
        footer={
          <div className="text-xs sm:text-sm text-slate-600">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-[#0d8274] font-bold hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </div>
        }
      >
        {error && <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-xs sm:text-sm text-right border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm text-slate-700">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="muyser@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 h-11 sm:h-12 text-xs sm:text-sm text-left rounded-2xl sm:rounded-3xl border-slate-200 shadow-sm focus:border-[#0d8274] focus:ring-1 focus:ring-[#0d8274]"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs sm:text-sm text-slate-700">كلمة المرور</Label>
              <Link to="/forgot-password" className="text-[11px] sm:text-xs text-[#0d8274] font-medium hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 h-11 sm:h-12 text-xs sm:text-sm text-left rounded-2xl sm:rounded-3xl border-slate-200 shadow-sm focus:border-[#0d8274] focus:ring-1 focus:ring-[#0d8274]"
                dir="ltr"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 sm:h-12 text-xs sm:text-sm font-bold rounded-2xl sm:rounded-3xl bg-[#0d8274] text-white hover:bg-[#0d8274]/90 shadow-md transition-all mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جارٍ تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>
      </AuthLayout>
    </div>
  );
}
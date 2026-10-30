import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل إعادة تعيين كلمة المرور");

      navigate("/login");
    } catch (err) {
      setError(err.message || "فشل إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="رابط غير صالح"
        subtitle="رابط إعادة تعيين كلمة المرور مفقود أو غير صالح"
        footer={<Link to="/forgot-password" className="text-primary font-medium hover:underline">طلب رابط جديد</Link>}
      >
        <p className="text-sm text-foreground text-center">الرابط المستخدم غير مكتمل. يرجى طلب رابط جديد.</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout icon={Lock} title="كلمة مرور جديدة" subtitle="أدخل كلمة المرور الجديدة أدناه">
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-right">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10 h-12 text-left"
              dir="ltr"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10 h-12 text-left"
              dir="ltr"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : "إعادة تعيين كلمة المرور"}
        </Button>
      </form>
    </AuthLayout>
  );
}
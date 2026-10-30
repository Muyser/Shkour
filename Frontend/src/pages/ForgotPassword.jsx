import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // تجاهل الأخطاء لأسباب أمنية
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="استعادة كلمة المرور"
      subtitle="سنرسل لك رابطاً لإعادة تعيينها"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          <ArrowLeft className="w-3 h-3 inline ml-1" /> العودة لتسجيل الدخول
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground text-center">
          إن كان الحساب موجوداً بهذا البريد، ستتلقى رابط إعادة تعيين كلمة المرور قريباً.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 h-12 text-left"
                dir="ltr"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : "إرسال رابط الاستعادة"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";

const INITIAL = { name: "", phone: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const setField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("الرجاء إدخال الاسم ورقم الهاتف ونص الرسالة.");
      return;
    }
    setSending(true);
    try {
      await base44.entities.ContactMessage.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setDone(true);
      setForm(INITIAL);
    } catch (submitError) {
      setError("تعذر إرسال الرسالة الآن، حاول مرة أخرى أو تواصل معنا عبر واتساب.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3.5 sm:gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-center shadow-sm">
        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600" />
        <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">تم إرسال رسالتك بنجاح</h3>
        <p className="max-w-md text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
          شكرًا لتواصلك معنا. سيتصل بك أحد مستشارينا في أقرب وقت ممكن، وإذا كان الأمر عاجلًا يمكنك مراسلتنا مباشرة عبر واتساب.
        </p>
        <Button variant="outline" onClick={() => setDone(false)} className="mt-2 rounded-2xl border-slate-200 text-xs sm:text-sm">
          إرسال رسالة أخرى
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">أرسل لنا رسالة</h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-600">سعداء بالإجابة على استفساراتك حول التقديم والخدمات.</p>

      <div className="mt-5 sm:mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name" className="text-xs sm:text-sm font-semibold text-slate-700">الاسم الكامل *</Label>
          <Input id="contact-name" value={form.name} onChange={setField("name")} placeholder="اسمك كما تود أن نناديك به" className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm py-2.5 sm:py-3" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone" className="text-xs sm:text-sm font-semibold text-slate-700">رقم الهاتف / واتساب *</Label>
          <Input id="contact-phone" value={form.phone} onChange={setField("phone")} placeholder="‎+250 7xx xxx xxx" dir="ltr" className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm text-right py-2.5 sm:py-3" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email" className="text-xs sm:text-sm font-semibold text-slate-700">البريد الإلكتروني</Label>
          <Input id="contact-email" type="email" value={form.email} onChange={setField("email")} placeholder="example@email.com" dir="ltr" className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm text-right py-2.5 sm:py-3" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-subject" className="text-xs sm:text-sm font-semibold text-slate-700">الموضوع</Label>
          <Input id="contact-subject" value={form.subject} onChange={setField("subject")} placeholder="مثال: استفسار عن التقديم لجامعة" className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm py-2.5 sm:py-3" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="contact-message" className="text-xs sm:text-sm font-semibold text-slate-700">رسالتك *</Label>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={setField("message")}
            placeholder="اكتب استفسارك بالتفصيل وسيصلنا فورًا..."
            rows={5}
            className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm"
          />
        </div>
      </div>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-600 font-medium border border-red-200">{error}</p> : null}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs sm:text-sm font-bold text-slate-900 transition hover:bg-amber-400 shadow-sm w-full sm:w-auto disabled:opacity-50"
      >
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
      </button>
    </form>
  );
}
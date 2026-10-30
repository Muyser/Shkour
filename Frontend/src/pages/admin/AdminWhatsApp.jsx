import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Loader2, Save, ShieldCheck, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

const SECRETS = [
  { name: "WHATSAPP_ACCESS_TOKEN", label: "رمز الوصول (Access Token)" },
  { name: "WHATSAPP_PHONE_NUMBER_ID", label: "معرّف رقم الهاتف" },
  { name: "WHATSAPP_BUSINESS_ACCOUNT_ID", label: "معرّف حساب الأعمال" },
  { name: "WHATSAPP_VERIFY_TOKEN", label: "كلمة التحقق (Verify Token)" },
  { name: "WHATSAPP_APP_SECRET", label: "App Secret" },
];

const DATA_SOURCES = [
  "الدول",
  "الجامعات والمعاهد",
  "التخصصات",
  "الرسوم وشروط القبول",
  "المستندات المطلوبة لكل مؤسسة",
  "الخدمات ومتطلباتها",
  "معاهد اللغة",
];

export default function AdminWhatsApp() {
  const [record, setRecord] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const webhookUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/functions/whatsappWebhook`;

  useEffect(() => {
    base44.entities.SiteSettings.list({ sort: "-created_date", limit: 1 })
      .then((page) => {
        const existing = page?.items?.[0] || null;
        setRecord(existing);
        setEnabled(existing?.whatsapp_ai_enabled ?? true);
        setInstructions(existing?.whatsapp_ai_instructions || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const payload = { whatsapp_ai_enabled: enabled, whatsapp_ai_instructions: instructions };
    try {
      if (record?.id) {
        await base44.entities.SiteSettings.update(record.id, payload);
      } else {
        const created = await base44.entities.SiteSettings.create(payload);
        setRecord(created);
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-[var(--radius)]" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">واتساب والذكاء الاصطناعي</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            المساعد يقرأ من قاعدة بيانات الموقع نفسها، ولا يخترع معلومات غير موجودة.
          </p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2 bg-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ
        </Button>
      </div>

      {saved ? <p className="rounded-xl bg-mint px-3 py-2 text-xs text-mint-foreground">تم حفظ الإعدادات.</p> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
            <Sparkles className="h-4 w-4 text-gold" />
            حالة المساعد
          </h2>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-3">
            <div>
              <p className="text-sm text-primary">تفعيل مساعد واتساب</p>
              <p className="text-[11px] text-muted-foreground">عند التفعيل يرد المساعد تلقائيًا على الرسائل.</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="mt-4">
            <Label className="text-xs text-foreground/80">تعليمات إضافية للمساعد (اختياري)</Label>
            <textarea
              rows={5}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="مثال: رحّب بالطالب، واسأله عن التخصص والدولة قبل التوصية."
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-primary">مصادر البيانات المتاحة للمساعد</p>
            <ul className="mt-2 space-y-1.5">
              {DATA_SOURCES.map((source) => (
                <li key={source} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-primary">
              <ShieldCheck className="h-4 w-4 text-gold" />
              ربط الـ Webhook
            </h2>
            <p className="mt-1 text-[11px] leading-6 text-muted-foreground">
              أضف هذا الرابط في إعدادات WhatsApp Cloud API، ونفس كلمة التحقق الموجودة في الأسرار.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/60 p-2">
              <code className="flex-1 overflow-hidden text-[10px] text-primary" dir="ltr">
                {webhookUrl}
              </code>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => {
                  navigator.clipboard?.writeText(webhookUrl);
                  setCopied(true);
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            {copied ? <p className="mt-1 text-[10px] text-emerald-700">تم النسخ</p> : null}
          </section>

          <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
            <h2 className="font-heading text-base font-bold text-primary">الأسرار المحفوظة</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              تُدار من صفحة الأسرار في لوحة المنصة، ولا تظهر أبدًا في الواجهة أو الكود.
            </p>
            <ul className="mt-3 space-y-2">
              {SECRETS.map((secret) => (
                <li key={secret.name} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="text-xs text-primary">{secret.label}</span>
                  <span className="font-mono text-[9px] text-muted-foreground" dir="ltr">
                    {secret.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
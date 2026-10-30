import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import RequiredDocumentsEditor from "@/components/admin/RequiredDocumentsEditor";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY = {
  name: "",
  type: "university",
  country_id: "",
  country: "",
  city: "",
  image_url: "",
  description: "",
  programs: [],
  admission_requirements: [],
  duration: "",
  tuition_fees: "",
  application_deadline: "",
  language: "",
  required_documents: [],
  is_visible: true,
};

function Text({ label, value, onChange, placeholder, type = "text", ltr = false }) {
  return (
    <div className="space-y-1.5 text-right">
      <Label className="text-xs text-foreground/80">{label}</Label>
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} dir={ltr ? "ltr" : "rtl"} className={`rounded-2xl ${ltr ? "text-left" : "text-right"}`} />
    </div>
  );
}

function Area({ label, value, onChange, rows = 4, placeholder, help }) {
  return (
    <div className="space-y-1.5 text-right">
      <Label className="text-xs text-foreground/80">{label}</Label>
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-right focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {help ? <p className="text-[10px] text-muted-foreground">{help}</p> : null}
    </div>
  );
}

export default function AdminInstitutionEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const defaultType = location.pathname.includes("/institutes") ? "institute" : "university";
  const isNew = !id || id === "new";

  const [form, setForm] = useState({ ...EMPTY, type: defaultType });
  const [imageFile, setImageFile] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetch(`${API_URL}/api/countries`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.items?.length > 0) setCountries(data.items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/institutions/${id}`)
      .then((res) => res.json())
      .then((found) => {
        if (found && !found.message) {
          setForm({ ...EMPTY, ...found, type: found.type || defaultType });
        }
      })
      .catch(() => setError("فشل جلب بيانات المؤسسة"))
      .finally(() => setLoading(false));
  }, [id, isNew, defaultType]);

  const set = (name) => (value) => setForm((prev) => ({ ...prev, [name]: value }));

  const save = async () => {
    if (!form.name.trim()) {
      setError("اسم المؤسسة مطلوب");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const dataToSend = new FormData();
      Object.keys(form).forEach((key) => {
        if (Array.isArray(form[key])) {
          dataToSend.append(key, JSON.stringify(form[key]));
        } else if (form[key] !== null && form[key] !== undefined) {
          dataToSend.append(key, form[key]);
        }
      });

      if (imageFile) {
        dataToSend.append("image", imageFile);
      }

      const url = isNew ? `${API_URL}/api/institutions` : `${API_URL}/api/institutions/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (!res.ok) throw new Error("فشل حفظ البيانات");

      toast({ title: "نجاح", description: "تم حفظ المؤسسة بنجاح" });
      navigate(form.type === "institute" ? "/admin/institutes" : "/admin/universities");
    } catch (saveError) {
      setError(saveError.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  const currentTypeTitle = form.type === "institute" ? "معهد" : "جامعة";
  const backPath = form.type === "institute" ? "/admin/institutes" : "/admin/universities";

  return (
    <div className="space-y-5 text-right" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to={backPath} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <ArrowRight className="h-3.5 w-3.5" />
            رجوع إلى قائمة {form.type === "institute" ? "المعاهد" : "الجامعات"}
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold text-primary">
            {isNew ? `إضافة ${currentTypeTitle}` : `تعديل: ${form.name}`}
          </h1>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2 bg-primary rounded-2xl">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ
        </Button>
      </div>

      {error ? <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p> : null}

      <div className="space-y-5">
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="font-heading text-base font-bold text-primary">المعلومات الأساسية</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Text label="اسم المؤسسة" value={form.name} onChange={set("name")} placeholder="اسم المؤسسة..." />
            
            <div className="space-y-1.5 text-right">
              <Label className="text-xs text-foreground/80">نوع المؤسسة</Label>
              <select
                value={form.type}
                onChange={(e) => set("type")(e.target.value)}
                className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-right"
              >
                <option value="university">جامعة (University)</option>
                <option value="institute">معهد (Institute)</option>
              </select>
            </div>

            <div className="space-y-1.5 text-right">
              <Label className="text-xs text-foreground/80">الدولة</Label>
              <select
                value={form.country}
                onChange={(event) => {
                  const selected = countries.find((item) => item.name === event.target.value);
                  setForm((prev) => ({
                    ...prev,
                    country: event.target.value,
                    country_id: selected?._id || selected?.id || "",
                  }));
                }}
                className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-right"
              >
                <option value="">اختر الدولة</option>
                {countries.map((country) => (
                  <option key={country._id || country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <Text label="المدينة" value={form.city} onChange={set("city")} />
            <Text label="مدة الدراسة" value={form.duration} onChange={set("duration")} placeholder="4 سنوات" />
            <Text label="لغة الدراسة" value={form.language} onChange={set("language")} placeholder="الإنجليزية" />
            <Text label="الرسوم الدراسية" value={form.tuition_fees} onChange={set("tuition_fees")} placeholder="تُحدد من الإدارة" />
            <Text label="مواعيد التقديم" value={form.application_deadline} onChange={set("application_deadline")} placeholder="سبتمبر / فبراير" />

            <div className="space-y-1.5 sm:col-span-2 text-right">
              <Label className="text-xs text-foreground/80">صورة المؤسسة</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  className="cursor-pointer rounded-2xl"
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              {form.image_url && !imageFile && (
                <img src={form.image_url} alt="" className="mt-2 h-32 w-full rounded-2xl object-cover" />
              )}
            </div>

            <div className="sm:col-span-2">
              <Area label="نبذة عن المؤسسة" value={form.description} onChange={set("description")} rows={4} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="font-heading text-base font-bold text-primary">المستندات المطلوبة للتقديم</h2>
          <RequiredDocumentsEditor
            documents={form.required_documents || []}
            onChange={set("required_documents")}
          />
        </section>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="gap-2 bg-primary rounded-2xl">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}
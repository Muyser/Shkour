import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NATIONALITIES = ["سوداني", "مصري", "رواندي", "تركي", "هندي", "ماليزي", "روسي", "أخرى"];
const CURRENT_COUNTRIES = ["السودان", "مصر", "رواندا", "قبرص", "تركيا", "الهند", "ماليزيا", "روسيا", "دولة أخرى"];
const QUALIFICATIONS = ["الشهادة السودانية", "الثانوية العامة", "دبلوم", "بكالوريوس", "دراسات عليا", "أخرى"];

function Field({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs sm:text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[10px] sm:text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export default function StudentForm({ data, onChange, institution, errors }) {
  const set = (name) => (value) => onChange({ ...data, [name]: value });
  const programs = institution?.programs || [];

  return (
    <div className="space-y-6 sm:space-y-8 text-right" dir="rtl">
      <section>
        <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">البيانات الشخصية</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="الاسم الكامل" required>
              <Input
                value={data.student_name}
                onChange={(event) => set("student_name")(event.target.value)}
                placeholder="الاسم كما في الشهادة"
                className={`rounded-2xl border bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 ${
                  errors?.student_name ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors?.student_name ? <p className="text-[11px] text-red-500 mt-1">هذا الحقل مطلوب</p> : null}
            </Field>
          </div>

          <Field label="الجنسية" required>
            <Select value={data.nationality} onValueChange={set("nationality")}>
              <SelectTrigger className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 w-full">
                <SelectValue placeholder="اختر الجنسية" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white border border-slate-200 shadow-md">
                {NATIONALITIES.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="الجنس" required>
            <Select value={data.gender} onValueChange={set("gender")}>
              <SelectTrigger className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 w-full">
                <SelectValue placeholder="اختر" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white border border-slate-200 shadow-md">
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="رقم WhatsApp" required hint="مثال: 249xxxxxxxxx مع رمز الدولة">
              <Input
                value={data.whatsapp}
                onChange={(event) => set("whatsapp")(event.target.value)}
                placeholder="+249..."
                dir="ltr"
                className={`rounded-2xl border bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 text-right ${
                  errors?.whatsapp ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors?.whatsapp ? <p className="text-[11px] text-red-500 mt-1">رقم واتساب مطلوب</p> : null}
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="الدولة الحالية" required>
              <Select value={data.current_country} onValueChange={set("current_country")}>
                <SelectTrigger className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 w-full">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-white border border-slate-200 shadow-md">
                  {CURRENT_COUNTRIES.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-6">
        <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">البيانات الأكاديمية</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="آخر مؤهل دراسي" required>
            <Select value={data.last_qualification} onValueChange={set("last_qualification")}>
              <SelectTrigger className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 w-full">
                <SelectValue placeholder="اختر المؤهل" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-white border border-slate-200 shadow-md">
                {QUALIFICATIONS.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="النسبة / الدرجة" required>
            <Input
              value={data.grade}
              onChange={(event) => set("grade")(event.target.value)}
              placeholder="مثال: 85% أو 3.2 من 4"
              className={`rounded-2xl border bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 ${
                errors?.grade ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors?.grade ? <p className="text-[11px] text-red-500 mt-1">هذا الحقل مطلوب</p> : null}
          </Field>

          <Field label="التخصص المطلوب" required hint={programs.length ? undefined : "يمكنك كتابة التخصص يدويًا"}>
            {programs.length ? (
              <Select value={data.program} onValueChange={set("program")}>
                <SelectTrigger className={`rounded-2xl border bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 w-full ${errors?.program ? "border-red-500" : "border-slate-200"}`}>
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-white border border-slate-200 shadow-md max-h-60">
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={data.program}
                onChange={(event) => set("program")(event.target.value)}
                placeholder="اسم التخصص"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900"
              />
            )}
            {errors?.program ? <p className="text-[11px] text-red-500 mt-1">هذا الحقل مطلوب</p> : null}
          </Field>

          <Field label="الجامعة / المعهد المختار">
            <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs sm:text-sm font-medium text-slate-800">
              {institution?.name}
            </div>
          </Field>
        </div>
      </section>
    </div>
  );
}
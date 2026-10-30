export const DEFAULT_WHATSAPP = "250794420606";
export const OFFICE_NAME = "مكتب شكور للتقديمات والخدمات التعليمية";

export const NAV_LINKS = [
  { label: "الرئيسية", to: "/" },
  { label: "الجامعات", to: "/universities" },
  { label: "المعاهد", to: "/institutes" },
  { label: "الدول", to: "/countries" },
  { label: "التخصصات", to: "/programs" },
  { label: "المعرض", to: "/gallery" },
  { label: "اتصل بنا", to: "/contact" },
];

export const STATUS_META = {
  new: { label: "جديد", className: "bg-primary/10 text-primary border-primary/20" },
  reviewing: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-800 border-amber-200" },
  needs_documents: { label: "يحتاج مستندات", className: "bg-orange-50 text-orange-800 border-orange-200" },
  completed: { label: "مكتمل", className: "bg-sky-50 text-sky-800 border-sky-200" },
  accepted: { label: "مقبول", className: "bg-mint text-mint-foreground border-emerald-200" },
  rejected: { label: "مرفوض", className: "bg-red-50 text-red-800 border-red-200" },
  closed: { label: "مغلق", className: "bg-muted text-muted-foreground border-border" },
};

export const STATUS_ORDER = [
  "new",
  "reviewing",
  "needs_documents",
  "completed",
  "accepted",
  "rejected",
  "closed",
];

export const TYPE_LABEL = { university: "جامعة", institute: "معهد" };

export const waLink = (number, message) => {
  const digits = String(number || DEFAULT_WHATSAPP).replace(/\D/g, "");
  const text = message || "مرحبًا مكتب شكور، أرغب في الاستفسار عن خدماتكم التعليمية.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(date);
};

export const slugify = (value) =>
  String(value || "")
    .trim()
    .replace(/[\s/\\]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .toLowerCase();

export const linesToArray = (value) =>
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
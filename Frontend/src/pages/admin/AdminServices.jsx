import EntityManager from "@/components/admin/EntityManager";
import ServiceIcon from "@/components/site/ServiceIcon";

const FIELDS = [
  { name: "title", label: "اسم الخدمة", type: "text", required: true },
  { name: "slug", label: "الرابط (slug)", type: "text", placeholder: "استخراج-الشهادات-السودانية" },
  { name: "icon", label: "الأيقونة", type: "icon" },
  { name: "cta_label", label: "نص زر التواصل", type: "text", placeholder: "تواصل معنا" },
  { name: "short_description", label: "وصف مختصر", type: "textarea", rows: 2, full: true },
  { name: "description", label: "الوصف التفصيلي", type: "textarea", rows: 6, full: true },
  { name: "includes", label: "ماذا تشمل الخدمة", type: "list", rows: 4, full: true },
  { name: "requirements", label: "المتطلبات", type: "list", rows: 4, full: true },
  { name: "order", label: "ترتيب الظهور", type: "number" },
  { name: "is_visible", label: "ظاهرة على الموقع", type: "boolean" },
];

const COLUMNS = [
  {
    key: "title",
    label: "الخدمة",
    render: (item) => (
      <span className="flex items-center gap-2 text-sm text-primary">
        <ServiceIcon name={item.icon} className="h-4 w-4 text-gold" />
        {item.title}
      </span>
    ),
  },
  { key: "short_description", label: "الوصف المختصر" },
  { key: "order", label: "الترتيب" },
  { key: "is_visible", label: "الحالة" },
];

const DEFAULT_SERVICES = [
  {
    id: "serv-1",
    title: "تأمين القبولات الجامعية",
    slug: "university-admissions",
    icon: "GraduationCap",
    cta_label: "احصل على قبولك",
    short_description: "استخراج القبولات الجامعية المباشرة والمجانية في أفضل الجامعات الخاصة والمعتمدة.",
    description: "نساعد الطلاب على اختيار الجامعة والتخصص المناسب لمعدلهم وميزانيتهم، ونقوم بإجراءات التقديم ومتابعة القبول حتى صدوره رسميًا.",
    includes: ["تقديم مجاني بدون رسوم وسيطة", "اختيار أفضل الجامعات المعتمدة", "متابعة الطلب حتى صدور القبول المبدئي والنهائي"],
    requirements: ["صورة جواز السفر", "صورة شهادة الثانوية العامة أو بيان الدرجات"],
    order: 1,
    is_visible: true,
  },
  {
    id: "serv-2",
    title: "استخراج وتوثيق الشهادات",
    slug: "certificate-attestation",
    icon: "ScrollText",
    cta_label: "اطلب الخدمة",
    short_description: "خدمة استخراج وتوثيق الشهادات الدراسية والأكاديمية من الجهات الرسمية والمعتمدة.",
    description: "نقوم بتخليص وإجراءات استخراج الشهادات والأوراق الثبوتية وتوثيقها من الوزارات والجهات المختصة لتكون جاهزة للتقديم الدولي.",
    includes: ["استخراج الشهادات بدل الفاقد أو الأصلية", "التوثيق من الخارجية والسفارات", "الشحن السريع والآمن للمستندات"],
    requirements: ["صورة الرقم الوطني أو الهوية", "تفاصيل الدفعة وسنة التخرج"],
    order: 2,
    is_visible: true,
  },
  {
    id: "serv-3",
    title: "الاستقبال والتسكين الطلابي",
    slug: "airport-reception-housing",
    icon: "PlaneTakeoff",
    cta_label: "احجز استقبالك",
    short_description: "توفير خدمة الاستقبال المباشر من المطار والتوصيل إلى مكان الإقامة والسكن الطلابي.",
    description: "يكون فريقنا في انتظار الطالب عند وصوله إلى المطار للمساعدة في حمل الحقائب والتوصيل الآمن إلى السكن وتسهيل إجراءات الاستقرار الأولى.",
    includes: ["استقبال شخصي في المطار", "تأمين السكن الطلابي المناسب", "مساعدة في شراء شريحة الاتصال والتأقلم"],
    requirements: ["تذاكر الطيران وتاريخ الوصول", "تحديد نوع السكن المفضل"],
    order: 3,
    is_visible: true,
  },
];

export default function AdminServices() {
  return (
    <div className="text-right" dir="rtl">
      <EntityManager
        title="الخدمات"
        description="أضف الخدمات التعليمية وعدّل وصفها وأيقوناتها."
        fields={FIELDS}
        columns={COLUMNS}
        defaults={{
          title: "",
          slug: "",
          icon: "GraduationCap",
          cta_label: "تواصل معنا",
          short_description: "",
          description: "",
          includes: [],
          requirements: [],
          order: 0,
          is_visible: true,
        }}
        defaultItems={DEFAULT_SERVICES}
        searchField="title"
        addLabel="إضافة خدمة"
      />
    </div>
  );
}
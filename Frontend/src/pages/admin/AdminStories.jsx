
import { base44 } from "@/api/base44Client";
import EntityManager from "@/components/admin/EntityManager";

const FIELDS = [
  { name: "student_name", label: "اسم الطالب", type: "text", required: true },
  { name: "country", label: "الدولة", type: "text" },
  { name: "university", label: "الجامعة", type: "text" },
  { name: "program", label: "التخصص", type: "text" },
  { name: "image_url", label: "صورة الطالب", type: "image", full: true },
  { name: "story", label: "القصة", type: "textarea", rows: 6, full: true },
  { name: "video_url", label: "رابط فيديو (اختياري)", type: "text", full: true },
  { name: "published_date", label: "تاريخ النشر", type: "date" },
  { name: "order", label: "ترتيب الظهور", type: "number" },
  { name: "is_visible", label: "ظاهر على الموقع", type: "boolean" },
];

const COLUMNS = [
  { key: "student_name", label: "الطالب" },
  { key: "university", label: "الجامعة" },
  { key: "program", label: "التخصص" },
  { key: "story", label: "القصة" },
  { key: "order", label: "الترتيب" },
  { key: "is_visible", label: "الحالة" },
];

export default function AdminStories() {
  return (
    <EntityManager
      title="قصص النجاح"
      description="أضف قصص الطلاب الناجحة لتظهر في الموقع."
      entity={base44.entities.StudentStory}
      fields={FIELDS}
      columns={COLUMNS}
      defaults={{
        student_name: "",
        country: "",
        university: "",
        program: "",
        image_url: "",
        story: "",
        video_url: "",
        published_date: "",
        order: 0,
        is_visible: true,
      }}
      searchField="student_name"
      addLabel="إضافة قصة"
    />
  );
}
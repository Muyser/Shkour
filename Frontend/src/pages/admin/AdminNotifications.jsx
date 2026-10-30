
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import EntityManager from "@/components/admin/EntityManager";

const FIELDS = [
  { name: "title", label: "العنوان", type: "text", required: true, full: true },
  { name: "body", label: "النص", type: "textarea", rows: 3, full: true },
  {
    name: "type",
    label: "النوع",
    type: "select",
    options: [
      { value: "application", label: "طلب تقديم" },
      { value: "service", label: "خدمة" },
      { value: "system", label: "نظام" },
    ],
  },
  { name: "link", label: "الرابط", type: "text", placeholder: "/admin/applications/..." },
  { name: "is_read", label: "مقروء", type: "boolean" },
];

const COLUMNS = [
  { key: "title", label: "العنوان" },
  { key: "body", label: "النص" },
  {
    key: "type",
    label: "النوع",
    render: (item) => (
      <Badge variant="outline" className="rounded-full text-[10px]">
        {item.type === "application" ? "طلب" : item.type === "service" ? "خدمة" : "نظام"}
      </Badge>
    ),
  },
  {
    key: "is_read",
    label: "الحالة",
    render: (item) => (
      <Badge
        variant="outline"
        className={`rounded-full text-[10px] ${
          item.is_read ? "border-border bg-muted text-muted-foreground" : "border-gold/40 bg-gold/10 text-gold-foreground"
        }`}
      >
        {item.is_read ? "مقروء" : "جديد"}
      </Badge>
    ),
  },
];

export default function AdminNotifications() {
  return (
    <EntityManager
      title="الإشعارات"
      description="إشعارات الطلبات الجديدة والتنبيهات الإدارية."
      entity={base44.entities.Notification}
      fields={FIELDS}
      columns={COLUMNS}
      defaults={{ title: "", body: "", type: "system", link: "", is_read: false }}
      sort="-created_date"
      searchField="title"
      addLabel="إضافة إشعار"
    />
  );
}
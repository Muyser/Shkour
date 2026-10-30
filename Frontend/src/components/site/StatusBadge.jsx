
import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/site";

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.new;
  return (
    <Badge variant="outline" className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${meta.className}`}>
      {meta.label}
    </Badge>
  );
}
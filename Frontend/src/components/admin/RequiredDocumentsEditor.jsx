import React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function RequiredDocumentsEditor({ documents = [], onChange }) {
  const update = (index, patch) => {
    const next = documents.map((doc, docIndex) => (docIndex === index ? { ...doc, ...patch } : doc));
    onChange(next.map((doc, docIndex) => ({ ...doc, order: docIndex })));
  };

  const add = () => {
    onChange([
      ...documents,
      {
        id: `doc-${Date.now()}`,
        name: "",
        required: true,
        note: "",
        order: documents.length,
      },
    ]);
  };

  const remove = (index) => {
    onChange(documents.filter((_, docIndex) => docIndex !== index).map((doc, docIndex) => ({ ...doc, order: docIndex })));
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= documents.length) return;
    const next = [...documents];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((doc, docIndex) => ({ ...doc, order: docIndex })));
  };

  return (
    <div className="rounded-[var(--radius)] border border-border/70 bg-secondary/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-heading text-sm font-bold text-primary">المستندات المطلوبة للتقديم</p>
          <p className="text-[11px] text-muted-foreground">
            تظهر هذه القائمة للطالب عند التقديم لهذه المؤسسة فقط.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={add} className="gap-1 bg-card">
          <Plus className="h-3.5 w-3.5" />
          إضافة مستند
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {documents.length ? (
          documents.map((doc, index) => (
            <div key={doc.id || index} className="rounded-xl border border-border/70 bg-card p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/5 text-[10px] text-primary">
                  {index + 1}
                </span>
                <Input
                  value={doc.name || ""}
                  onChange={(event) => update(index, { name: event.target.value })}
                  placeholder="اسم المستند (مثال: جواز السفر)"
                  className="h-9 flex-1 min-w-[180px]"
                />
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={Boolean(doc.required)}
                    onCheckedChange={(checked) => update(index, { required: checked })}
                  />
                  <Badge
                    variant="outline"
                    className={`rounded-full text-[10px] ${
                      doc.required
                        ? "border-gold/40 bg-gold/10 text-gold-foreground"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {doc.required ? "مطلوب" : "اختياري"}
                  </Badge>
                </div>
                <div className="flex items-center gap-0.5">
                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(index, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => move(index, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Input
                value={doc.note || ""}
                onChange={(event) => update(index, { note: event.target.value })}
                placeholder="ملاحظة اختيارية تظهر للطالب"
                className="mt-2 h-8 bg-background text-xs"
              />
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card/60 p-4 text-center text-xs text-muted-foreground">
            لا توجد مستندات مطلوبة لهذه المؤسسة. أضف ما تحتاجه.
          </p>
        )}
      </div>
    </div>
  );
}
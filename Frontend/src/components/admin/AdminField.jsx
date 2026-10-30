import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { linesToArray } from "@/lib/site";

export const ICON_OPTIONS = [
  "GraduationCap",
  "Building2",
  "FileBadge",
  "ShieldCheck",
  "Plane",
  "FolderCheck",
  "MessagesSquare",
  "Languages",
  "Stamp",
  "ScrollText",
  "Compass",
  "BookOpen",
  "BadgeCheck",
  "PlaneTakeoff",
  "Landmark",
];

function ImageField({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const response = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(response.file_url);
    } catch (uploadError) {
      setError(uploadError?.message || "تعذر رفع الصورة");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
          dir="ltr"
          className="flex-1"
        />
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={upload} />
        <Button type="button" variant="outline" size="icon" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value ? <img src={value} alt="" className="h-24 w-full rounded-xl object-cover" /> : null}
      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}

function MediaField({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isVideo = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(value || "");

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const response = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(response.file_url);
    } catch (uploadError) {
      setError(uploadError?.message || "تعذر رفع الملف");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
          dir="ltr"
          className="flex-1"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={upload}
        />
        <Button type="button" variant="outline" size="icon" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value ? (
        isVideo ? (
          <video src={value} controls className="h-32 w-full rounded-xl bg-primary object-cover" />
        ) : (
          <img src={value} alt="" className="h-24 w-full rounded-xl object-cover" />
        )
      ) : null}
      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}

export default function AdminField({ field, value, onChange }) {
  const { type = "text", label, placeholder, options, required, rows = 4, help } = field;

  const control = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            rows={rows}
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        );
      case "list":
        return (
          <div className="space-y-1">
            <Textarea
              rows={rows}
              value={Array.isArray(value) ? value.join("\n") : value || ""}
              onChange={(event) => onChange(linesToArray(event.target.value))}
              placeholder={placeholder || "كل عنصر في سطر مستقل"}
            />
            <p className="text-[10px] text-muted-foreground">كل عنصر في سطر مستقل.</p>
          </div>
        );
      case "number":
        return (
          <Input
            type="number"
            value={value ?? 0}
            onChange={(event) => onChange(Number(event.target.value))}
          />
        );
      case "boolean":
        return (
          <div className="flex h-10 items-center">
            <Switch checked={Boolean(value)} onCheckedChange={onChange} />
            <span className="ms-2 text-xs text-muted-foreground">{value ? "مفعّل" : "غير مفعّل"}</span>
          </div>
        );
      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || "اختر"} />
            </SelectTrigger>
            <SelectContent>
              {(options || []).map((option) => {
                const item = typeof option === "string" ? { value: option, label: option } : option;
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      case "date":
        return <Input type="date" value={value || ""} onChange={(event) => onChange(event.target.value)} />;
      case "image":
        return <ImageField value={value} onChange={onChange} />;
      case "media":
        return <MediaField value={value} onChange={onChange} />;
      case "icon":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="اختر أيقونة" />
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "email":
        return (
          <Input type="email" dir="ltr" value={value || ""} onChange={(event) => onChange(event.target.value)} />
        );
      default:
        return (
          <Input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        );
    }
  };

  return (
    <div className={`space-y-1.5 ${field.full ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs text-foreground/80">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {control()}
      {help ? <p className="text-[10px] text-muted-foreground">{help}</p> : null}
    </div>
  );
}
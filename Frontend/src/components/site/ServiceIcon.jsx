import React from "react";
import {
  GraduationCap,
  Building2,
  FileBadge,
  ShieldCheck,
  Plane,
  FolderCheck,
  MessagesSquare,
  Languages,
  Stamp,
  ScrollText,
  Compass,
  BookOpen,
  BadgeCheck,
  PlaneTakeoff,
  Landmark,
  Sparkles,
} from "lucide-react";

const ICONS = {
  GraduationCap,
  Building2,
  FileBadge,
  ShieldCheck,
  Plane,
  FolderCheck,
  MessagesSquare,
  Languages,
  Stamp,
  ScrollText,
  Compass,
  BookOpen,
  BadgeCheck,
  PlaneTakeoff,
  Landmark,
};

export default function ServiceIcon({ name, className = "h-5 w-5" }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon className={className} />;
}
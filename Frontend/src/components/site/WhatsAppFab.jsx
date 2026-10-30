
import { MessageCircle } from "lucide-react";
import useSiteSettings from "@/lib/useSiteSettings";
import { waLink } from "@/lib/site";

export default function WhatsAppFab() {
  const settings = useSiteSettings();
  return (
    <a
      href={waLink(settings?.whatsapp_number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#1faa59] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1faa59]/30 transition hover:scale-105 hover:bg-[#188f4b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1faa59]"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">واتساب</span>
    </a>
  );
}
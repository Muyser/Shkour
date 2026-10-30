import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useSiteSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.SiteSettings.list({ sort: "-created_date", limit: 1 })
      .then((page) => {
        if (active) setSettings(page?.items?.[0] || null);
      })
      .catch(() => {
        if (active) setSettings(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
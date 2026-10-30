import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Search, AlertTriangle, Upload, Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // حالة نافذة معاينة الفيديو أو الصورة المكبرة
  const [previewMedia, setPreviewMedia] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    media_type: "image",
    description: "",
    is_visible: true,
  });
  const [mediaFile, setMediaFile] = useState(null);

  const token = localStorage.getItem("admin_token");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/gallery?title=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }
    } catch (err) {
      toast({ title: "خطأ", description: "فشل تحميل عناصر المعرض", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchItems, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: "تنبيه", description: "عنوان العنصر مطلوب", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("media_type", formData.media_type);
      dataToSend.append("description", formData.description);
      dataToSend.append("is_visible", formData.is_visible);

      if (mediaFile) {
        dataToSend.append("image", mediaFile);
      }

      const url = currentItem 
        ? `${API_URL}/api/gallery/${currentItem._id || currentItem.id}` 
        : `${API_URL}/api/gallery`;
      
      const method = currentItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "فشل حفظ العنصر");

      toast({ title: "نجاح", description: "تم حفظ العنصر بنجاح" });
      setIsOpen(false);
      resetForm();
      fetchItems();
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    const targetId = itemToDelete._id || itemToDelete.id;
    try {
      const res = await fetch(`${API_URL}/api/gallery/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل الحذف");
      toast({ title: "نجاح", description: "تم حذف العنصر بنجاح" });
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title || "",
      media_type: item.media_type || "image",
      description: item.description || "",
      is_visible: item.is_visible ?? true,
    });
    setMediaFile(null);
    setIsOpen(true);
  };

  const resetForm = () => {
    setCurrentItem(null);
    setFormData({
      title: "",
      media_type: "image",
      description: "",
      is_visible: true,
    });
    setMediaFile(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-right" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary">معرض الوسائط</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">إدارة صور وفيديوهات المعرض وتشغيلها مباشرة.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsOpen(true); }} className="flex items-center justify-center gap-2 rounded-2xl text-xs sm:text-sm py-2">
          <Plus className="w-4 h-4" /> إضافة عنصر
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-card px-3 py-1.5 sm:p-3 rounded-2xl border border-border/70">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input 
          placeholder="ابحث بالعنوان..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="border-0 focus-visible:ring-0 shadow-none text-xs sm:text-sm h-8 sm:h-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[11px] sm:text-xs text-muted-foreground">
                  <th className="p-3 sm:p-4">العنوان</th>
                  <th className="p-3 sm:p-4">النوع</th>
                  <th className="p-3 sm:p-4">معاينة الملف</th>
                  <th className="p-3 sm:p-4">الوصف</th>
                  <th className="p-3 sm:p-4">الحالة</th>
                  <th className="p-3 sm:p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-xs sm:text-sm">
                {items.length ? (
                  items.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-secondary/20">
                      <td className="p-3 sm:p-4 font-medium text-primary whitespace-nowrap">{item.title}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {item.media_type === "video" ? "فيديو" : "صورة"}
                        </Badge>
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        {item.media_url ? (
                          item.media_type === "video" ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1.5 text-xs rounded-xl h-8"
                              onClick={() => setPreviewMedia(item)}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> تشغيل الفيديو
                            </Button>
                          ) : (
                            <img 
                              src={item.media_url} 
                              alt={item.title} 
                              className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl cursor-pointer hover:opacity-80 transition"
                              onClick={() => setPreviewMedia(item)}
                            />
                          )
                        ) : (
                          <span className="text-[10px] sm:text-xs text-muted-foreground">لا يوجد ملف</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 truncate max-w-[150px] sm:max-w-xs text-muted-foreground">{item.description || "—"}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${item.is_visible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                          {item.is_visible ? "ظاهر" : "مخفي"}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-left whitespace-nowrap flex items-center justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => openEdit(item)}><Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-destructive hover:text-destructive" onClick={() => confirmDelete(item)}><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-xs sm:text-sm text-muted-foreground">لا توجد عناصر مضافة.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة معاينة وتشغيل الفيديو أو الصورة */}
      {previewMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card rounded-2xl p-4 max-w-2xl w-full space-y-3 sm:space-y-4 shadow-2xl relative border border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-sm sm:text-md font-bold text-primary">{previewMedia.title}</h3>
              <Button variant="ghost" size="sm" className="rounded-xl h-8 text-xs" onClick={() => setPreviewMedia(null)}>✕ إغلاق</Button>
            </div>
            <div className="flex justify-center bg-black rounded-2xl overflow-hidden max-h-[75vh]">
              {previewMedia.media_type === "video" ? (
                <video src={previewMedia.media_url} controls autoPlay className="w-full max-h-[70vh] object-contain" />
              ) : (
                <img src={previewMedia.media_url} alt={previewMedia.title} className="w-full max-h-[70vh] object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة أو تعديل عنصر */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card rounded-2xl p-4 sm:p-6 max-w-lg w-full space-y-3 sm:space-y-4 max-h-[90vh] overflow-y-auto shadow-xl border border-border">
            <h2 className="text-base sm:text-lg font-bold text-primary">{currentItem ? "تعديل العنصر" : "إضافة عنصر جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <Label>عنوان العنصر</Label>
                <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>

              <div className="space-y-1.5">
                <Label>نوع الوسائط</Label>
                <select
                  value={formData.media_type}
                  onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                  className="h-9 sm:h-10 w-full rounded-xl border border-input bg-background px-3 text-xs sm:text-sm text-right"
                >
                  <option value="image">صورة</option>
                  <option value="video">فيديو</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>ملف الوسائط (صورة أو فيديو)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={(e) => setMediaFile(e.target.files[0])} 
                    className="cursor-pointer rounded-xl h-9 sm:h-10 text-xs py-1.5"
                  />
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                </div>
                {currentItem?.media_url && !mediaFile && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">الملف الحالي مرفوع وجاهز (اختر ملفاً جديداً للتبديل)</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>الوصف</Label>
                <Textarea className="rounded-xl text-xs sm:text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Label>ظاهر على الموقع</Label>
                <Switch checked={formData.is_visible} onCheckedChange={(val) => setFormData({ ...formData, is_visible: val })} />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" className="rounded-xl text-xs sm:text-sm h-9 sm:h-10" onClick={() => setIsOpen(false)} disabled={saving}>إلغاء</Button>
                <Button type="submit" className="rounded-xl text-xs sm:text-sm h-9 sm:h-10" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جارٍ الحفظ...
                    </>
                  ) : (
                    "حفظ"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card rounded-2xl p-4 sm:p-6 max-w-sm w-full space-y-3 sm:space-y-4 text-center shadow-xl border border-border">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-1 sm:mb-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-primary">تأكيد الحذف</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1 rounded-xl text-xs sm:text-sm h-9 sm:h-10">
                إلغاء
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirmed} className="flex-1 rounded-xl text-xs sm:text-sm h-9 sm:h-10">
                تأكيد الحذف
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
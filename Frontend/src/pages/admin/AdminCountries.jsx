import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, Search, AlertTriangle, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    flag: "",
    description: "",
    highlights: "",
    is_visible: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("admin_token");

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/countries?name=${search}`);
      const data = await res.json();
      if (res.ok) {
        setCountries(data.items || []);
      }
    } catch (err) {
      toast({ title: "خطأ", description: "فشل تحميل الدول", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("flag", formData.flag);
      dataToSend.append("description", formData.description);
      dataToSend.append("is_visible", formData.is_visible);

      const highlightsArray = typeof formData.highlights === "string"
        ? formData.highlights.split(",").map(h => h.trim()).filter(Boolean)
        : formData.highlights;
      dataToSend.append("highlights", JSON.stringify(highlightsArray));

      if (imageFile) {
        dataToSend.append("image", imageFile);
      }

      const url = currentCountry 
        ? `${API_URL}/api/countries/${currentCountry._id}` 
        : `${API_URL}/api/countries`;
      
      const method = currentCountry ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (!res.ok) throw new Error("فشل حفظ الدولة");

      toast({ title: "نجاح", description: "تم حفظ الدولة بنجاح" });
      setIsOpen(false);
      resetForm();
      fetchCountries();
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (country) => {
    setCountryToDelete(country);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!countryToDelete) return;
    try {
      const res = await fetch(`${API_URL}/api/countries/${countryToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل الحذف");
      toast({ title: "نجاح", description: "تم حذف الدولة بنجاح" });
      setDeleteModalOpen(false);
      setCountryToDelete(null);
      fetchCountries();
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (country) => {
    setCurrentCountry(country);
    setFormData({
      name: country.name || "",
      flag: country.flag || "",
      description: country.description || "",
      highlights: Array.isArray(country.highlights) ? country.highlights.join(", ") : "",
      is_visible: country.is_visible ?? true,
    });
    setImageFile(null);
    setIsOpen(true);
  };

  const resetForm = () => {
    setCurrentCountry(null);
    setFormData({
      name: "",
      flag: "",
      description: "",
      highlights: "",
      is_visible: true,
    });
    setImageFile(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-right" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary">إدارة الدول</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">أضف وجهات الدراسة وارفع صورها الرسمية.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsOpen(true); }} className="flex items-center justify-center gap-2 rounded-2xl text-xs sm:text-sm py-2">
          <Plus className="w-4 h-4" /> إضافة دولة
        </Button>
      </div>

      {/* حقل البحث */}
      <div className="flex items-center gap-2 bg-card px-3 py-1.5 sm:p-3 rounded-2xl border border-border/70">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input 
          placeholder="ابحث عن دولة..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="border-0 focus-visible:ring-0 shadow-none text-xs sm:text-sm h-8 sm:h-10"
        />
      </div>

      {/* الجدول مع دعم التمرير الأفقي للشاشات الصغيرة */}
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[11px] sm:text-xs text-muted-foreground">
                  <th className="p-3 sm:p-4">الدولة</th>
                  <th className="p-3 sm:p-4">العلم</th>
                  <th className="p-3 sm:p-4">الصورة</th>
                  <th className="p-3 sm:p-4">الوصف</th>
                  <th className="p-3 sm:p-4">الحالة</th>
                  <th className="p-3 sm:p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-xs sm:text-sm">
                {countries.length ? (
                  countries.map((c) => (
                    <tr key={c._id} className="hover:bg-secondary/20">
                      <td className="p-3 sm:p-4 font-medium text-primary whitespace-nowrap">{c.name}</td>
                      <td className="p-3 sm:p-4 text-lg sm:text-xl">{c.flag}</td>
                      <td className="p-3 sm:p-4">
                        {c.image_url ? (
                          <img src={c.image_url} alt={c.name} className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-xl" />
                        ) : (
                          <span className="text-[10px] sm:text-xs text-muted-foreground">لا توجد</span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 truncate max-w-[150px] sm:max-w-xs text-muted-foreground">{c.description}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${c.is_visible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                          {c.is_visible ? "ظاهر" : "مخفي"}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-left whitespace-nowrap flex items-center justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => openEdit(c)}><Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-destructive hover:text-destructive" onClick={() => confirmDelete(c)}><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-xs sm:text-sm text-muted-foreground">لا توجد دول مضافة.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة الإضافة / التعديل (Modal) متجاوبة مع الهواتف */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card rounded-2xl p-4 sm:p-6 max-w-lg w-full space-y-3 sm:space-y-4 max-h-[90vh] overflow-y-auto shadow-xl border border-border">
            <h2 className="text-base sm:text-lg font-bold text-primary">{currentCountry ? "تعديل الدولة" : "إضافة دولة جديدة"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <Label>اسم الدولة</Label>
                <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>رمز العلم</Label>
                <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.flag} onChange={(e) => setFormData({ ...formData, flag: e.target.value })} placeholder="🇹🇷" />
              </div>
              <div className="space-y-1.5">
                <Label>صورة الدولة</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    className="cursor-pointer rounded-xl h-9 sm:h-10 text-xs py-1.5"
                  />
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                </div>
                {currentCountry?.image_url && !imageFile && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">الصورة الحالية مسجلة (اختر ملفاً جديداً فقط إن أردت التبديل)</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>الوصف</Label>
                <Textarea className="rounded-xl text-xs sm:text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>مزايا الدراسة (افصل بينها بفواصل)</Label>
                <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} placeholder="ميزة 1, ميزة 2" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <Label>ظاهرة على الموقع</Label>
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
              هل أنت متأكد من رغبتك في حذف دولة <span className="font-semibold text-primary">"{countryToDelete?.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء.
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
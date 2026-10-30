import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    institution_id: "",
    degree: "",
    description: "",
    tuition_fees: "",
    duration: "",
    language: "",
    order: 0,
    is_visible: true,
  });

  const token = localStorage.getItem("admin_token");

  // جلب الجامعات والمعاهد لربطها بالتخصص
  const fetchInstitutions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/institutions`);
      const data = await res.json();
      if (res.ok) setInstitutions(data.items || []);
    } catch (err) {
      console.error("فشل تحميل المؤسسات");
    }
  };

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/programs?name=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (res.ok) {
        setPrograms(data.items || []);
      }
    } catch (err) {
      toast({ title: "خطأ", description: "فشل تحميل التخصصات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchPrograms, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = currentProgram 
        ? `${API_URL}/api/programs/${currentProgram._id || currentProgram.id}` 
        : `${API_URL}/api/programs`;
      
      const method = currentProgram ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("فشل حفظ التخصص");

      toast({ title: "نجاح", description: "تم حفظ التخصص بنجاح" });
      setIsOpen(false);
      resetForm();
      fetchPrograms();
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (program) => {
    setProgramToDelete(program);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!programToDelete) return;
    const targetId = programToDelete._id || programToDelete.id;
    try {
      const res = await fetch(`${API_URL}/api/programs/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل الحذف");
      toast({ title: "نجاح", description: "تم حذف التخصص بنجاح" });
      setDeleteModalOpen(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (program) => {
    setCurrentProgram(program);
    setFormData({
      name: program.name || "",
      institution_id: program.institution_id?._id || program.institution_id || "",
      degree: program.degree || "",
      description: program.description || "",
      tuition_fees: program.tuition_fees || "",
      duration: program.duration || "",
      language: program.language || "",
      order: program.order || 0,
      is_visible: program.is_visible ?? true,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setCurrentProgram(null);
    setFormData({
      name: "",
      institution_id: "",
      degree: "",
      description: "",
      tuition_fees: "",
      duration: "",
      language: "",
      order: 0,
      is_visible: true,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-right" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-primary">التخصصات</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">إدارة التخصصات التابعة للجامعات والمعاهد.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsOpen(true); }} className="flex items-center justify-center gap-2 rounded-2xl text-xs sm:text-sm py-2">
          <Plus className="w-4 h-4" /> إضافة تخصص
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-card px-3 py-1.5 sm:p-3 rounded-2xl border border-border/70">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input 
          placeholder="ابحث عن تخصص..." 
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
                  <th className="p-3 sm:p-4">التخصص</th>
                  <th className="p-3 sm:p-4">المؤسسة</th>
                  <th className="p-3 sm:p-4">الدرجة</th>
                  <th className="p-3 sm:p-4">اللغة / المدة</th>
                  <th className="p-3 sm:p-4">الحالة</th>
                  <th className="p-3 sm:p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-xs sm:text-sm">
                {programs.length ? (
                  programs.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-secondary/20">
                      <td className="p-3 sm:p-4 font-medium text-primary whitespace-nowrap">{p.name}</td>
                      <td className="p-3 sm:p-4 text-muted-foreground whitespace-nowrap">{p.institution_id?.name || "—"}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">{p.degree || "—"}</td>
                      <td className="p-3 sm:p-4 text-xs text-muted-foreground whitespace-nowrap">{p.language || "—"} · {p.duration || "—"}</td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${p.is_visible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                          {p.is_visible ? "ظاهر" : "مخفي"}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-left whitespace-nowrap flex items-center justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => openEdit(p)}><Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-destructive hover:text-destructive" onClick={() => confirmDelete(p)}><Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="p-8 text-center text-xs sm:text-sm text-muted-foreground">لا توجد تخصصات مضافة.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card rounded-2xl p-4 sm:p-6 max-w-lg w-full space-y-3 sm:space-y-4 max-h-[90vh] overflow-y-auto shadow-xl border border-border">
            <h2 className="text-base sm:text-lg font-bold text-primary">{currentProgram ? "تعديل التخصص" : "إضافة تخصص جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <Label>اسم التخصص</Label>
                <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="space-y-1.5">
                <Label>المؤسسة (الجامعة أو المعهد)</Label>
                <select
                  value={formData.institution_id}
                  onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                  className="h-9 sm:h-10 w-full rounded-xl border border-input bg-background px-3 text-xs sm:text-sm text-right"
                  required
                >
                  <option value="">اختر المؤسسة التابعة لها</option>
                  {institutions.map((inst) => (
                    <option key={inst._id || inst.id} value={inst._id || inst.id}>
                      {inst.name} ({inst.type === "university" ? "جامعة" : "معهد"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label>الدرجة العلمية</Label>
                  <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="بكالوريوس" />
                </div>
                <div className="space-y-1.5">
                  <Label>لغة الدراسة</Label>
                  <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} placeholder="الإنجليزية" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label>مدة الدراسة</Label>
                  <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="4 سنوات" />
                </div>
                <div className="space-y-1.5">
                  <Label>الرسوم الدراسية</Label>
                  <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" value={formData.tuition_fees} onChange={(e) => setFormData({ ...formData, tuition_fees: e.target.value })} placeholder="سنوياً" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>الوصف</Label>
                <Textarea className="rounded-xl text-xs sm:text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 items-center">
                <div className="space-y-1.5">
                  <Label>الترتيب</Label>
                  <Input className="rounded-xl h-9 sm:h-10 text-xs sm:text-sm" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} />
                </div>
                <div className="flex items-center justify-between pt-5">
                  <Label>ظاهر على الموقع</Label>
                  <Switch checked={formData.is_visible} onCheckedChange={(val) => setFormData({ ...formData, is_visible: val })} />
                </div>
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

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-card rounded-2xl p-4 sm:p-6 max-w-sm w-full space-y-3 sm:space-y-4 text-center shadow-xl border border-border">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-1 sm:mb-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-primary">تأكيد الحذف</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              هل أنت متأكد من رغبتك في حذف تخصص <span className="font-semibold text-primary">"{programToDelete?.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء.
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
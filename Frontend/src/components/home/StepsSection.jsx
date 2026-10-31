const STEPS = [
  { title: "اختر مؤسستك", text: "تصفح الجامعات والمعاهد وقارن التخصصات والرسوم." },
  { title: "أكمل نموذج التقديم", text: "بيانات بسيطة وواضحة، بدون تعقيد أو حسابات." },
  { title: "ارفع مستنداتك", text: "قائمة المستندات تظهر تلقائيًا حسب المؤسسة التي اخترتها." },
  { title: "راجع وأرسل", text: "راجع بياناتك ثم أرسل الطلب واحتفظ برقمه لمتابعة الحالة." },
];

export default function StepsSection() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4" dir="rtl">
      {STEPS.map((step, index) => (
        <div
          key={step.title}
          className="relative rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 text-right shadow-md sm:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#0d8274]/30 hover:shadow-xl"
        >
          <span className="font-heading text-xl sm:text-3xl font-extrabold text-amber-500/80">
            {`٠${index + 1}`}
          </span>
          <h3 className="mt-2 font-heading text-xs sm:text-base font-bold text-slate-900">
            {step.title}
          </h3>
          <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm leading-relaxed text-slate-600 line-clamp-3 sm:line-clamp-none">
            {step.text}
          </p>
        </div>
      ))}
    </div>
  );
}
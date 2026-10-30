import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "بيانات الطالب" },
  { id: 2, label: "المستندات" },
  { id: 3, label: "المراجعة والإرسال" },
];

export default function StepIndicator({ current }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4 text-right" dir="rtl">
      {STEPS.map((step, index) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  done
                    ? "bg-amber-500 text-slate-900"
                    : active
                      ? "bg-[#0d8274] text-white"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : step.id}
              </span>
              <span
                className={`whitespace-nowrap text-[11px] sm:text-xs ${
                  active ? "font-bold text-slate-900" : "text-slate-500 font-medium"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <span className={`h-px flex-1 ${done ? "bg-amber-500/60" : "bg-slate-200"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
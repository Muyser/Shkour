export default function EmptyState({ title = "لا توجد نتائج", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-border bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
        <span className="text-xl">◦</span>
      </div>
      <p className="font-heading text-lg font-bold text-primary">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}
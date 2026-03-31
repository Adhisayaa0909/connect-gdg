const SkeletonCard = () => (
  <div className="rounded-xl border bg-card p-6 shadow-sm animate-pulse">
    <div className="flex gap-2 mb-3">
      <div className="h-6 w-16 rounded-full bg-muted" />
      <div className="h-6 w-20 rounded-full bg-muted" />
    </div>
    <div className="h-6 w-3/4 rounded bg-muted mb-2" />
    <div className="h-4 w-full rounded bg-muted mb-1" />
    <div className="h-4 w-2/3 rounded bg-muted mb-4" />
    <div className="h-4 w-1/2 rounded bg-muted mb-2" />
    <div className="h-4 w-1/3 rounded bg-muted mb-5" />
    <div className="flex gap-2">
      <div className="h-10 flex-1 rounded-full bg-muted" />
      <div className="h-10 flex-1 rounded-full bg-muted" />
    </div>
  </div>
);

export default SkeletonCard;

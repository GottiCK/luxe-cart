// Placeholder shown in the product grid while real data is loading —
// matches the real ProductCard's shape so the layout doesn't jump once
// actual products replace it.
export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-cloud" />
      <div className="mt-3 h-3 bg-cloud w-3/4" />
      <div className="mt-2 h-3 bg-cloud w-1/3" />
    </div>
  );
}

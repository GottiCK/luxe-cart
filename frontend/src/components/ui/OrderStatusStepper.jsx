const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderStatusStepper({ status }) {
  if (status === 'Cancelled') {
    return <p className="text-wine text-sm">This order was cancelled.</p>;
  }

  const currentIndex = STATUSES.indexOf(status);

  return (
    <div className="flex items-start">
      {STATUSES.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center shrink-0">
            <div
              className={`w-2.5 h-2.5 rounded-full ${i <= currentIndex ? 'bg-wine' : 'bg-stone/25'}`}
            />
            <span
              className={`text-[10px] mt-1.5 whitespace-nowrap ${
                i <= currentIndex ? 'text-ink' : 'text-stone/50'
              }`}
            >
              {s}
            </span>
          </div>
          {i < STATUSES.length - 1 && (
            <div className={`flex-1 h-px mx-1.5 mb-4 ${i < currentIndex ? 'bg-wine' : 'bg-stone/20'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
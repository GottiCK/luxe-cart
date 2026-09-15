// Marks where a real photo goes. Swap these for actual product/lifestyle
// photography by replacing the parent <img>/background usage — see README.
export default function PlaceholderImage({ label, dims, ratio = 'aspect-[3/4]', className = '' }) {
  return (
    <div
      className={`relative ${ratio} w-full overflow-hidden bg-cloud flex items-center justify-center ${className}`}
    >
      <div className="text-center px-4">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto mb-2 text-stone/40"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="8.5" cy="8.5" r="1.4" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M21 15l-5-5-9 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-xs text-stone/70">{label}</p>
        {dims && <p className="text-[10px] text-stone/50 mt-0.5">{dims}</p>}
      </div>
    </div>
  );
}

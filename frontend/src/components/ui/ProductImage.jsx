import { useState } from 'react';
import PlaceholderImage from './PlaceholderImage';

// Product photos come from real data (product.images[].url — placeholder
// URLs from the seeder for now, real Cloudinary photos once the admin
// image-upload phase is built) so they render as actual <img> tags, unlike
// the site's static design placeholders (hero, category tiles). Falls back
// to the labeled empty state if the URL is missing or fails to load.
export default function ProductImage({ src, alt, ratio = 'aspect-[3/4]', className = '', imgClassName = '' }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <PlaceholderImage label={alt} ratio={ratio} className={className} />;
  }

  return (
    <div className={`relative ${ratio} w-full overflow-hidden bg-cloud ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

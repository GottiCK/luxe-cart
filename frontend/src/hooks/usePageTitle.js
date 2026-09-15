import { useEffect } from 'react';

// Sets the browser tab title for the current page — falls back to the
// site default when no title is given (or once the component unmounts).
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | LUXE CART` : 'LUXE CART | Premium Fashion, Shoes & Slippers';
    return () => {
      document.title = 'LUXE CART | Premium Fashion, Shoes & Slippers';
    };
  }, [title]);
}

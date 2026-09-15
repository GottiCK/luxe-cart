import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';
import { fetchProducts, fetchProductFilters } from '../api/products';
import { fetchCategories } from '../api/categories';
import { usePageTitle } from '../hooks/usePageTitle';

const PARENT_TYPES = [
  { value: 'clothes', label: 'Clothes' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'slippers', label: 'Slippers' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'popular', label: 'Top rated' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  usePageTitle(searchParams.get('search') ? `"${searchParams.get('search')}" — Shop` : 'Shop');

  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [filterOptions, setFilterOptions] = useState({ sizes: [], colors: [], priceRange: { min: 0, max: 0 } });
  const [subcategories, setSubcategories] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [priceInputs, setPriceInputs] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const isNewArrival = searchParams.get('isNewArrival') === 'true';
  const isBestSeller = searchParams.get('isBestSeller') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  // Keep the search box and price inputs in sync if the URL changes elsewhere (e.g. nav links)
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setPriceInputs({
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  // Fetch products whenever the filters in the URL change
  useEffect(() => {
    setLoading(true);
    fetchProducts(Object.fromEntries(searchParams))
      .then((data) => {
        setProducts(data.products);
        setPageInfo({ page: data.page, pages: data.pages, total: data.total });
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Fetch available sizes/colors/price range for the current category
  useEffect(() => {
    fetchProductFilters(category || undefined)
      .then(setFilterOptions)
      .catch(() => {});
  }, [category]);

  // Fetch the subcategory list once a top-level category is chosen
  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      return;
    }
    fetchCategories(category)
      .then(setSubcategories)
      .catch(() => setSubcategories([]));
  }, [category]);

  const updateParams = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === false) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (resetPage) next.delete('page');
    setSearchParams(next);
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => setSearchParams({});

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  const handlePriceApply = () => {
    updateParams({ minPrice: priceInputs.min, maxPrice: priceInputs.max });
  };

  const activeFilterCount = [category, subcategory, size, color, isNewArrival, isBestSeller, searchParams.get('search')].filter(
    Boolean
  ).length;

  const FilterPanel = (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-stone mb-3">Category</p>
        <div className="space-y-2">
          {PARENT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => updateParams({ category: category === t.value ? '' : t.value, subcategory: '' })}
              className={`block text-sm ${category === t.value ? 'text-wine' : 'text-ink/75 hover:text-ink'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {subcategories.length > 0 && (
        <div>
          <p className="text-xs text-stone mb-3">Type</p>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((c) => (
              <button
                key={c._id}
                onClick={() => updateParams({ subcategory: subcategory === c.name ? '' : c.name })}
                className={`px-3 py-1.5 text-xs border ${
                  subcategory === c.name ? 'border-ink bg-ink text-bone' : 'border-stone/30 text-ink/75 hover:border-ink'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {filterOptions.sizes.length > 0 && (
        <div>
          <p className="text-xs text-stone mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {filterOptions.sizes.map((s) => (
              <button
                key={s}
                onClick={() => updateParams({ size: size === s ? '' : s })}
                className={`px-3 py-1.5 text-xs border ${
                  size === s ? 'border-ink bg-ink text-bone' : 'border-stone/30 text-ink/75 hover:border-ink'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {filterOptions.colors.length > 0 && (
        <div>
          <p className="text-xs text-stone mb-3">Color</p>
          <div className="flex flex-wrap gap-2">
            {filterOptions.colors.map((c) => (
              <button
                key={c}
                onClick={() => updateParams({ color: color === c ? '' : c })}
                className={`px-3 py-1.5 text-xs border ${
                  color === c ? 'border-ink bg-ink text-bone' : 'border-stone/30 text-ink/75 hover:border-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-stone mb-3">Price (GH₵)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={priceInputs.min}
            onChange={(e) => setPriceInputs((p) => ({ ...p, min: e.target.value }))}
            className="w-full border border-stone/30 bg-transparent px-3 py-2 text-xs focus:border-wine outline-none"
          />
          <span className="text-stone/50">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={priceInputs.max}
            onChange={(e) => setPriceInputs((p) => ({ ...p, max: e.target.value }))}
            className="w-full border border-stone/30 bg-transparent px-3 py-2 text-xs focus:border-wine outline-none"
          />
        </div>
        <button onClick={handlePriceApply} className="mt-2 text-xs text-wine hover:text-wine-dark">
          Apply
        </button>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-center gap-2 text-sm text-ink/80 cursor-pointer">
          <input
            type="checkbox"
            checked={isNewArrival}
            onChange={(e) => updateParams({ isNewArrival: e.target.checked })}
            className="accent-wine"
          />
          New arrivals
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/80 cursor-pointer">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => updateParams({ isBestSeller: e.target.checked })}
            className="accent-wine"
          />
          Best sellers
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="text-xs text-stone hover:text-wine underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">Shop all</h1>
          <p className="text-sm text-stone">{loading ? 'Loading…' : `${pageInfo.total} product${pageInfo.total === 1 ? '' : 's'}`}</p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              className="border border-stone/30 bg-transparent px-3 py-2 text-sm w-40 sm:w-56 focus:border-wine outline-none"
            />
          </form>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value }, { resetPage: false })}
            className="border border-stone/30 bg-transparent px-3 py-2 text-sm focus:border-wine outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="lg:hidden border border-stone/30 px-4 py-2 text-sm"
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        {mobileFiltersOpen && (
          <div className="lg:hidden border border-stone/20 p-5 mb-2">{FilterPanel}</div>
        )}

        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink mb-2">No products match your filters</p>
              <p className="text-sm text-stone mb-6">Try widening your search or clearing a filter.</p>
              <button onClick={clearFilters} className="border border-ink text-ink px-6 py-3 text-sm hover:border-wine hover:text-wine transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pageInfo.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: page - 1 }, { resetPage: false })}
                    className="text-sm text-ink disabled:text-stone/40 hover:text-wine"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-stone">
                    Page {pageInfo.page} of {pageInfo.pages}
                  </span>
                  <button
                    disabled={page >= pageInfo.pages}
                    onClick={() => updateParams({ page: page + 1 }, { resetPage: false })}
                    className="text-sm text-ink disabled:text-stone/40 hover:text-wine"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

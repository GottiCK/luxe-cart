import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProducts } from '../../api/products';
import { adminDeleteProduct } from '../../api/admin';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchProducts({ limit: 100 })
      .then((d) => setProducts(d.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await adminDeleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-ink text-bone px-5 py-2.5 text-sm hover:bg-wine transition-colors"
        >
          Add product
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-stone">No products yet — add your first one.</p>
      ) : (
        <div className="border border-stone/20 divide-y divide-stone/15">
          {products.map((p) => (
            <div key={p._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-ink">{p.name}</p>
                <p className="text-xs text-stone mt-1">
                  {p.category} · {p.subcategory} · GH₵ {p.price} · {p.totalStock} in stock
                </p>
              </div>
              <div className="flex gap-4 text-sm shrink-0">
                <Link to={`/admin/products/${p._id}`} className="text-wine hover:text-wine-dark">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p._id, p.name)} className="text-stone hover:text-wine">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../api/categories';
import { adminCreateCategory, adminDeleteCategory } from '../../api/admin';

const PARENT_TYPES = ['clothes', 'shoes', 'slippers'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', parentType: 'clothes' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await adminCreateCategory(form);
      toast.success('Category added');
      setForm({ name: '', parentType: form.parentType });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await adminDeleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete category');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Categories</h1>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 mb-8">
        <input
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="border border-stone/30 bg-transparent px-4 py-2.5 text-sm focus:border-wine outline-none"
        />
        <select
          value={form.parentType}
          onChange={(e) => setForm((f) => ({ ...f, parentType: e.target.value }))}
          className="border border-stone/30 bg-transparent px-4 py-2.5 text-sm focus:border-wine outline-none"
        >
          {PARENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-bone px-5 py-2.5 text-sm hover:bg-wine transition-colors disabled:opacity-60"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : (
        <div className="border border-stone/20 divide-y divide-stone/15">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-5 py-3">
              <p className="text-sm text-ink">
                {c.name} <span className="text-xs text-stone ml-2">{c.parentType}</span>
              </p>
              <button onClick={() => handleDelete(c._id, c.name)} className="text-sm text-stone hover:text-wine">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

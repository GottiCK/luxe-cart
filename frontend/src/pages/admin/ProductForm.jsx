import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProductBySlug } from '../../api/products';
import { adminCreateProduct, adminUpdateProduct, uploadProductImage } from '../../api/admin';

const CATEGORY_OPTIONS = ['clothes', 'shoes', 'slippers'];

const emptyVariant = () => ({ size: '', color: '', stock: 0 });

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = id !== 'new' && !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'clothes',
    subcategory: '',
    price: '',
    discountPrice: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  });
  const [variants, setVariants] = useState([emptyVariant()]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    fetchProductBySlug(id)
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description,
          category: p.category,
          subcategory: p.subcategory,
          price: p.price,
          discountPrice: p.discountPrice ?? '',
          isFeatured: p.isFeatured,
          isNewArrival: p.isNewArrival,
          isBestSeller: p.isBestSeller,
        });
        setVariants(p.variants.length ? p.variants : [emptyVariant()]);
        setImages(p.images || []);
      })
      .catch(() => toast.error('Could not load product'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((v) => v.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addVariant = () => setVariants((v) => [...v, emptyVariant()]);
  const removeVariant = (index) => setVariants((v) => v.filter((_, i) => i !== index));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const image = await uploadProductImage(file);
      setImages((imgs) => [...imgs, image]);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => setImages((imgs) => imgs.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanVariants = variants
      .filter((v) => v.size && v.color)
      .map((v) => ({ ...v, stock: Number(v.stock) || 0 }));

    if (cleanVariants.length === 0) {
      toast.error('Add at least one size/color variant');
      return;
    }
    if (images.length === 0) {
      toast.error('Add at least one product image');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice === '' ? null : Number(form.discountPrice),
        variants: cleanVariants,
        images,
      };

      if (isEdit) {
        await adminUpdateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await adminCreateProduct(payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-stone">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">{isEdit ? 'Edit product' : 'Add product'}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none sm:col-span-2"
          />
          <textarea
            required
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none sm:col-span-2"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            required
            name="subcategory"
            placeholder="Type (e.g. T-shirts)"
            value={form.subcategory}
            onChange={handleChange}
            className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
          <input
            required
            type="number"
            min="0"
            name="price"
            placeholder="Price (GH₵)"
            value={form.price}
            onChange={handleChange}
            className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
          <input
            type="number"
            min="0"
            name="discountPrice"
            placeholder="Sale price (optional)"
            value={form.discountPrice}
            onChange={handleChange}
            className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-5">
          {[
            ['isFeatured', 'Featured'],
            ['isNewArrival', 'New arrival'],
            ['isBestSeller', 'Best seller'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="accent-wine" />
              {label}
            </label>
          ))}
        </div>

        <div>
          <p className="text-sm text-ink mb-3">Images</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-ink text-bone w-5 h-5 text-xs rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="inline-block border border-stone/30 px-4 py-2 text-sm cursor-pointer hover:border-wine">
            {uploading ? 'Uploading…' : 'Add image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        <div>
          <p className="text-sm text-ink mb-3">Sizes, colors &amp; stock</p>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 items-center flex-wrap">
                <input
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                  className="border border-stone/30 bg-transparent px-3 py-2 text-sm w-24 focus:border-wine outline-none"
                />
                <input
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(i, 'color', e.target.value)}
                  className="border border-stone/30 bg-transparent px-3 py-2 text-sm w-32 focus:border-wine outline-none"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(i, 'stock', e.target.value)}
                  className="border border-stone/30 bg-transparent px-3 py-2 text-sm w-24 focus:border-wine outline-none"
                />
                <button type="button" onClick={() => removeVariant(i)} className="text-stone hover:text-wine text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addVariant} className="mt-3 text-sm text-wine hover:text-wine-dark">
            + Add variant
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchAddresses,
  createAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
} from '../api/addresses';
import { GHANA_REGIONS } from '../data/regions';
import { usePageTitle } from '../hooks/usePageTitle';

export default function DeliveryAddresses() {
  usePageTitle('Delivery Addresses');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', region: '', city: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAddresses()
      .then(setAddresses)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAddress(form);
      toast.success('Address saved');
      setForm({ fullName: '', phone: '', address: '', region: '', city: '' });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await apiDeleteAddress(id);
      toast.success('Address removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await apiSetDefaultAddress(id);
      toast.success('Default address updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  if (loading) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-sm text-stone">Loading…</div>;
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-14">
      <Link to="/account" className="text-sm text-stone hover:text-wine mb-6 inline-block">
        ← Back to account
      </Link>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Delivery addresses</h1>

      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-stone mb-6">No saved addresses yet.</p>
      )}

      <div className="space-y-3 mb-8 max-w-lg">
        {addresses.map((a) => (
          <div key={a._id} className="border border-stone/20 p-5">
            <p className="text-sm text-ink">
              {a.fullName}
              {a.isDefault && (
                <span className="text-[10px] text-wine ml-2 border border-wine px-1.5 py-0.5">Default</span>
              )}
            </p>
            <p className="text-xs text-stone mt-1">{a.phone}</p>
            <p className="text-xs text-stone mt-1">
              {a.address}, {a.city}, {a.region}
            </p>
            <div className="flex gap-4 mt-3 text-xs">
              {!a.isDefault && (
                <button onClick={() => handleSetDefault(a._id)} className="text-wine hover:text-wine-dark">
                  Set as default
                </button>
              )}
              <button onClick={() => handleDelete(a._id)} className="text-stone hover:text-wine">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4 border border-stone/20 p-6">
          <input
            required
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
          <input
            required
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
          <input
            required
            name="address"
            placeholder="Delivery address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              required
              name="region"
              value={form.region}
              onChange={handleChange}
              className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
            >
              <option value="">Region</option>
              {GHANA_REGIONS.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
            <input
              required
              name="city"
              placeholder="City / Town"
              value={form.city}
              onChange={handleChange}
              className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save address'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-stone/30 text-ink px-6 py-3 text-sm hover:border-wine transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors"
        >
          Add new address
        </button>
      )}
    </div>
  );
}

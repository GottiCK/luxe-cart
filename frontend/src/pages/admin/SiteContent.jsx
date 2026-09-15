import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchSiteSettings } from '../../api/settings';
import { adminUpdateSiteSettings, uploadProductImage } from '../../api/admin';

const CATEGORY_LABELS = {
  clothes: 'Clothes',
  shoes: 'Shoes',
  slippers: 'Slippers',
};

export default function SiteContent() {
  const [heroImage, setHeroImage] = useState({ url: '', publicId: '' });
  const [categoryImages, setCategoryImages] = useState({
    clothes: { url: '', publicId: '' },
    shoes: { url: '', publicId: '' },
    slippers: { url: '', publicId: '' },
  });
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        if (settings.heroImage?.url) setHeroImage(settings.heroImage);
        if (settings.categoryImages) {
          setCategoryImages((prev) => ({ ...prev, ...settings.categoryImages }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey('hero');
    try {
      const image = await uploadProductImage(file);
      setHeroImage(image);
      toast.success('Hero image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingKey(null);
      e.target.value = '';
    }
  };

  const handleCategoryUpload = async (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey(key);
    try {
      const image = await uploadProductImage(file);
      setCategoryImages((prev) => ({ ...prev, [key]: image }));
      toast.success(`${CATEGORY_LABELS[key]} image uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingKey(null);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateSiteSettings({ heroImage, categoryImages });
      toast.success('Homepage content updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-stone">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Homepage content</h1>
      <p className="text-sm text-stone mb-8">
        Update the hero banner and category images shown on the homepage.
      </p>

      <div className="max-w-2xl space-y-10">
        <div>
          <p className="text-sm text-ink mb-3">Hero banner</p>
          {heroImage.url && (
            <img src={heroImage.url} alt="Hero" className="w-full max-w-md aspect-[16/9] object-cover mb-3" />
          )}
          <label className="inline-block border border-stone/30 px-4 py-2 text-sm cursor-pointer hover:border-wine">
            {uploadingKey === 'hero' ? 'Uploading…' : heroImage.url ? 'Replace image' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroUpload}
              disabled={uploadingKey !== null}
              className="hidden"
            />
          </label>
          <p className="text-[11px] text-stone/70 mt-2">Recommended: 1920×1080px, landscape orientation.</p>
        </div>

        <div>
          <p className="text-sm text-ink mb-3">Category images</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Object.keys(CATEGORY_LABELS).map((key) => (
              <div key={key}>
                <p className="text-xs text-stone mb-2">{CATEGORY_LABELS[key]}</p>
                {categoryImages[key]?.url && (
                  <img src={categoryImages[key].url} alt={key} className="w-full aspect-[3/4] object-cover mb-2" />
                )}
                <label className="inline-block border border-stone/30 px-3 py-1.5 text-xs cursor-pointer hover:border-wine">
                  {uploadingKey === key ? 'Uploading…' : categoryImages[key]?.url ? 'Replace' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCategoryUpload(key, e)}
                    disabled={uploadingKey !== null}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-stone/70 mt-2">Recommended: 900×1200px, portrait orientation.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

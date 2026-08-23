import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productService.js';
import { ApiError } from '../services/apiClient.js';

const categories = [
  'Beer',
  'Single Malt Whisky',
  'Blended Whisky',
  'Vodka',
  'Gin',
  'Dark Rum',
  'White Rum',
  'Tequila',
  'Cognac',
  'Brandy',
  'Wine',
];

const initialForm = {
  name: '',
  batch: '',
  category: 'Single Malt Whisky',
  price: '',
  volume: '',
  abv: '',
  color: '#C9822B',
  image: '',
  description: '',
};

function Field({ label, name, value, onChange, error, type = 'text', placeholder, required = true, ...props }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest2 text-stone mb-2">
        {label}{required && <span className="text-gold"> *</span>}
      </span>
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-surface border px-4 py-3 text-sm text-bone placeholder:text-stone/60 outline-none transition-colors focus:border-gold ${error ? 'border-burgundy' : 'border-white/10'}`}
      />
      {error && <span className="block mt-1 text-xs text-burgundy">{error}</span>}
    </label>
  );
}

export default function CreateProduct() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = ['name', 'category', 'price', 'volume', 'abv', 'image', 'description'];
    requiredFields.forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = 'This field is required';
    });
    if (form.price && (Number.isNaN(Number(form.price)) || Number(form.price) < 0)) {
      nextErrors.price = 'Enter a valid non-negative price';
    }
    if (form.image && !/^https?:\/\/\S+$/i.test(form.image)) {
      nextErrors.image = 'Enter a valid image URL';
    }
    if (form.color && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(form.color)) {
      nextErrors.color = 'Use a valid hex color';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setSubmitError('');
    try {
      const product = await createProduct({
        ...form,
        price: Number(form.price),
        batch: form.batch || undefined,
        color: form.color || undefined,
      });
      navigate(`/product/${product.id}`);
    } catch (error) {
      setStatus('idle');
      setSubmitError(error instanceof ApiError ? error.message : 'Could not create the product. Try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Link to="/" className="text-xs text-stone hover:text-gold uppercase tracking-widest2">
        &larr; Back to catalog
      </Link>

      <div className="max-w-3xl mt-8">
        <div className="eyebrow mb-4"><span /> Catalog management</div>
        <h1 className="font-display text-4xl md:text-5xl text-bone mb-3">Add a bottle</h1>
        <p className="text-stone text-sm leading-relaxed mb-10">Create a new listing for the Reserve collection.</p>

        <form onSubmit={handleSubmit} className="border-t border-white/10 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="e.g. The Reserve 12" />
            <Field label="Batch" name="batch" value={form.batch} onChange={handleChange} error={errors.batch} placeholder="e.g. Batch 04" required={false} />

            <label className="block">
              <span className="block text-[10px] uppercase tracking-widest2 text-stone mb-2">Category <span className="text-gold">*</span></span>
              <select name="category" value={form.category} onChange={handleChange} className="w-full bg-surface border border-white/10 px-4 py-3 text-sm text-bone outline-none focus:border-gold">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              {errors.category && <span className="block mt-1 text-xs text-burgundy">{errors.category}</span>}
            </label>
            <Field label="Price (INR)" name="price" value={form.price} onChange={handleChange} error={errors.price} type="number" min="0" step="0.01" placeholder="8500" />
            <Field label="Volume" name="volume" value={form.volume} onChange={handleChange} error={errors.volume} placeholder="750 ml" />
            <Field label="ABV" name="abv" value={form.abv} onChange={handleChange} error={errors.abv} placeholder="43%" />
            <Field label="Image URL" name="image" value={form.image} onChange={handleChange} error={errors.image} type="url" placeholder="https://..." />
            <Field label="Label color" name="color" value={form.color} onChange={handleChange} error={errors.color} type="text" placeholder="#C9822B" required={false} />
          </div>

          <label className="block mt-6">
            <span className="block text-[10px] uppercase tracking-widest2 text-stone mb-2">Description <span className="text-gold">*</span></span>
            <textarea name="description" value={form.description} onChange={handleChange} required maxLength={600} rows={5} placeholder="A short note about this bottle..." className={`w-full resize-y bg-surface border px-4 py-3 text-sm text-bone placeholder:text-stone/60 outline-none transition-colors focus:border-gold ${errors.description ? 'border-burgundy' : 'border-white/10'}`} />
            <span className="flex justify-between mt-1 text-xs text-stone"><span>{errors.description}</span><span>{form.description.length}/600</span></span>
          </label>

          {submitError && <p role="alert" className="mt-6 border border-burgundy/50 bg-burgundy/10 px-4 py-3 text-sm text-bone">{submitError}</p>}

          <div className="flex items-center gap-5 mt-8">
            <button type="submit" disabled={status === 'submitting'} className="premium-button px-6 py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors disabled:cursor-wait disabled:opacity-60">
              {status === 'submitting' ? 'Creating...' : 'Create product'} <span aria-hidden="true">&#8594;</span>
            </button>
            <Link to="/" className="text-xs uppercase tracking-widest2 text-stone hover:text-gold">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
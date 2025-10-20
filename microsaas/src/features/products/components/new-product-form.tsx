'use client'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { productSchema } from '../schemas'
import { useState } from 'react'

interface ProductFormProps {
  onSubmit: (data: z.infer<typeof productSchema>) => Promise<void>
  defaultValues?: Partial<z.infer<typeof productSchema>>
}

export function ProductForm({ onSubmit, defaultValues }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || '',
      tagline: defaultValues?.tagline || '',
      website_url: defaultValues?.website_url || '',
      repo_url: defaultValues?.repo_url,
      is_open_source: defaultValues?.is_open_source || false,
      description: defaultValues?.description || '',
      tags: defaultValues?.tags || [],
      logo_url: defaultValues?.logo_url,
      demo_url: defaultValues?.demo_url,
      pricing_model: defaultValues?.pricing_model || 'free',
      promo_code: defaultValues?.promo_code,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        await onSubmit(value)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && form.state.values.tags.length < 3) {
      form.setFieldValue('tags', [...form.state.values.tags, trimmed])
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    const newTags = form.state.values.tags.filter((_, i) => i !== index)
    form.setFieldValue('tags', newTags)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          validators={{
            onChange: productSchema.shape.name,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="name">
                  Name of the Launch *
                </FieldLabel>
                <input
                  id="name"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                  placeholder="My Awesome SaaS"
                />
                <FieldDescription>
                  The name of your product
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="tagline"
          validators={{
            onChange: productSchema.shape.tagline,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="tagline">
                  Tagline *
                </FieldLabel>
                <input
                  id="tagline"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                  placeholder="The best way to manage your tasks"
                />
                <FieldDescription>
                  A short, catchy description
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="website_url"
          validators={{
            onChange: productSchema.shape.website_url,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="website_url">
                  Website URL *
                </FieldLabel>
                <input
                  id="website_url"
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                  placeholder="https://example.com"
                />
                <FieldDescription>
                  Link to your product website
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="is_open_source">
          {(field) => {
            return (
              <Field orientation="horizontal">
                <input
                  id="is_open_source"
                  type="checkbox"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="w-4 h-4"
                />
                <FieldLabel htmlFor="is_open_source">
                  Is this open source?
                </FieldLabel>
              </Field>
            )
          }}
        </form.Field>

        {form.state.values.is_open_source && (
          <form.Field
            name="repo_url"
            validators={{
              onChange: productSchema.shape.repo_url,
            }}
          >
            {(field) => {
              return (
                <Field>
                  <FieldLabel htmlFor="repo_url">
                    Repository URL *
                  </FieldLabel>
                  <input
                    id="repo_url"
                    type="url"
                    value={field.state.value || ''}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value || undefined)}
                    className="w-full border px-3 py-2"
                    placeholder="https://github.com/username/repo"
                  />
                  <FieldDescription>
                    Link to your GitHub/GitLab repository
                  </FieldDescription>
                </Field>
              )
            }}
          </form.Field>
        )}

        <form.Field
          name="description"
          validators={{
            onChange: productSchema.shape.description,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="description">
                  Description *
                </FieldLabel>
                <textarea
                  id="description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full border px-3 py-2 min-h-[120px]"
                  aria-invalid={isInvalid}
                  placeholder="Tell us about your product, its features, and what makes it unique..."
                />
                <FieldDescription>
                  Detailed description (50-1000 characters)
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="tags"
          validators={{
            onChange: productSchema.shape.tags,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="tags">
                  Tags * (up to 3)
                </FieldLabel>
                <div className="flex gap-2">
                  <input
                    id="tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    className="flex-1 border px-3 py-2"
                    placeholder="Add a tag"
                    disabled={field.state.value.length >= 3}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={field.state.value.length >= 3 || !tagInput.trim()}
                    className="border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                {field.state.value.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.state.value.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 border px-2 py-1 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <FieldDescription>
                  Add up to 3 tags to help people find your product
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="logo_url"
          validators={{
            onChange: productSchema.shape.logo_url,
          }}
        >
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor="logo_url">
                  Logo
                </FieldLabel>
                <div className="space-y-4">
                  <div>
                    <input
                      id="logo_url"
                      type="url"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value || undefined)}
                      className="w-full border px-3 py-2"
                      placeholder="https://example.com/logo.png"
                    />
                    <FieldDescription>
                      Direct link to your product logo
                    </FieldDescription>
                  </div>
                  
                  <div className="border p-4">
                    <p className="text-sm mb-2">Or upload a logo:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // TODO: Upload to Supabase Storage
                          console.log('Logo file selected:', file.name)
                          // For now, just show a placeholder
                          alert('File upload coming soon! For now, please use a URL.')
                        }
                      }}
                      className="w-full text-sm"
                    />
                    <FieldDescription>
                      Upload will be available soon
                    </FieldDescription>
                  </div>
                </div>
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="demo_url"
          validators={{
            onChange: productSchema.shape.demo_url,
          }}
        >
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor="demo_url">
                  Demo Video URL (Loom or YouTube)
                </FieldLabel>
                <input
                  id="demo_url"
                  type="url"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || undefined)}
                  className="w-full border px-3 py-2"
                  placeholder="https://loom.com/share/..."
                />
                <FieldDescription>
                  Link to a Loom or YouTube demo video
                </FieldDescription>
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="pricing_model"
          validators={{
            onChange: productSchema.shape.pricing_model,
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <FieldLabel htmlFor="pricing_model">
                  Pricing Model *
                </FieldLabel>
                <select
                  id="pricing_model"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as 'free' | 'freemium' | 'premium')}
                  className="w-full border px-3 py-2"
                  aria-invalid={isInvalid}
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="premium">Premium</option>
                </select>
                <FieldDescription>
                  How do you monetize your product?
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="promo_code"
          validators={{
            onChange: productSchema.shape.promo_code,
          }}
        >
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor="promo_code">
                  Promo Code
                </FieldLabel>
                <input
                  id="promo_code"
                  type="text"
                  value={field.state.value || ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value || undefined)}
                  className="w-full border px-3 py-2"
                  placeholder="SUMMER2024"
                />
                <FieldDescription>
                  Optional promo code for early users
                </FieldDescription>
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border px-6 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Product'}
        </button>
      </div>
    </form>
  )
}


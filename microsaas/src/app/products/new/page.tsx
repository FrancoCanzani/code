'use client'

import { ProductForm } from '@/features/products/components/new-product-form'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { productSchema } from '@/features/products/schemas'
import { z } from 'zod'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in to submit a product')
        router.push('/login')
        return
      }

      // TODO: Insert into database once schema is set up
      console.log('Product data:', data)
      
      // For now, just show success message
      alert('Product submitted successfully! (Database integration coming soon)')
      router.push('/')
    } catch (error) {
      console.error('Error submitting product:', error)
      alert('Failed to submit product. Please try again.')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">
              Submit a Product
            </h1>
            <p className="text-sm">
              Share your micro SaaS with the community
            </p>
          </div>

          <div className="border p-8">
            <ProductForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}

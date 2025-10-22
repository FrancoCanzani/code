'use client'

import { ProductForm } from '@/features/products/components/new-product-form'
import { useCreateProduct } from '@/features/products/mutations'
import { useRouter } from 'next/navigation'
import { productSchema } from '@/features/products/schemas'
import { z } from 'zod'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const createProductMutation = useCreateProduct()

  const handleSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      await createProductMutation.mutateAsync(data)
      toast.success('Product submitted successfully!')
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('logged in')) {
          router.push('/login')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Failed to submit product. Please try again.')
      }
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
            <ProductForm 
              onSubmit={handleSubmit}
              isSubmitting={createProductMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export type PricingModel = 'free' | 'freemium' | 'premium'

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  website_url: string
  repo_url?: string
  is_open_source: boolean
  logo_url?: string
  demo_url?: string
  pricing_model: PricingModel
  promo_code?: string
  tags: string[]
  maker_id: string
  status: 'draft' | 'pending' | 'launched' | 'featured'
  upvotes_count: number
  comments_count: number
  views_count: number
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  name: string
  tagline: string
  website_url: string
  repo_url?: string
  is_open_source: boolean
  description: string
  tags: string[]
  logo_url?: string
  demo_url?: string
  pricing_model: PricingModel
  promo_code?: string
}


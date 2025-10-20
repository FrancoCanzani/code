import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-2xl font-semibold mb-2">
              MicroSaaS
            </h1>
            <p className="text-sm">
              Discover and share micro SaaS products
            </p>
          </div>

          <div className="border p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Dashboard
              </h2>
              <div className="text-sm">
                {user.email}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/products/new"
                className="border p-6 hover:bg-gray-50"
              >
                <h3 className="font-semibold mb-1">Submit Product</h3>
                <p className="text-sm">
                  Share your micro SaaS
                </p>
              </Link>

              <Link
                href="/products"
                className="border p-6 hover:bg-gray-50"
              >
                <h3 className="font-semibold mb-1">Discover</h3>
                <p className="text-sm">
                  Explore products
                </p>
              </Link>

              <Link
                href="/profile"
                className="border p-6 hover:bg-gray-50"
              >
                <h3 className="font-semibold mb-1">Profile</h3>
                <p className="text-sm">
                  Manage account
                </p>
              </Link>
            </div>
          </div>

          <div className="border p-8">
            <h3 className="text-lg font-semibold mb-4">
              Coming Soon
            </h3>
            <div className="space-y-2 text-sm">
              <div>Product analytics</div>
              <div>Comments and discussions</div>
              <div>Upvoting</div>
              <div>Email notifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

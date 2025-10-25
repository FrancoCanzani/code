import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import CommentSection from "@/features/products/components/comment-section";
import UpvoteButton from "@/features/products/components/upvote-button";
import { Product } from "@/features/products/types";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      upvotes!left(user_id)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const processedProduct: Product = {
    ...product,
    is_upvoted: user
      ? (product.upvotes?.some((upvote: any) => upvote.user_id === user.id) ??
        false)
      : false,
  };

  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:profiles!comments_user_id_fkey(name, avatar_url)
    `,
    )
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-6">
          <main className="flex-1">
            <div className="flex items-start gap-x-6">
              <div className="rounded-md w-10 flex items-center justify-center h-10 bg-gray-100 p-1">
                {product.logo_url ? (
                  <Image
                    src={product.logo_url}
                    alt={`${product.name} logo`}
                    width={30}
                    height={30}
                  />
                ) : (
                  <div className="h-9 w-9 flex items-center font-medium italic justify-center">
                    {product.name.split("")[0]}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-medium">{product.name}</h2>
                <h3 className="text-muted-foreground text-sm">
                  {product.tagline}
                </h3>
                <p className="my-4">{product.description}</p>

                {product.demo_url && (
                  <div className="my-4">
                    <div className="relative w-full max-w-2xl">
                      <iframe
                        src={
                          product.demo_url.includes("youtube.com")
                            ? product.demo_url.replace("watch?v=", "embed/")
                            : product.demo_url
                        }
                        className="w-full h-64 rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${product.name} demo video`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <CommentSection
              productId={id}
              initialComments={comments || []}
              currentUserId={user?.id}
              commentsCount={product.comments_count || 0}
            />
          </main>

          <div className="w-80 shrink-0 space-y-6">
            <div className="flex flex-col gap-2">
              <Button asChild variant={"outline"} className="w-full">
                <a
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              </Button>
              <UpvoteButton product={processedProduct} />
            </div>

            {(product.twitter_url ||
              product.linkedin_url ||
              product.product_hunt_url) && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-sm">Socials</h4>
                <div className="flex gap-2">
                  {product.twitter_url && (
                    <a
                      href={product.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title="Twitter"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {product.linkedin_url && (
                    <a
                      href={product.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title="LinkedIn"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {product.product_hunt_url && (
                    <a
                      href={product.product_hunt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title="Product Hunt"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.604 9.4h-3.405v3.2h3.405a1.6 1.6 0 1 0 0-3.2M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0m1.604 14.4h-3.405V18H7.801V6h5.803a4.4 4.4 0 1 1 0 8.4" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Team Section */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-sm">Team</h4>
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium">
                  AS
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium">
                  MK
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium">
                  LC
                </div>
              </div>
            </div>

            {product.repo_url && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-sm">Open Source</h4>
                <a
                  href={product.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Repository
                </a>
              </div>
            )}

            <Button variant="outline" className="w-full">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

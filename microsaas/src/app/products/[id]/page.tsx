import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import UpvoteButton from "@/features/products/components/upvote-button";
import { Product } from "@/features/products/types";
import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight, Github, MessageSquare } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: {
    id: string;
  };
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

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-start gap-6">
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
            <div className="inline-flex justify-between w-full">
              <h2 className="text-3xl font-medium">{product.name}</h2>
              <a
                href={product.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:underline hover:text-blue-600 inline-flex items-center gap-1 text-sm font-medium transition-colors duration-100"
              >
                Visit Website
                <ArrowUpRight className="opacity-0 size-3.5 group-hover:opacity-100 transition-opacity" />{" "}
              </a>
            </div>
             <h3 className="text-muted-foreground">{product.tagline}</h3>
             <p className="my-4">{product.description}</p>
             
             {product.demo_url && (
               <div className="mt-4">
                 <div className="relative w-full max-w-2xl">
                   <iframe
                     src={product.demo_url.includes('youtube.com') ? product.demo_url.replace('watch?v=', 'embed/') : product.demo_url}
                     className="w-full h-64 rounded-lg"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     title={`${product.name} demo video`}
                   />
                 </div>
               </div>
             )}

            <div className="flex items-center gap-4 mb-6">
              {product.repo_url && (
                <Button variant="outline" asChild>
                  <a
                    href={product.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <UpvoteButton product={processedProduct} />

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>{product.comments_count} comments</span>
              </div>
            </div>
          </div>
        </div>

         <div className="mt-8 pt-6 border-t">
           <h2 className="text-xl font-semibold mb-4">About {product.name}</h2>
           <p className="text-gray-700 leading-relaxed">{product.description}</p>
         </div>

        {product.tags && product.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Product Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Pricing:</span>{" "}
              {product.pricing_model}
            </div>
            <div>
              <span className="font-medium">Platforms:</span>{" "}
              {product.platforms.join(", ")}
            </div>
            {product.promo_code && (
              <div>
                <span className="font-medium">Promo Code:</span>{" "}
                {product.promo_code}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

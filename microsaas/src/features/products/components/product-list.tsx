import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Product } from "../types";

export default async function ProductList({
  date,
}: {
  date: "today" | "yesterday" | "week" | "month";
}) {
  const supabase = await createClient();

  const now = new Date();

  const dates = new Map([
    ["today", new Date(now.getFullYear(), now.getMonth(), now.getDate())],
    [
      "yesterday",
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
    ],
    ["week", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)],
    ["month", new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())],
  ]);

  const titles = new Map([
    ["today", "Today's Top Products"],
    ["yesterday", "Yesterday's Top Products"],
    ["week", "This Week's Top Products"],
    ["month", "This Month's Top Products"],
  ]);

  const startDate = dates.get(date) || dates.get("today")!;
  const title = titles.get(date) || titles.get("today")!;

  const { data: products, error } = await supabase
    .from("products")
    .select()
    .gte("created_at", startDate.toISOString())
    .order("upvotes_count", { ascending: false })
    .limit(5);

  if (error) {
    return (
      <div>
        <div>Error loading products</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="duration-100 ease-out outline-transparent not-disabled:cursor-pointer hover:not-disabled:outline-[3px] hover:not-disabled:outline-border/50 hover:not-disabled:border-ring focus-visible:outline-[3px] focus-visible:outline-border/50 focus-visible:border-ring group relative flex flex-col items-start gap-3 w-full border bg-card p-3 rounded hover:bg-accent"
        >
          <div>
            <a
              href={product.website_url}
              className="group-[anchor] group-[anchor]-hover:font-medium"
            >
              {product.name}
            </a>
            <h3>{product.tagline}</h3>
          </div>

          {product.logo_url ? (
            <Image src={product.logo_url} alt={`${product.name} logo`} />
          ) : (
            <div className="h-3 bg-gray-100">{product.name.split("")[0]}</div>
          )}
        </div>
      ))}
    </div>
  );
}

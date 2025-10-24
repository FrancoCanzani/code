import Header from "@/components/header";
import ProductList from "@/features/products/components/product-list";

export default async function Home() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />
      <main className="p-6 space-y-4 max-w-4xl">
        <ProductList date="today" />
        <ProductList date="yesterday" />
        <ProductList date="week" />
        <ProductList date="month" />
      </main>
    </div>
  );
}

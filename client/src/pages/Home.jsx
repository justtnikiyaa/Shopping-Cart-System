import { useEffect, useState } from "react";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import HeroSection from "../components/home/HeroSection";
import { getCategories, getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      setApiError("");

      try {
        const [productsResult, categoriesResult] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        setProducts(productsResult.products || []);
        setCategories(categoriesResult || []);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <section>
      {apiError ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {apiError}
        </div>
      ) : null}

      <HeroSection featuredProduct={products[0]} />
      <FeaturedCategories categories={categories} loading={loading} />
      <FeaturedProducts products={products} loading={loading} />
    </section>
  );
}

export default Home;

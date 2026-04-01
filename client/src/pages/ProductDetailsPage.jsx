import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { productId } = useParams();

  return (
    <section>
      <h1 className="text-3xl font-bold">Product Details</h1>
      <p className="mt-2 text-slate-600">Viewing product: {productId}</p>
    </section>
  );
}

export default ProductDetailsPage;

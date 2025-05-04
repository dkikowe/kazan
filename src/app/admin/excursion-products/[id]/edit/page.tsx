import { ExcursionProduct } from "@/models/excursion-product";
import { connectToDatabase } from "@/lib/mongodb";
import EditForm from "./edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();
  const product = await ExcursionProduct.findById(id).populate("excursionCard");

  if (!product) {
    throw new Error("Product not found");
  }

  return <EditForm id={id} initialData={product} />;
}

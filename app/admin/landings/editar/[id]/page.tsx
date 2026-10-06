import { notFound } from "next/navigation";
import { getLandingPageById } from "@/lib/actions/landing";
import { LandingForm } from "@/components/landing/LandingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarLandingPage({ params }: Props) {
  const { id } = await params;
  const res = await getLandingPageById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <LandingForm initialData={res.data} isEditing={true} />;
}

import type { Metadata } from "next";
import { PicnicPage } from "@/components/PicnicPage";
import { formatName } from "@/lib/formatName";
import { getPicnicData } from "@/lib/picnic-data";

type PageProps = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const greetingName = formatName(decodeURIComponent(name));

  return {
    title: `Hi ${greetingName} · Gumloop Picnic Basket`,
    description: `We want to send ${greetingName} a picnic basket from Gumloop.`,
  };
}

export default async function PersonalizedPicnicPage({ params }: PageProps) {
  const { name } = await params;
  const greetingName = formatName(decodeURIComponent(name));
  const data = getPicnicData();

  return <PicnicPage greetingName={greetingName} data={data} />;
}

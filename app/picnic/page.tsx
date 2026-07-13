import { PicnicPage } from "@/components/PicnicPage";
import { getPicnicData } from "@/lib/picnic-data";

export default function PicnicFallbackPage() {
  const data = getPicnicData();

  return <PicnicPage greetingName="there" data={data} />;
}

import { Helmet } from "react-helmet-async";
import { PRODUCTION_ORIGIN } from "@/lib/site";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

function documentTitle(title: string): string {
  return title.includes("SoulRide") ? title : `${title} · SoulRide`;
}

export default function Seo({ title, description, path, noindex = false }: SeoProps) {
  const fullTitle = documentTitle(title);
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${PRODUCTION_ORIGIN}${canonicalPath}`;

  return (
    <Helmet>
      <html lang="mk" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="mk_MK" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      {noindex ? null : <link rel="canonical" href={url} />}
    </Helmet>
  );
}

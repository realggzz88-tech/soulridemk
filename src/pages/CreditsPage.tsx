import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PhotoCredit, SmartImage } from "@/components/SmartImage";
import { useCredits, type CreditGroup } from "@/lib/content";

const LICENCES = [
  { name: "CC0", href: "https://creativecommons.org/publicdomain/zero/1.0/" },
  { name: "CC BY", href: "https://creativecommons.org/licenses/by/4.0/" },
  { name: "CC BY-SA", href: "https://creativecommons.org/licenses/by-sa/4.0/" },
];

const CreditsPage = () => {
  const credits = useCredits();
  const groups = credits.data ?? [];
  const spots = groups.filter((group) => group.kind === "spot").sort((a, b) => a.t.en.title.localeCompare(b.t.en.title));
  const routes = groups.filter((group) => group.kind === "route");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen px-4 pb-16 pt-24 sm:px-6 sm:pt-28" style={{ backgroundColor: "hsl(20 15% 8%)" }}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Фотографии и лиценци</h1>
          <p className="text-base leading-relaxed" style={{ color: "hsl(30 10% 70%)" }}>
            Photographs and licences. Every picture is a Wikimedia Commons file we host ourselves. The Macedonian description is the image alt text. The English line is the second description.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {LICENCES.map((licence) => (
              <li key={licence.name}>
                <a href={licence.href} className="underline" style={{ color: "hsl(170 60% 60%)" }} target="_blank" rel="noopener noreferrer">
                  {licence.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm" style={{ color: "hsl(30 10% 60%)" }}>
            Некои фотографии се повторуваат на места и рути. Датотеката се чува еднаш.
          </p>
        </header>

        <Section title="Места" groups={spots} />
        <Section title="Рути" groups={routes} />

        <p className="mt-12 text-sm" style={{ color: "hsl(30 10% 60%)" }}>
          <Link to="/" className="underline">
            Почетна
          </Link>
        </p>
      </div>
    </div>
  );
};

function Section({ title, groups }: { title: string; groups: CreditGroup[] }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-semibold text-white">{title}</h2>
      <div className="space-y-8">
        {groups.map((group) => (
          <article key={`${title}-${group.slug}`}>
            <h3 className="mb-3 text-lg font-semibold text-white">
              <Link to={title === "Рути" ? `/routes/${group.slug}` : `/spots/${group.slug}`} className="hover:underline">
                {group.t.en.title}
              </Link>
            </h3>
            <ul className="space-y-3">
              {group.photos.map((photo) => (
                <li key={photo.key + group.slug} className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-20">
                    <SmartImage photo={photo} variant="thumb" alt={photo.alt.mk} />
                  </div>
                  <div className="min-w-0 text-sm" style={{ color: "hsl(30 10% 75%)" }}>
                    <PhotoCredit photo={photo} />
                    <p className="mt-1" lang="mk">
                      {photo.alt.mk}
                    </p>
                    <p lang="en">{photo.alt.en}</p>
                    {photo.needsNativeCheck ? (
                      <p className="mt-1 text-xs" style={{ color: "hsl(30 40% 65%)" }}>
                        Алтернативниот текст чека проверка
                        {photo.altNote ? ` — ${photo.altNote}` : ""}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CreditsPage;

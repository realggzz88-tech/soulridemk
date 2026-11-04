import type { Route } from "@/data/routes";
import type { Spot } from "@/data/spots";

const regionMk: Record<Spot["region"] | Route["region"], string> = {
  West: "Западна Македонија",
  Central: "Централна Македонија",
  East: "Источна Македонија",
  "Multi-Region": "повеќе краишта на Македонија",
};

const difficultyMk: Record<Route["difficulty"], string> = {
  Easy: "лесна",
  Moderate: "средна",
  Challenging: "тешка",
};

export const homeSeo = {
  title: "SoulRide · Заборавените патишта на Македонија",
  description:
    "Мото и планинарење низ Северна Македонија: скриени места, планински превои, езера и рути. SoulRide ги собира патиштата што картите ги забораваат.",
  path: "/",
};

export const spotsSeo = {
  title: "Места за возење и планинарење",
  description:
    "Сите места за мото и пешачење во Западна, Централна и Источна Македонија. Филтрирај по регион и пронајди го следниот видиковец со SoulRide.",
  path: "/spots",
};

export const routesSeo = {
  title: "Рути низ Северна Македонија",
  description:
    "Рути за мото и планинарење низ Северна Македонија, со растојание, тежина и постојки. Избери јамка и тргни со SoulRide.",
  path: "/routes",
};

export const aboutSeo = {
  title: "За SoulRide",
  description:
    "SoulRide е водич за мото-патувања и планинарење низ Македонија. Заедно ги бараме заборавените патишта, видиковци и локални приказни.",
  path: "/about",
};

export const loginSeo = {
  title: "Најава",
  description: "Најави се на SoulRide за да ги зачуваш местата, рутите и разговорот со другите возачи.",
  path: "/login",
};

export const signupSeo = {
  title: "Регистрација",
  description: "Отвори профил на SoulRide и приклучи се кон возачите што ја истражуваат Македонија.",
  path: "/signup",
};

export const chatSeo = {
  title: "Заедница",
  description: "Разговор на заедницата SoulRide за возачи и планинари во Македонија.",
  path: "/chat",
};

export const profileSeo = {
  title: "Профил",
  description: "Твојот SoulRide профил: биографија, мотор и зачувани рути.",
  path: "/profile",
};

export const notFoundSeo = {
  title: "Страницата не е пронајдена",
  description:
    "Оваа адреса не постои на SoulRide. Врати се на почетната или избери место за возење низ Македонија.",
};

export function spotSeo(spot: Spot) {
  return {
    title: `${spot.title} · Место за возење`,
    description: `${spot.title} е место за мото и планинарење во ${regionMk[spot.region]}. Видиковци, совети за возачи и карта на SoulRide.`,
    path: `/spots/${spot.id}`,
  };
}

export function routeSeo(route: Route) {
  return {
    title: `${route.title} · Рута`,
    description: `${route.title} е рута низ ${regionMk[route.region]}. Растојание ${route.distance}, тежина ${difficultyMk[route.difficulty]}. SoulRide водич за мото и планинарење.`,
    path: `/routes/${route.id}`,
  };
}

export interface Route {
  id: string;
  title: string;
  description: string;
  poeticTagline: string;
  longDescription: string;
  spotIds: string[];
  region: "East" | "West" | "Central" | "Multi-Region";
  difficulty: "Easy" | "Moderate" | "Challenging";
  duration: string;
  distance: string;
  mainImage: string;
  highlights: string[];
  activities: string[];
  riderTips: string[];
  thingsToDo: { [spotId: string]: string };
}

export const routes: Route[] = [
  {
    id: "eastern-waterfalls-loop",
    title: "Eastern Waterfalls Loop",
    description: "From Strumica to Kolesino, Smolare, Vodoča Monastery: Cascading wonders and spiritual stops.",
    poeticTagline: "Where waters fall and souls rise",
    longDescription: "This eastern odyssey threads through the lush Belasica foothills, connecting Macedonia's most spectacular waterfalls with ancient monasteries that have witnessed a millennium of prayers. The road winds through villages where time flows like the rivers themselves—slowly, deliberately, with purpose. From the 39-meter cascade of Smolare to the gentle song of Kolesino, from the Byzantine silence of Vodoča to the panoramic heights of Carevi Kuli, this route weaves together the elements that make eastern Macedonia unforgettable: water, stone, faith, and the roads that connect them all.",
    spotIds: ["kolesino-waterfall", "smolare-waterfall", "vodoca-monastery"],
    region: "East",
    difficulty: "Moderate",
    duration: "4-5 hours",
    distance: "~85 km",
    mainImage: "https://www.beinmacedonia.com/wp-content/uploads/2025/06/Smolare-Waterfall-North-Macedonia-Visit-North-Macedonia.jpg",
    highlights: [
      "Two of Macedonia's tallest waterfalls in one ride",
      "1000-year-old monastery with glowing frescoes",
      "Twisting mountain roads through oak forests",
      "Local village taverns serving fresh trout"
    ],
    activities: [
      "Feel the mist of cascading waterfalls on your face",
      "Wander through ancient monastery gardens in silence",
      "Ride the twisting Belasica mountain roads",
      "Feast on fresh trout at village tavernas",
      "Capture golden light through forest canopies"
    ],
    riderTips: [
      "Gravel on hairpins near Smolare—ride alert and smooth",
      "Morning mist creates magical waterfall photos",
      "Monastery visits require modest dress",
      "Fill up in Strumica—no fuel stations on the mountain roads"
    ],
    thingsToDo: {
      "kolesino-waterfall": "Stand beneath the 15m cascade and feel the healing mist",
      "smolare-waterfall": "Hike to the viewing platform for Macedonia's tallest waterfall",
      "vodoca-monastery": "Light a candle and sit in the 1000-year silence"
    }
  },
  {
    id: "western-lakes-tour",
    title: "Western Lakes Tour",
    description: "Ohrid to Galicica Pass, Trpejca Beach, Sv. Naum: Lake serenity and ancient paths.",
    poeticTagline: "Where two lakes mirror eternity",
    longDescription: "This iconic loop embraces both of Macedonia's UNESCO-protected lakes, climbing through Galicica National Park where the air thins and perspectives multiply. Begin at Lake Ohrid's ancient shores, ascend the legendary hairpins of Galicica Pass where two lakes shimmer below, descend to the fishing village of Trpejca, and conclude at St. Naum Monastery where peacocks roam and springs bubble up from legend. Every kilometer offers views that have inspired poets, painters, and pilgrims for millennia. This isn't just a ride—it's a journey through the soul of the Balkans.",
    spotIds: ["galicica-pass", "trpejca-beach", "sv-naum-monastery"],
    region: "West",
    difficulty: "Challenging",
    duration: "5-6 hours",
    distance: "~120 km",
    mainImage: "https://ourwanders.com/wp-content/uploads/2023/06/YourGuideToGalicicaNationalPark_NorthMacedonia_featured.jpg",
    highlights: [
      "Galicica Pass with dual-lake panoramas",
      "Medieval monastery with natural springs",
      "Lakeside village cuisine at Trpejca",
      "30+ hairpin turns of pure riding joy"
    ],
    activities: [
      "Conquer Galicica's legendary hairpin bends",
      "Gaze at two ancient lakes from cloud height",
      "Dine on grilled letnik fish at lakeside tavernas",
      "Watch peacocks strut at St. Naum Monastery",
      "Take a boat to the turquoise springs"
    ],
    riderTips: [
      "Loose gravel on Galicica summit—don't overcook corners",
      "Sunset from the pass is legendary but means riding down in dark",
      "Book Trpejca restaurants for lunch in summer",
      "St. Naum gets crowded midday—arrive early or late"
    ],
    thingsToDo: {
      "galicica-pass": "View epic dual-lake panoramas from the summit café",
      "trpejca-beach": "Eat fresh grilled trout with your feet in the lake",
      "sv-naum-monastery": "Take a boat ride to the magical turquoise springs"
    }
  },
  {
    id: "central-canyon-ride",
    title: "Central Canyon Ride",
    description: "Matka Canyon to Marko's Towers: Dramatic gorges and historic towers.",
    poeticTagline: "Where stone tells stories of kings",
    longDescription: "Just minutes from Macedonia's capital lies geological and historical drama that rivals anywhere in Europe. This route connects Matka Canyon—where limestone cliffs plunge into emerald waters and medieval monasteries cling to impossible walls—with the legendary Marko's Towers near Prilep, fortress ruins associated with the Balkans' greatest folk hero. Between them, the road traverses landscapes that shift from canyon to plain to mountain, through towns where Roman and Byzantine history sleeps just beneath the surface. Pack your sense of wonder; you'll need every ounce.",
    spotIds: ["matka-canyon", "markos-towers"],
    region: "Central",
    difficulty: "Moderate",
    duration: "6-7 hours",
    distance: "~140 km",
    mainImage: "https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=center,quality=60,width=400,height=265,dpr=2/tour_img/7f1dd888b74ba0994170b1dae71ccbd0e76c2a6a88c29cfc84517eded3ebf2b0.jpeg",
    highlights: [
      "Cave exploration at Vrelo Cave",
      "Hiking to legendary King Marko's fortress",
      "Kayaking options in Matka Canyon",
      "Byzantine churches with ancient frescoes"
    ],
    activities: [
      "Kayak between towering limestone canyon walls",
      "Explore Vrelo Cave's ancient stalactites",
      "Hike to Marko's legendary fortress ruins",
      "Photograph monasteries clinging to cliff faces",
      "Sip coffee overlooking emerald canyon waters"
    ],
    riderTips: [
      "Matka parking is limited—arrive before 10am on weekends",
      "The Prilep road can be hot in summer—hydrate well",
      "Marko's Towers hike takes 45-60 min—pack water",
      "Evening light at Matka is spectacular for photos"
    ],
    thingsToDo: {
      "matka-canyon": "Take the cave boat tour into Vrelo's crystal depths",
      "markos-towers": "Hike to the fortress and hear legends of King Marko"
    }
  },
  {
    id: "northern-mountain-pass",
    title: "Northern Mountain Pass",
    description: "Mavrovo Lake to Bistra Pass: Pine forests and high twists.",
    poeticTagline: "Where eagles circle below your wheels",
    longDescription: "This high-altitude odyssey combines the serene beauty of Mavrovo Lake—with its famous drowned church rising from the waters—with the raw wilderness of Bistra Mountain Pass where roads were carved against nature's will. The route climbs through pine forests that exhale ancient perfume, past shepherds' huts unchanged for centuries, up to elevations where the air sharpens every sense. This is Macedonia's mountain heart, wild and untamed, where wolves still hunt and roads still demand respect. Not for the faint of heart, but transformative for those who dare.",
    spotIds: ["mavrovo-lake-loop", "bistra-mountain-pass"],
    region: "West",
    difficulty: "Challenging",
    duration: "4-5 hours",
    distance: "~95 km",
    mainImage: "https://live.staticflickr.com/65535/53544878928_bb34f6dd19_h.jpg",
    highlights: [
      "Famous drowned church in Mavrovo Lake",
      "High-altitude hairpins with no guardrails",
      "Alpine meadows with wild horses",
      "Mountain hut lamb feasts"
    ],
    activities: [
      "Photograph the iconic drowned church at Mavrovo",
      "Ride hairpins carved into wild mountainsides",
      "Feast on slow-roasted lamb at mountain huts",
      "Watch for wild horses in alpine meadows",
      "Breathe the purest mountain air in the Balkans"
    ],
    riderTips: [
      "Weather changes rapidly—pack full waterproofs",
      "No guardrails on Bistra—focus and respect the edge",
      "Shepherds have right of way—stop for flocks",
      "Fuel in Mavrovi Anovi—nothing beyond"
    ],
    thingsToDo: {
      "mavrovo-lake-loop": "Stand before the drowned church rising from azure waters",
      "bistra-mountain-pass": "Conquer the wild hairpins where eagles soar below"
    }
  },
  {
    id: "southern-winery-escape",
    title: "Southern Winery Escape",
    description: "Demir Kapija to Popova Kula: Vardar gorge and soulful vines.",
    poeticTagline: "Where rivers carved paths for wine to flow",
    longDescription: "This civilized escape combines geological drama with viticultural pleasure. The Iron Gate gorge of Demir Kapija showcases nature's power to carve through mountains, while the vineyards of Popova Kula demonstrate humanity's gift for coaxing beauty from sun-warmed earth. The route follows the Vardar River through some of Macedonia's most dramatic scenery, past rock climbing walls and kayaking rapids, before ascending into wine country where Vranec grapes have grown since Roman times. End your ride with a tasting overlooking endless vine rows—you've earned it.",
    spotIds: ["demir-kapija-gorge", "popova-kula-winery"],
    region: "Central",
    difficulty: "Easy",
    duration: "3-4 hours",
    distance: "~70 km",
    mainImage: "https://adventurousmiriam.com/wp-content/uploads/2020/01/45662628464_553abbf66a_c.jpg",
    highlights: [
      "Limestone gorge with 500m cliffs",
      "Award-winning Macedonian wines",
      "Riverside picnic spots",
      "Rock climbing and kayaking options"
    ],
    activities: [
      "Marvel at the Iron Gate's towering limestone walls",
      "Taste award-winning Vranec and rosé wines",
      "Picnic by the rushing Vardar River",
      "Watch rock climbers scale ancient cliff faces",
      "Toast sunset over endless vineyard rows"
    ],
    riderTips: [
      "Designate a sober rider for the winery visit",
      "Morning light illuminates the gorge's eastern cliffs",
      "Book winery tastings in advance for full experience",
      "The gorge road has limited stops—scout pull-offs"
    ],
    thingsToDo: {
      "demir-kapija-gorge": "Stand where the Vardar broke through the mountain",
      "popova-kula-winery": "Savor a sunset wine tasting overlooking the vines"
    }
  },
  {
    id: "pelister-peaks-hike",
    title: "Pelister Peaks Hike",
    description: "Baba Mountain trails with overlooks and endemic Molika pine forests.",
    poeticTagline: "Where five million years of patience bloom",
    longDescription: "Macedonia's first national park offers riding and hiking that connects you with a landscape five million years in the making. The endemic Molika pine—found almost nowhere else on Earth—has watched ice ages come and go, and now watches you wind through its ancient groves. This route combines dramatic mountain roads with opportunities to leave the bike and explore on foot: the glacial 'Eyes of Pelister' lakes, the highest peaks of Baba Mountain, and viewpoints where Greece shimmers on the horizon. Come for the roads; stay for the perspective only altitude provides.",
    spotIds: ["pelister-viewpoint", "pelister-national-park"],
    region: "West",
    difficulty: "Moderate",
    duration: "5-6 hours",
    distance: "~80 km",
    mainImage: "https://www.discoveringmacedonia.com/wp-content/uploads/2018/02/pelister-baba-mountain-macedonia-2.jpg",
    highlights: [
      "Endemic Molika pine forests",
      "Glacial lakes hike (2-3 hours)",
      "Views to Greece on clear days",
      "Mountain hut accommodation available"
    ],
    activities: [
      "Walk among five-million-year-old Molika pines",
      "Hike to the glacial 'Eyes of Pelister' lakes",
      "Gaze toward Greece from the high overlooks",
      "Stay overnight in authentic mountain huts",
      "Pick wild berries along the August roadsides"
    ],
    riderTips: [
      "Glacial lakes hike adds 2-3 hours—budget accordingly",
      "Temperature drops 10°C from valley to summit",
      "August wild berries make perfect trailside snacks",
      "Mountain huts offer simple overnight stays—book ahead"
    ],
    thingsToDo: {
      "pelister-viewpoint": "Watch the world fall away at Baba Mountain's edge",
      "pelister-national-park": "Hike to the glacial 'Eyes' that reflect infinite sky"
    }
  },
  {
    id: "prespa-hidden-shores",
    title: "Prespa Hidden Shores",
    description: "Lake Prespa to Golem Grad Island: Quiet waters and ancient mysteries.",
    poeticTagline: "Where serpents guard forgotten empires",
    longDescription: "This mystical journey explores Macedonia's shy sibling lake—quieter, more mysterious, and infinitely more contemplative than famous Ohrid. The road traces Prespa's shores through apple orchards and abandoned villages, past Byzantine ruins and pelican colonies, toward the enigmatic Golem Grad island where Roman temples sleep among thousands of water snakes. This isn't a route for those seeking crowds or comforts; it's for souls who find peace in solitude and wonder in the forgotten. Boats to Golem Grad depart from lakeside villages, crossing waters shared by three nations into a world time forgot.",
    spotIds: ["prespa-lake-shore", "golem-grad-island"],
    region: "West",
    difficulty: "Moderate",
    duration: "4-5 hours",
    distance: "~65 km",
    mainImage: "https://static.euronews.com/articles/stories/08/57/96/04/1440x810_cmsv2_496958ef-277c-5baf-bbdb-26e588abb2fa-8579604.jpg",
    highlights: [
      "Pelican colonies at dawn",
      "Boat trip to snake-inhabited island",
      "Roman ruins in wild nature",
      "Three-country border views"
    ],
    activities: [
      "Watch pelicans take flight at dawn",
      "Boat across waters shared by three nations",
      "Explore Roman ruins guarded by serpents",
      "Photograph abandoned villages reclaimed by nature",
      "Taste the peace of a lake the world forgot"
    ],
    riderTips: [
      "Check boat schedules to Golem Grad in advance",
      "The snakes are harmless—wear closed shoes anyway",
      "Dawn and dusk bring the best pelican sightings",
      "Bring all supplies—the shore has few services"
    ],
    thingsToDo: {
      "prespa-lake-shore": "Watch pelicans paint circles in the morning sky",
      "golem-grad-island": "Walk among Roman ruins guarded by ancient serpents"
    }
  }
];

export const getRouteById = (id: string): Route | undefined => {
  return routes.find(route => route.id === id);
};

export const getRoutesByRegion = (region: string): Route[] => {
  if (region === "All") return routes;
  return routes.filter(route => route.region === region);
};

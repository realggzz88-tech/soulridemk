export interface Spot {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  images: string[];
  riderTips: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const spots: Spot[] = [
  {
    id: "galicica-pass",
    title: "Galicica Pass",
    description: "Where asphalt serpentines through clouds, and two ancient lakes mirror the infinite sky below.",
    longDescription: "Between heaven and the deep blue waters lies Galicica—a pass that doesn't merely connect two lakes, but two states of being. As your engine hums through each hairpin turn, Lake Ohrid glimmers on one side like liquid sapphire, while Lake Prespa dreams in quiet emerald on the other. The altitude steals your breath, but the vistas steal something deeper. Here, where eagles circle below your wheels and clouds kiss the tarmac, you understand why the ancients believed mountains were bridges to the divine. Every curve earned, every summit gained—this is where riders become pilgrims.",
    tags: ["Views", "Roads", "Mountain"],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    ],
    riderTips: [
      "Dawn rides offer mystical mist that weaves between peaks like spirits dancing",
      "Loose gravel haunts the hairpin exits—lean with respect, not recklessness",
      "The summit café serves Turkish coffee strong enough to match the altitude",
    ],
    coordinates: { lat: 40.95, lng: 20.8 },
  },
  {
    id: "vevcani-village",
    title: "Vevčani Village",
    description: "An ancient republic where crystal springs sing beneath thousand-year oaks, and time moves like honey.",
    longDescription: "Some places exist outside of time, and Vevčani is one such sanctuary. This self-declared republic—yes, it has its own passport—guards springs so pure they've quenched the thirst of emperors and rebels alike. The road narrows as you approach, forcing you to slow, to notice: the moss-covered stones, the water's endless song, the forest canopy filtering light into emerald cathedral rays. Locals still speak of water spirits and mountain guardians, and as the springs cascade over ancient rock, you'll understand this isn't superstition—it's recognition. The forest breathes here. And if you listen closely, it whispers secrets in languages older than roads.",
    tags: ["Hidden Gem", "Nature", "Cultural"],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200",
    ],
    riderTips: [
      "January's carnival transforms the village into a surreal dream of masks and fire",
      "Approach the springs in silence—some waters demand reverence",
      "The riverside taverns serve trout that was swimming moments before it reached your plate",
    ],
    coordinates: { lat: 41.24, lng: 20.59 },
  },
  {
    id: "mavrovo-lake-loop",
    title: "Mavrovo Lake Loop",
    description: "Pine-scented kilometers where a drowned church rises from azure waters, and every season tells a different story.",
    longDescription: "Mavrovo is not one road but a meditation—a loop that teaches the rider patience, presence, and the profound beauty of going nowhere in particular. The lake itself holds a secret: beneath its surface sleeps a church, its cross rising above the waterline like a prayer that refused to drown. In summer, the pines exhale their ancient perfume; in autumn, the mountains blaze with color so vivid it seems painted by a divine hand; in winter, ice transforms everything into crystalline silence. The road follows the water's edge, curves around hidden coves, climbs through forests that have watched centuries pass. This is not a route to rush. This is a route to remember who you are when the world stops rushing you.",
    tags: ["Views", "Roads", "Nature"],
    images: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    ],
    riderTips: [
      "The full loop demands two hours without stops—but who rides Mavrovo without stopping?",
      "October's colors here rival any forest on Earth",
      "Fill your tank in Mavrovi Anovi—the mountains keep no fuel stations",
    ],
    coordinates: { lat: 41.65, lng: 20.73 },
  },
  {
    id: "matka-canyon",
    title: "Matka Canyon",
    description: "A limestone cathedral carved by water and time, where monasteries cling to cliffs and caves guard prehistoric secrets.",
    longDescription: "The Treska River spent millennia carving Matka Canyon, and the result is nothing short of geological poetry. Cliffs rise vertically from emerald waters, their faces pocked with caves that shelter Ice Age butterflies and stalactites older than civilization. Medieval monks chose these impossible walls for their monasteries, understanding that some devotions require dramatic settings. The road to Matka builds anticipation with each curve—you sense something monumental approaching before you see it. And when the canyon finally reveals itself, when those fortress walls of limestone tower above you, the only response is silence. This is where you understand that nature is the first and greatest architect, and we are merely visitors in her cathedral.",
    tags: ["Views", "Cultural", "Adventure"],
    images: [
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1200",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    ],
    riderTips: [
      "Sunrise beats the kayak crowds and paints the canyon walls in gold",
      "The cave boat tour reveals an underworld of crystalline wonder",
      "Small bikes navigate the limited parking with grace; cruisers require patience",
    ],
    coordinates: { lat: 41.95, lng: 21.3 },
  },
  {
    id: "trpejca-beach",
    title: "Trpejca Beach",
    description: "A lakeside village where fishermen's nets dry in Mediterranean sun, and time dissolves into the rhythm of gentle waves.",
    longDescription: "They call Trpejca 'the Macedonian Saint-Tropez,' but that misses the point entirely. This isn't glamour—it's grace. Stone houses tumble toward Lake Ohrid's shore like children rushing to the water's edge. Fishermen mend nets using techniques unchanged for centuries. The air smells of grilling fish and wild herbs. The road here winds through olive groves and past Byzantine churches whose frescoes have witnessed a millennium of sunsets. At the shore, you'll find pebbles smooth enough to sleep on, water clear enough to count fish at depth, and a pace of life that reminds you urgency is a modern invention. Order the catch of the day. Watch the sun melt into the lake. Let the waves teach you their ancient, patient rhythm.",
    tags: ["Views", "Food Stops", "Nature"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1200",
    ],
    riderTips: [
      "The village streets test your slow-speed skills—embrace the challenge",
      "Letnik fish, grilled simply, needs no accompaniment but lake views",
      "Sunset here isn't optional—it's mandatory maintenance for the soul",
    ],
    coordinates: { lat: 41.03, lng: 20.75 },
  },
  {
    id: "pelister-viewpoint",
    title: "Pelister Viewpoint",
    description: "Where Baba Mountain meets the sky, ancient pines stand witness, and the horizon curves with the weight of wonder.",
    longDescription: "Pelister is Macedonia's first national park, but numbers and designations fail it. This is where the endemic Molika pine—found nowhere else on Earth—has stood for five million years, watching ice ages come and go, watching civilizations rise and fall, watching riders like you seek something that only altitude and solitude can provide. The road climbs relentlessly, switching back through forests that whisper in winds that have crossed the entire Balkan peninsula. At the viewpoint, you'll understand why ancient peoples believed their gods lived on mountaintops. The world spreads below you—Greece to the south, the lakes to the west, plains stretching toward horizons you'll never reach. Some heights cannot be measured in meters. Some views cannot be captured in photographs. Some silences speak louder than any words ever could.",
    tags: ["Views", "Roads", "Mountain"],
    images: [
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200",
    ],
    riderTips: [
      "Mountain weather writes its own rules—pack layers even in summer",
      "The glacial lakes reward those willing to hike beyond the road's end",
      "August's wild berries line the roadside—nature's pit stop provisions",
    ],
    coordinates: { lat: 41.0, lng: 21.19 },
  },
];

// Unique tags for filtering
export const allTags = ["Views", "Roads", "Food Stops", "Nature", "Cultural", "Mountain", "Adventure", "Hidden Gem"];

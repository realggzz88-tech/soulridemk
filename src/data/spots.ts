export interface Spot {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  poeticTagline: string;
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
    poeticTagline: "Where the road meets the heavens",
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
    poeticTagline: "Where water whispers ancient secrets",
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
    poeticTagline: "Where memories surface from the deep",
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
    poeticTagline: "Where stone remembers eternity",
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
    poeticTagline: "Where the soul learns to float",
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
    poeticTagline: "Where altitude becomes attitude",
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
  {
    id: "treskavec-monastery",
    title: "Treskavec Monastery",
    description: "A remote ascent where ancient stones pierce the clouds and silence becomes a language unto itself.",
    poeticTagline: "Where faith carved into stone",
    longDescription: "Perched atop a barren mountain like a prayer frozen in stone, Treskavec Monastery demands everything from those who seek it. The road—if you can call it that—twists upward through terrain that separates the curious from the committed. Byzantine walls rise from the rock as if grown rather than built, their centuries of devotion weathering storms that would crumble lesser structures. Frescoes inside still glow with colors mixed from faith and mineral, depicting saints who knew that the path to enlightenment is always uphill. At the summit, wind and silence compete for dominance. The Pelagonia plain stretches impossibly far below. Here, at the edge of the sky, you understand why hermits chose hardship over comfort. Some truths only reveal themselves to those willing to climb.",
    tags: ["Cultural", "Adventure", "Mountain"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    ],
    riderTips: [
      "The final kilometers demand adventure-ready tires and unwavering focus",
      "Carry water—the monastery's springs run dry in summer",
      "Sunrise illuminates the frescoes with light the painters intended",
    ],
    coordinates: { lat: 41.28, lng: 21.35 },
  },
  {
    id: "prespa-lake-shore",
    title: "Prespa Lake Shore",
    description: "Quiet waters where pelicans glide through morning mist and borders dissolve into shared horizons.",
    poeticTagline: "Where three nations share one soul",
    longDescription: "Prespa is the shy sibling of famous Ohrid—less visited, more vulnerable, infinitely more mysterious. Three countries share these waters: North Macedonia, Albania, Greece. But the pelicans that nest on its islands recognize no borders, and neither does the profound stillness that settles over the lake at dawn. The road traces the shoreline through apple orchards and abandoned villages, past Byzantine churches hiding behind overgrown walls, through communities where time flows differently. Unlike its popular neighbor, Prespa asks nothing of you but attention. Watch the water birds paint circles in the sky. Listen to the reeds whisper secrets passed between nations. Feel the peculiar peace of a place the world hasn't yet discovered—or perhaps has wisely left alone.",
    tags: ["Views", "Nature", "Hidden Gem"],
    images: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    ],
    riderTips: [
      "Dawn brings pelican flights—patience rewards the early rider",
      "The border villages serve authentic mountain cuisine untouched by tourism",
      "Autumn paints the apple orchards in colors worth the detour",
    ],
    coordinates: { lat: 40.92, lng: 21.0 },
  },
  {
    id: "bistra-mountain-pass",
    title: "Bistra Mountain Pass",
    description: "High-altitude twists through wilderness so pure it remembers what freedom meant before roads existed.",
    poeticTagline: "Where the wild still rules",
    longDescription: "Bistra doesn't welcome visitors—it tolerates them. This is Macedonia's untamed heart, where wolves still hunt and shepherds still know every star by name. The pass cuts through terrain that fought against the road's construction and continues to challenge its existence. Hairpins carved into mountainsides offer views that simultaneously humble and exhilarate. No guardrails here—just ancient stone markers placed by travelers who understood that some journeys require respect for risk. The air thins as you climb, sharpening every sense. Eagles circle thermals above exposed granite faces. The engine's note changes with altitude, becoming part of a symphony that includes wind, wildlife, and the profound silence between heartbeats. This is riding at its most elemental—machine, road, mountain, and the narrow space where they meet.",
    tags: ["Roads", "Adventure", "Mountain"],
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200",
    ],
    riderTips: [
      "Weather shifts without warning—waterproofs aren't optional, they're survival gear",
      "The mountain huts serve lamb slow-cooked over fires that never quite die",
      "Respect the shepherds' right of way—their flocks own these roads by ancestry",
    ],
    coordinates: { lat: 41.62, lng: 20.58 },
  },
  {
    id: "ohrid-old-town-overlook",
    title: "Ohrid Old Town Overlook",
    description: "Ancient stones stacked by emperors gaze upon waters that have witnessed thirty centuries of human dreams.",
    poeticTagline: "Where history meets eternity",
    longDescription: "They call Ohrid the Jerusalem of the Balkans, and from the fortress overlooking the old town, you understand why. Every stone here has a story. Every narrow lane has heard footsteps of Romans, Byzantines, Ottomans, and now—you. The road winds through cobblestones polished by millennia of passage, past churches older than most nations, up to Samuel's Fortress where the view stops hearts and starts conversations with the cosmos. Lake Ohrid stretches below like liquid time itself—one of Europe's oldest and deepest lakes, home to species found nowhere else on Earth. The old town cascades down the hillside, a tumble of terracotta roofs and whitewashed walls that seem to glow at golden hour. Park the bike. Climb the remaining steps on foot. Let the view remind you that empires rise and fall, but some beauties endure forever.",
    tags: ["Views", "Cultural", "Food Stops"],
    images: [
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1200",
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200",
    ],
    riderTips: [
      "Sunset from the fortress turns the lake into molten gold—arrive early for the best perch",
      "The old town's cobblestones demand slow speeds and high appreciation",
      "Local wine taverns hide in courtyards—ask locals for their secret favorites",
    ],
    coordinates: { lat: 41.11, lng: 20.8 },
  },
  // Eastern Gems - Strumica Region
  {
    id: "carevi-kuli",
    title: "Carevi Kuli Fortress",
    description: "Hilltop ruins where Byzantine emperors once surveyed their domain, now offering panoramic soul views over the valley.",
    poeticTagline: "Where emperors dreamed in stone",
    longDescription: "High above Strumica, the ancient walls of Carevi Kuli—the Tsar's Towers—stand as silent witnesses to a thousand years of history. This Byzantine fortress, perched on a dramatic hilltop, once commanded views that made empires possible. Today, the same views command something different: awe, silence, and the peculiar peace that comes from standing where history happened. The road winds upward through oak forests and past orchards heavy with fruit, each switchback revealing more of the Strumica valley below. At the summit, ruined walls frame the sky like ancient picture frames, and the wind carries whispers of battles fought, lovers met, and prayers offered. This isn't mere archaeology—it's a conversation across centuries. The stones remember. And now, so will you.",
    tags: ["Fortress", "Views", "Eastern Gems", "Cultural"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    ],
    riderTips: [
      "Golden hour transforms the ruins into amber-lit poetry—time your arrival",
      "The final approach rewards capable tires and steady throttle control",
      "Pack a flask of local rakija—the sunset deserves a toast",
    ],
    coordinates: { lat: 41.4412, lng: 22.6521 },
  },
  {
    id: "kolesino-waterfall",
    title: "Kolesino Waterfall",
    description: "Cascading waters tumble through lush Belasica hills, offering the perfect refreshing stop for weary souls.",
    poeticTagline: "Where water sings to stone",
    longDescription: "Hidden in the green embrace of Belasica Mountain, Kolesino Waterfall descends in a graceful 15-meter cascade that seems to materialize from the forest itself. The road here is the prelude—winding through villages where time moves slowly and grandmothers still hang laundry in sunshine older than industry. As you approach, the air changes: cooler, damper, carrying the mineral scent of ancient water. The waterfall emerges through foliage like a secret shared between the mountain and those patient enough to seek it. Mist rises where water meets rock, creating rainbows when the light agrees. Local legend speaks of healing waters, and whether you believe in such magic or not, there's undeniable restoration in standing before falling water, feeling its thunder in your chest, letting its spray wash away the road's dust and the world's weight.",
    tags: ["Waterfalls", "Nature", "Eastern Gems", "Hidden Gem"],
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    ],
    riderTips: [
      "Morning mist adds mystique—arrive before the crowds claim the magic",
      "The short trail from parking to falls demands proper footwear",
      "Combine with Smolare for the ultimate waterfall duo ride",
    ],
    coordinates: { lat: 41.3285, lng: 22.7834 },
  },
  {
    id: "smolare-waterfall",
    title: "Smolare Waterfall",
    description: "A hidden gorge beauty reached via rewarding twisty roads, where waters plunge 39 meters into emerald pools.",
    poeticTagline: "Where persistence meets paradise",
    longDescription: "The tallest waterfall in North Macedonia doesn't reveal itself easily—and that's precisely its gift. The road to Smolare tests and rewards in equal measure, threading through the Star Dojran region on asphalt that curves and climbs like a poem in motion. When you finally arrive, the waterfall announces itself with sound before sight: a deep, constant thunder that builds anticipation with every step down the forest trail. Then, through the trees, it appears—39 meters of falling water, plunging into a pool so green it seems lit from within. This is where the Belasica Mountain shares its deepest secret, where riders become pilgrims, and where the journey's difficulty transforms into the arrival's joy. Some destinations are measured in kilometers. Smolare is measured in transformation.",
    tags: ["Waterfalls", "Roads", "Eastern Gems", "Adventure"],
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200",
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    ],
    riderTips: [
      "The approach road features 20+ hairpins—warm up your cornering confidence",
      "Midweek visits mean you'll likely have the falls to yourself",
      "The viewing platform offers the best photography angles—patience pays",
    ],
    coordinates: { lat: 41.3425, lng: 22.8123 },
  },
  {
    id: "vodoca-monastery",
    title: "Vodoča Monastery",
    description: "An ancient spiritual sanctuary where time dissolves into prayer, surrounded by mountains that have witnessed a millennium of devotion.",
    poeticTagline: "Where silence speaks volumes",
    longDescription: "In the quiet hills near Strumica, Vodoča Monastery has stood for over a thousand years, its stones accumulating prayers like moss accumulates dew. This 11th-century sanctuary, dedicated to Saint Leontius, represents something increasingly rare in our accelerating world: unbroken continuity. Monks have walked these grounds, lit these candles, and maintained these traditions through empires, wars, and the countless small revolutions of daily life. The ride here passes through pastoral landscapes that seem painted rather than grown—rolling hills, ancient trees, and the particular quality of light that eastern Macedonia holds like a secret. At the monastery, frescoes still glow with Byzantine colors, and the architecture speaks of an age when buildings were built to last not decades but centuries. Silence here isn't empty—it's full of accumulated reverence, a thousand years of whispered prayers still echoing in the stones.",
    tags: ["Cultural", "Eastern Gems", "Hidden Gem", "Mountain"],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    ],
    riderTips: [
      "Dress modestly—this is an active monastery deserving respect",
      "The resident monks sometimes offer tours to genuinely interested visitors",
      "Sunday morning services offer authentic glimpses of living tradition",
    ],
    coordinates: { lat: 41.4156, lng: 22.5678 },
  },
];

// Unique tags for filtering - expanded with new categories
export const allTags = [
  "Views", 
  "Roads", 
  "Food Stops", 
  "Nature", 
  "Cultural", 
  "Mountain", 
  "Adventure", 
  "Hidden Gem",
  "Waterfalls",
  "Fortress",
  "Eastern Gems"
];

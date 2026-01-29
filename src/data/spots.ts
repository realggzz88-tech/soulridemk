export interface Spot {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  images: string[];
  riderTips: string[];
}

export const spots: Spot[] = [
  {
    id: "galicica-pass",
    title: "Galicica Pass",
    description: "Epic twists with soul-stirring panoramas over lakes.",
    longDescription: "Where asphalt meets the heavens, Galicica Pass carves through ancient mountains like a serpent seeking enlightenment. Each hairpin bend reveals new vistas of Lake Ohrid and Lake Prespa, separated by the ridge you're conquering. The air thins, the soul expands, and the road becomes a meditation in motion.",
    tags: ["Twisty Ride", "Mountain Pass", "Panoramic"],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    ],
    riderTips: [
      "Best experienced at dawn when mist dances between peaks",
      "Watch for loose gravel on hairpin exits",
      "Stop at the viewpoint café for Turkish coffee with a view",
    ],
  },
  {
    id: "vevcani-village",
    title: "Vevčani Village",
    description: "Hidden springs and forests that whisper ancient stories.",
    longDescription: "Nestled against the mountain's embrace, Vevčani guards its secrets well. Crystal springs cascade through mossy stones while forests older than memory stand sentinel. The road here is narrow, intimate—a conversation between rider and landscape that speaks of rebellion, independence, and the eternal cycle of water returning to its source.",
    tags: ["Hidden Gem", "Nature", "Cultural"],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200",
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200",
    ],
    riderTips: [
      "Visit during Vevčani Carnival for a surreal experience",
      "The springs are sacred—approach with reverence",
      "Local trout restaurants serve the freshest catch",
    ],
  },
  {
    id: "mavrovo-lake-loop",
    title: "Mavrovo Lake Loop",
    description: "Pine-scented paths with views that heal the rider's soul.",
    longDescription: "The Mavrovo circuit is a pilgrimage for the wandering soul. Pine forests exhale their ancient perfume as the road hugs the lake's sapphire edge. In winter, a submerged church reveals its cross above frozen waters—a monument to change, to letting go, to the beauty found in what remains. The loop teaches patience, presence, and the art of the long way home.",
    tags: ["Lake Views", "Scenic Loop", "Forest"],
    images: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    ],
    riderTips: [
      "The full loop takes about 2 hours without stops—plan for more",
      "Autumn colors transform this route into pure gold",
      "Fuel up in Mavrovi Anovi—no stations on the mountain stretch",
    ],
  },
  {
    id: "matka-canyon",
    title: "Matka Canyon",
    description: "Dramatic rides to monasteries carved in stone.",
    longDescription: "Where the Treska River carved its cathedral through limestone, Matka Canyon awaits. The approach road is a prelude—each curve building anticipation until the cliffs rise around you like fortress walls. Medieval monasteries cling to impossible perches, and caves hold secrets older than civilization. This is not just a ride; it's a journey through geological time.",
    tags: ["Canyon", "Historic", "Adventure"],
    images: [
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1200",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    ],
    riderTips: [
      "Arrive early to beat the weekend kayak crowds",
      "The cave tour by boat is worth the detour",
      "Parking is limited—smaller bikes have the advantage",
    ],
  },
  {
    id: "trpejca-beach",
    title: "Trpejca Beach",
    description: "Lakeside serenity with pebble shores and fresh fish tales.",
    longDescription: "Trpejca sits where time forgot to hurry. Stone houses tumble toward Lake Ohrid's embrace, and fishermen mend nets as their fathers did, and their fathers before. The ride here winds through olive groves and past Byzantine churches, each kilometer peeling away another layer of modern urgency. At the shore, fresh fish sizzles on grills, and the only agenda is watching the sun paint the water gold.",
    tags: ["Lakeside", "Peaceful", "Culinary"],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1200",
    ],
    riderTips: [
      "The narrow village streets require confident low-speed handling",
      "Try the letnik—local fish grilled to perfection",
      "Sunset here is mandatory soul maintenance",
    ],
  },
  {
    id: "pelister-viewpoint",
    title: "Pelister Viewpoint",
    description: "Baba Mountain overlooks that touch the heavens.",
    longDescription: "Pelister National Park guards the southernmost reaches of this land, and its viewpoints offer perspectives that shift something fundamental within. The road climbs through ancient pine forests—the rare Molika pines found nowhere else on Earth—until the world falls away beneath you. From here, you see not just landscape, but the curve of the planet itself. Some heights cannot be measured in meters.",
    tags: ["Mountain", "National Park", "Elevated"],
    images: [
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200",
    ],
    riderTips: [
      "Weather changes rapidly—pack layers regardless of season",
      "The mountain lakes are worth the extra kilometers",
      "Wild berries line the road in late summer—stop and feast",
    ],
  },
];

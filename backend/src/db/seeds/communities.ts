import { PrismaClient } from "@prisma/client";

const communities = [
  {
    id: "community-ion-district",
    name: "Ion District",
    website: "https://iondistrict.com",
    description: "Innovation district anchored by the Ion with labs, offices, and community programs.",
    tags: ["innovation-district", "coworking", "programs"],
    category: "Innovation District",
    latitude: 29.7336,
    longitude: -95.3851,
    address: "Midtown, Houston, TX"
  },
  {
    id: "community-the-cannon",
    name: "The Cannon",
    website: "https://thecannon.com",
    description: "Coworking campus and startup hub with programming and corporate partnerships.",
    tags: ["coworking", "accelerator", "events"],
    category: "Startup Hub",
    latitude: 29.8021,
    longitude: -95.5609,
    address: "West Houston, TX"
  },
  {
    id: "community-impact-hub-houston",
    name: "Impact Hub Houston",
    website: "https://houston.impacthub.net",
    description: "Impact-focused entrepreneurial community supporting social and climate ventures.",
    tags: ["impact", "climate", "community"],
    category: "Impact Community",
    latitude: 29.7429,
    longitude: -95.3808,
    address: "Downtown Houston, TX"
  },
  {
    id: "community-tie-houston",
    name: "TiE Houston",
    website: "https://houston.tie.org",
    description: "Chapter of TiE Global fostering mentorship and investment for founders.",
    tags: ["mentorship", "investment", "network"],
    category: "Founder Network",
    latitude: 29.76,
    longitude: -95.369,
    address: "Houston, TX"
  },
  {
    id: "community-startup-grind-houston",
    name: "Startup Grind Houston",
    website: "https://www.startupgrind.com/houston",
    description: "Local Startup Grind chapter hosting fireside chats, mixers, and founder education.",
    tags: ["events", "education", "community"],
    category: "Events",
    latitude: 29.7604,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "community-houston-exponential",
    name: "Houston Exponential",
    website: "https://www.houstonexponential.org",
    description: "Ecosystem connector accelerating Houston's innovation economy.",
    tags: ["ecosystem", "platform", "community"],
    category: "Ecosystem Platform",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "community-fruition-tech-labs",
    name: "Fruition Tech Labs",
    website: "https://fruitiontechlabs.com",
    description: "Startup studio and accelerator supporting early-stage founders with build services.",
    tags: ["accelerator", "studio", "services"],
    category: "Accelerator",
    latitude: 29.734,
    longitude: -95.384,
    address: "Houston, TX"
  },
  {
    id: "community-access-silicon-valley-houston",
    name: "Access Silicon Valley – Houston",
    website: "https://www.accesssiliconvalley.net",
    description: "Angel and founder networking series bridging Houston and Silicon Valley investors.",
    tags: ["angels", "network", "events"],
    category: "Angel Network",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "community-houston-angel-network",
    name: "Houston Angel Network",
    website: "https://houstonangelnetwork.org",
    description: "One of the largest angel investing networks in Texas backing early-stage startups.",
    tags: ["angels", "investment", "early-stage"],
    category: "Angel Network",
    latitude: 29.7608,
    longitude: -95.3697,
    address: "Downtown Houston, TX"
  },
  {
    id: "community-pipeline-angels",
    name: "Pipeline Angels",
    website: "https://pipelineangels.com",
    description: "Angel training and investment collective funding women and nonbinary founders.",
    tags: ["angels", "diversity", "investment"],
    category: "Angel Network",
    latitude: 29.7605,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "community-rice-angels",
    name: "Rice Angels",
    website: "https://entrepreneurship.rice.edu",
    description: "Rice alumni and community angel group investing in early-stage ventures.",
    tags: ["angels", "rice", "investment"],
    category: "Angel Network",
    latitude: 29.7174,
    longitude: -95.4018,
    address: "Rice University, Houston, TX"
  },
  {
    id: "community-houston-lean-startup-circle",
    name: "Houston Lean Startup Circle",
    website: "https://www.meetup.com/lean-startup-circle-houston",
    description: "Meetup community practicing Lean Startup with founder workshops and peer feedback.",
    tags: ["meetup", "lean-startup", "community"],
    category: "Founder Community",
    latitude: 29.7604,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "community-jlabs-tmc",
    name: "JLABS @ TMC",
    website: "https://jlabs.jnjinnovation.com/locations/texas-medical-center",
    description: "Johnson & Johnson's life sciences incubator at Texas Medical Center.",
    tags: ["biotech", "incubator", "tmc"],
    category: "Incubator",
    latitude: 29.7057,
    longitude: -95.401,
    address: "Texas Medical Center, Houston, TX"
  },
  {
    id: "community-redhouse-associates",
    name: "RedHouse Associates",
    website: "https://redhouseassoc.com",
    description: "Houston-based angel group and accelerator supporting early-stage startups.",
    tags: ["angels", "accelerator", "investment"],
    category: "Angel Network",
    latitude: 29.7602,
    longitude: -95.3695,
    address: "Houston, TX"
  },
  {
    id: "community-catapult-houston",
    name: "Catapult Houston",
    website: "https://catapulthouston.com",
    description: "Startup accelerator and founder community offering cohorts and mentorship.",
    tags: ["accelerator", "mentorship", "cohort"],
    category: "Accelerator",
    latitude: 29.7604,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "community-plug-and-play-houston",
    name: "Plug and Play Houston",
    website: "https://www.plugandplaytechcenter.com",
    description: "Corporate innovation platform running energy and health programs in Houston.",
    tags: ["accelerator", "corporate", "energy"],
    category: "Accelerator",
    latitude: 29.7605,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "community-eunike-ventures",
    name: "Eunike Ventures",
    website: "https://eunikeventures.com",
    description: "Energy-focused open innovation venture platform partnering with corporates.",
    tags: ["energy", "venture", "open-innovation"],
    category: "Venture Studio",
    latitude: 29.757,
    longitude: -95.365,
    address: "Houston, TX"
  },
  {
    id: "community-halliburton-labs",
    name: "Halliburton Labs",
    website: "https://www.halliburtonlabs.com",
    description: "Clean energy tech accelerator offering industrial scale-up resources.",
    tags: ["climate", "energy", "accelerator"],
    category: "Accelerator",
    latitude: 29.7545,
    longitude: -95.367,
    address: "Houston, TX"
  },
  {
    id: "community-surge-accelerator",
    name: "SURGE Accelerator",
    website: "https://www.surgeaccelerator.com",
    description: "Energy and climate accelerator backing founders across the Gulf Coast.",
    tags: ["energy", "climate", "accelerator"],
    category: "Accelerator",
    latitude: 29.7607,
    longitude: -95.3696,
    address: "Houston, TX"
  }
];

export const seedCommunities = async (prisma: PrismaClient) => {
  for (const community of communities) {
    await prisma.community.upsert({
      where: { id: community.id },
      update: { ...community, tags: JSON.stringify(community.tags) },
      create: { ...community, tags: JSON.stringify(community.tags) }
    });
  }
};

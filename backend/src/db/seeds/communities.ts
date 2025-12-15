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
  },
  {
    id: "community-rice-alliance",
    name: "Rice Alliance for Technology and Entrepreneurship",
    website: "https://alliance.rice.edu",
    description: "Rice University's flagship accelerator programs and startup competitions.",
    tags: ["rice", "accelerator", "competitions"],
    category: "University Program",
    latitude: 29.7168,
    longitude: -95.404,
    address: "Rice University, Houston, TX"
  },
  {
    id: "community-masschallenge-houston",
    name: "MassChallenge Houston",
    website: "https://masschallenge.org",
    description: "Equity-free accelerator running energy, health, and general tracks in Houston.",
    tags: ["accelerator", "equity-free", "program"],
    category: "Accelerator",
    latitude: 29.753,
    longitude: -95.359,
    address: "Downtown Houston, TX"
  },
  {
    id: "community-ai-houston",
    name: "AI Houston Meetup",
    website: "https://www.meetup.com/ai-houston",
    description: "Developer and researcher meetup covering ML ops, LLMs, and applied AI projects.",
    tags: ["ai", "meetup", "developers"],
    category: "Meetup",
    latitude: 29.763,
    longitude: -95.383,
    address: "Houston, TX"
  },
  {
    id: "partner-sugar-land-edc",
    name: "Sugar Land Economic Development",
    website: "https://www.sugarlandecodev.com",
    description: "Office of Economic Development and Tourism for Sugar Land.",
    tags: ["economic-development", "partner"],
    category: "Partner",
    latitude: 29.6197,
    longitude: -95.6349,
    address: "Sugar Land, TX"
  },
  {
    id: "partner-texas-am-innovation",
    name: "Texas A&M Innovation",
    website: "https://innovation.tamu.edu",
    description: "Texas A&M innovation and commercialization programs.",
    tags: ["university", "innovation", "partner"],
    category: "Partner",
    latitude: 30.628,
    longitude: -96.3344,
    address: "College Station, TX"
  },
  {
    id: "partner-greater-brazos",
    name: "Greater Brazos Partnership",
    website: "https://greaterbrazos.com",
    description: "Regional partnership supporting growth across the Brazos Valley.",
    tags: ["economic-development", "partner"],
    category: "Partner",
    latitude: 30.628,
    longitude: -96.3344,
    address: "College Station, TX"
  },
  {
    id: "partner-city-college-station",
    name: "City of College Station",
    website: "https://www.cstx.gov",
    description: "Economic development initiatives for College Station.",
    tags: ["economic-development", "municipal"],
    category: "Partner",
    latitude: 30.628,
    longitude: -96.3344,
    address: "College Station, TX"
  },
  {
    id: "partner-city-bryan",
    name: "City of Bryan",
    website: "https://www.bryantx.gov",
    description: "Economic development and innovation support for Bryan.",
    tags: ["economic-development", "municipal"],
    category: "Partner",
    latitude: 30.6744,
    longitude: -96.3699,
    address: "Bryan, TX"
  },
  {
    id: "partner-frisco-edc",
    name: "Frisco Economic Development Corporation",
    website: "https://www.friscoedc.com",
    description: "Economic development for Frisco with innovation and corporate attraction.",
    tags: ["economic-development", "partner"],
    category: "Partner",
    latitude: 33.1507,
    longitude: -96.8236,
    address: "Frisco, TX"
  },
  {
    id: "partner-mckinney-edc",
    name: "McKinney Economic Development Corporation",
    website: "https://www.mckinneyedc.com",
    description: "Innovation and business attraction for McKinney.",
    tags: ["economic-development", "partner"],
    category: "Partner",
    latitude: 33.1976,
    longitude: -96.6153,
    address: "McKinney, TX"
  },
  {
    id: "partner-origin-innovation-hub",
    name: "Origin Innovation Hub",
    website: "https://origininnovationhub.com",
    description: "Incubation and coworking hub supporting startups.",
    tags: ["coworking", "incubator", "partner"],
    category: "Partner",
    latitude: 29.76,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "partner-baylor-sports-therapy",
    name: "Baylor Scott & White Sports Therapy & Research",
    website: "https://www.bswhealth.com",
    description: "Sports therapy and research facility collaborating with innovators.",
    tags: ["health", "sports", "partner"],
    category: "Partner",
    latitude: 33.1047,
    longitude: -96.819,
    address: "Frisco, TX"
  },
  {
    id: "partner-ntx-innovation-alliance",
    name: "North Texas Innovation Alliance",
    website: "https://ntxia.org",
    description: "Regional alliance advancing smart city and innovation projects.",
    tags: ["innovation", "smart-city", "partner"],
    category: "Partner",
    latitude: 32.7767,
    longitude: -96.797,
    address: "Dallas, TX"
  },
  {
    id: "partner-walmart",
    name: "Walmart",
    website: "https://www.walmart.com",
    description: "Corporate partner supporting innovation pilots and supply chain programs.",
    tags: ["corporate", "retail", "partner"],
    category: "Partner",
    latitude: 29.76,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "partner-exxonmobil",
    name: "ExxonMobil",
    website: "https://corporate.exxonmobil.com",
    description: "Energy corporate collaborating on low-carbon and digital innovation.",
    tags: ["corporate", "energy", "partner"],
    category: "Partner",
    latitude: 29.737,
    longitude: -95.46,
    address: "Houston, TX"
  },
  {
    id: "partner-shell",
    name: "Shell",
    website: "https://www.shell.com",
    description: "Energy corporate partner for climate tech and digital projects.",
    tags: ["corporate", "energy", "partner"],
    category: "Partner",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "partner-astrazeneca",
    name: "AstraZeneca",
    website: "https://www.astrazeneca.com",
    description: "Life sciences corporate partner for clinical and digital health pilots.",
    tags: ["corporate", "health", "partner"],
    category: "Partner",
    latitude: 29.71,
    longitude: -95.4,
    address: "Houston, TX"
  },
  {
    id: "partner-dell",
    name: "Dell Technologies",
    website: "https://www.dell.com",
    description: "Enterprise technology partner supporting cloud and edge innovation.",
    tags: ["corporate", "cloud", "edge"],
    category: "Partner",
    latitude: 29.76,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "partner-microsoft",
    name: "Microsoft",
    website: "https://www.microsoft.com",
    description: "Cloud and AI partner collaborating on startup and enterprise programs.",
    tags: ["corporate", "cloud", "ai"],
    category: "Partner",
    latitude: 29.76,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "partner-lg-chem",
    name: "LG Chem",
    website: "https://www.lgchem.com",
    description: "Materials and battery partner exploring energy transition technologies.",
    tags: ["corporate", "materials", "energy"],
    category: "Partner",
    latitude: 29.76,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "partner-mercedes-benz",
    name: "Mercedes-Benz",
    website: "https://www.mercedes-benz.com",
    description: "Mobility and automotive innovation partner.",
    tags: ["corporate", "mobility", "partner"],
    category: "Partner",
    latitude: 29.76,
    longitude: -95.37,
    address: "Houston, TX"
  },
  {
    id: "community-greentown-houston",
    name: "Greentown Labs Houston",
    website: "https://greentownlabs.com/houston",
    description: "Flagship climate and energy incubator with labs, workspace, and accelerator programs.",
    tags: ["accelerator", "climate", "energy"],
    category: "Accelerator",
    latitude: 29.738,
    longitude: -95.3747,
    address: "4200 San Jacinto St, Houston, TX"
  },
  {
    id: "community-tmcx",
    name: "TMCx",
    website: "https://www.tmc.edu/innovation/tmcx",
    description: "Texas Medical Center accelerator for digital health, med devices, and biotech.",
    tags: ["health", "biotech", "accelerator"],
    category: "Accelerator",
    latitude: 29.7065,
    longitude: -95.4019,
    address: "TMC Innovation, Houston, TX"
  },
  {
    id: "community-redlabs",
    name: "RED Labs",
    website: "https://www.bauer.uh.edu/redlabs",
    description: "University of Houston startup accelerator for students.",
    tags: ["university", "accelerator", "student"],
    category: "University Program",
    latitude: 29.7227,
    longitude: -95.3406,
    address: "University of Houston, TX"
  },
  {
    id: "community-owlspark",
    name: "OwlSpark",
    website: "https://owlspark.com",
    description: "Rice University accelerator for student and faculty-led startups.",
    tags: ["university", "accelerator", "rice"],
    category: "University Program",
    latitude: 29.716,
    longitude: -95.402,
    address: "Rice University, Houston, TX"
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
    id: "community-softeq",
    name: "Softeq Development",
    website: "https://www.softeq.com/venture-studio",
    description: "Venture studio and accelerator building and investing in hardware/IoT/software startups.",
    tags: ["venture-studio", "accelerator", "hardware"],
    category: "Accelerator",
    latitude: 29.741,
    longitude: -95.46,
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
    id: "community-haa-accelerator",
    name: "Houston Arts Alliance Accelerator Grant",
    website: "https://www.houstonartsalliance.com",
    description: "Accelerator grant program supporting creative and cultural projects.",
    tags: ["arts", "grant", "accelerator"],
    category: "Grant Program",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "community-seed-round-capital",
    name: "Seed Round Capital",
    website: "https://seedround.vc",
    description: "Houston seed fund with accelerator-style support.",
    tags: ["seed", "accelerator", "investment"],
    category: "Accelerator",
    latitude: 29.7461,
    longitude: -95.3885,
    address: "Houston, TX"
  },
  {
    id: "community-cannon",
    name: "The Cannon Community",
    website: "https://thecannon.com",
    description: "Coworking and startup hub with programming across Houston.",
    tags: ["coworking", "community", "programs"],
    category: "Innovation District",
    latitude: 29.8021,
    longitude: -95.5609,
    address: "West Houston, TX"
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
    id: "community-masschallenge-houston",
    name: "MassChallenge Houston",
    website: "https://masschallenge.org",
    description: "Equity-free accelerator running energy, health, and general tracks in Houston.",
    tags: ["accelerator", "equity-free", "program"],
    category: "Accelerator",
    latitude: 29.753,
    longitude: -95.359,
    address: "Downtown Houston, TX"
  },
  {
    id: "community-founder-institute",
    name: "Founder Institute Houston",
    website: "https://fi.co",
    description: "Global pre-seed accelerator with a Houston chapter for idea-to-MVP founders.",
    tags: ["accelerator", "pre-seed", "program"],
    category: "Accelerator",
    latitude: 29.7604,
    longitude: -95.3698,
    address: "Houston, TX"
  },
  {
    id: "community-ion-houston",
    name: "Ion Houston",
    website: "https://iondistrict.com",
    description: "Innovation hub with coworking, labs, and corporate/startup programs.",
    tags: ["innovation-district", "coworking", "programs"],
    category: "Innovation District",
    latitude: 29.7336,
    longitude: -95.3851,
    address: "4201 Main St, Houston, TX"
  }
];

export const communitySeedData = communities;

export const seedCommunities = async (prisma: PrismaClient) => {
  for (const community of communitySeedData) {
    await prisma.community.upsert({
      where: { id: community.id },
      update: { ...community, tags: JSON.stringify(community.tags) },
      create: { ...community, tags: JSON.stringify(community.tags) }
    });
  }
};

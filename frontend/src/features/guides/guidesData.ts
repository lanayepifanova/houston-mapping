export type OrgRef = {
  id: string;
  label: string;
  kind: "firm" | "startup" | "community";
};

export type GuideSection = {
  id: string;
  title: string;
  bullets: {
    text: string;
    orgs?: OrgRef[];
    tags?: string[];
  }[];
};

export type Guide = {
  id: string;
  title: string;
  summary: string;
  breakIn: string[];
  pitfalls: string[];
  relatedTags: string[];
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    id: "energytech-101",
    title: "EnergyTech 101",
    summary: "Hydrogen, carbon, grid/storage, and industrial IoT foundations for Houston’s energy corridor.",
    breakIn: [
      "Meet operators and midstream leads; offer fast pilots for leak detection, ESG, or reliability.",
      "Join Halliburton Labs, Chevron Catalyst, Greentown Houston, and Rice Alliance Energy cohorts.",
      "Target OT/IT champions; win one site, then expand by asset class."
    ],
    pitfalls: [
      "Underestimating OT security/air-gapped constraints; plan for on-prem/edge and no outbound calls.",
      "Long procurement: budget cycles and safety reviews add months—pilot scopes must be crisp.",
      "Ignoring measurement/verification; align on KPIs (uptime, emissions avoided, payback)."
    ],
    relatedTags: ["energy", "climate", "hydrogen", "carbon", "storage", "industrial"],
    sections: [
      {
        id: "landscape",
        title: "Landscape",
        bullets: [
          {
            text: "Operators + corporate innovation: ExxonMobil, Shell, Chevron Technology Ventures, Halliburton Labs.",
            orgs: [
              { id: "partner-exxonmobil", label: "ExxonMobil", kind: "community" },
              { id: "partner-shell", label: "Shell", kind: "community" },
              { id: "firm-chevron-technology-ventures", label: "Chevron Technology Ventures", kind: "firm" },
              { id: "community-halliburton-labs", label: "Halliburton Labs", kind: "community" }
            ]
          },
          {
            text: "Pipelines/midstream: CO2/H2 transport and integrity monitoring opportunities.",
            tags: ["pipelines", "midstream"]
          }
        ]
      },
      {
        id: "where-startups-win",
        title: "Where startups win",
        bullets: [
          {
            text: "Hydrogen: production, coatings, leak detection, subsurface acceleration (GeoKiln).",
            orgs: [
              { id: "startup-geokiln", label: "GeoKiln", kind: "startup" },
              { id: "startup-arculus", label: "Arculus", kind: "startup" }
            ]
          },
          {
            text: "Carbon: MRV, point-source capture, and pipeline monitoring; 45Q/45V incentives.",
            tags: ["carbon", "monitoring"]
          },
          {
            text: "Grid/Storage: LDES, kinetic storage (Revterra), DER orchestration.",
            orgs: [{ id: "startup-revterra", label: "Revterra", kind: "startup" }]
          },
          {
            text: "Industrial IoT & safety: methane monitoring (Tranzmeo), vision safety (EyeTronic), edge AI (XNow).",
            orgs: [
              { id: "startup-tranzmeo", label: "Tranzmeo", kind: "startup" },
              { id: "startup-eyetronic", label: "EyeTronic", kind: "startup" },
              { id: "startup-xnow", label: "XNow", kind: "startup" }
            ]
          }
        ]
      },
      {
        id: "reg-standards",
        title: "Reg/Standards",
        bullets: [
          { text: "EPA methane rules (OGMP), PHMSA pipeline integrity, IRA 45Q/45V." },
          { text: "Utility interconnects (ERCOT), Class VI wells for CO2, OT security (NIST/ISA/IEC 62443)." }
        ]
      },
      {
        id: "pilots-funding",
        title: "Pilots & Funding",
        bullets: [
          {
            text: "Pilots via Halliburton Labs, Chevron Catalyst, midstream operators; Greentown demos.",
            orgs: [
              { id: "community-halliburton-labs", label: "Halliburton Labs", kind: "community" },
              { id: "firm-chevron-technology-ventures", label: "Chevron Technology Ventures", kind: "firm" }
            ]
          },
          { text: "DOE OCED/LPO funding; utility incentives for DR/LDES; 45Q/45V for carbon/hydrogen." }
        ]
      },
      {
        id: "who-to-talk-to",
        title: "Who to talk to",
        bullets: [
          {
            text: "Programs: Halliburton Labs, Greentown Houston, SURGE Accelerator, Rice Alliance Energy.",
            orgs: [
              { id: "community-halliburton-labs", label: "Halliburton Labs", kind: "community" },
              { id: "community-surge-accelerator", label: "SURGE Accelerator", kind: "community" }
            ]
          },
          {
            text: "Investors: 8090 Industries, Coastal Climate Partners, Quantum Energy Partners, Bayou Quantum.",
            orgs: [
              { id: "firm-8090-industries", label: "8090 Industries", kind: "firm" },
              { id: "firm-coastal-climate-partners", label: "Coastal Climate Partners", kind: "firm" },
              { id: "firm-quantum-energy-partners", label: "Quantum Energy Partners", kind: "firm" }
            ]
          }
        ]
      },
      {
        id: "templates",
        title: "Templates",
        bullets: [
          { text: "Pilot SOW: safety scope, data access, OT/edge deployment plan, M&V metrics." },
          { text: "BD email: anchor on regulation/compliance, offer fast demo + payback model." }
        ]
      }
    ]
  },
  {
    id: "aerospace-101",
    title: "Aerospace 101",
    summary: "Mission ops software, in-space services, and dual-use robotics rooted at JSC and the Spaceport.",
    breakIn: [
      "Build with flight heritage requirements in mind; show test data and reliability.",
      "Partner with JSC labs, Axiom, and Spaceport tenants; pursue NASA SBIR/SpaceWERX.",
      "Bridge terrestrial use cases (inspection/robots) to dual-use/space."
    ],
    pitfalls: [
      "Underestimating export controls (ITAR/EAR) and spectrum/licensing for sensing.",
      "Long procurement cycles—anchor on demos with commercial constellations or defense pilots.",
      "Insufficient redundancy and ops tooling; mission software must be auditable."
    ],
    relatedTags: ["aerospace", "space", "infrastructure", "robotics"],
    sections: [
      {
        id: "landscape",
        title: "Landscape",
        bullets: [
          {
            text: "NASA JSC, Axiom Space, Intuitive Machines, NanoRacks at Houston Spaceport.",
            orgs: [
              { id: "startup-nanoracks", label: "NanoRacks", kind: "startup" },
              { id: "startup-intuitive-machines", label: "Intuitive Machines", kind: "startup" },
              { id: "community-halliburton-labs", label: "Halliburton Labs", kind: "community" }
            ]
          }
        ]
      },
      {
        id: "where-startups-win",
        title: "Where startups win",
        bullets: [
          { text: "Mission ops + tasking (ground software, constellation automation)." },
          { text: "In-space manufacturing/logistics (Ambrosia Space, NanoRacks), debris/SSA." },
          { text: "Robotics and inspection (Gecko Robotics as analog), autonomy, and CV." },
          { text: "Materials/structures: pressure vessels (Steelhead), composites (Elementium)." }
        ]
      },
      {
        id: "reg-standards",
        title: "Reg/Standards",
        bullets: [
          { text: "FAA launch licensing, NOAA remote sensing, FCC spectrum coordination." },
          { text: "ITAR/EAR export controls; radiation testing requirements for hardware." }
        ]
      },
      {
        id: "pilots-funding",
        title: "Pilots & Funding",
        bullets: [
          { text: "NASA SBIR/STTR, SpaceWERX/AFWERX, Space Force pitch days." },
          { text: "Spaceport accelerator batches; Axiom ecosystem pilots." }
        ]
      },
      {
        id: "who-to-talk-to",
        title: "Who to talk to",
        bullets: [
          { text: "Investors: SpaceFund, Space City Ventures, Silent Ventures." },
          { text: "Programs: Spaceport incubators, JSC partnerships, Rice aerospace labs." }
        ]
      },
      {
        id: "templates",
        title: "Templates",
        bullets: [
          { text: "Mission-readiness checklist: redundancy, ops runbooks, telemetry plan." },
          { text: "Pilot deck: dual-use narrative, TRL, test/flight roadmap, licensing plan." }
        ]
      }
    ]
  },
  {
    id: "biotech-101",
    title: "Biotech 101",
    summary: "TMC-driven devices, diagnostics, and digital health with growing wet-lab capacity.",
    breakIn: [
      "Engage TMC Innovation/JLABS; align on clinical champions early.",
      "Pick regulatory path (510(k), De Novo, CLIA) and reimbursement story from day one.",
      "Secure quality (ISO13485/QMS) and data governance (HIPAA/BAA) before pilots."
    ],
    pitfalls: [
      "Skipping clinical evidence and payer path; demos without trial plans stall.",
      "Weak QMS/validation; hospitals will block without security/QA artifacts.",
      "Underestimating procurement and IRB timelines."
    ],
    relatedTags: ["health", "medtech", "diagnostics", "tmc", "women's-health"],
    sections: [
      {
        id: "landscape",
        title: "Landscape",
        bullets: [
          {
            text: "Texas Medical Center, TMC Innovation, JLABS @ TMC; health systems (MD Anderson, Baylor, Memorial Hermann).",
            orgs: [
              { id: "community-jlabs-tmc", label: "JLABS @ TMC", kind: "community" },
              { id: "community-rice-alliance", label: "Rice Alliance", kind: "community" }
            ]
          }
        ]
      },
      {
        id: "where-startups-win",
        title: "Where startups win",
        bullets: [
          { text: "Med devices: Saranas (bleed monitoring), Prana Thoracic (lung intervention), Direct Kinetics (ECG wearables)." },
          { text: "Diagnostics: MyLabBox (at-home), MolecularMatch (oncology decision support)." },
          { text: "Digital health: sepsis detection (LuminareMed), advance care planning (Koda)." }
        ]
      },
      {
        id: "reg-standards",
        title: "Reg/Standards",
        bullets: [
          { text: "FDA (510(k), De Novo, PMA), CLIA/CAP, HIPAA/BAA, SOC2 for SaaS." },
          { text: "Quality: ISO13485/QMS, clinical data, IRB approvals." }
        ]
      },
      {
        id: "pilots-funding",
        title: "Pilots & Funding",
        bullets: [
          { text: "TMCx cohorts, JLABS residency, BARDA/NIH SBIR." },
          { text: "Health system pilots with MD Anderson, Baylor, Memorial Hermann." }
        ]
      },
      {
        id: "who-to-talk-to",
        title: "Who to talk to",
        bullets: [
          { text: "Clinical champions at TMC, device incubators, and local CRO/CMO partners." },
          { text: "Investors: Med Center Partners, health-focused angels." }
        ]
      },
      {
        id: "templates",
        title: "Templates",
        bullets: [
          { text: "Pilot SOW: IRB status, device accountability, data sharing, endpoints." },
          { text: "Security packet: HIPAA, SOC2, BAA template, DPIA/THA checklist." }
        ]
      }
    ]
  },
  {
    id: "ai-industrial",
    title: "AI Industrial Systems",
    summary: "Applied AI for heavy industry, logistics, and infrastructure with safety and reliability baked in.",
    breakIn: [
      "Partner with OT leads; deploy edge-first with air-gap options.",
      "Show ROI fast: downtime reduction, safety incidents avoided, emissions measured.",
      "Win one facility, then template rollouts; support offline/low-connectivity."
    ],
    pitfalls: [
      "Pure cloud assumptions—many sites require on-prem/air-gapped deployments.",
      "Lack of explainability and audit; regulated customers need traceable models.",
      "Ignoring worker workflows; adoption hinges on low-friction UX and change management."
    ],
    relatedTags: ["industrial", "ai", "safety", "iot"],
    sections: [
      {
        id: "landscape",
        title: "Landscape",
        bullets: [
          { text: "Industrial operators (refineries, midstream, utilities), port/logistics players." },
          { text: "OT vendors and systems integrators; cloud/edge partners (Microsoft, Dell)." }
        ]
      },
      {
        id: "where-startups-win",
        title: "Where startups win",
        bullets: [
          { text: "Predictive maintenance/anomaly detection: BigMachine AI, Intelligent Core, ReasonOS." },
          { text: "Safety/compliance: EyeTronic (CV safety), ScribeRule (policy automation), methane monitoring (Tranzmeo)." },
          { text: "Edge copilots for field techs: XNow; digital twins and drone data: Optelos." }
        ]
      },
      {
        id: "reg-standards",
        title: "Reg/Standards",
        bullets: [
          { text: "OSHA safety, PHMSA for pipelines, NERC CIP for utilities, ISA/IEC 62443 for OT security." },
          { text: "Data residency and logging for auditability; model governance." }
        ]
      },
      {
        id: "pilots-funding",
        title: "Pilots & Funding",
        bullets: [
          { text: "Corporate pilots with Halliburton Labs, Chevron Catalyst, utilities; AFWERX/DIU for dual-use." },
          { text: "VCs: Moonshots, Silent Ventures, 8090 Industries for industrial/dual-use AI." }
        ]
      },
      {
        id: "who-to-talk-to",
        title: "Who to talk to",
        bullets: [
          { text: "OT/IT leads at plants, port authorities, and integrators; safety/compliance officers." },
          { text: "Local AI meetups and industrial consortiums; North Texas Innovation Alliance for smart city overlaps." }
        ]
      },
      {
        id: "templates",
        title: "Templates",
        bullets: [
          { text: "Pilot checklist: data access, edge deployment, safety sign-off, KPIs, rollback plan." },
          { text: "RFP response: OT security posture, offline mode, support SLAs, model auditability." }
        ]
      }
    ]
  },
  {
    id: "defense-tech",
    title: "Defense Tech",
    summary: "Dual-use autonomy, space, cyber, and materials with SBIR/DIU pathways.",
    breakIn: [
      "Map to specific mission needs; align with AFWERX/SpaceWERX solicitations.",
      "Prepare export control stance (ITAR/EAR) and security posture early.",
      "Show TRL and test data; use commercial traction to de-risk."
    ],
    pitfalls: [
      "Ignoring security/CMMC and export controls; slows down onboarding.",
      "Boilerplate decks—need mission-specific value and references.",
      "Underestimating contracting timelines; plan for phase I/II SBIR runway."
    ],
    relatedTags: ["defense", "dual-use", "security", "aerospace", "robotics"],
    sections: [
      {
        id: "landscape",
        title: "Landscape",
        bullets: [
          { text: "Space/dual-use: NanoRacks, Ambrosia Space; robotics: Gecko Robotics, Knightscope." },
          { text: "Investors: Moonshots, Silent Ventures, Boost VC, 8090 Industries." }
        ]
      },
      {
        id: "where-startups-win",
        title: "Where startups win",
        bullets: [
          { text: "Autonomy/robotics for inspection and security; aerial comms (SkyCom) for disasters." },
          { text: "Space logistics/in-space services; advanced materials (Arculus, XO-Nano)." },
          { text: "Cyber/edge AI and secure comms; mission ops software." }
        ]
      },
      {
        id: "reg-standards",
        title: "Reg/Standards",
        bullets: [
          { text: "ITAR/EAR, CMMC, FedRAMP/IL5 for cloud workloads; SBOM and supply-chain." },
          { text: "Test ranges and airspace for autonomy; RF/spectrum coordination." }
        ]
      },
      {
        id: "pilots-funding",
        title: "Pilots & Funding",
        bullets: [
          { text: "AFWERX/SpaceWERX SBIR/STTR, DIU solicitations, Army Applications Lab." },
          { text: "Dual-use accelerators (Boost VC), Plug and Play defense tracks." }
        ]
      },
      {
        id: "who-to-talk-to",
        title: "Who to talk to",
        bullets: [
          { text: "Defense primes, mission owners, and SBIR topic leads; dual-use investors." },
          { text: "University/consortia for testing; local aerospace/robotics meetups." }
        ]
      },
      {
        id: "templates",
        title: "Templates",
        bullets: [
          { text: "Capability brief: mission fit, TRL, test data, cyber posture, export stance." },
          { text: "Phase I/II SBIR plan: milestones, partner endorsements, transition path." }
        ]
      }
    ]
  }
];

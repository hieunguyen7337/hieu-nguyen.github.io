export interface PhotoItem {
  src: string;
  alt: string;
}

export interface Role {
  title: string;
  period: string;
}

export interface ExperienceLink {
  label: string;
  url: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  location?: string;
  roles: Role[];
  // The CV's bullets (AI variant) verbatim, then any owner-confirmed detail the CV has no room
  // for. scripts/sitecheck.mjs reads the .tex and fails the build if a CV bullet is missing here.
  bullets: string[];
  photoStrip?: PhotoItem[];
  links?: ExperienceLink[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  grade?: string;
}

const FPT_PATENT =
  'https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-achieves-us-patent-for-advanced-acoustic-anomaly-detection-technology';

export const experience: ExperienceEntry[] = [
  {
    id: 'plenarius',
    company: 'Plenarius (formerly Calimac)',
    roles: [{ title: 'Chief Technology Officer', period: 'April 2026 – Present' }],
    bullets: [
      'Inherited a PHP-based platform and led its migration to Go and PostgreSQL, moving 96 server-rendered pages, 205 API paths and the recommendation system onto the new production stack with no PHP in the request path.',
      'Designed the vector search architecture over roughly 200,000 papers and integrated paid AI features into the platform, including dimensionality reduction, quantised vector storage, exact re-scoring and evaluation across retrieval configurations.',
      'Run the production platform on a single 8-vCPU server for roughly US$43 per month all in, tracking retrieval quality, cost per query and infrastructure trade-offs.',
    ],
    links: [{ label: 'Website', url: 'https://plenarius.org' }],
  },
  {
    id: 'cognilaw',
    company: 'Cognilaw',
    location: 'Brisbane, Queensland, Australia',
    roles: [{ title: 'AI Researcher', period: 'January 2026 – June 2026' }],
    bullets: [
      'Evaluated and improved a hallucination-resistant RAG pipeline for legal workflows, testing retrieval strategies, grounded generation and answer validation using retrieval and response-quality metrics.',
    ],
    photoStrip: [
      { src: 'cognilaw/AI%26Society_Cognilaw_presentation.jfif', alt: 'AI & Society Cognilaw presentation' },
      { src: 'cognilaw/AI%26Society_Cognilaw_presentation_everyone_picture.jfif', alt: 'Cognilaw team group photo' },
    ],
  },
  {
    id: 'qut-ra',
    company: 'Queensland University of Technology',
    location: 'Brisbane, Queensland, Australia',
    roles: [{ title: 'Research Assistant', period: 'September 2025 – Present' }],
    bullets: [
      'Evaluated and engineered an agentic person re-identification system combining appearance, body composition, gait and physical attributes through confidence-weighted voting.',
      'Cleaned and prepared biomedical literature datasets, then fine-tuned transformer models for protein-protein interaction relation extraction.',
    ],
  },
  {
    id: 'viettel',
    company: 'Viettel Post',
    location: 'Hanoi, Vietnam',
    roles: [{ title: 'AI Software Engineer', period: 'April 2023 – November 2024' }],
    bullets: [
      'Integrated Whisper fine-tuned on Vietnamese with BERT classifiers for offensive-language detection and mood prediction, achieving 90% accuracy in production.',
      'Trained an Extra Trees classifier for customer churn prediction, reaching 80% accuracy.',
      'Developed and implemented route optimisation for logistics operations.',
    ],
  },
  {
    id: 'fpt',
    company: 'FPT Software',
    location: 'Hanoi, Vietnam',
    roles: [{ title: 'AI Software Engineer', period: 'October 2021 – March 2023' }],
    bullets: [
      "Contributed to FPT's US-patented Sound AI acoustic anomaly-detection platform, deployed on a Samsung factory floor. Built its Python backend on Azure Functions, supporting model serving, CI/CD and production monitoring.",
      'Built text summarisation and code generation applications alongside the Sound AI platform.',
    ],
    links: [{ label: 'FPT Patent', url: FPT_PATENT }],
  },
  {
    id: 'asilla',
    company: 'Asilla',
    location: 'Hanoi, Vietnam',
    roles: [{ title: 'Research Intern, Computer Vision', period: 'April 2021 – July 2021' }],
    bullets: [
      'Fine-tuned and deployed real-time human pose estimation on Jetson Nano with TensorRT, using INT8 quantisation and structured pruning to improve efficiency by 20% under edge-compute constraints.',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/hieunguyen7337/trt_pose_edited' }],
  },
];

// The CV files the club roles under "Volunteer", not Experience. The earlier role in each club is
// its own line here; on the CV it is the closing clause of the entry.
export const volunteer: ExperienceEntry[] = [
  {
    id: 'qut-tech',
    company: 'QUT The Emerging Coders Hub (TECH)',
    location: 'Brisbane, Queensland, Australia',
    roles: [
      { title: 'Vice President', period: 'October 2025 – Present' },
      { title: 'General Executive', period: 'June 2025 – October 2025' },
    ],
    bullets: [
      'Ran coding and IT workshops teaching beginners to build chatbots, personal websites and AI agents, and organised career events including mock interview sessions.',
    ],
    photoStrip: [
      { src: 'QUT_TECH/QUT_TECH_member.png', alt: 'QUT TECH members' },
      { src: 'QUT_TECH/QUT_TECH_project.jfif', alt: 'QUT TECH project showcase' },
      { src: 'QUT_TECH/QUT_TECH_feedback.jpg', alt: 'QUT TECH feedback session' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/QUT-TECH' },
      { label: 'Workshop Feedback', url: 'https://www.instagram.com/stories/highlights/18160688248434308/' },
    ],
  },
  {
    id: 'qut-aiml',
    company: 'QUT AI & ML Society',
    location: 'Brisbane, Queensland, Australia',
    roles: [
      { title: 'Project Manager', period: 'September 2025 – Present' },
      { title: 'Project Officer', period: 'August 2025 – September 2025' },
    ],
    bullets: [
      'Led 30+ members building a predictive analytics dashboard on real insurance data for claim-delay prediction and anomaly detection.',
    ],
    photoStrip: [
      { src: 'QUT_AIML/QUT_AIML_team.jfif', alt: 'QUT AIML team' },
      { src: 'QUT_AIML/QUT_AIML_first_week.jfif', alt: 'QUT AIML first week' },
      { src: 'QUT_AIML/QUT_AIML_first_NTI_project_night.jfif', alt: 'NTI project night' },
    ],
  },
];

export const education: EducationEntry[] = [
  {
    institution: 'Queensland University of Technology',
    degree: 'Master of Artificial Intelligence',
    period: 'February 2025 – November 2026',
    grade: 'GPA 6.54 / 7.0',
  },
  {
    institution: 'University of Science and Technology of Hanoi',
    degree: 'Bachelor of Information Technology',
    period: 'August 2018 – June 2021',
  },
];

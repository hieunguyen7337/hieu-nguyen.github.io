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
  description: string;
  photoStrip?: PhotoItem[];
  links?: ExperienceLink[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  grade?: string;
}

export const experience: ExperienceEntry[] = [
  {
    id: 'plenarius',
    company: 'Plenarius (formerly Calimac)',
    roles: [{ title: 'Chief Technology Officer', period: 'April 2026 – Present' }],
    description:
      'Leads engineering for the live research platform, which moved from an inherited PHP codebase to a Go and PostgreSQL stack now serving all of production, with zero PHP in the request path.',
    links: [{ label: 'Website', url: 'https://plenarius.org' }],
  },
  {
    id: 'cognilaw',
    company: 'Cognilaw',
    location: 'Brisbane, Queensland, Australia',
    roles: [{ title: 'AI Researcher', period: 'January 2026 – June 2026' }],
    description:
      'Built a hallucination-resistant retrieval-augmented generation pipeline for legal work, covering retrieval strategy design, grounded generation, answer validation, evaluation metrics and iterative optimisation loops.',
    photoStrip: [
      { src: 'cognilaw/AI%26Society_Cognilaw_presentation.jfif', alt: 'AI & Society Cognilaw presentation' },
      { src: 'cognilaw/AI%26Society_Cognilaw_presentation_everyone_picture.jfif', alt: 'Cognilaw team group photo' },
    ],
  },
  {
    id: 'qut-tech',
    company: 'QUT The Emerging Coders Hub (TECH)',
    location: 'Brisbane, Queensland, Australia',
    roles: [{ title: 'Vice President', period: 'October 2025 – Present' }],
    description:
      'Organise workshops to teach beginners in coding and IT how to build chatbots, personal websites, and AI agents.',
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
    roles: [{ title: 'Project Manager', period: 'September 2025 – Present' }],
    description:
      'Manage a team of 30+ club members researching and building an insurance analytics dashboard on NTI data to predict claim delays and detect fraud.',
    photoStrip: [
      { src: 'QUT_AIML/QUT_AIML_team.jfif', alt: 'QUT AIML team' },
      { src: 'QUT_AIML/QUT_AIML_first_week.jfif', alt: 'QUT AIML first week' },
      { src: 'QUT_AIML/QUT_AIML_first_NTI_project_night.jfif', alt: 'NTI project night' },
    ],
  },
  {
    id: 'qut-ra',
    company: 'Queensland University of Technology',
    location: 'Brisbane, Queensland, Australia',
    roles: [{ title: 'Research Assistant', period: 'September 2025 – Present' }],
    description:
      'Two active research streams: (1) transformer-based biomedical NLP for protein interaction extraction; (2) multi-agent computer vision for person re-identification.',
  },
  {
    id: 'viettel',
    company: 'Viettel Post',
    location: 'Hanoi, Vietnam',
    roles: [{ title: 'AI Software Engineer', period: 'April 2023 – November 2024' }],
    description:
      "Built NLP models for logistics operations including call centre analysis, churn prediction, and route optimisation for one of Vietnam's largest postal companies.",
  },
  {
    id: 'fpt',
    company: 'FPT Software',
    location: 'Hanoi, Vietnam',
    roles: [{ title: 'AI Software Engineer', period: 'October 2021 – March 2023' }],
    description:
      'Built the Python backend on Azure Functions for the Sound AI acoustic anomaly detection platform in production at Samsung, alongside text summarisation and code generation applications.',
  },
  {
    id: 'asilla',
    company: 'Asilla',
    location: 'Hanoi, Vietnam',
    roles: [{ title: 'Research Intern', period: 'April 2021 – July 2021' }],
    description:
      'Deployed human pose estimation to Jetson Nano edge devices using TensorRT, achieving a 20% efficiency improvement at real-time throughput through INT8 quantisation and structured pruning.',
  },
];

export const education: EducationEntry[] = [
  {
    institution: 'Queensland University of Technology',
    degree: "Master's degree, Artificial Intelligence",
    period: 'February 2025 – November 2026',
    grade: 'GPA 6.54 / 7.0',
  },
  {
    institution: 'University of Science and Technology of Ha Noi',
    degree: "Bachelor's degree, Information Technology",
    period: 'August 2018 – June 2021',
  },
];

export interface PhotoItem {
  src: string;
  alt: string;
}

export interface Role {
  title: string;
  period: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  location: string;
  roles: Role[];
  description: string;
  photoStrip?: PhotoItem[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
}

export const experience: ExperienceEntry[] = [
  {
    id: 'cognilaw',
    company: 'Cognilaw',
    location: 'Brisbane City, QLD',
    roles: [{ title: 'AI Researcher', period: 'January 2026 – Present' }],
    description:
      'Building a production RAG pipeline for legal professionals, focused on hallucination reduction, retrieval quality, and evaluation metrics.',
    photoStrip: [
      { src: 'cognilaw/AI%26Society_Cognilaw_presentation.jfif', alt: 'AI & Society Cognilaw presentation' },
      { src: 'cognilaw/AI%26Society_Cognilaw_presentation_everyone_picture.jfif', alt: 'Cognilaw team group photo' },
    ],
  },
  {
    id: 'qut-tech',
    company: 'QUT The Emerging Coders Hub (TECH)',
    location: 'Brisbane, Queensland',
    roles: [{ title: 'Vice President', period: 'October 2025 – Present' }],
    description:
      'Organise workshops to teach beginners in coding and IT how to build chatbots, personal websites, and AI agents.',
    photoStrip: [
      { src: 'QUT_TECH/QUT_TECH_member.png', alt: 'QUT TECH members' },
      { src: 'QUT_TECH/QUT_TECH_project.jfif', alt: 'QUT TECH project showcase' },
      { src: 'QUT_TECH/QUT_TECH_feedback.jpg', alt: 'QUT TECH feedback session' },
    ],
  },
  {
    id: 'qut-aiml',
    company: 'QUT AI & ML Society',
    location: 'Brisbane, Queensland',
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
    location: 'Brisbane City, QLD',
    roles: [{ title: 'Research Assistant', period: 'September 2025 – Present' }],
    description:
      'Two active research streams: (1) transformer-based biomedical NLP for protein interaction extraction; (2) multi-agent computer vision for person re-identification.',
  },
  {
    id: 'viettel',
    company: 'Viettel Post',
    location: 'Vietnam',
    roles: [{ title: 'AI Software Engineer', period: 'April 2023 – November 2024' }],
    description:
      "Built NLP models for logistics operations including call centre analysis, churn prediction, and route optimisation for one of Vietnam's largest postal companies.",
  },
  {
    id: 'fpt',
    company: 'FPT Software',
    location: 'Cầu Giấy, Hanoi, Vietnam',
    roles: [{ title: 'AI Software Engineer', period: 'October 2021 – March 2023' }],
    description:
      'Developed and deployed the backend of the Sound AI MLOps platform (in production at Samsung) plus text summarisation and code generation applications.',
  },
  {
    id: 'asilla',
    company: 'Asilla',
    location: 'Cầu Giấy, Hanoi, Vietnam',
    roles: [{ title: 'Research Intern', period: 'April 2021 – July 2021' }],
    description:
      'Improved human pose detection precision by 20% through model compression and advanced computer vision techniques on Jetson Nano edge devices.',
  },
];

export const education: EducationEntry[] = [
  {
    institution: 'Queensland University of Technology',
    degree: "Master's degree, Artificial Intelligence",
    period: 'February 2025 – November 2026',
  },
  {
    institution: 'University of Science and Technology of Ha Noi',
    degree: "Bachelor's degree, Information Technology",
    period: 'August 2018 – June 2021',
  },
];

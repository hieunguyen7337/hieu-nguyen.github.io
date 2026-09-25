export interface Badge {
  label: string;
  color: 'cyan' | 'indigo' | 'teal' | 'gold';
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2;
  badge?: Badge;
  primaryImage?: string;
  galleryImages?: string[];
  tags: string[];
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'plenarius',
    title: 'Plenarius',
    description:
      'Inherited a PHP platform and led the migration to Go and PostgreSQL for Plenarius, an open platform for academic research with vector search over roughly 200,000 papers. Production serves 96 server-rendered pages and 205 public API paths from one binary, with zero PHP in the request path. The retrieval architecture pairs a 1-bit binary quantisation prefilter with an exact re-scoring pass. The platform runs on one 8-vCPU server for roughly US$43 a month all in.',
    tier: 1,
    badge: { label: 'Active · CTO', color: 'cyan' },
    primaryImage: 'plenarius/plenarius_search.png',
    galleryImages: [
      'plenarius/plenarius_search.png',
      'plenarius/plenarius_home.png',
      'plenarius/plenarius_library.png',
    ],
    tags: ['Go', 'PostgreSQL', 'pgvector', 'Vector Search', 'Quantisation'],
    links: [{ label: 'Website', url: 'https://plenarius.org' }],
  },
  // ── TIER 1: Featured Research & Active Work ──────────────────────────────
  {
    id: 'local-ai-workflow-platform',
    title: 'Local AI Workflow Platform',
    description:
      'Local-first platform for authoring, running and visualising AI workflows from declarative YAML. Each workflow is validated through a Pydantic GraphSpec contract before being compiled into runnable graphs, with approval interrupts, rollback restore and eval coverage. The platform was presented at AgentCamp 2026, Brisbane Edition.',
    tier: 1,
    badge: { label: 'Presented · AgentCamp 2026', color: 'cyan' },
    primaryImage: 'AI_Agent_Local_Workflow_PLatform/PLatform_Workflow_sample.png',
    galleryImages: ['AI_Agent_Local_Workflow_PLatform/PLatform_Workflow_sample.png'],
    tags: ['Python', 'LangGraph', 'FastAPI', 'React Flow', 'Pydantic', 'YAML'],
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/hieunguyen7337/AI_Agent_Local_Workflow_PLatform',
      },
    ],
  },
  {
    id: 'cognilaw',
    title: 'Cognilaw',
    description:
      'Evaluated and improved a hallucination-resistant retrieval-augmented generation pipeline designed for legal workflows. The core challenge was hallucination reduction: legal AI that cites non-existent cases is worse than no AI at all. Work focused on testing retrieval strategies, grounded generation and answer validation using retrieval and response-quality metrics.',
    tier: 1,
    badge: { label: 'AI Researcher · 2026', color: 'indigo' },
    primaryImage: 'cognilaw/cognilaw_basic_architecture.jfif',
    galleryImages: [
      'cognilaw/cognilaw_basic_architecture.jfif',
      'cognilaw/cognilaw_architecture.jfif',
      'cognilaw/cognilaw_hallucination_eval.png',
      'cognilaw/AI%26Society_Cognilaw_presentation.jfif',
      'cognilaw/AI%26Society_Cognilaw_presentation_everyone_picture.jfif',
    ],
    tags: ['RAG', 'LLM', 'Hallucination Reduction', 'Legal AI', 'Python'],
    links: [{ label: 'Website', url: 'https://cognilawai.com/' }],
  },
  {
    id: 'reid',
    title: 'Agentic AI for Person Re-Identification',
    description:
      'Multi-agent architecture developed at QUT for person re-identification across camera feeds. Specialised agents reason over complementary visual cues: appearance, body composition, gait, and physical attributes. To produce the final prediction, a confidence-weighted voting mechanism aggregates the individual agent outputs into a unified identification decision.',
    tier: 1,
    badge: { label: 'QUT Research', color: 'indigo' },
    primaryImage: 'AgenticAI_for_Video_Re-Identification/Agentic_solution.jpg',
    galleryImages: [
      'AgenticAI_for_Video_Re-Identification/Agentic_solution.jpg',
      'AgenticAI_for_Video_Re-Identification/Re-ID_problem.png',
    ],
    tags: ['Computer Vision', 'Multi-Agent', 'Re-Identification', 'LLM'],
  },
  {
    id: 'nti',
    title: 'NTI Insurance Fraud Detection Dashboard',
    description:
      'Leading a team of 30+ QUT AIML Society members to build a predictive analytics dashboard on NTI insurance data, detecting fraudulent and anomalous claims and forecasting claim delays. Combines data science, software engineering, and ML model development on a real-world industry dataset.',
    tier: 1,
    badge: { label: 'Team Lead · 30+ Members', color: 'teal' },
    primaryImage: 'QUT_AIML/QUT_AIML_first_NTI_project_night.jfif',
    galleryImages: [
      'QUT_AIML/QUT_AIML_first_NTI_project_night.jfif',
      'QUT_AIML/NTI_dashboard.png',
      'QUT_AIML/QUT_AIML_team.jfif',
      'QUT_AIML/QUT_AIML_first_week.jfif',
    ],
    tags: ['Data Science', 'Fraud Detection', 'Dashboard', 'ML', 'Team Lead'],
    links: [
      { label: 'Frontend', url: 'https://github.com/QUT-AIML/NTI_Project_Frontend' },
      { label: 'Backend', url: 'https://github.com/QUT-AIML/NTI_Project_Backend' },
    ],
  },

  // ── TIER 2: Industry, Research & Hackathons ──────────────────────────────
  {
    id: 'protein',
    title: 'Relation Extraction for Protein-Protein Interaction',
    description:
      'Ongoing QUT research on relation extraction for protein-protein interaction. The project fine-tunes transformer models over biomedical literature to extract protein names and their interaction relationships. The resulting pipeline processes raw academic text and turns it into structured output.',
    tier: 2,
    badge: { label: 'QUT Research', color: 'indigo' },
    primaryImage:
      'Relation_Extraction_for_Protein-Protein_Interaction/general_model_architecture.jpg',
    galleryImages: [
      'Relation_Extraction_for_Protein-Protein_Interaction/general_model_architecture.jpg',
    ],
    tags: ['NLP', 'Bioinformatics', 'Transformers', 'Information Extraction'],
  },
  {
    id: 'audio',
    title: 'Audio Call Analysis',
    description:
      'Vietnamese-language call analysis system: Whisper fine-tuned on Vietnamese transcribes calls, then BERT classifiers detect offensive language and predict customer mood. Achieved 90% accuracy in production at Viettel Post.',
    tier: 2,
    primaryImage: 'Audio_Call_Analysis/Whisper_architecture.png',
    galleryImages: ['Audio_Call_Analysis/Whisper_architecture.png'],
    tags: ['NLP', 'Whisper', 'BERT', 'Vietnamese', 'Sentiment Analysis'],
  },
  {
    id: 'churn',
    title: 'Customer Churn Detection',
    description:
      'Customer churn detection for Viettel Post logistics operations. Built an Extra Trees classification model to predict which customers would churn, achieving 80% accuracy.',
    tier: 2,
    primaryImage: 'customer_churn/customer_churn_visual.png',
    galleryImages: ['customer_churn/customer_churn_visual.png'],
    tags: ['Data Science', 'ML', 'Churn Prediction', 'Scikit-learn'],
  },
  {
    id: 'soundai',
    title: 'Sound AI MLOps Platform',
    description:
      'Production acoustic anomaly detection platform deployed on a Samsung factory floor at FPT Software, contributing to a US patent awarded to FPT. The backend was written in Python on Azure Functions with MongoDB on Azure Cosmos DB, supporting model serving, CI/CD pipelines, backend integration, and monitoring.',
    tier: 2,
    primaryImage: 'SoundAI/Sound_AI_platform.png',
    galleryImages: ['SoundAI/Sound_AI_platform.png', 'SoundAI/Sound_AI_workflow.png'],
    tags: ['MLOps', 'Azure Functions', 'Docker', 'Production', 'Samsung'],
    links: [{ label: 'FPT Patent', url: 'https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-achieves-us-patent-for-advanced-acoustic-anomaly-detection-technology' }],
  },
  {
    id: 'pose',
    title: 'Human Pose Estimation on Edge',
    description:
      'Optimised a human pose estimation model for Jetson Nano edge devices during a computer vision internship at Asilla. Applying INT8 quantisation and structured pruning with TensorRT delivered a 20% efficiency improvement at real-time throughput under edge-compute constraints.',
    tier: 2,
    primaryImage: 'Human_Pose_Estimation_on_Edge/Human_pose_model_pipeline.PNG',
    galleryImages: ['Human_Pose_Estimation_on_Edge/Human_pose_model_pipeline.PNG'],
    tags: ['Computer Vision', 'Edge AI', 'Model Optimisation', 'Jetson Nano'],
    links: [{ label: 'GitHub', url: 'https://github.com/hieunguyen7337/trt_pose_edited' }],
  },
  {
    id: 'jarvis',
    title: 'Jarvis',
    description:
      "Conversational agent built at QUT's AI Hackathon during a 48-hour build. Students talk to Jarvis to manage deadlines, exams, and work shifts.",
    tier: 2,
    badge: { label: 'QUT AI Hackathon', color: 'indigo' },
    primaryImage: 'QUT_AIML_hackathon_Jarvis/Jarvis_opening_page.jfif',
    galleryImages: [
      'QUT_AIML_hackathon_Jarvis/Jarvis_opening_page.jfif',
      'QUT_AIML_hackathon_Jarvis/Jarvis_feature.jfif',
      'QUT_AIML_hackathon_Jarvis/Jarvis_presentation.jfif',
      'QUT_AIML_hackathon_Jarvis/Jarvis_team.jfif',
    ],
    tags: ['LLM', 'Chatbot', 'Hackathon', '48h Build'],
  },
  {
    id: 'safemind',
    title: 'SafeMind',
    description:
      'Awarded Most Viable at the TANDA GenAI Hackathon. SafeMind provides voice-driven workplace incident capture for injured workers. The system captures evidence via voice and automatically pre-fills the Queensland WorkCover FM106 claim form template, compressing hours of paperwork.',
    tier: 2,
    badge: { label: 'Most Viable · TANDA', color: 'gold' },
    primaryImage: 'Tanda_hackathon_Safemind/Safe_mind_prize.jfif',
    galleryImages: [
      'Tanda_hackathon_Safemind/Safe_mind_prize.jfif',
      'Tanda_hackathon_Safemind/Safe_mind_presentation.jfif',
      'Tanda_hackathon_Safemind/Safe_mind_team.jfif',
    ],
    tags: ['Python', 'Flask', 'OpenAI API', 'MongoDB', 'python-docx'],
  },
  {
    id: 'capture',
    title: 'Capture the Narrative',
    description:
      '1st Place, UNSW National AI Competition. Built generative-AI agents inside a simulated election environment as an adversarial exercise in how synthetic content shifts sentiment. Framed as a red-team demonstration of misuse risks rather than a persuasion capability, the simulation moved a projected 49.5% loss to a 51.2% result.',
    tier: 2,
    badge: { label: '1st Place · UNSW National', color: 'gold' },
    primaryImage: 'Capture_the_narrative/capture_the_narrative_prize.jfif',
    galleryImages: [
      'Capture_the_narrative/capture_the_narrative_prize.jfif',
      'Capture_the_narrative/capture_the_narrative_heading%20image.png',
      'Capture_the_narrative/fake_social_media_homepage.png',
    ],
    tags: ['LLMs', 'Multi-agent simulation', 'AWS EC2', 'S3'],
  },
];

export const tier1 = projects.filter((p) => p.tier === 1);
export const tier2 = projects.filter((p) => p.tier === 2);

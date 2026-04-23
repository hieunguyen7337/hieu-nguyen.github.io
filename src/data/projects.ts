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
  // ── TIER 1: Featured Research & Active Work ──────────────────────────────
  {
    id: 'cognilaw',
    title: 'Cognilaw',
    description:
      'Building and evaluating a Retrieval-Augmented Generation pipeline specifically designed for the legal profession. The core challenge is hallucination reduction: legal AI that cites non-existent cases is worse than no AI at all. Working on custom retrieval strategies, evaluation metrics, and an iterative optimisation loop.',
    tier: 1,
    badge: { label: 'Active · AI Researcher', color: 'cyan' },
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
      'Multi-agent architecture where specialised agents reason over complementary cues (appearance, body composition, gait, and physical attributes) to identify individuals across camera feeds. Confidence-weighted voting makes the system robust to occlusion and appearance changes.',
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
    id: 'protein',
    title: 'Relation Extraction for Protein-Protein Interaction',
    description:
      'Fine-tuning transformer models to extract protein names and their interaction relationships from biomedical literature. The pipeline processes raw academic text and outputs structured knowledge graphs that can power drug discovery databases.',
    tier: 1,
    badge: { label: 'QUT Research', color: 'indigo' },
    primaryImage:
      'Relation_Extraction_for_Protein-Protein_Interaction/general_model_architecture.jpg',
    galleryImages: [
      'Relation_Extraction_for_Protein-Protein_Interaction/general_model_architecture.jpg',
    ],
    tags: ['NLP', 'Bioinformatics', 'Transformers', 'Information Extraction'],
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
    id: 'audio',
    title: 'Audio Call Analysis',
    description:
      'Vietnamese-language call analysis system: Whisper fine-tuned on Vietnamese transcribes calls, then BERT classifiers detect offensive language and predict customer mood. Achieved 90% accuracy in production at a major telecom.',
    tier: 2,
    primaryImage: 'Audio_Call_Analysis/Whisper_architecture.png',
    galleryImages: ['Audio_Call_Analysis/Whisper_architecture.png'],
    tags: ['NLP', 'Whisper', 'BERT', 'Vietnamese', 'Sentiment Analysis'],
  },
  {
    id: 'churn',
    title: 'Customer Churn Detection',
    description:
      'Predicted which customers would churn with 80% accuracy using Extra Tree Regression on Viettel Post logistics data. Identified early warning signals that enabled proactive retention campaigns.',
    tier: 2,
    primaryImage: 'customer_churn/customer_churn_visual.png',
    galleryImages: ['customer_churn/customer_churn_visual.png'],
    tags: ['Data Science', 'ML', 'Churn Prediction', 'Scikit-learn'],
  },
  {
    id: 'soundai',
    title: 'Sound AI MLOps Platform',
    description:
      'End-to-end MLOps platform based on Landing AI, deployed in production on a Samsung factory floor for acoustic anomaly detection. Managed backend infrastructure, CI/CD pipelines, model serving, and monitoring at FPT Software.',
    tier: 2,
    primaryImage: 'SoundAI/Sound_AI_platform.png',
    galleryImages: ['SoundAI/Sound_AI_platform.png', 'SoundAI/Sound_AI_workflow.png'],
    tags: ['MLOps', 'FastAPI', 'Docker', 'Production', 'Samsung'],
    links: [{ label: 'FPT Patent', url: 'https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-achieves-us-patent-for-advanced-acoustic-anomaly-detection-technology' }],
  },
  {
    id: 'pose',
    title: 'Human Pose Estimation on Edge',
    description:
      'Optimised a pose estimation model for Jetson Nano edge devices at Asilla, achieving a 20% precision improvement while maintaining real-time inference speed through model compression and quantisation.',
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
      'Conversational AI agent built at QUT\'s AI Hackathon in 48 hours. Students talk to Jarvis to manage deadlines, exams, and work shifts. It also connects students with shared food preferences for on-campus dining.',
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
      'Most Viable award at TANDA GenAI Hackathon. Voice-powered OHS incident reporting for injured workers. SafeMind captures evidence via voice and automatically pre-fills WorkCover claim forms, reducing hours of paperwork to minutes.',
    tier: 2,
    badge: { label: 'Most Viable · TANDA', color: 'gold' },
    primaryImage: 'Tanda_hackathon_Safemind/Safe_mind_prize.jfif',
    galleryImages: [
      'Tanda_hackathon_Safemind/Safe_mind_prize.jfif',
      'Tanda_hackathon_Safemind/Safe_mind_presentation.jfif',
      'Tanda_hackathon_Safemind/Safe_mind_team.jfif',
    ],
    tags: ['LLM', 'Voice AI', 'OHS', 'Hackathon', 'Award Winner'],
  },
  {
    id: 'capture',
    title: 'Capture the Narrative',
    description:
      '1st Place at UNSW National AI Competition. Developed GenAI bots that strategically influence voter sentiment through targeted content. In simulation, shifted a projected 49.5% loss to a 51.2% victory, demonstrating both the power and risk of AI in political communication.',
    tier: 2,
    badge: { label: '1st Place · UNSW National', color: 'gold' },
    primaryImage: 'Capture_the_narrative/capture_the_narrative_prize.jfif',
    galleryImages: [
      'Capture_the_narrative/capture_the_narrative_prize.jfif',
      'Capture_the_narrative/capture_the_narrative_heading%20image.png',
      'Capture_the_narrative/fake_social_media_homepage.png',
    ],
    tags: ['GenAI', 'LLM', 'NLP', 'Competition', 'Award Winner'],
  },
];

export const tier1 = projects.filter((p) => p.tier === 1);
export const tier2 = projects.filter((p) => p.tier === 2);

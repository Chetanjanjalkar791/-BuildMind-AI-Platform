export type ToolTab =
  | 'home'
  | 'dashboard'
  | 'frontend'
  | 'code-gen'
  | 'roadmap'
  | 'complexity'
  | 'algorithm'
  | 'api-mock'
  | 'chats';

export interface DeveloperMetric {
  title: string;
  value: string | number;
  change: string;
  type: 'increase' | 'decrease' | 'neutral';
  icon: string;
}

export interface SavedSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  explanation?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  tool: ToolTab;
  messages: ChatMessage[];
  createdAt: string;
}

export interface GeneratedCodeResponse {
  code: string;
  explanation: string;
  language: string;
  title: string;
}

export interface FrontendComponentResponse {
  html: string;
  css: string;
  js: string;
  explanation: string;
}

export interface ComplexityAnalysis {
  time: string;
  space: string;
  explanation: string;
  bottlenecks: string[];
  optimizedCode: string;
  growthData: { n: number; linear: number; quadratic: number; custom: number; customLabel: string }[];
}

export interface AlgorithmStep {
  step: number;
  line: string;
  variables: Record<string, string>;
  explanation: string;
}

export interface AlgorithmBreakdown {
  title: string;
  concept: string;
  code: string;
  variables: string[];
  steps: AlgorithmStep[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  resources: string[];
}

export interface RoadmapResponse {
  title: string;
  overallTimeline: string;
  nodes: RoadmapNode[];
}

export interface ApiMockEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  headers: Record<string, string>;
  responseBody: string;
  fetchSelector: string;
}

export interface ApiMockResponse {
  title: string;
  description: string;
  endpoints: ApiMockEndpoint[];
}

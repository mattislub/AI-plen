export type ProjectSection = {
  type: string;
  content: Record<string, any>;
};

export type ProjectStructure = {
  name: string;
  title: string;
  sections: ProjectSection[];
};

export type Project = {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  theme: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  created_at: string;
  updated_at: string;
  structure?: ProjectStructure[];
};

export type ProjectInput = {
  title: string;
  description: string;
  theme: string;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  structure?: ProjectStructure[];
};

const STORAGE_KEY = 'ai-plen-projects';
let inMemoryStore: Project[] = [];

function isBrowserEnvironment() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readProjects(): Project[] {
  if (isBrowserEnvironment()) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Project[];
    } catch (error) {
      console.warn('Failed to parse stored projects. Resetting storage.', error);
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }
  return inMemoryStore;
}

function writeProjects(projects: Project[]) {
  if (isBrowserEnvironment()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } else {
    inMemoryStore = projects;
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

export async function fetchProjects(): Promise<Project[]> {
  const projects = readProjects();
  return projects.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const timestamp = new Date().toISOString();
  const project: Project = {
    id: generateId(),
    user_id: null,
    title: input.title || 'פרויקט ללא שם',
    description: input.description || '',
    theme: input.theme || 'כללי',
    primary_color: input.primary_color || '#1D4ED8',
    secondary_color: input.secondary_color || '#9333EA',
    background_color: input.background_color || '#F8FAFC',
    created_at: timestamp,
    updated_at: timestamp,
    structure: input.structure,
  };

  const projects = readProjects();
  writeProjects([project, ...projects]);
  return project;
}

export async function removeProject(id: string): Promise<void> {
  const projects = readProjects();
  writeProjects(projects.filter((project) => project.id !== id));
}

export async function clearProjects() {
  writeProjects([]);
}

import { useState } from 'react';
import HomePage from './components/HomePage';
import ProjectsList from './components/ProjectsList';
import ProjectWizard from './components/ProjectWizard';
import FloatingChat from './components/FloatingChat';
import { Project } from './lib/supabase';

type AppView = 'home' | 'projects' | 'wizard' | 'project-detail';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  function handleStartNewProject() {
    setView('wizard');
  }

  function handleViewProjects() {
    setView('projects');
  }

  function handleBackHome() {
    setView('home');
    setSelectedProject(null);
  }

  function handleProjectComplete(project: Project) {
    setSelectedProject(project);
    setView('projects');
  }

  function handleSelectProject(project: Project) {
    setSelectedProject(project);
    alert(`פרויקט "${project.title}" נבחר!\nפיתוח תצוגת הפרויקט בקרוב...`);
  }

  return (
    <>
      {view === 'home' && (
        <HomePage
          onStartNewProject={handleStartNewProject}
          onViewProjects={handleViewProjects}
        />
      )}

      {view === 'projects' && (
        <ProjectsList
          onBackHome={handleBackHome}
          onStartNewProject={handleStartNewProject}
          onSelectProject={handleSelectProject}
        />
      )}

      {view === 'wizard' && (
        <ProjectWizard
          onCancel={handleBackHome}
          onComplete={handleProjectComplete}
        />
      )}

      <FloatingChat />
    </>
  );
}

export default App;

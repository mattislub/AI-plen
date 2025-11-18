import { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Plus, Calendar } from 'lucide-react';
import { fetchProjects, removeProject, type Project } from '../lib/supabase';

interface ProjectsListProps {
  onBackHome: () => void;
  onStartNewProject: () => void;
  onSelectProject: (project: Project) => void;
}

export default function ProjectsList({ onBackHome, onStartNewProject, onSelectProject }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('האם אתה בטוח שברצונך למחוק את הפרויקט?')) return;

    try {
      await removeProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('שגיאה במחיקת הפרויקט');
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={onBackHome}
              className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לדף הבית
            </button>
            <h1 className="text-4xl font-bold text-gray-900">הפרויקטים שלי</h1>
          </div>
          <button
            onClick={onStartNewProject}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            פרויקט חדש
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600 text-lg mb-4">עדיין לא יצרת פרויקטים</p>
            <button
              onClick={onStartNewProject}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              צור את הפרויקט הראשון שלך
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title || 'פרויקט ללא שם'}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.description || 'אין תיאור'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteProject(project.id, e)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(project.updated_at)}</span>
                </div>

                {project.theme && (
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {project.theme}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

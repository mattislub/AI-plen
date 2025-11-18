import { Sparkles, FolderKanban } from 'lucide-react';

interface HomePageProps {
  onStartNewProject: () => void;
  onViewProjects: () => void;
}

export default function HomePage({ onStartNewProject, onViewProjects }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            בואו ליצור את האתר שלכם
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            תארו באופן חופשי מה אתם רוצים לבנות, והבינה המלאכותית תעזור לכם לתכנן ולעצב את האתר המושלם
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <button
            onClick={onStartNewProject}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-600"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <Sparkles className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">פרויקט חדש</h2>
              <p className="text-gray-600">
                התחילו פרויקט חדש עם הבינה המלאכותית
              </p>
            </div>
          </button>

          <button
            onClick={onViewProjects}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-600"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <FolderKanban className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">הפרויקטים שלי</h2>
              <p className="text-gray-600">
                צפו בכל הפרויקטים שיצרתם
              </p>
            </div>
          </button>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          <p>מופעל על ידי OpenAI GPT-4 • נתמך על ידי Supabase</p>
        </div>
      </div>
    </div>
  );
}

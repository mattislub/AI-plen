import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle, Edit3 } from 'lucide-react';
import { createProject, type Project, type ProjectStructure } from '../lib/supabase';

interface ProjectWizardProps {
  onCancel: () => void;
  onComplete: (project: Project) => void;
}

type WizardStep = 'describe' | 'review' | 'edit';

interface GeneratedContent {
  title: string;
  description: string;
  theme: string;
  pages: Array<{
    name: string;
    title: string;
    sections: Array<{
      type: string;
      content: Record<string, any>;
    }>;
  }>;
}

export default function ProjectWizard({ onCancel, onComplete }: ProjectWizardProps) {
  const [step, setStep] = useState<WizardStep>('describe');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [editedContent, setEditedContent] = useState<GeneratedContent | null>(null);

  async function handleGenerateContent() {
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const content = await generateContentLocally(userInput);
      setGeneratedContent(content);
      setEditedContent(content);
      setStep('review');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('שגיאה ביצירת התוכן. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProject() {
    if (!editedContent) return;

    setLoading(true);
    try {
      const projectStructure: ProjectStructure[] = editedContent.pages.map((page, index) => ({
        name: page.name || `page-${index + 1}`,
        title: page.title,
        sections: page.sections.map(section => ({
          type: section.type,
          content: section.content,
        })),
      }));

      const project = await createProject({
        title: editedContent.title,
        description: editedContent.description,
        theme: editedContent.theme,
        structure: projectStructure,
      });

      onComplete(project);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('שגיאה בשמירת הפרויקט. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  }

  function summarizeTheme(input: string) {
    if (!input.trim()) return 'מותאם אישית';
    const keywords = input
      .replace(/[.,!?]/g, '')
      .split(' ')
      .map(word => word.trim())
      .filter(Boolean);
    if (keywords.length === 0) return 'מותאם אישית';
    return `${keywords.slice(0, 3).join(' ')}`;
  }

  async function generateContentLocally(description: string): Promise<GeneratedContent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanDescription = description.trim();
        const title = cleanDescription
          ? `אתר עבור ${cleanDescription.split(/[.!?]/)[0]?.slice(0, 40)}`
          : 'אתר חדש שנוצר באשף';
        const theme = summarizeTheme(cleanDescription);
        const baseCTA = cleanDescription ? 'דברו איתי עכשיו' : 'למידע נוסף';
        const heroHeading = cleanDescription || 'בואו לבנות איתנו אתר ייחודי';

        const pages = [
          {
            name: 'home',
            title: 'דף הבית',
            sections: [
              {
                type: 'hero',
                content: {
                  heading: heroHeading,
                  subheading: 'פתרונות דיגיטליים מותאמים אישית לצרכים שלכם',
                  cta: baseCTA,
                },
              },
              {
                type: 'about',
                content: {
                  title: 'מי אנחנו',
                  body: cleanDescription || 'הגיע הזמן לספר לעולם עליכם ועל מה שאתם מציעים.',
                },
              },
            ],
          },
          {
            name: 'services',
            title: 'שירותים',
            sections: [
              {
                type: 'services',
                content: {
                  title: 'מה אנחנו מציעים',
                  items: [
                    'פתרונות מותאמים אישית',
                    'תכנון חווית משתמש',
                    'תמיכה וליווי מתמשך',
                  ],
                },
              },
              {
                type: 'features',
                content: {
                  title: 'למה לבחור בנו',
                  items: [
                    'גישה מקצועית וקשובה',
                    'עיצוב עכשווי ונקי',
                    'התמקדות בתוצאות עסקיות',
                  ],
                },
              },
            ],
          },
          {
            name: 'contact',
            title: 'צור קשר',
            sections: [
              {
                type: 'contact',
                content: {
                  title: 'נשמח לשמוע מכם',
                  description: 'צרו קשר ונבנה יחד אתר מדויק לצרכים שלכם',
                  cta: 'שלחו הודעה',
                },
              },
              {
                type: 'faq',
                content: {
                  title: 'שאלות נפוצות',
                  items: [
                    { question: 'כמה זמן לוקח לבנות אתר?', answer: 'רוב הפרויקטים מסתיימים תוך מספר שבועות.' },
                    { question: 'מה נדרש ממני כדי להתחיל?', answer: 'תיאור קצר של המטרה והחזון שלכם.' },
                  ],
                },
              },
            ],
          },
        ];

        resolve({
          title,
          description: cleanDescription || 'אשף הפרויקטים יוצר עבורך מבנה אתר בסיסי שניתן לערוך בקלות.',
          theme,
          pages,
        });
      }, 800);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" />
            ביטול
          </button>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'describe' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'describe' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="font-medium">תיאור</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded"></div>
            <div className={`flex items-center gap-2 ${step === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="font-medium">סקירה</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded"></div>
            <div className={`flex items-center gap-2 ${step === 'edit' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="font-medium">עריכה</span>
            </div>
          </div>
        </div>

        {step === 'describe' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">תארו את האתר שלכם</h2>
            </div>
            <p className="text-gray-600 mb-6">
              ספרו לנו באופן חופשי איזה אתר אתם רוצים לבנות. תארו את המטרה, התוכן, העיצוב ואת כל מה שחשוב לכם.
            </p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="לדוגמה: אני רוצה אתר תדמית לעסק שלי בתחום הצילום. האתר יכלול גלריית תמונות, מידע עליי, מחירון שירותים ודרכי יצירת קשר..."
              className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none resize-none text-lg"
              disabled={loading}
            />
            <button
              onClick={handleGenerateContent}
              disabled={!userInput.trim() || loading}
              className="mt-6 w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  יוצר את התוכן...
                </>
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  המשך לסקירה
                </>
              )}
            </button>
          </div>
        )}

        {step === 'review' && editedContent && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">סקירת התוכן</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם האתר</label>
                <input
                  type="text"
                  value={editedContent.title}
                  onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
                <textarea
                  value={editedContent.description}
                  onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">נושא</label>
                <input
                  type="text"
                  value={editedContent.theme}
                  onChange={(e) => setEditedContent({ ...editedContent, theme: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">דפים ({editedContent.pages.length})</h3>
                <div className="space-y-3">
                  {editedContent.pages.map((page, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{page.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {page.sections.length} קטעים: {page.sections.map(s => s.type).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep('describe')}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                חזרה
              </button>
              <button
                onClick={() => setStep('edit')}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                עריכה מפורטת
              </button>
              <button
                onClick={handleSaveProject}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    שומר...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    שמור והמשך
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'edit' && editedContent && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Edit3 className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">עריכה מפורטת</h2>
            </div>

            <div className="space-y-8">
              {editedContent.pages.map((page, pageIdx) => (
                <div key={pageIdx} className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{page.title}</h3>
                  <div className="space-y-4">
                    {page.sections.map((section, sectionIdx) => (
                      <div key={sectionIdx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 mb-2">
                          קטע: {section.type}
                        </div>
                        <textarea
                          value={JSON.stringify(section.content, null, 2)}
                          onChange={(e) => {
                            try {
                              const newContent = JSON.parse(e.target.value);
                              const newPages = [...editedContent.pages];
                              newPages[pageIdx].sections[sectionIdx].content = newContent;
                              setEditedContent({ ...editedContent, pages: newPages });
                            } catch (error) {
                            }
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm h-32 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep('review')}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                חזרה
              </button>
              <button
                onClick={handleSaveProject}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    שומר...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    שמור והמשך
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export type AIConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  aiFunctionUrl: string;
};

export function getAIConfig(): { config?: AIConfig; error?: string } {
  if (!SUPABASE_URL && !SUPABASE_ANON_KEY) {
    return {
      error:
        'לא נמצאו משתני הסביבה VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY. אנא ודא שהגדרת את הערכים בקובץ ה-.env המקומי שלך.',
    };
  }

  if (!SUPABASE_URL) {
    return {
      error: 'משתנה הסביבה VITE_SUPABASE_URL חסר. אנא הגדר אותו כדי לאפשר חיבור ל-AI.',
    };
  }

  if (!SUPABASE_ANON_KEY) {
    return {
      error: 'משתנה הסביבה VITE_SUPABASE_ANON_KEY חסר. אנא הגדר אותו כדי לאפשר חיבור ל-AI.',
    };
  }

  return {
    config: {
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
      aiFunctionUrl: `${SUPABASE_URL}/functions/v1/ai-assistant`,
    },
  };
}

export type AmaQuestion = {
  id: string;
  question: string;
  display_name: string | null;
  is_anonymous: boolean;
  contact_email: string | null;
  contact_phone: string | null;
  contact_handle: string | null;
  created_at: string;
};

export type AmaQuestionInput = {
  question: string;
  anonymous?: boolean;
  displayName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactHandle?: string;
};
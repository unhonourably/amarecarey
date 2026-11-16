export type GuestbookEntry = {
  id: string;
  signature: string;
  body: string;
  is_anonymous: boolean;
  anonymous_number: number | null;
  created_at: string;
};

export type GuestbookInput = {
  signature: string;
  body: string;
  anonymous?: boolean;
};
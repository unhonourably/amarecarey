export type GuestbookEntry = {
  id: string;
  signature: string;
  body: string;
  created_at: string;
};

export type GuestbookInput = {
  signature: string;
  body: string;
};
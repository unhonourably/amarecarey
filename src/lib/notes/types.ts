export type TipTapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
};

export type TipTapDoc = {
  type: "doc";
  content?: TipTapNode[];
};

export type PersonalNote = {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  content: TipTapDoc;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PersonalNoteSummary = Omit<PersonalNote, "content">;

export type NoteInput = {
  first_name: string;
  last_name: string;
  content: TipTapDoc;
  published?: boolean;
};

export type NoteStats = {
  total: number;
  published: number;
  drafts: number;
};

export type LookupResult =
  | { found: true; slug: string }
  | { found: false };

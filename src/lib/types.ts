export type Lang = "hu" | "en";
export type PageId = string;
export type Filename = string;
export type CodeFile = {content: string; version: number;};
export type Pages = Record<Lang, Record<PageId, Record<Filename, CodeFile>>>;

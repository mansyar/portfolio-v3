import { atom } from 'nanostores';

export type SafeModeView =
  | 'main'
  | 'projects'
  | 'knowledge-base'
  | 'contact'
  | 'project-detail'
  | 'article-detail';

export const $safeModeView = atom<SafeModeView>('main');
export const $safeModeSlug = atom<string | null>(null);

export function setSafeModeView(view: SafeModeView): void {
  $safeModeView.set(view);
}

export function setSafeModeSlug(slug: string | null): void {
  $safeModeSlug.set(slug);
}

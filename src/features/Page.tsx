import { ReactNode } from 'react';

export function Page({ header, content }: { header: ReactNode; content: ReactNode }) {
  return (
    <article className="animate-fade-in">
      <header className="relative mb-6">
        <div className="absolute top-0 -left-4 h-full w-1 bg-[var(--color-signal)]" />
        <div className="pl-4">{header}</div>
      </header>
      <section className="border-theme bg-surface rounded-lg border p-6 sm:p-8">{content}</section>
    </article>
  );
}

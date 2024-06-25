import { ReactNode } from 'react';

export const Page = ({ header, content }: { header: ReactNode; content: ReactNode }) => {
  return (
    <>
      <header className="-mb-2 rounded-t-xl bg-stone-200 px-8 pb-8 pt-6 dark:bg-zinc-800">
        {header}
      </header>
      <section className="-mx-0 rounded-xl border-2 border-stone-200 bg-stone-50 p-8 dark:border-zinc-800 dark:bg-zinc-600">
        {content}
      </section>
    </>
  );
};

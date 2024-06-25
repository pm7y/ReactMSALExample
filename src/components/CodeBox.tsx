import { CopyButton } from './CopyButton';

export function CodeBox({
  code,
  copyValue,
  copyLabel,
}: {
  readonly code: string;
  readonly copyValue?: string | null;
  readonly copyLabel?: string | null;
}) {
  const copyText = copyValue ?? code;

  return (
    <div className="my-6 rounded-2xl bg-stone-200 px-4 pb-4 pt-2 dark:bg-stone-900">
      {copyText && (
        <div className="flex justify-end">
          <CopyButton value={copyText} label={copyLabel ?? 'Copy'} />
        </div>
      )}
      <pre className="custom-scrollbar overflow-x-auto pb-4 text-sm">{code}</pre>
    </div>
  );
}

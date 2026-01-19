import { CopyButton } from './CopyButton';

const DotIndicator = () => <span className="dot-indicator" />;

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
    <div className="group border-theme bg-surface relative my-6 overflow-hidden rounded-lg border dark:bg-[var(--color-void)]">
      <div className="border-theme bg-surface-elevated flex items-center justify-between border-b px-4 py-2 dark:bg-[var(--color-charcoal)]">
        <div className="flex items-center gap-2">
          <DotIndicator />
          <DotIndicator />
          <DotIndicator />
        </div>
        {copyText && <CopyButton value={copyText} label={copyLabel ?? 'Copy'} />}
      </div>
      <pre className="custom-scrollbar text-primary overflow-x-auto p-4 text-sm leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

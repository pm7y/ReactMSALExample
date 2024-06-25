import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon';

export function CopyButton({ value, label }: { readonly value: string; readonly label?: string }) {
  return (
    <button
      type="button"
      title={label ?? 'Copy to Clipboard'}
      onClick={() => {
        navigator.clipboard.writeText(value);
      }}
      className="flex items-center justify-between gap-1 hover:scale-105 active:scale-95">
      <ClipboardIcon className="size-5" />
      {label && <span className="font-mono text-xs leading-none"> {label}</span>}
    </button>
  );
}

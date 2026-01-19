export function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-light-bg)]/80 backdrop-blur-sm dark:bg-[var(--color-void)]/80">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner" />
        <span className="text-sm text-[var(--color-light-muted)] dark:text-[var(--color-mist)]">
          Authenticating...
        </span>
      </div>
    </div>
  );
}

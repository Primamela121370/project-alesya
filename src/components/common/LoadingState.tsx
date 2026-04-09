export function LoadingState({ text = 'Загрузка...' }: { text?: string }) {
  return <div className="rounded border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-sm text-[var(--color-muted)]">{text}</div>;
}

export function EmptyState({ text = 'Пока пусто' }: { text?: string }) {
  return <div className="rounded border border-dashed border-[var(--color-border-mid)] bg-[var(--color-card)] p-4 text-sm text-[var(--color-muted)]">{text}</div>;
}

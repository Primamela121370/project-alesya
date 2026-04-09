export function required(value: string, label: string) {
  if (!value.trim()) return `${label} обязательно`;
  return '';
}

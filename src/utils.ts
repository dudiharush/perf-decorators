export interface WithPerfData {
  __perfData: unknown[];
  logPref: () => void;
}

export function hasPerfData(obj: unknown): obj is WithPerfData {
  return (obj as WithPerfData).__perfData !== undefined;
}

export const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

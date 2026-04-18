export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(error: string): ServiceResult<T> {
  return { ok: false, error };
}

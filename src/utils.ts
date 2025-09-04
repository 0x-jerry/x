import { existsSync, type PathLike } from 'node:fs'
import { exec as _exec, type ExecOptions } from '@0x-jerry/utils/node'

export async function exec(
  script: string,
  params: string[],
  opt?: ExecOptions,
) {
  const cmd = [script, ...params].join(' ')

  await _exec(cmd, opt)
}

export function exists(path: PathLike) {
  return existsSync(path)
}

export function flagOptionToStringArray(
  opt: Record<string, string | null | number | boolean | undefined>,
): string[] {
  return Object.entries(opt).flatMap(([_key, value]) => {
    const key = (_key.length === 1 ? '-' : '--') + _key
    if (typeof value === 'string' || typeof value === 'number') {
      return [key, String(value)]
    }
    return [key]
  })
}

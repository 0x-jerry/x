import type { ModuleSource } from 'node:module'

export function sourceToStr(source?: ModuleSource) {
  if (!source) return ''

  if (source instanceof ArrayBuffer) {
    return Buffer.from(source).toString('utf-8')
  }

  if (typeof source === 'string') {
    return source
  }

  return Buffer.from(source.buffer).toString('utf-8')
}

import type { LoadHook, ModuleSource, ResolveHook } from 'node:module'

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

export function chainHooks<T extends LoadHook | ResolveHook>(fns: T[]): T {
  const wrapperFn = (a: unknown, b: unknown, defaultHook: any) => {
    const fn = fns.reduceRight((prev, hook) => {
      return (a: any, b: any) => {
        // console.log(a, b, hook)
        return hook(a, b, prev)
      }
    }, defaultHook)

    // console.log(a, b, fn)
    return fn(a, b)
  }

  return wrapperFn as T
}

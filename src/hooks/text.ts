import type { LoadHook, ResolveHook } from 'node:module'
import path from 'node:path'
import { sourceToStr } from './utils'

const supportedExtensions = ['.txt', '.sql', '.md']

const FORMAT_TYPE = 'text'

export const resolve: ResolveHook = async (specifier, ctx, nextResolve) => {
  const nextResult = await nextResolve(specifier, ctx)

  const ext = path.extname(specifier)

  if (!supportedExtensions.includes(ext)) return nextResult

  return {
    ...nextResult,
    format: FORMAT_TYPE,
  }
}

export const load: LoadHook = async (url, ctx, nextLoad) => {
  const nextResult = await nextLoad(url, ctx)

  if (ctx.format !== FORMAT_TYPE) return nextResult

  const source = `export default ${JSON.stringify(sourceToStr(nextResult.source))};`

  return {
    format: 'module',
    source,
  }
}

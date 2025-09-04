import type { LoadHook, ResolveHook } from 'node:module'
import path from 'node:path'
import stripJsonComment from 'strip-json-comments'
import { sourceToStr } from './utils'

const supportedExtensions = ['.jsonc']

const FORMAT_TYPE = 'jsonc'

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

  const source = stripJsonComment(sourceToStr(nextResult.source))

  return {
    format: 'json',
    source,
  }
}

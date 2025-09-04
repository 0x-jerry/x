import {
  type LoadHookSync,
  type ResolveHookSync,
  registerHooks,
} from 'node:module'
import path from 'node:path'
import stripJsonComment from 'strip-json-comments'
import { sourceToStr } from './utils'

const supportedExtensions = ['.jsonc']

const FORMAT_TYPE = 'jsonc'

const resolve: ResolveHookSync = (specifier, _ctx, nextResolve) => {
  const nextResult = nextResolve(specifier)

  const ext = path.extname(specifier)

  if (!supportedExtensions.includes(ext)) return nextResult

  return {
    ...nextResult,
    format: FORMAT_TYPE,
  }
}

const load: LoadHookSync = (url, ctx, nextLoad) => {
  const nextResult = nextLoad(url, ctx)

  if (ctx.format !== FORMAT_TYPE) return nextResult

  const source = stripJsonComment(sourceToStr(nextResult.source))

  return {
    format: 'json',
    source,
  }
}

registerHooks({
  resolve,
  load,
})

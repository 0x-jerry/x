import {
  type LoadHookSync,
  type ResolveHookSync,
  registerHooks,
} from 'node:module'
import path from 'node:path'
import { sourceToStr } from './utils'

const supportedExtensions = ['.txt', '.sql', '.md']

const FORMAT_TYPE = 'text'

const resolve: ResolveHookSync = (specifier, ctx, nextResolve) => {
  const nextResult = nextResolve(specifier, ctx)

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

  const source = `export default ${JSON.stringify(sourceToStr(nextResult.source))};`

  return {
    format: 'module',
    source,
  }
}

registerHooks({
  resolve,
  load,
})

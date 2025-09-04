import {
  type LoadHookSync,
  type ResolveHookSync,
  registerHooks,
} from 'node:module'
import path from 'node:path'
import yaml from 'yaml'
import { sourceToStr } from './utils'

const supportedExtensions = ['.yaml', '.yml']

const FORMAT_TYPE = 'yaml'

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
  if (ctx.format !== FORMAT_TYPE) return nextLoad(url, ctx)

  const nextResult = nextLoad(url, { format: 'module' })
  const source = yaml.parse(sourceToStr(nextResult.source))

  return {
    format: 'json',
    source: JSON.stringify(source),
  }
}

registerHooks({
  resolve,
  load,
})

import type { LoadHook, ResolveHook } from 'node:module'
import path from 'node:path'
import yaml from 'yaml'
import { sourceToStr } from './utils'

const supportedExtensions = ['.yaml', '.yml']

const FORMAT_TYPE = 'yaml'

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
  if (ctx.format !== FORMAT_TYPE) return nextLoad(url, ctx)

  const nextResult = await nextLoad(url, ctx)
  const source = yaml.parse(sourceToStr(nextResult.source))

  return {
    format: 'json',
    source: JSON.stringify(source),
  }
}

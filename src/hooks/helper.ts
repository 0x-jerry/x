import type { LoadFnOutput, LoadHook, ResolveHook } from 'node:module'
import type { Awaitable } from '@0x-jerry/utils'

export interface ModuleHook {
  load: LoadHook
  resolve: ResolveHook
}

export interface CreateHookOption {
  type: string
  loader: (source: string) => Awaitable<LoadFnOutput>
}

export function createModuleHook({
  type,
  loader,
}: CreateHookOption): ModuleHook {
  const resolve: ResolveHook = async (specifier, ctx, nextResolve) => {
    const nextResult = await nextResolve(specifier, ctx)

    if (ctx.importAttributes.type !== type) {
      return nextResult
    }

    return {
      ...nextResult,
      format: type,
      shortCircuit: true,
    }
  }

  const load: LoadHook = async (url, ctx, nextLoad) => {
    const nextLoadResult = await nextLoad(url, ctx)

    if (ctx.format !== type) return nextLoadResult

    if (!nextLoadResult.source) return nextLoadResult

    const source = await loader(nextLoadResult.source.toString())

    return {
      shortCircuit: true,
      ...source,
    }
  }

  return {
    resolve,
    load,
  }
}

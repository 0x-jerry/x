import { readFile } from 'node:fs/promises'
import type { LoadFnOutput, LoadHook, ResolveHook } from 'node:module'
import { fileURLToPath } from 'node:url'
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
    if (ctx.format !== type) return nextLoad(url, ctx)

    const raw = await readFile(fileURLToPath(url), 'utf-8')

    const source = await loader(raw)

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

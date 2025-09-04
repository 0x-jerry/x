import type { LoadHook, ResolveHook } from 'node:module'
// @ts-expect-error
import * as tsx from 'tsx/esm'
import * as jsonc from './jsonc'
import * as text from './text'
import { chainHooks } from './utils'
import * as yaml from './yaml'

interface Hook {
  load: LoadHook
  resolve: ResolveHook
}

const hooks: Hook[] = [jsonc, text, yaml, tsx]

export const resolve: ResolveHook = chainHooks(hooks.map((n) => n.resolve))

export const load: LoadHook = chainHooks(hooks.map((n) => n.load))
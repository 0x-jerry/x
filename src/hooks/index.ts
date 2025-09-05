import type { LoadHook, ResolveHook } from 'node:module'
// @ts-expect-error
import * as tsx from 'tsx/esm'
import type { ModuleHook } from './helper'
import jsonc from './jsonc'
import text from './text'
import { chainHooks } from './utils'
import yaml from './yaml'

const hooks: ModuleHook[] = [jsonc, text, yaml, tsx]

export const resolve: ResolveHook = chainHooks(hooks.map((n) => n.resolve))

export const load: LoadHook = chainHooks(hooks.map((n) => n.load))

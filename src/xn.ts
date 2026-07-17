#!/usr/bin/env node
import { type ActionParsedArgs, silver } from '@0x-jerry/silver'
import { version } from '../package.json'
import { DepManager } from './commands/depManager'

silver`
v${version} @help @autocomplete

xn, is a dependency manage tool, it is support node/deno/cargo. ${defaultAction}

i/install [...modules], Install dependencies. ${installAction}

-t --types @bool, install package's type too, only take effect in node project.

up/upgrade [...modules], Upgrade dependencies. ${upgradeAction}

-L --latest @bool, upgrade to the latest version.

rm/remove <...modules>, Remove dependencies. ${removeAction}

-t --types @bool, remove package's type too, only take effect in node project.
`

async function defaultAction() {
  await new DepManager().install()
}

async function installAction(_: string[], opt: ActionParsedArgs) {
  const { params, options } = getParameters(opt)

  const installOnly = !params.length

  if (installOnly) {
    await new DepManager().install(options)
    return
  }

  await new DepManager().add(params, options)
}

async function upgradeAction(_: string[], opt: ActionParsedArgs) {
  const { params, options } = getParameters(opt)

  await new DepManager().upgrade(params, options)
}

async function removeAction(_: string[], opt: ActionParsedArgs) {
  const { params, options } = getParameters(opt)

  await new DepManager().remove(params, options)
}

function getParameters(opt: ActionParsedArgs) {
  const params = opt._
  const otherOpt: Record<string, string> = { ...opt }

  const blockOptions = ['_', '--', 'L']

  for (const opt of blockOptions) {
    Reflect.deleteProperty(otherOpt, opt)
  }

  return {
    params,
    options: otherOpt,
  }
}

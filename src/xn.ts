#!/usr/bin/env node
import { sliver, type ActionParsedArgs } from '@0x-jerry/silver'
import { DepManager } from './commands/depManager'

sliver`
@help @autocompletion

xn, install dependency quickly, support node/deno/cargo. ${defaultAction}

i/install [...modules], install dependencies. ${installAction}

-t --types @bool, install package's types too, only effect node project.

up/upgrade [...modules], upgrade dependencies. ${upgradeAction}

rm/remove <...modules>, remove dependencies. ${removeAction}

-t --types @bool, remove package's types too, only effect node project.
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

  delete otherOpt._
  delete otherOpt['--']

  return {
    params,
    options: otherOpt,
  }
}

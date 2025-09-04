#!/usr/bin/env node
import { type ActionParsedArgs, sliver } from '@0x-jerry/silver'
import { version } from '../package.json'
import { getAvailableCommands, runScript } from './commands/run'
import { exec } from './utils'
import path from 'node:path'

const ins = sliver`
v${version} @help @autocompletion

xr <@command:command-or-file> #stopEarly, run npm script or ts/js file quickly. ${defaultAction}
`

ins.type('command', async () => {
  const allScripts = await getAvailableCommands()

  return allScripts
})

async function defaultAction(_: string[], arg: ActionParsedArgs) {
  const [commandOrFile, ...params] = arg._

  if (isJsFile(commandOrFile)) {
    const registerFilePath = path.join(import.meta.dirname, './preload.js')

    await exec('node', ['--import', registerFilePath, commandOrFile])
    return
  }

  try {
    await runScript(commandOrFile, params)
  } catch (error) {
    // ignore error
    process.exit(1)
  }
}

const RE_TJS_FILE = /.(t|j)sx?$/

/**
 * Support ts, js, tsx, jsx
 */
function isJsFile(file: string) {
  return RE_TJS_FILE.test(file)
}
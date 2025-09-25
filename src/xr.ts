#!/usr/bin/env node
import { type ActionParsedArgs, sliver } from '@0x-jerry/silver'
import { version } from '../package.json'
import { getAvailableCommands, runScript } from './commands/run'
import { getBinariesPairs } from './commands/run/node'
import { exec } from './utils'

const ins = sliver`
v${version} @help @autocompletion

xr <@scripts|bin|_files:command-or-file> #stopEarly, run npm script or ts/js file quickly. ${defaultAction}
`

ins.type('scripts', async () => {
  const allScripts = await getAvailableCommands()

  return allScripts
})

ins.type('bin', () => getBinariesPairs().then((resp) => Object.keys(resp)))

async function defaultAction(_: string[], arg: ActionParsedArgs) {
  const [commandOrFile, ...params] = arg._

  try {
    if (isJsFile(commandOrFile)) {
      await exec(
        'node',
        ['--import', import.meta.resolve(`./hooks/register.js`), commandOrFile],
        { silent: true },
      )
    } else {
      await runScript(commandOrFile, params)
    }
  } catch (_error) {
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

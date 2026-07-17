#!/usr/bin/env node
import { type ActionParsedArgs, silver } from '@0x-jerry/silver'
import { bootstrap } from 'global-agent'
import { version } from '../package.json'
import { downloadGitRepo } from './commands/downloadGitRepo'

bootstrap({
  environmentVariableNamespace: '',
})

silver`
v${version} @autocomplete

x, has some useful subcommand.

t/template [dest], download git repo as a template. ${defaultAction}

-u --url, Git url to download with. eg. -u 0x-jerry/x, -u https://github.com/0x-jerry/x
-b --branch, Git branch.
`

async function defaultAction(_: string[], args: ActionParsedArgs) {
  const [destDir] = _
  const { url, branch = 'main' } = args

  await downloadGitRepo({
    url,
    branch,
    destDir,
  })
}

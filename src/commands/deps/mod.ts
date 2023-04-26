import { Command } from 'cliffy/command/mod.ts'
import { installCommand } from './commands/install.ts'
import { upgradeCommand } from './commands/upgrade.ts'

export const xmCommander = new Command()
  .command('install', installCommand)
  .command('upgrade', upgradeCommand)

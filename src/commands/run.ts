import { Command } from 'cliffy/command/mod.ts'
import { join, isAbsolute } from 'path/mod.ts'
import { run } from '../utils/run.ts'
import { exists } from 'fs/mod.ts'
import { which } from '../utils/which.ts'

export const runCommand = new Command()
  .description('Run custom command, support package.json.')
  .stopEarly()
  .arguments('<script:string> [...params]')
  .option('-c, --config', 'Config file, default is x.conf.json')
  .action(
    async (
      opt: { config: string },
      scriptName: string,
      params: string[] = [],
    ) => {
      const str = await getCmd(scriptName, opt.config)

      if (!str) {
        return
      }

      const [cmd, ...args] = parseCmdStr(str)

      await run(await tryConvertCmd(cmd), ...args, ...params)
    },
  )

async function tryConvertCmd(bin: string): Promise<string> {
  const isExist = await which(bin)

  if (!isExist) {
    const nodeModuleBin = join(Deno.cwd(), 'node_modules', '.bin', bin)

    if (await exists(nodeModuleBin)) {
      return nodeModuleBin
    }
  }

  return bin
}

async function getConfigPath(config?: string) {
  const cwd = Deno.cwd()

  const path = config
    ? isAbsolute(config)
      ? config
      : join(cwd, config)
    : join(cwd, 'x.conf.json')

  if (await exists(path)) {
    return path
  }

  const pkgPath = join(cwd, 'package.json')

  if (await exists(pkgPath)) {
    return pkgPath
  }

  return false
}

async function getCmd(cmd: string, conf?: string): Promise<string | false> {
  const path = await getConfigPath(conf)

  if (!path) {
    return false
  }

  const text = await Deno.readTextFile(path)

  const json = JSON.parse(text)

  return json.scripts?.[cmd]
}

export function parseCmdStr(cmdStr: string): string[] {
  const char = '\\w-+/\\.'

  const name = `[-${char}\\.]+`
  const quote = `'[${char}\\s]+'|"[${char}\\s]+"`
  const eq = `${name}=${quote}`

  const regexp = new RegExp(`(${eq}|${quote}|${name}|\s+)`, 'g')

  const args = cmdStr
    .split(regexp)
    .reduce((params, cur) => {
      if (cur.includes('=')) {
        params.push(...cur.split('='))
      } else {
        const param = /^['"]/.test(cur) ? cur.slice(1, -1) : cur
        params.push(param)
      }

      return params
    }, [] as string[])
    .filter((n) => n.trim())

  return args
}

if (import.meta.main) {
  runCommand.parse()
}
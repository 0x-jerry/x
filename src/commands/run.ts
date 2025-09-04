import path from 'node:path'
import pc from 'picocolors'
import { exec } from '../utils.ts'
import { DenoTaskDetecter } from './run/deno.ts'
import { NodeTaskDetecter } from './run/node.ts'
import { RustTaskDetecter } from './run/rust.ts'
import type { TaskDetector } from './run/types.ts'

export async function runScript(command: string, params: string[] = []) {
  const taskDetectors: TaskDetector[] = [
    new NodeTaskDetecter(),
    new DenoTaskDetecter(),
    new RustTaskDetecter(),
  ]

  const cwd = process.cwd()

  for (const taskDetector of taskDetectors) {
    if (await taskDetector.check(cwd)) {
      const task = await taskDetector.task(cwd, command)
      if (task) {
        const env = makeEnv((await taskDetector.binaryPaths?.(cwd)) || [])
        await exec(task, params, { env })
        return
      }
    }
  }

  const allScripts = await getAvailableCommands()

  console.log(
    pc.red('['),
    pc.cyan(`${command}`),
    pc.red('] not exists in the list: '),
    allScripts.map((name) => pc.cyan(name)).join(', '),
  )
}

function makeEnv(extraPaths: string[]) {
  const env = process.env

  const envPaths: string[] = process.env.PATH?.split(path.delimiter) || []

  env.PATH = [...envPaths, ...extraPaths].join(path.delimiter)

  return env
}

export async function getAvailableCommands(): Promise<string[]> {
  const taskDetectors: TaskDetector[] = [
    new NodeTaskDetecter(),
    new DenoTaskDetecter(),
    new RustTaskDetecter(),
  ]

  const cwd = process.cwd()

  const p = taskDetectors.map(async (t) =>
    (await t.check(cwd)) ? Object.keys((await t.tasks?.(cwd)) || {}) : [],
  )

  const tasks = await Promise.all(p)

  return tasks.flat()
}

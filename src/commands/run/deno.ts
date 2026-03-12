import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathExists } from 'fs-extra'
import { parse } from 'jsonc-parser'
import type { TaskDetector } from './types'

export class DenoTaskDetecter implements TaskDetector {
  async check(cwd: string): Promise<string | undefined> {
    const has = await (
      pathExists(path.join(cwd, 'deno.json')) ||
      pathExists(path.join(cwd, 'deno.jsonc'))
    )

    return has ? cwd : undefined
  }

  async task(cwd: string, taskName: string): Promise<string | undefined> {
    return (await this.tasks(cwd))[taskName]
  }

  async tasks(cwd: string) {
    let tasks: Record<string, string> = {}

    let denoConfigPath = path.join(cwd, 'deno.json')

    if (!(await pathExists(denoConfigPath))) {
      denoConfigPath = path.join(cwd, 'deno.jsonc')
    }

    if (await pathExists(denoConfigPath)) {
      const text = await readFile(denoConfigPath, 'utf8')
      const json = parse(text)

      tasks = json.tasks || {}
    }

    return tasks
  }
}

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathExists } from 'fs-extra'
import type { TaskDetector } from './types'

export class NodeTaskDetecter implements TaskDetector {
  async binaryPaths(cwd: string): Promise<string[]> {
    const envPaths: string[] = []

    let dir = cwd
    do {
      const binPath = path.join(dir, 'node_modules', '.bin')

      if (await pathExists(binPath)) {
        envPaths.push(binPath)
      }

      dir = path.resolve(dir, '..')
    } while (dir !== path.resolve(dir, '..'))

    return envPaths
  }

  check(cwd: string): Promise<boolean> {
    return pathExists(path.join(cwd, 'package.json'))
  }

  async task(cwd: string, taskName: string): Promise<string | undefined> {
    return (await this.tasks(cwd))[taskName]
  }

  async tasks(cwd: string) {
    const pkgPath = path.join(cwd, 'package.json')

    const text = await readFile(pkgPath, 'utf8')
    const json = JSON.parse(text)

    const tasks: Record<string, string> = json.scripts || {}

    return tasks
  }
}

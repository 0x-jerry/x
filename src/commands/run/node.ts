import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathExists } from 'fs-extra/esm'
import type { TaskDetector } from './types'
import { detectPackageRoot } from '../utils/node'

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

  async check(cwd: string): Promise<string | undefined> {
    const pkgInfo = await detectPackageRoot(cwd)

    return pkgInfo?.pkgDir
  }

  async task(cwd: string, taskName: string): Promise<string | undefined> {
    return (await this.tasks(cwd))[taskName]
  }

  async tasks(cwd: string) {
    const pkgInfo = await detectPackageRoot(cwd)

    const tasks: Record<string, string> = pkgInfo?.package.scripts || {}

    return tasks
  }
}

export async function getBinariesPairs() {
  let dir = process.cwd()

  const binaries: Record<string, string> = {}

  do {
    const binPath = path.join(dir, 'node_modules', '.bin')

    if (await pathExists(binPath)) {
      const files = await readdir(binPath)
      for (const filename of files) {
        binaries[filename] = path.join(binPath, filename)
      }
    }

    dir = path.resolve(dir, '..')
  } while (dir !== path.resolve(dir, '..'))

  return binaries
}

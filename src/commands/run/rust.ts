import path from 'node:path'
import { pathExists } from 'fs-extra'
import type { TaskDetector } from './types'

export class RustTaskDetecter implements TaskDetector {
  async check(cwd: string): Promise<string | undefined> {
    return (await pathExists(path.join(cwd, 'Cargo.toml'))) ? cwd : undefined
  }

  async task(_cwd: string, _taskName: string): Promise<string | undefined> {
    return 'cargo run'
  }
}

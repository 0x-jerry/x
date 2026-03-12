import { readFile } from 'node:fs/promises'
import { exists } from '../../utils'
import path from "node:path"

export type DepManagerCommand = 'npm' | 'yarn' | 'pnpm' | 'bun'

export interface PackageJson {
  name?: string
  version?: string
  script?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}

export interface ProjectInfo {
  pkgDir: string
  package: PackageJson
  pm?: DepManagerCommand | null
  subProject?: ProjectInfo
}

export async function detectPackageRoot(cwd: string, subProjectInfo?: ProjectInfo): Promise<ProjectInfo | null> {
  const pkg = await getPkgJson(cwd)

  if (!pkg) {
    return detectParentDir(subProjectInfo)
  }

  const pm = await detectPkgManagerCommand(cwd)

  const info: ProjectInfo = {
    pkgDir: cwd,
    package: pkg,
    pm,
    subProject: subProjectInfo,
  }

  if (pm) {
    return info
  }

  return detectParentDir(info)

  async function detectParentDir(subProjectInfo?: ProjectInfo) {
    const parentDir = path.dirname(cwd)

    if (parentDir === cwd) {
      return subProjectInfo ?? null
    }

    return detectPackageRoot(parentDir, subProjectInfo)
  }
}

async function detectPkgManagerCommand(
  cwd = process.cwd(),
): Promise<DepManagerCommand | null> {
  const pnpmLockFile = path.join(cwd, 'pnpm-lock.yaml')
  if (exists(pnpmLockFile)) {
    return 'pnpm'
  }

  const bunLockFile = path.join(cwd, 'bun.lock')
  if (exists(bunLockFile)) {
    return 'bun'
  }

  const yarnLockFile = path.join(cwd, 'yarn.lock')
  if (exists(yarnLockFile)) {
    return 'yarn'
  }

  const jsonLockFile = path.join(cwd, 'package-lock.json')
  if (exists(jsonLockFile)) {
    return 'npm'
  }

  return null
}

async function getPkgJson(
  cwd = process.cwd(),
): Promise<PackageJson | false> {
  const jsonFile = path.join(cwd, 'package.json')
  try {
    const txt = await readFile(jsonFile, { encoding: 'utf-8' })

    return JSON.parse(txt)
  } catch (_error) {
    return false
  }
}

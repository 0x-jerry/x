import { readFile } from 'node:fs/promises'
import path, { join } from 'node:path'
import pc from 'picocolors'
import { exec, exists, flagOptionToStringArray } from '../../utils'
import type { DependencyManager } from './types'

interface NodeInstallOption {
  [key: string]: string | boolean | undefined
  t?: boolean
  types?: boolean
}

export class NodeDependencyManager implements DependencyManager {
  async check() {
    const cwd = process.cwd()

    const pkgInfo = await detectPackageRoot(cwd)

    return !!pkgInfo
  }

  async install(option?: Record<string, string>): Promise<void> {
    await runDepManagerCommand('install')
  }

  async add(modules: string[], option: NodeInstallOption = {}): Promise<void> {
    const { t, types, ...otherOption } = option

    await runDepManagerCommand(
      'add',
      ...modules,
      ...flagOptionToStringArray(otherOption),
    )

    if (types) {
      const typeModules = modules.map((pkg) => getTypePackageName(pkg))
      await runDepManagerCommand('add', ...typeModules, '-D')
    }
  }

  async remove(
    modules: string[],
    option: NodeInstallOption = {},
  ): Promise<void> {
    if (option.types) {
      const typeModules = modules.map((pkg) => getTypePackageName(pkg))

      modules.push(...typeModules)
    }

    await runDepManagerCommand('remove', ...modules)
  }

  async upgrade(
    modules: string[],
    option: Record<string, string> = {},
  ): Promise<void> {
    await runDepManagerCommand(
      'upgrade',
      ...modules,
      ...flagOptionToStringArray(option),
    )
  }
}

const { yellow } = pc

type DepManagerCommand = 'npm' | 'yarn' | 'pnpm' | 'bun'

type DepManagerActionCommand = 'install' | 'add' | 'upgrade' | 'remove'

const depInstallerCommandMapper: Record<
  DepManagerActionCommand,
  Record<DepManagerCommand, string>
> = {
  install: {
    npm: 'i',
    yarn: 'install',
    pnpm: 'i',
    bun: 'i',
  },
  add: {
    npm: 'i',
    yarn: 'add',
    pnpm: 'i',
    bun: 'add',
  },
  remove: {
    npm: 'uninstall',
    yarn: 'remove',
    pnpm: 'uninstall',
    bun: 'remove',
  },
  upgrade: {
    npm: 'up',
    yarn: 'upgrade',
    pnpm: 'up',
    bun: 'update',
  },
}

/**
 * ```ts
 * runDepManagerCommand('add', 'lodash@1', '-d')
 * runDepManagerCommand('install')
 * ```
 * @param params
 */
async function runDepManagerCommand(
  action: DepManagerActionCommand,
  ...params: string[]
) {
  const cwd = process.cwd()

  const pkgInfo = await detectPackageRoot(cwd)

  if (!pkgInfo) {
    console.log(
      yellow(
        `Can't find package.json! Please ensure that current path is a node project.`,
      ),
    )
    return
  }

  const pm = pkgInfo.pm || 'pnpm'

  const actionName = depInstallerCommandMapper[action][pm]

  await exec(pm, [actionName, ...params])
}

async function detectPkgManagerCommand(
  cwd = process.cwd(),
): Promise<DepManagerCommand | null> {
  const pnpmLockFile = join(cwd, 'pnpm-lock.yaml')
  if (exists(pnpmLockFile)) {
    return 'pnpm'
  }

  const bunLockFile = join(cwd, 'bun.lock')
  if (exists(bunLockFile)) {
    return 'bun'
  }

  const yarnLockFile = join(cwd, 'yarn.lock')
  if (exists(yarnLockFile)) {
    return 'yarn'
  }

  const jsonLockFile = join(cwd, 'package-lock.json')
  if (exists(jsonLockFile)) {
    return 'npm'
  }

  return null
}

async function getPkgJson(
  cwd = process.cwd(),
): Promise<PackageJson | false> {
  const jsonFile = join(cwd, 'package.json')
  try {
    const txt = await readFile(jsonFile, { encoding: 'utf-8' })

    return JSON.parse(txt)
  } catch (_error) {
    return false
  }
}

interface PackageJson {
  name?: string
  version?: string
  script?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}

/**
 *
 * @param pkg
 *
 * getPackageName('lodash@latest') => @types/lodash
 * getPackageName('@babel/core') => @types/babel__core
 *
 */
export function getTypePackageName(pkg: string) {
  const idx = pkg.lastIndexOf('@')
  const name = idx > 0 ? pkg.slice(0, idx) : pkg

  if (name.includes('@')) {
    const [scope, pkgName] = name.split('/')
    return `@types/${scope.slice(1)}__${pkgName}`
  }
  return `@types/${name}`
}

interface ProjectInfo {
  pkgDir: string
  package: PackageJson
  pm?: DepManagerCommand | null
  subProject?: ProjectInfo
}

async function detectPackageRoot(cwd: string, subProjectInfo?: ProjectInfo): Promise<ProjectInfo | null> {
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

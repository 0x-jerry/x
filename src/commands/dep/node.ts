import pc from 'picocolors'
import { exec, flagOptionToStringArray } from '../../utils'
import type { DependencyManager } from './types'
import { detectPackageRoot } from '../utils/node'

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

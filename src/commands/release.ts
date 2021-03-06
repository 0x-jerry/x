import { Command, HelpCommand } from 'cliffy/command/mod.ts'
import { Select } from 'cliffy/prompt/select.ts'
import { run } from '../utils.ts'
import * as semver from 'semver/mod.ts'
import { version } from '../../version.ts'

export const releaseCommand = new Command()
  .hidden()
  .description('Create a new release for deno project.')
  .option('--patch', 'Create a path release.')
  .option('--minor', 'Create a minor release.')
  .option('--major', 'Create a major release.')
  .action(async (opt) => {
    const nextType = opt.major
      ? 'major'
      : opt.minor
      ? 'minor'
      : opt.patch
      ? 'patch'
      : undefined

    const releaseVersion = await getNextVersion(version, nextType)

    if (!releaseVersion) {
      Deno.exit()
    }

    await writeVersionFile(releaseVersion)
    await run('git', 'add', 'version.ts')

    // commit
    await run('git', 'commit', '-m', `chore: release ${releaseVersion}`)
    await run('git', 'tag', `v${releaseVersion}`)

    // push
    await run('git', 'push')
    await run('git', 'push', '--tags')
  })

releaseCommand.command('help', new HelpCommand())

async function getNextVersion(
  version: string,
  specifiedReleaseType?: semver.ReleaseType,
) {
  const inc = (type: semver.ReleaseType) => semver.inc(version, type)

  if (specifiedReleaseType) {
    return inc(specifiedReleaseType)
  }

  const types: semver.ReleaseType[] = ['patch', 'minor', 'major']

  const options = types.map((type) => ({
    name: `${type}(${inc(type)})`,
    value: type,
  }))

  const releaseType = (await Select.prompt({
    message: 'Please select release type',
    options: options,
  })) as semver.ReleaseType

  const releaseVersion = inc(releaseType)
  return releaseVersion
}

async function writeVersionFile(releaseVersion: string) {
  await Deno.writeTextFile(
    'version.ts',
    `// Do not edit this file directly.
// This file is auto-generated by https://github.com/0x-jerry/x
  
export const version = '${releaseVersion}'
`,
  )
}

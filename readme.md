# X

Some useful command for myself.

## Install

```sh
pnpm i -g @0x-jerry/x
```

## Run task `xr`

`xr` command can auto detect tasks in `package.json/scripts`, `deno.json/tasks`, and run it. you can also append any parameters.

Example: In a node project with `pnpm-lock.yaml`. And `package.json` has a script `"test": "vitest run"`

```sh
xr test test/*.ts
# equals
vitest run test/*.ts

# you can also execute binary file in `node_modules/.bin` folder.
xr vite --port 4004
```

Example: In a deno project with `deno.json` or `deno.jsonc`. And have a task `"dev": "deno run -A main.ts"`

```sh
xr dev
# equals
deno run -A main.ts
```

`xr` can execute js/ts file directly, also support import any `string/yaml/jsonc` file directly with import attribute.

Example:

`script.ts`

```ts
const count: number = 3;
console.log(count)

import textData from './test.txt' with { type: 'text' }
console.log(textData) // => typeof textData === 'string'

import yamlData from './test.yaml' with { type: 'yaml' }
console.log(yamlData) // => typeof yamlData === 'object'

import jsoncData from './test.jsonc' with { type: 'jsonc' }
console.log(jsoncData) // => typeof jsoncData === 'object'

import sqlStr from './files/test.sql' with { type: 'text' }
console.log(sqlStr) // => typeof sqlStr === 'string'
```

Execute it:

```sh
xr ./script.ts
```

## Dependency Manager `xn`

`xn` command can install modules by detect the correct tool automatically, it detects lockfile to decide which dependency manager tool should be used.

Example: install packages in a node project with `pnpm-lock.yaml`

```sh
xn i lodash-es
# equals
pnpm i lodash-es

xn i lodash-es -D
# equals
pnpm i lodash-es -D

# -t/--types option support install @types/xx package in one command.
xn i lodash-es --types
# equals
pnpm i lodash-es && pnpm i @types/lodash-es -D
```

Example: remove packages in a node project with `pnpm-lock.yaml`

```sh
xn rm lodash-es
# equals
pnpm uninstall lodash-es

xn rm lodash-es -D
# equals
pnpm uninstall lodash-es -D

# -t/--types option support remove @types/xx package in one command.
xn rm lodash-es --types
# equals
pnpm uninstall lodash-es @types/lodash-es
```

`xn` also support rust project.

Example: in a rust project with `Cargo.toml`

```sh
xn i log
# equals
cargo add log

xn rm log
# equals
cargo remove log
```

## Command Completions

This feature only support zsh.

Add those code to `~/.zshrc`

```zsh
source <(x completion)
source <(xr completion)
source <(xn completion)
```

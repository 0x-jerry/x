import { createModuleHook } from './helper'

const { load, resolve } = createModuleHook({
  type: 'text',
  loader(rawSource) {
    const source = `export default ${JSON.stringify(rawSource)};`

    return {
      format: 'module',
      source,
    }
  },
})

export { load, resolve }

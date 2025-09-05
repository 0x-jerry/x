import { createModuleHook } from './helper'

export default createModuleHook({
  type: 'text',
  loader(rawSource) {
    const source = `export default ${JSON.stringify(rawSource)};`

    return {
      format: 'module',
      source,
    }
  },
})

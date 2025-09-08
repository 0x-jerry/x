import stripJsonComment from 'strip-json-comments'
import { createModuleHook } from './helper'

const { load, resolve } = createModuleHook({
  type: 'jsonc',
  loader(rawSource) {
    const source = stripJsonComment(rawSource)

    return {
      format: 'json',
      source,
    }
  },
})

export { load, resolve }

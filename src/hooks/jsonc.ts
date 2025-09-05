import stripJsonComment from 'strip-json-comments'
import { createModuleHook } from './helper'

export default createModuleHook({
  type: 'jsonc',
  loader(rawSource) {
    const source = stripJsonComment(rawSource)

    return {
      format: 'json',
      source,
    }
  },
})

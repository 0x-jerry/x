import yaml from 'yaml'
import { createModuleHook } from './helper'

export default createModuleHook({
  type: 'yaml',
  loader(rawSource) {
    const source = yaml.parse(rawSource)

    return {
      format: 'json',
      source: JSON.stringify(source),
    }
  },
})

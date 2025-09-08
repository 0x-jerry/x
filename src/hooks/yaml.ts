import yaml from 'yaml'
import { createModuleHook } from './helper'

const { load, resolve } = createModuleHook({
  type: 'yaml',
  loader(rawSource) {
    const source = yaml.parse(rawSource)

    return {
      format: 'json',
      source: JSON.stringify(source),
    }
  },
})

export { load, resolve }

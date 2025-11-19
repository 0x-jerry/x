import { register } from 'node:module'

import { register as registerTsx } from 'tsx/esm/api'

// tsx must be the first one, the order is matters.
registerTsx()

register('./text.js', import.meta.url)
register('./jsonc.js', import.meta.url)
register('./yaml.js', import.meta.url)

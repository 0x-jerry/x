import { register } from 'node:module'

register('./tsx.js', import.meta.url)
register('./text.js', import.meta.url)
register('./jsonc.js', import.meta.url)
register('./yaml.js', import.meta.url)

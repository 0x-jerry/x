import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/xr.ts',
    'src/xn.ts',
    'src/x.ts',
    'src/hooks/register.ts',
    'src/hooks/text.ts',
    'src/hooks/jsonc.ts',
    'src/hooks/yaml.ts',
  ],
  format: ['esm'],
  clean: true,
})

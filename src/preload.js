import { register } from 'node:module';

// todo, write custom registers
register('@nodejs-loaders/alias', import.meta.url);
register('@nodejs-loaders/tsx', import.meta.url);
register('@nodejs-loaders/text', import.meta.url);
register('@nodejs-loaders/jsonc', import.meta.url);
register('@nodejs-loaders/json5', import.meta.url);
register('@nodejs-loaders/yaml', import.meta.url);
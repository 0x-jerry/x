// npm run build && ./dist/xr.js tests/test.ts 

import '@0x-jerry/utils/node'

const count: number = 3;
console.log(count)

import textData from './test.txt' with { type: 'text' }
console.log(textData)

import yamlData from './test.yaml' with { type: 'yaml' }
console.log(yamlData)

import jsoncData from './test.jsonc' with { type: 'jsonc' }
console.log(jsoncData)

import sqlStr from './files/test.sql' with { type: 'text' }

console.log(sqlStr)
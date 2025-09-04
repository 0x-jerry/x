import { chainHooks } from './utils'

describe('utils', () => {
  type TestHook = (a: any, b: any, next: (a: any, b: any) => any) => any

  it('#chainHooks', async () => {
    const output: number[] = []
    const hooks: TestHook[] = [
      async (a, b, next) => {
        output.push(1)
        await next(a, b)
        output.push(2)
      },
      async (a, b, next) => {
        output.push(3)
        await next(a, b)
        output.push(4)
      },
      async (a, b, next) => {
        output.push(5)
        await next(a, b)
        output.push(6)
      },
      async (a, b, next) => {
        output.push(7)
        await next(a, b)
        output.push(8)
      },
    ]

    const fn = chainHooks(hooks)
    await fn(0, 0, () => {})
    expect(output).eqls([1, 3, 5, 7, 8, 6, 4, 2])
  })
})

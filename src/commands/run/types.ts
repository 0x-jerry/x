export interface TaskDetector {
  binaryPaths?(cwd: string): Promise<string[]>
  check(cwd: string): Promise<string | undefined>
  task(cwd: string, taskName?: string): Promise<string | undefined>

  tasks?(cwd: string): Promise<Record<string, string>>
}

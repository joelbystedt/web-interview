export type Result<T> = {
  success: boolean
  status: number
  data?: T
  error?: string
}

export const ok = <T>(data: T): Result<T> => ({
  success: true,
  status: 200,
  data,
})

export const err = <T>(error: string, status: number): Result<T> => ({
  success: false,
  status,
  error,
})

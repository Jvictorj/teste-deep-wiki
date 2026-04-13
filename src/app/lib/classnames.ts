export type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassArray

export interface ClassDictionary {
  [id: string]: boolean
}

export interface ClassArray extends Array<ClassValue> {}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  const push = (value: ClassValue): void => {
    if (!value) return

    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value))
      return
    }

    if (Array.isArray(value)) {
      value.forEach(push)
      return
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, active]) => {
        if (active) classes.push(key)
      })
    }
  }

  inputs.forEach(push)
  return classes.join(' ')
}

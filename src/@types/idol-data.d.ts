declare module '*/idol-data.json' {
  interface IdolData {
    brand: string
    name: string
    color: string
    attr: string
    Vo: number
    Da: number
    Vi: number
  }

  const value: IdolData
  export = value
}

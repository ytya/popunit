declare module '*/idol-data.json' {
  interface IdolInfo {
    brand: string
    name: string
    yomi: string
    attr: string
    vo: number
    da: number
    vi: number
  }

  export const idolData: IdolInfo
}

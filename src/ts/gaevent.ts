export class GAEvent {
  /**
   * テーブル更新イベント
   *
   * @static
   * @param {string[]} brands - 選択したブランドリスト
   * @param {string} attr1 - 属性1
   * @param {string} attr2 - 属性2
   * @param {string} attr3 - 属性3
   * @memberof GAEvent
   */
  static updateTable(brands: string[], attr1: string, attr2: string, attr3: string): void {
    if (!window.gtag) return

    // 検索条件をsearch_termに詰めて送信
    let term = ''
    for (const brand of brands) {
      term += `brand:${brand} `
    }
    term += `attr1:${attr1} `
    term += `attr2:${attr2} `
    term += `attr3:${attr3}`

    window.gtag('event', 'search', { search_term: term })
  }
}

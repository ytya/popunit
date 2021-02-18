export class GAEvent {
  /**
   * テーブル更新イベント
   *
   * @static
   * @param {string[]} brands - 選択したブランドリスト
   * @param {string} attr1 - 属性1
   * @param {string} attr2 - 属性2
   * @param {string} attr3 - 属性3
   * @param {string[]} refineWords - 絞り込み検索ワード
   * @memberof GAEvent
   */
  static updateTable(brands: string[], attr1: string, attr2: string, attr3: string, refineWords: string[]): void {
    if (!window.gtag) return

    // 検索条件を送信
    window.gtag('event', 'fetch_unit', {
      cond_brand: brands.join(' '),
      cond_attr: [attr1, attr2, attr3].sort().join(''),
      cond_refine: refineWords.join(' '),
    })
  }
}

import { IdolDB, UnitInfo, COMPARE_KEY } from './idol-db'

interface Column {
  name: string
  isSort: boolean
  isReverse: boolean
}

/**
 * 検索条件に応じてユニットテーブルを描画
 * // TODO: tableは件数が多くなると更新に時間がかかるので、paginationするか非table要素で描画する
 *
 * @export
 * @class UnitTable
 */
export class UnitTable {
  private _idolDB: IdolDB
  private _columns: Map<string, Column> // 列設定
  private _theadElem: HTMLTableRowElement // thead要素
  private _isBrandSort: boolean // ブランドソートするか

  /**
   * Creates an instance of UnitTable.
   * @param {HTMLTableElement} _tableElem - 制御するtable要素
   * @memberof UnitTable
   */
  constructor(private _tableElem: HTMLTableElement) {
    this._idolDB = new IdolDB()
    this._columns = new Map([
      ['idol1', { name: 'アイドル1', isSort: true, isReverse: false }],
      ['idol2', { name: 'アイドル2', isSort: false, isReverse: false }],
      ['idol3', { name: 'アイドル3', isSort: false, isReverse: false }],
      ['vo', { name: 'Vo', isSort: false, isReverse: true }],
      ['da', { name: 'Da', isSort: false, isReverse: true }],
      ['vi', { name: 'Vi', isSort: false, isReverse: true }],
    ])
    this._isBrandSort = false

    this._initThead()
    this._theadElem = this._tableElem.querySelector('thead tr') as HTMLTableRowElement
    this._updateThead()
  }

  set isBrandSort(value: boolean) {
    this._isBrandSort = value
    this._renderTable()
  }

  _initThead(): void {
    let thead = '<thead><tr>'
    this._columns.forEach((v: Column, k: string) => {
      let th_class = 'th-status'
      if (k.includes('idol')) {
        th_class = 'th-idol'
      }
      thead += `<th col-id="${k}" class="${th_class}">${v.name}</th>`
    })
    thead += '</tr></thead><tbody></tbody>'
    this._tableElem.innerHTML = thead

    this._theadElem = this._tableElem.querySelector('thead tr') as HTMLTableRowElement
    const thElems = this._theadElem.getElementsByTagName('th')
    for (let i = 0; i < thElems.length; i++) {
      const th = thElems[i]
      th.onclick = () => {
        const col_id = th.getAttribute('col-id') as string
        const col = this._columns.get(col_id) as Column
        if (col.isSort) {
          col.isReverse = !col.isReverse
        } else {
          for (const c of this._columns.values()) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            c.isSort = false
          }
          col.isSort = true
        }
        this._updateThead()
        this._renderTable()
      }
    }
  }

  _updateThead(): void {
    const thElems = this._theadElem.getElementsByTagName('th')
    for (let i = 0; i < thElems.length; i++) {
      const th = thElems[i]
      const col = this._columns.get(th.getAttribute('col-id') as string) as Column
      let sortIcon = ''
      const sortActive = col.isSort ? 'icon-sort-active' : 'icon-sort-deactive'
      if (col.isReverse) {
        sortIcon = `<i class="material-icons icon-sort ${sortActive}">arrow_upward</i>`
      } else {
        sortIcon = `<i class="material-icons icon-sort ${sortActive}">arrow_downward</i>`
      }
      th.innerHTML = `<a class="btn-th">${col.name} ${sortIcon}</a>`
    }
  }

  _sort(): UnitInfo[] {
    let sort_key = COMPARE_KEY.NAME1
    let isReverse = false
    for (const [col_id, col] of this._columns) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!col.isSort) {
        continue
      }
      switch (col_id) {
        case 'idol1':
          sort_key = COMPARE_KEY.NAME1
          break
        case 'idol2':
          sort_key = COMPARE_KEY.NAME2
          break
        case 'idol3':
          sort_key = COMPARE_KEY.NAME3
          break
        case 'vo':
          sort_key = COMPARE_KEY.VO
          break
        case 'da':
          sort_key = COMPARE_KEY.DA
          break
        case 'vi':
          sort_key = COMPARE_KEY.VI
          break
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      isReverse = col.isReverse
      break
    }
    return this._idolDB.sortUnits(sort_key, this._isBrandSort, isReverse)
  }

  _renderCell(col_id: string, unit: UnitInfo): string {
    // 列IDに応じて値を取得
    let cellValue = ''
    let attr = ''
    let brand = ''
    let td_class = 'cell-status'
    if (col_id == 'idol1') {
      cellValue = unit.idol1.name
      brand = unit.idol1.brand
      attr = unit.idol1.attr
    } else if (col_id == 'idol2') {
      cellValue = unit.idol2.name
      brand = unit.idol2.brand
      attr = unit.idol2.attr
    } else if (col_id == 'idol3') {
      cellValue = unit.idol3.name
      brand = unit.idol3.brand
      attr = unit.idol3.attr
    } else if (col_id == 'vo') {
      cellValue = String(unit.vo)
    } else if (col_id == 'da') {
      cellValue = String(unit.da)
    } else if (col_id == 'vi') {
      cellValue = String(unit.vi)
    }
    if (cellValue == '') {
      cellValue = '-'
    }

    // ブランド表示
    switch (brand) {
      case '765AS':
        brand = 'as765'
        break
      case 'シンデレラガールズ':
        brand = 'cinderella'
        break
      case 'ミリオンライブ':
        brand = 'million'
        break
      case 'SideM':
        brand = 'sidem'
        break
      case 'シャイニーカラーズ':
        brand = 'shiny'
        break
      default:
        brand = ''
    }
    if (brand != '') {
      cellValue = `<span class="text-brand-${brand}">${cellValue}</span>`
      td_class = 'td-idol'
    }

    // 属性表示
    if (attr.length == 2) {
      const attrMap: { [key: string]: string } = {
        花: 'flower',
        炎: 'fire',
        雪: 'snow',
        天: 'heaven',
        虹: 'rainbow',
        光: 'light',
        海: 'ocean',
        闇: 'darkness',
        空: 'sky',
        風: 'wind',
        月: 'moon',
        夢: 'dream',
        雷: 'thunder',
        星: 'star',
        愛: 'love',
      }
      const attr1 = `<span class="text-attr-${attrMap[attr[0]]}">${attr[0]}</span>`
      const attr2 = `<span class="text-attr-${attrMap[attr[1]]}">${attr[1]}</span>`
      attr = `<span class="text-attr-background">${attr1}${attr2}</span>`
      cellValue = attr + ' ' + cellValue
    }

    return `<td class="${td_class}">${cellValue}</td>`
  }

  _renderTbody(units: UnitInfo[]): string {
    const dst: string[] = []
    for (const unit of units) {
      let tr = '<tr>'
      for (const col_id of this._columns.keys()) {
        tr += this._renderCell(col_id, unit)
      }
      tr += '</tr>'
      dst.push(tr)
    }
    return dst.join('')
  }

  _renderTable(): void {
    const units = this._sort()

    let tbody = this._renderTbody(units.slice(0, 100))
    const tbodyElem = this._tableElem.querySelector('tbody') as HTMLElement
    tbodyElem.innerHTML = tbody

    // 100件以上の場合は一度画面更新を挟んで全件表示
    if (units.length > 100) {
      setTimeout(() => {
        tbody = this._renderTbody(units.slice(100))
        tbodyElem.innerHTML += tbody
      }, 150)
    }
  }

  /**
   * テーブル更新
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr1 - 一人目の属性
   * @param {string} attr2 - 二人目の属性
   * @param {string} attr3 - 三人目の属性
   * @param {string[]} [refineWords=[]] - 絞り込み検索ワード
   * @memberof UnitTable
   */
  public update(brands: string[], attr1: string, attr2: string, attr3: string, refineWords: string[] = []): void {
    this._idolDB.collectUnits(brands, attr1, attr2, attr3, refineWords)
    this._renderTable()
  }

  /**
   * ユニット数取得
   *
   * @returns {number}
   * @memberof UnitTable
   */
  public getUnitNum(): number {
    return this._idolDB.getUnitNum()
  }
}

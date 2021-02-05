import { IdolDB, UnitInfo, COMPARE_KEY } from './idol-db'

interface Column {
  name: string
  isSort: boolean
  isReverse: boolean
}

export class UnitTable {
  private _idolDB: IdolDB
  private _columns: Map<string, Column>
  private _theadElem: HTMLTableRowElement
  private _isBrandSort: boolean

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
    this._sort()
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
    thead += '</tr></thead>'
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
            c.isSort = false
          }
          col.isSort = true
        }
        this._updateThead()
        this._sort()
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

  _sort(): void {
    let sort_key = COMPARE_KEY.NAME1
    let isReverse = false
    for (const [col_id, col] of this._columns.entries()) {
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
      isReverse = col.isReverse
      break
    }
    const units = this._idolDB.sortUnits(sort_key, this._isBrandSort, isReverse)
    this._update(units)
  }

  _removeTbody(): void {
    const tbody = this._tableElem.querySelector('tbody')
    if (tbody) {
      this._tableElem.removeChild(tbody)
    }
  }

  _renderCell(col_id: string, unit: UnitInfo): string {
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

    // ブランド表示
    switch (brand) {
      case '765AS':
        brand = '765as'
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
    attr = attr
      .replace('花', '<span class="text-attr-flower">花</span>')
      .replace('炎', '<span class="text-attr-fire">炎</span>')
      .replace('雪', '<span class="text-attr-snow">雪</span>')
      .replace('天', '<span class="text-attr-heaven">天</span>')
      .replace('虹', '<span class="text-attr-rainbow">虹</span>')
      .replace('光', '<span class="text-attr-light">光</span>')
      .replace('海', '<span class="text-attr-ocean">海</span>')
      .replace('闇', '<span class="text-attr-darkness">闇</span>')
      .replace('空', '<span class="text-attr-sky">空</span>')
      .replace('風', '<span class="text-attr-wind">風</span>')
      .replace('月', '<span class="text-attr-moon">月</span>')
      .replace('夢', '<span class="text-attr-dream">夢</span>')
      .replace('雷', '<span class="text-attr-thunder">雷</span>')
      .replace('星', '<span class="text-attr-star">星</span>')
      .replace('愛', '<span class="text-attr-love">愛</span>')
    if (attr != '') {
      attr = `<span class="text-attr-background">${attr}</span>`
      cellValue = attr + ' ' + cellValue
    }

    return `<td class="${td_class}">${cellValue}</td>`
  }

  _update(units: UnitInfo[]): void {
    this._removeTbody()

    let tbody = '<tbody>'
    for (const unit of units) {
      let tr = '<tr>'
      for (const col_id of this._columns.keys()) {
        tr += this._renderCell(col_id, unit)
      }
      tr += '</tr>'
      tbody += tr
    }
    tbody += '</tbody>'

    this._tableElem.insertAdjacentHTML('beforeend', tbody)
  }

  /**
   * テーブル更新
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr1 - 一人目の属性
   * @param {string} attr2 - 二人目の属性
   * @param {string} attr3 - 三人目の属性
   * @memberof UnitTable
   */
  public update(brands: string[], attr1: string, attr2: string, attr3: string): void {
    this._idolDB.collectUnits(brands, attr1, attr2, attr3)
    this._sort()
  }
}

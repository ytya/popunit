import M from 'materialize-css'
import '../css/style.scss'
import { DataFrame, Row } from 'dataframe-js'
import SortableTable, { ColmnConf } from '@riversun/sortable-table'
import { IdolDB, IdolInfo, UnitInfo } from './idol-db'

interface IdolTableDict {
  idol1: string
  idol2: string
  idol3: string
  vo: number
  da: number
  vi: number
}

/**
 * ユニットリストをテーブル用オブジェクトに変換
 *
 * @param {UnitInfo[]} units - ユニットリスト
 * @returns {IdolTableDict[]}
 */
const convertUnitInfo2TableDist = (units: UnitInfo[]): IdolTableDict[] => {
  const dst: IdolTableDict[] = []
  for (const unit of units) {
    dst.push({
      idol1: unit.idol1.name + ' ' + unit.idol1.attr,
      idol2: unit.idol2.name + ' ' + unit.idol2.attr,
      idol3: unit.idol3.name + ' ' + unit.idol3.attr,
      vo: unit.vo,
      da: unit.da,
      vi: unit.vi,
    })
  }
  return dst
}

// onLoad
window.addEventListener('load', () => {
  // ブランドボタン
  const btnBrands = document.getElementsByClassName('btn-brand') as HTMLCollectionOf<HTMLElement>
  const checkBrands = document.getElementsByClassName('check-brand') as HTMLCollectionOf<HTMLInputElement>

  // 属性ボタン
  const btnAttrs = document.getElementsByClassName('btn-attr') as HTMLCollectionOf<HTMLElement>
  const checkAttrs1 = document.getElementsByName('check-attr1') as NodeListOf<HTMLInputElement>
  const checkAttrs2 = document.getElementsByName('check-attr2') as NodeListOf<HTMLInputElement>
  const checkAttrs3 = document.getElementsByName('check-attr3') as NodeListOf<HTMLInputElement>

  // アイドルテーブル
  const tableIdol = document.getElementById('idol_table') as HTMLElement

  // matelialize-css初期化
  M.AutoInit()

  // アイドルDB構築
  const idolDB = new IdolDB()

  // テーブル初期化
  const sortableTable = new SortableTable()
  sortableTable.setTable(tableIdol)
  sortableTable.setCellRenderer((col: ColmnConf, row: any) => {
    const colValue = String(row[col.id])
    if (typeof colValue === 'undefined') {
      return `<th></th>`
    }

    // ヘッダー
    if (col.isHeader) {
      return `<th>${colValue}</th>`
    }

    // アイドル名以外
    if (!col.id.includes('idol')) {
      return `<td>${colValue}</td>`
    }

    // 属性の色を変更
    let name = colValue.slice(0, -3)
    let attr = colValue
      .slice(-2)
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
    if (attr == '- ') {
      attr = ''
      name = '-'
    } else {
      attr = `<span class="text-attr-background">${attr}</span>`
    }
    return `<td>${attr} ${name}</td>`
  })

  // ブランド取得
  const getBrands = () => {
    const brands: string[] = new Array<string>()
    for (let i = 0; i < checkBrands.length; i++) {
      if (checkBrands[i].checked) {
        brands.push(checkBrands[i].value)
      }
    }
    return brands
  }

  // 属性取得
  const getAttr = (checkAttrs: NodeListOf<HTMLInputElement>): string => {
    for (let i = 0; i < checkAttrs.length; i++) {
      if (checkAttrs[i].checked) {
        return checkAttrs[i].value
      }
    }
    return '-'
  }

  // アイドルリスト更新
  const updateIdol = () => {
    const brands = getBrands()
    const attr1 = getAttr(checkAttrs1)
    const attr2 = getAttr(checkAttrs2)
    const attr3 = getAttr(checkAttrs3)
    const units = idolDB.collectUnits(brands, attr1, attr2, attr3)
    const tableData = convertUnitInfo2TableDist(units)
    sortableTable.setData(tableData)
  }

  // ブランドボタンイベント
  for (let i = 0; i < btnBrands.length; i++) {
    btnBrands[i].onclick = (e: MouseEvent) => {
      // トグル
      const checkbox = btnBrands[i].parentElement?.getElementsByClassName('check-brand')[0] as HTMLInputElement
      checkbox.checked = !checkbox.checked

      // テーブル更新
      updateIdol()
    }
  }

  // 属性ボタンイベント
  for (let i = 0; i < btnAttrs.length; i++) {
    btnAttrs[i].onclick = (e: MouseEvent) => {
      const checkbox = btnAttrs[i].parentElement?.getElementsByClassName('check-attr')[0] as HTMLInputElement
      if (checkbox.checked) {
        // チェック済みの場合は解除
        checkbox.checked = false
      } else {
        // 未チェックの場合は一度全属性解除してからチェック
        const checkAttrs = checkbox.parentElement?.parentElement?.getElementsByClassName(
          'check-attr',
        ) as HTMLCollectionOf<HTMLInputElement>
        for (let j = 0; j < checkAttrs.length; j++) {
          checkAttrs[j].checked = false
        }
        checkbox.checked = true
      }

      // テーブル更新
      updateIdol()
    }
  }
})

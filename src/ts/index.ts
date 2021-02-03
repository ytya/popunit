import M from 'materialize-css'
import '../css/style.scss'
import { DataFrame, Row } from 'dataframe-js'
import idolData from './idol-data.json'
import SortableTable, { ColmnConf } from '@riversun/sortable-table'

// idol-data.json
// [{"brand": "765AS", "name": "天海春香", "color": "#e22b30", "attr": "花海", "Vo": 90, "Da": 70, "Vi": 80}]

interface IdolTableDict {
  idol1: string
  idol2: string
  idol3: string
  vo: number
  da: number
  vi: number
}

interface IdolInfo {
  name: string
  attr: string
  vo: number
  da: number
  vi: number
}

// アイドルデータ読み込み
const dfIdol = new DataFrame(idolData, null)

// アイドル情報取得
const getIdolInfo = (row: Row): IdolInfo => {
  return {
    name: row.get('name') as string,
    attr: row.get('attr') as string,
    vo: row.get('Vo') as number,
    da: row.get('Da') as number,
    vi: row.get('Vi') as number,
  }
}

// アイドル選択
const selectIdol = (brands: string[], attr: string): DataFrame => {
  let df = dfIdol.where((row: Row) => {
    if (brands.length != 0 && !brands.includes(row.get('brand') as string)) {
      return false
    }
    return (row.get('attr') as string).includes(attr)
  })
  if (df.dim()[0] == 0) {
    df = df.push(['-', '-', '#000000', '', 0, 0, 0])
  }
  return df
}

// アイドル選択
const collectUnit = (brands: string[], attr1: string, attr2: string, attr3: string): IdolTableDict[] => {
  const df1 = selectIdol(brands, attr1)
  const df2 = selectIdol(brands, attr2)
  const df3 = selectIdol(brands, attr3)
  const height1 = df1.dim()[0]
  const height2 = df2.dim()[0]
  const height3 = df3.dim()[0]

  // 全組み合わせを取得
  const unitData: IdolTableDict[] = []
  for (let i = 0; i < height1; i++) {
    const idol1 = getIdolInfo(df1.getRow(i))
    for (let j = 0; j < height2; j++) {
      const idol2 = getIdolInfo(df2.getRow(j))
      if (idol2.name != '-' && idol1.name == idol2.name) {
        continue
      }
      for (let k = 0; k < height3; k++) {
        const idol3 = getIdolInfo(df3.getRow(k))
        if (idol3.name != '-' && (idol1.name == idol3.name || idol2.name == idol3.name)) {
          continue
        }

        // ユニット追加
        unitData.push({
          idol1: idol1.name + ' ' + idol1.attr,
          idol2: idol2.name + ' ' + idol2.attr,
          idol3: idol3.name + ' ' + idol3.attr,
          vo: idol1.vo + idol2.vo + idol3.vo,
          da: idol1.da + idol2.da + idol3.da,
          vi: idol1.vi + idol2.vi + idol3.vi,
        })
      }
    }
  }
  return unitData
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
    const unitData = collectUnit(brands, attr1, attr2, attr3)
    sortableTable.setData(unitData)
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

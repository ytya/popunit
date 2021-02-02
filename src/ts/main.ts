//import '../../node_modules/materialize-css/dist/css/materialize.min.css'
//import '../../node_modules/materialize-css/dist/js/materialize.min'
import M from 'materialize-css'
import '../css/style.scss'
import { DataFrame, Row } from 'dataframe-js'
import idolData from './idol-data.json'
import SortableTable from '@riversun/sortable-table'

interface IdolTableDict {
  idol1: string
  idol2: string
  idol3: string
  Vo: number
  Da: number
  Vi: number
}

const attrDict: { [key: string]: string } = {
  flower: '花',
  fire: '炎',
  snow: '雪',
  heaven: '天',
  rainbow: '虹',
  light: '光',
  ocean: '海',
  darkness: '闇',
  sky: '空',
  wind: '風',
  moon: '月',
  dream: '夢',
  thunder: '雷',
  star: '星',
  love: '愛',
}

M.AutoInit()

// アイドルデータ読み込み
const dfIdol = new DataFrame(idolData, null)

// テーブル初期化
const tableIdol = document.getElementById('idol_table')
const sortableTable = new SortableTable()
if (tableIdol != null) {
  sortableTable.setTable(tableIdol)
}

// アイドル選択
const selectIdol = (brands: string[], attr1: string, attr2: string, attr3: string): IdolTableDict[] => {
  const df = dfIdol.where((row: Row) => {
    if (brands.length != 0 && !brands.includes(row.get('brand') as string)) {
      return false
    }
    return (row.get('attr') as string).includes(attr1)
  })
  const [height, width] = df.dim()
  const data: IdolTableDict[] = []
  for (let i = 0; i < height; i++) {
    const row = df.getRow(i)
    data[i] = {
      idol1: row.get('name') as string,
      idol2: row.get('name') as string,
      idol3: row.get('name') as string,
      Vo: row.get('Vo') as number,
      Da: row.get('Da') as number,
      Vi: row.get('Vi') as number,
    }
  }
  return data
}

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

// 属性1取得
const getAttr1 = () => {
  let attr1 = ''
  for (let i = 0; i < checkAttrs1.length; i++) {
    if (checkAttrs1[i].checked) {
      attr1 = attrDict[checkAttrs1[i].value]
      break
    }
  }
  return attr1
}

// アイドルリスト更新
const updateIdol = () => {
  const attr1 = getAttr1()
  const brands = getBrands()
  const data = selectIdol(brands, attr1, attr1, attr1)
  sortableTable.setData(data)
}

const data = selectIdol([], '花', '夢', '光')
sortableTable.setData(data)

// ブランドボタン
const btnBrands = document.getElementsByClassName('btn-brand') as HTMLCollectionOf<HTMLElement>
const checkBrands = document.getElementsByClassName('check-brand') as HTMLCollectionOf<HTMLInputElement>
for (let i = 0; i < btnBrands.length; i++) {
  btnBrands[i].onclick = (e: MouseEvent) => {
    const checkbox = btnBrands[i].parentElement?.getElementsByClassName('check-brand')[0] as HTMLInputElement
    checkbox.checked = !checkbox.checked
    updateIdol()
  }
}

// 属性ボタン
const btnAttrs = document.getElementsByClassName('btn-attr') as HTMLCollectionOf<HTMLElement>
const checkAttrs1 = document.getElementsByName('check-attr1') as NodeListOf<HTMLInputElement>
for (let i = 0; i < btnAttrs.length; i++) {
  btnAttrs[i].onclick = (e: MouseEvent) => {
    const checkbox = btnAttrs[i].parentElement?.getElementsByClassName('check-attr')[0] as HTMLInputElement
    if (checkbox.checked) {
      checkbox.checked = false
    } else {
      for (let j = 0; j < checkAttrs1.length; j++) {
        checkAttrs1[j].checked = false
      }
      checkbox.checked = true
    }
    updateIdol()
  }
}

// sub.jsに定義されたJavaScriptを実行する。
//hello(message)

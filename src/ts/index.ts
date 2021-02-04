import M from 'materialize-css'
import '../css/style.scss'
import { IdolTable } from './idol-table'

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
  const tableIdol = document.getElementById('idol_table') as HTMLTableElement

  // matelialize-css初期化
  M.AutoInit()

  // テーブル初期化
  const idolTable = new IdolTable(tableIdol)

  // ブランド取得
  function getBrands() {
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
    idolTable.update(brands, attr1, attr2, attr3)
  }

  // ブランドボタンイベント
  for (let i = 0; i < btnBrands.length; i++) {
    btnBrands[i].onclick = () => {
      // トグル
      const checkbox = btnBrands[i].parentElement?.getElementsByClassName('check-brand')[0] as HTMLInputElement
      checkbox.checked = !checkbox.checked

      // テーブル更新
      updateIdol()
    }
  }

  // 属性ボタンイベント
  for (let i = 0; i < btnAttrs.length; i++) {
    btnAttrs[i].onclick = () => {
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

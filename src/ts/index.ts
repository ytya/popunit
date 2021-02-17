import M from 'materialize-css'
import SlimSelect from 'slim-select'
import '../css/style.scss'
import { UnitTable } from './unit-table'
import { GAEvent } from './gaevent'
import idolData from './idol-data.json'

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
  const checkBrandSort = document.getElementById('check-brand-sort') as HTMLInputElement
  const labelUnitNum = document.getElementById('label-unit-num') as HTMLLabelElement
  const tableUnit = document.getElementById('table-unit') as HTMLTableElement

  // テーブル初期化
  const unitTable = new UnitTable(tableUnit)

  // matelialize-css初期化
  M.AutoInit()

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
    return ''
  }

  // 絞り込み検索ワード取得
  const getRefineWords = (): string[] => {
    return slimSelect.selected() as string[]
  }

  // アイドルリスト更新
  const updateUnit = () => {
    // ユニットテーブル更新
    const brands = getBrands()
    const attr1 = getAttr(checkAttrs1)
    const attr2 = getAttr(checkAttrs2)
    const attr3 = getAttr(checkAttrs3)
    const refineWords = getRefineWords()
    unitTable.update(brands, attr1, attr2, attr3, refineWords)

    // GAイベント発火
    GAEvent.updateTable(brands, attr1, attr2, attr3, refineWords)

    // ユニット数
    labelUnitNum.innerHTML = String(unitTable.getUnitNum()) + ' 組'
  }

  // ブランドボタンイベント
  for (let i = 0; i < btnBrands.length; i++) {
    btnBrands[i].onclick = () => {
      // トグル
      const checkbox = btnBrands[i].parentElement?.getElementsByClassName('check-brand')[0] as HTMLInputElement
      checkbox.checked = !checkbox.checked

      // テーブル更新
      updateUnit()
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
      updateUnit()
    }
  }

  // ブランドソート
  checkBrandSort.onclick = () => {
    unitTable.isBrandSort = checkBrandSort.checked
  }

  // 絞り込み検索
  const idolOptions: { [key: string]: { text: string; value: string }[] } = {
    '765AS': [],
    シンデレラガールズ: [],
    ミリオンライブ: [],
    SideM: [],
    シャイニーカラーズ: [],
  }
  for (const idol of idolData) {
    // slim-selectのバグのため、valueを明示的に設定
    idolOptions[idol.brand].push({ text: idol.name, value: idol.name })
  }
  const attrOptions: { text: string; value: string }[] = []
  for (const attr of ['花', '空', '炎', '風', '雪', '月', '天', '夢', '虹', '雷', '光', '星', '海', '愛', '闇']) {
    attrOptions.push({ text: attr, value: attr })
  }
  const slimSelect = new SlimSelect({
    select: '#select-refine-search',
    placeholder: '絞り込み',
    showSearch: true, // shows search field
    searchText: 'No Results',
    addToBody: true,
    onChange: (info) => {
      updateUnit()
    },
    data: [
      {
        label: '属性',
        options: attrOptions,
      },
      {
        label: '765AS',
        options: idolOptions['765AS'],
      },
      {
        label: 'シンデレラガールズ',
        options: idolOptions['シンデレラガールズ'],
      },
      {
        label: 'ミリオンライブ',
        options: idolOptions['ミリオンライブ'],
      },
      {
        label: 'SideM',
        options: idolOptions['SideM'],
      },
      {
        label: 'シャイニーカラーズ',
        options: idolOptions['シャイニーカラーズ'],
      },
    ],
  })
})

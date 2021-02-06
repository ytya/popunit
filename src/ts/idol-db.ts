import { DataFrame, Row } from 'dataframe-js'
import idolData from './idol-data.json'

// idol-data.json
// [{"brand": "765AS", "name": "天海春香", "yomi": "あまみ はるか", "attr": "花海", "vo": 90, "da": 70, "vi": 80}]

export interface IdolInfo {
  name: string
  yomi: string
  brand: string
  attr: string
  vo: number
  da: number
  vi: number
}

export const COMPARE_KEY = {
  NAME1: 'name1',
  NAME2: 'name2',
  NAME3: 'name3',
  VO: 'vo',
  DA: 'da',
  VI: 'vi',
}
export type COMPARE_KEY = typeof COMPARE_KEY[keyof typeof COMPARE_KEY]

const BRAND_ORDER: { [key: string]: number } = {
  '765AS': 0,
  シンデレラガールズ: 1,
  ミリオンライブ: 2,
  SideM: 3,
  シャイニーカラーズ: 4,
}

export class UnitInfo {
  private _vo: number
  private _da: number
  private _vi: number

  constructor(private _idol1: IdolInfo, private _idol2: IdolInfo, private _idol3: IdolInfo) {
    this._vo = _idol1.vo + _idol2.vo + _idol3.vo
    this._da = _idol1.da + _idol2.da + _idol3.da
    this._vi = _idol1.vi + _idol2.vi + _idol3.vi
  }

  get idol1(): IdolInfo {
    return this._idol1
  }

  get idol2(): IdolInfo {
    return this._idol2
  }

  get idol3(): IdolInfo {
    return this._idol3
  }

  get vo(): number {
    return this._vo
  }

  get da(): number {
    return this._da
  }

  get vi(): number {
    return this._vi
  }

  private compareBrand(other: UnitInfo, key: COMPARE_KEY): number {
    if (key == COMPARE_KEY.NAME2) {
      const o1 = BRAND_ORDER[this.idol2.brand]
      const o2 = BRAND_ORDER[other.idol2.brand]
      if (o1 < o2) {
        return -1
      } else if (o1 > o2) {
        return 1
      } else {
        return 0
      }
    } else if (key == COMPARE_KEY.NAME3) {
      const o1 = BRAND_ORDER[this.idol3.brand]
      const o2 = BRAND_ORDER[other.idol3.brand]
      if (o1 < o2) {
        return -1
      } else if (o1 > o2) {
        return 1
      } else {
        return 0
      }
    } else {
      const o1 = BRAND_ORDER[this.idol1.brand]
      const o2 = BRAND_ORDER[other.idol1.brand]
      if (o1 < o2) {
        return -1
      } else if (o1 > o2) {
        return 1
      } else {
        return 0
      }
    }
  }

  private compareName(other: UnitInfo, key: COMPARE_KEY, isBrandCompare = false): number {
    if (isBrandCompare) {
      const c = this.compareBrand(other, key)
      if (c != 0) {
        return c
      }
    }
    if (key == COMPARE_KEY.NAME2) {
      if (this.idol2.yomi < other.idol2.yomi) {
        return -1
      } else if (this.idol2.yomi > other.idol2.yomi) {
        return 1
      } else {
        return 0
      }
    } else if (key == COMPARE_KEY.NAME3) {
      if (this.idol3.yomi < other.idol3.yomi) {
        return -1
      } else if (this.idol3.yomi > other.idol3.yomi) {
        return 1
      } else {
        return 0
      }
    } else {
      if (this.idol1.yomi < other.idol1.yomi) {
        return -1
      } else if (this.idol1.yomi > other.idol1.yomi) {
        return 1
      } else {
        return 0
      }
    }
  }

  /**
   * ユニット名比較
   *
   * @private
   * @param {UnitInfo} other
   * @param {COMPARE_KEY} key - 比較するkey
   * @param {boolean} [isBrandCompare=false] - ブランド比較をするか
   * @returns {number}
   * @memberof UnitInfo
   */
  private compareUnitName(other: UnitInfo, key: COMPARE_KEY, isBrandCompare = false): number {
    if (key == COMPARE_KEY.NAME2) {
      const c1 = this.compareName(other, COMPARE_KEY.NAME2, isBrandCompare)
      if (c1 != 0) {
        return c1
      }
      const c2 = this.compareName(other, COMPARE_KEY.NAME1, isBrandCompare)
      if (c2 != 0) {
        return c2
      }
      return this.compareName(other, COMPARE_KEY.NAME3, isBrandCompare)
    } else if (key == COMPARE_KEY.NAME3) {
      const c1 = this.compareName(other, COMPARE_KEY.NAME3, isBrandCompare)
      if (c1 != 0) {
        return c1
      }
      const c2 = this.compareName(other, COMPARE_KEY.NAME1, isBrandCompare)
      if (c2 != 0) {
        return c2
      }
      return this.compareName(other, COMPARE_KEY.NAME2, isBrandCompare)
    } else {
      const c1 = this.compareName(other, COMPARE_KEY.NAME1, isBrandCompare)
      if (c1 != 0) {
        return c1
      }
      const c2 = this.compareName(other, COMPARE_KEY.NAME2, isBrandCompare)
      if (c2 != 0) {
        return c2
      }
      return this.compareName(other, COMPARE_KEY.NAME3, isBrandCompare)
    }
  }

  /**
   * ユニット間の順番比較
   *
   * @param {UnitInfo} other - 比較対象
   * @param {COMPARE_KEY} key - 比較するkey
   * @param {boolean} [isBrandCompare=false] - ブランド順にするか
   * @returns {number} - -1:this < other  0: this == other  1: this > other
   * @memberof UnitInfo
   */
  public compare(other: UnitInfo, key: COMPARE_KEY, isBrandCompare = false): number {
    switch (key) {
      case COMPARE_KEY.NAME1:
      case COMPARE_KEY.NAME2:
      case COMPARE_KEY.NAME3:
        return this.compareUnitName(other, key, isBrandCompare)
      case COMPARE_KEY.VO:
        if (this.vo < other.vo) {
          return -1
        } else if (this.vo > other.vo) {
          return 1
        } else {
          return this.compareUnitName(other, COMPARE_KEY.NAME1, isBrandCompare)
        }
      case COMPARE_KEY.DA:
        if (this.da < other.da) {
          return -1
        } else if (this.da > other.da) {
          return 1
        } else {
          return this.compareUnitName(other, COMPARE_KEY.NAME1, isBrandCompare)
        }
      default:
        if (this.vi < other.vi) {
          return -1
        } else if (this.vi > other.vi) {
          return 1
        } else {
          return this.compareUnitName(other, COMPARE_KEY.NAME1, isBrandCompare)
        }
    }
  }
}

/**
 * アイドルデータの管理クラス
 *
 * @export
 * @class IdolDB
 */
export class IdolDB {
  // 大元のアイドルデータ
  private static readonly _dfIdol = new DataFrame(idolData, null)
  private _collectedUnits: UnitInfo[] = []

  /**
   * アイドル選択
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr - 選択する属性
   * @returns {DataFrame}
   * @memberof IdolDB
   */
  public selectIdol(brands: string[], attr: string): DataFrame {
    let df = IdolDB._dfIdol.filter((row: Row) => {
      if (brands.length != 0 && !brands.includes(row.get('brand') as string)) {
        return false
      }
      return (row.get('attr') as string).includes(attr)
    })
    if (df.dim()[0] == 0) {
      df = df.push(['', '', '', '', 0, 0, 0])
    }
    return df
  }

  /**
   * ユニットの全組み合わせを取得
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr1 - 一人目の属性
   * @param {string} attr2 - 二人目の属性
   * @param {string} attr3 - 三人目の属性
   * @returns {UnitInfo[]}
   * @memberof IdolDB
   */
  public collectUnits(brands: string[], attr1: string, attr2: string, attr3: string): UnitInfo[] {
    const df1 = this.selectIdol(brands, attr1)
    const df2 = this.selectIdol(brands, attr2)
    const df3 = this.selectIdol(brands, attr3)
    const height1 = df1.dim()[0]
    const height2 = df2.dim()[0]
    const height3 = df3.dim()[0]

    // 全組み合わせを取得
    const unitData: UnitInfo[] = []
    for (let i = 0; i < height1; i++) {
      const idol1 = df1.getRow(i).toDict() as IdolInfo
      for (let j = 0; j < height2; j++) {
        const idol2 = df2.getRow(j).toDict() as IdolInfo
        if (idol2.name != '' && idol1.name == idol2.name) {
          continue
        }
        for (let k = 0; k < height3; k++) {
          const idol3 = df3.getRow(k).toDict() as IdolInfo
          if (idol3.name != '' && (idol1.name == idol3.name || idol2.name == idol3.name)) {
            continue
          }
          if (idol1.name == '' && idol2.name == '' && idol3.name == '') {
            continue
          }

          // ユニット追加
          unitData.push(new UnitInfo(idol1, idol2, idol3))
        }
      }
    }
    this._collectedUnits = unitData
    return unitData
  }

  /**
   * 取得済みのユニットをソート
   *
   * @param {COMPARE_KEY} sortKey
   * @param {boolean} isBrandSort - ブランドソートをするか
   * @param {boolean} isReverse - true:昇順 false:降順
   * @returns {UnitInfo[]}
   * @memberof IdolDB
   */
  public sortUnits(sortKey: COMPARE_KEY, isBrandSort: boolean, isReverse: boolean): UnitInfo[] {
    // 比較関数決定
    const compareFn = (a: UnitInfo, b: UnitInfo): number => {
      return a.compare(b, sortKey, isBrandSort)
    }

    // ソート
    const sortedUnits = this._collectedUnits.slice().sort(compareFn)
    if (isReverse) {
      return sortedUnits.reverse()
    }
    return sortedUnits
  }
}

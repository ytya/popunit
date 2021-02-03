import { DataFrame, Row } from 'dataframe-js'
import idolData from './idol-data.json'

// idol-data.json
// [{"brand": "765AS", "name": "天海春香", "color": "#e22b30", "attr": "花海", "Vo": 90, "Da": 70, "Vi": 80}]

export interface IdolInfo {
  name: string
  attr: string
  vo: number
  da: number
  vi: number
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
}

/**
 * アイドルデータの管理クラス
 *
 * @export
 * @class IdolDB
 */
export class IdolDB {
  // 大元のアイドルデータ
  private static readonly dfIdol = new DataFrame(idolData, null)

  /**
   * アイドル情報を取得
   *
   * @private
   * @param {Row} row - DataFrameの1行
   * @returns {IdolInfo}
   * @memberof IdolDB
   */
  private getIdolInfoFromRow(row: Row): IdolInfo {
    return {
      name: row.get('name') as string,
      attr: row.get('attr') as string,
      vo: row.get('Vo') as number,
      da: row.get('Da') as number,
      vi: row.get('Vi') as number,
    }
  }

  /**
   * アイドル選択
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr - 選択する属性
   * @returns {DataFrame}
   * @memberof IdolDB
   */
  public selectIdol(brands: string[], attr: string): DataFrame {
    let df = IdolDB.dfIdol.where((row: Row) => {
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
      const idol1 = this.getIdolInfoFromRow(df1.getRow(i))
      for (let j = 0; j < height2; j++) {
        const idol2 = this.getIdolInfoFromRow(df2.getRow(j))
        if (idol2.name != '-' && idol1.name == idol2.name) {
          continue
        }
        for (let k = 0; k < height3; k++) {
          const idol3 = this.getIdolInfoFromRow(df3.getRow(k))
          if (idol3.name != '-' && (idol1.name == idol3.name || idol2.name == idol3.name)) {
            continue
          }

          // ユニット追加
          unitData.push(new UnitInfo(idol1, idol2, idol3))
        }
      }
    }
    return unitData
  }
}

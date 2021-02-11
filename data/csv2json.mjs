import csv from 'csv'
import fs from 'fs'
import path from 'path'

const filepath = path.resolve(process.cwd(), 'idol-data.csv')

const parser = csv.parse({trim: true, columns:true}, (err, data) => {
    const export_data = []
    for (const idol of data) {
        export_data.push({
            brand: idol['ブランド'],
            name: idol['名前'],
            yomi: idol['ふりがな'],
            attr: idol['属性1'] + idol['属性2'],
            vo: Number(idol['Vo']),
            da: Number(idol['Da']),
            vi: Number(idol['Vi'])
        })
    }

    fs.writeFileSync('../src/ts/idol-data.json', JSON.stringify(export_data))
})
fs.createReadStream(filepath).pipe(parser)

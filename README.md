# Scanfr 1.0.0
## 🎉 Update
- Nothing to say for now :D

## 📖 Description
It's a scrapper for https://www.scan-fr.cc/

## NPM
https://www.npmjs.com/package/scanfr
```
npm i scanfr
```
## Api
```js
const scanScrapper = require('scanfr');
const data = await scanScrapper.loadScan();
```
## How to use ?
Search scan
```js
//Get data from api.loadScan().then(data => {});
const onePiece = scanScrapper.searchScan(data, "one piece");
```
Get more information (resumate + volumes)
```js
const onePiece = scanScrapper.searchScan(data, "one piece");
const volumes = await scanScrapper.getVolumes(onePiece[0]);
console.log("--- [RESUMER] ---");
console.log(volumes.resumer);
console.log("--- [VOLUMES] ---");
console.log(volumes.volumes);
/*
{
    resumer: "...",
    {
        "volume-0": [...]
    }
}
*/
```
Start reading
```js
const volumesNames = Object.keys(volumes.volumes);
const chapitreZero = volumes.volumes[volumesNames[0]][0];
const reading = await scanScrapper.startReading(chapitreZero);
console.log(reading);
```
Next page
```js
const nextPage = scanScrapper.nextPage(reading);
console.log(nextPage);
```
Previous page
```js
const previousPage = scanScrapper.previousPage(nextPage);
console.log(previousPage);
```
## Example
```js
const scanScrapper = require('scanfr');

(async() => {
    console.log("--- [CHARGEMENT DB] ---");
    const data = await scanScrapper.loadScan();

    console.log("--- [RECHERCHE ONE PIECE] ---");
    const onePiece = scanScrapper.searchScan(data, "one piece");
    console.log(onePiece);

    console.log("--- [RECHERCHE VOLUMES POUR ONE PIECE] ---");
    const volumes = await scanScrapper.getVolumes(onePiece[0]);

    console.log("--- [VOLUMES] ---");
    console.log(volumes);

    console.log("--- [RESUMER] ---");
    console.log(volumes.resumer);

    const volumesNames = Object.keys(volumes.volumes);

    console.log("--- [DEBUT DE LA LECTURE] ---");
    const chapitreZero = volumes.volumes[volumesNames[0]][0];
    const reading = await scanScrapper.startReading(chapitreZero);

    console.log(reading);

    console.log("--- [PAGE SUIVANTE] ---");
    const nextPage = scanScrapper.nextPage(reading);

    console.log(nextPage);

    console.log("--- [PAGE PRECEDENTE] ---");
    const previousPage = scanScrapper.previousPage(nextPage);

    console.log(previousPage);
})();
```
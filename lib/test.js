const scanScrapper = require('./scanfr.js');

(async() => {
    try {
        console.log("--- [CHARGEMENT DB] ---");
        const data = await scanScrapper.loadScan();
        console.log(data)

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
    } catch (e) {
        console.error(e);
    }
})();
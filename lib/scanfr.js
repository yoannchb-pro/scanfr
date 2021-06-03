const got = require('got');
const DomParser = require('dom-parser');

/**
 * Permet de parse l'url de l'image
 * @param {String} url 
 * @param {Number} num 
 * @returns {String}
 */
const parseImgUrl = (url, num) => {
    const eps = url;
    const baseUrl = eps.substring(0, eps.lastIndexOf('/')) + "/";
    const epNumber = eps.substring(eps.lastIndexOf('/'));
    const splitted = epNumber.split('.');
    const extension = "." + splitted[1];
    const ep = num.toString().padStart(splitted[0].length - 1, "0");
    const url = baseUrl + ep + extension;
    return url;
}

/**
 * Permet de load les scans
 * @returns {Promise}
 */
exports.loadScan = async() => {
    try {
        const response = await got("https://www.scan-fr.cc/search?query=")
        let res = JSON.parse(response.body).suggestions;
        res.forEach(element => {
            const id = element.data;
            element.img = `https://www.scan-fr.cc/uploads/manga/${id}/cover/cover_250x350.jpg`;
            element.page = `https://www.scan-fr.cc/manga/${id}`;
        });
        return res;
    } catch (e) {
        return e;
    }
}

/**
 * Permet de cherche un scan
 * @param {Object} data 
 * @param {String} name 
 * @returns {Object}
 */
exports.searchScan = (data, name) => {
    if (!data || typeof data != "object") throw 'invalid data object (data,name)';
    if (!name) throw '"name" should be declared (data,name)';
    const nameRef = name.trim().toLowerCase();
    return data.filter(scan => scan.value.toLowerCase().includes(nameRef));
}

/**
 * Permet d'obtenir les volumes et les chapitres d'un scan
 * @param {Object} scan 
 * @returns {Promise}
 */
exports.getVolumes = async(scan) => {
    if (!scan || typeof scan != "object") throw 'invalid data object';
    if (!scan.page) throw "invalide object, should have page attribute";

    try {
        const scrap = await got(scan.page);
        const html = scrap.body;

        const parser = new DomParser();
        const document = parser.parseFromString(html);

        const list = document.getElementsByClassName('chapterszozo')[0];
        const link = list.getElementsByTagName('li');

        const resume = document.getElementsByClassName('well')[0].getElementsByTagName('p')[0].textContent;

        const res = {
            resumer: resume,
            volumes: {}
        };

        link.forEach((l) => {
            if (!l.getAttribute('class').includes('volume-')) return;

            const volume = l.getAttribute('class');
            if (!res.volumes[volume]) res.volumes[volume] = [];

            const a = l.getElementsByTagName('a')[0];
            const page = a.getAttribute('href') + "/1";
            const name = a.textContent;

            const splitted = name.split(' ');
            const ep = splitted[splitted.length - 1];

            const description = l.getElementsByTagName('em')[0].textContent;

            const date = l.getElementsByClassName('date-chapter-title-rtl')[0].textContent;

            res.volumes[volume].push({
                name: name,
                chapitre: ep,
                description: description,
                date: date,
                page: page
            });
        });

        return res;
    } catch (e) {
        return e;
    }
}

/**
 * Permet d'obtenir l'image d'un chapitre
 * @param {object} volume 
 * @returns {Promise}
 */
exports.startReading = async(volume) => {
    if (!volume || typeof volume != "object") throw 'invalid data object (volume)';
    if (!volume.page) throw "invalide object, should have page attribute";

    try {
        const scrap = await got(volume.page);
        const html = scrap.body;

        const parser = new DomParser();
        const document = parser.parseFromString(html);

        const imgs = document.getElementsByTagName('img');
        let img = false;
        for (let i of imgs) {
            const url = i.getAttribute('src');
            if (url.includes('https://scan-fr.cc/uploads/manga')) {
                img = url;
                break;
            }
        }

        img = parseImgUrl(img, 1);

        const nbImgs = document.getElementsByClassName('selectpicker')[0].getElementsByTagName('option').length;
        const actual = 1;

        return {
            img: img,
            nbImgs: nbImgs,
            actual: actual,
            page: volume.page
        }
    } catch (e) {
        return e;
    }
}

/**
 * Permet de passer à la page suivante
 * @param {Object} page 
 * @returns {Object}
 */
exports.nextPage = (page) => {
    if (!page || typeof page != "object") throw 'invalid data object (page)';
    if (!page.page || !page.nbImgs) throw "invalide object, should have page and nbImgs attribute";
    if (page.actual == page.nbImgs) throw "you are already on the last page";

    page.actual++;

    const url = parseImgUrl(page.img, page.actual);

    page.img = url;

    return page;
}

/**
 * Permet de passer à la page précédente
 * @param {Object} page 
 * @returns {Object}
 */
exports.previousPage = (page) => {
    if (!page || typeof page != "object") throw 'invalid data object (page)';
    if (!page.page || !page.nbImgs) throw "invalide object, should have page and nbImgs attribute";
    if (page.actual == 1) throw "you are already on the first page";

    page.actual--;

    const url = parseImgUrl(page.img, page.actual);

    page.img = url;

    return page;
}

/**
 * Permet direct de ce rendre à une page spécifique
 * @param {Object} page 
 * @param {Integer} num 
 * @returns {Object}
 */
exports.goToPage = (page, num) => {
    if (!page || typeof page != "object") throw 'invalid data object (page)';
    if (!page.page || !page.nbImgs) throw "invalide object, should have page and nbImgs attribute";
    if (num > page.nbImgs || num < 1) throw "invalide page number";

    page.actual = num;

    const url = parseImgUrl(page.img, page.actual);

    page.img = url;

    return page;
}
'use strict'

const xRay = require('x-ray');
const properties = require('../properties');
const xray = new xRay();

var scrapper = {
    infoByTitle: (imdbId, resolve, reject) => {
        if(!imdbId){
            reject();
        }
        let url = `${properties.imdbBase}${imdbId}/`;
        console.log(url);
        xray(url, {
            imdbRating: '#pagecontent #main_top #title-overview-widget #overview-top .star-box .titlePageSprite',
            ratedByUsers: '#pagecontent #main_top #title-overview-widget #overview-top .star-box .star-box-details a:nth-child(3) span',
        })((err, data) => {
            if(err){
                console.error(err);
                reject({});
                return;
            }
            console.log(data);
            resolve(data);
        });
    }
};

module.exports = scrapper;
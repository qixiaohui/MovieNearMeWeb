'use strict'

const xRay = require('x-ray');
const properties = require('../properties');
const xray = new xRay();

const newsScrapper = {
	getLatestNews: (page, resolve, reject) => {
		if(!page) page=1;
		let url = `${properties.screenrantNews}${page}/`;

        console.log(url);
        xray(url, {
        	list: xray('.latest-news .thumb-list .thumb-wrap', [{
        		title: '.info-wrapper .title a',
        		img: '.img-wrapper img@src',
        		content: '.info-wrapper .title a@href'
        	}])
        })((err, data) => {
            if(err){
                reject({});
                return;
            }
            resolve(data);
        });
	}
};

module.exports = newsScrapper;
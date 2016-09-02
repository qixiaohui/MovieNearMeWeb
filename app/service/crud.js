const axios = require('axios');
const domain = 'https://sheltered-peak-44325.herokuapp.com';
var crud = {
    GET: (url, headers) => {
		debugger;
        console.log(`${domain}${url}`);
        return axios({
            method: 'get',
            url: url,
            headers: headers
        });
    },
    POST: (url, headers, form) => {
        return axios({
            method: 'post',
            url: url,
            headers: headers,
            data: form
        });
    }
};

module.exports = crud;
const axios = require('axios');
var crud = {
    GET: (url, headers) => {
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
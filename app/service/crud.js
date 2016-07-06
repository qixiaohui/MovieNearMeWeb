export default ngModule => {
    ngModule.service('crud', function($scope, $http){
        this.get = (url, headers) => {
            $http.get({
                method: 'GET',
                url: url,
                headers: headers
            }).then((response) => {
                return response;
            }, (err) => {
                return {};
            });
        };

        this.post = (url, headers, form) => {
          $http.post({
              method: 'POST',
              url: url,
              headers: headers,
              data: form
          }).then((response) => {
              return response;
          }, (err) => {
              return {};
          });
        };
    });
};
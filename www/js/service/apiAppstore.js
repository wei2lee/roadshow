


(function() {
    var _module = angular.module('apiAppstore', ['value', 'ionic']);
    _module.
    factory('apiAppStoreServiceBase', function($q,u) {
        function api() {
            var _this = this;
            this._useCache = false;
        }
        api.prototype.useCache = function() {
            this._useCache = true;
            return this; 
        }
        api.prototype.processError = function(jqXHR, textStatus, errorThrown) {
            var msg = null;
            if(jqXHR.responseJSON != null) {
                var json = jqXHR.responseJSON;
                if(json.error_exist) {
                    if(!msg && json.error_message) {
                        msg = {
                            domain:u.ErrorDomain.ServerInfracture, 
                            code:0, 
                            description:json.error_message
                        }; 
                    }
                    if(!msg) {
                        msg = {
                            domain:u.ErrorDomain.ServerInfracture, 
                            code:0, 
                            description:"Unable to interprete server reply"
                        }; 
                    }
                }else{
                    msg = {
                        domain:u.ErrorDomain.ServerInfracture, 
                        code:0, 
                        description:"Unable to interprete server reply"
                    }; 
                }
            }else{
                if(!msg && jqXHR.status == 0) {
                    msg = {
                        domain:u.ErrorDomain.ClientHTTP, 
                        code:0, 
                        description:"Unable to connect to server"
                    }; 
                }
                if(!msg && errorThrown != null) {
                    msg = {
                        domain:u.ErrorDomain.ClientHTTP, 
                        code:jqXHR.status, 
                        description:errorThrown
                    }; 
                }
                console.log(jqXHR);
                if(!msg) {
                    msg = {
                        domain:u.ErrorDomain.ClientHTTP, 
                        code:jqXHR.status, 
                        description:'Unable to interprete server reply ('+jqXHR.status+')'
                    }; 
                }
            }
            return msg;
        }
        api.prototype.callApi = function(ajax) {
            var _self = this;
            var defer = $q.defer();
            ajax.then(function(data, textStatus, jqXHR) {
                if(data) {
                    if(!data.error_exist) {
                        console.log('done@' + this.url);
                        console.log(data.result);
                        defer.resolve(data.result);   
                        return;
                    }
                }
                console.log('done(with error)@' + this.url);
                var error = _self.createError(jqXHR, textStatus, null)
                console.log(error);
                defer.reject(error);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log('fail@' + this.url);
                var error = _self.createError(jqXHR, textStatus, errorThrown)
                console.log(error);
                defer.reject(error);
            });
            return defer.promise;
        }

        return api;
    })
    .service('apiApp', function($q, apiAppStoreServiceBase) {
    function api(){}
    api.prototype = new apiAppStoreServiceBase();
    api.prototype.get = function() {
        var platform = !ionic.Platform.isAndroid() ? 'ios' : 'android';
        return this.callApi($.ajax('http://infradigital.com.my/appstore/cms/resources/app.php?appid=com.hatten.roadshow&platform='+platform,{
            method:'GET',
            dataType:'json'
        }));
    }
    return new api();
});
    
})();
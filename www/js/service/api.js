(function() {
    var _module = angular.module('API', ['value']);
    _module.factory('APIServiceBase', function($q,u,$timeout,APIService) {
        function _apiServiceBase(_values) {
            var _this = this;
            this.values = _values;
            this.apiService = APIService;
            this._useCache = false;
            this.apiGetAllUrl = '';
        }
        _apiServiceBase.prototype.useCache = function() {
            this._useCache = true;
            return this; 
        }
        _apiServiceBase.prototype.getAll = function() {
            return $q(function(resolve,reject){
                reject(u.Error('Not implemented')); 
            });
        }
        _apiServiceBase.prototype.getById = function(id) {
            return $q(function(resolve,reject){
                reject(u.Error('Not implemented')); 
            });
        }
        
        _apiServiceBase.prototype.processError = function(jqXHR, textStatus, errorThrown) {
            var msg = null;
            if(jqXHR.responseJSON != null) {
                var json = jqXHR.responseJSON;
                if(!msg && json.error) {
                    msg = {
                        domain:u.ErrorDomain.ServerInfracture, 
                        code:json.error, 
                        description:json.error_description || ('error:'+json.error)
                    };   
                }
                if(!msg && json.ErrorCode){
                    msg = {
                        domain:u.ErrorDomain.ServerInfracture, 
                        code:json.ErrorCode, 
                        description:json.Message || ('ErrorCode:'+json.ErrorCode)
                    };   
                }
                if(!msg && json.Message) {
                    msg = {
                        domain:u.ErrorDomain.ServerInfracture, 
                        code:0, 
                        description:json.Message
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
        _apiServiceBase.prototype.processHtml = function(html) {

        }

        return _apiServiceBase;
    });
    
    _module.service('APIServiceBaseWithToken', function($q,$timeout,APIServiceBase,apiToken) {
        function api() {}
        api.prototype = new APIServiceBase();
        api.prototype.withToken = function(createJQXHR) {
            var defer = $q.defer();
            var _self = this;
            if(apiToken.apiService.token.access_token) {
                createJQXHR().done(function(data, textStatus, jqXHR) { 
                    console.log('done@' + this.url);
                    console.log(data);
                    defer.resolve(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    if(jqXHR.status==401){
                        console.log('fail@' + this.url);
                        console.log('Re-token');
                        return apiToken.token().then(function(){
                            return createJQXHR().then(function(data, textStatus, jqXHR){
                                console.log('done@' + this.url);
                                console.log(data);
                                defer.resolve(data);
                            });
                        }).catch(function(error) {
                            console.log('fail@' + this.url);
                            console.log(error);
                            defer.reject(error); 
                        });
                    }else{
                        console.log('fail@' + this.url);
                        var error = _self.processError(jqXHR, textStatus, errorThrown);
                        console.log(error);
                        defer.reject(error); 
                    }
                });
            }else{
                apiToken.token().then(function(){
                    createJQXHR().then(function(data, textStatus, jqXHR){
                        console.log('done@' + this.url);
                        console.log(data);
                        defer.resolve(data);
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        console.log('fail@' + this.url);
                        var error = _self.processError(jqXHR, textStatus, errorThrown);
                        console.log(error);
                        defer.reject(error); 
                    });
                }).catch(function(error) {
                    console.log('fail@' + this.url);
                    console.log(error);
                    defer.reject(error); 
                });
            }
            return defer.promise;
        }
        return api;
    });
    
    _module.factory('apiToken', function($q,APIServiceBase) {
        function api() {}
        api.prototype = new APIServiceBase();
        api.prototype.token = function(){
            var _self = this;
            return $q(function(resolve,reject) {
                $.ajax(_self.apiService.apiBase + 'Token',{
                    method:'POST',
                    dataType:'json',
                    data:{
                        username:_self.apiService.apiUserName,
                        password:_self.apiService.apiUserPassword,
                        grant_type:'password'
                    }
                }).done(function(data, textStatus, jqXHR) { 
                    console.log('done@' + this.url);
                    console.log(data);
                    _self.apiService.token = data;
                    resolve(data);
                }).fail (function(jqXHR, textStatus, errorThrown) {
                    console.log('fail@' + this.url);
                    var error = _self.processError(jqXHR, textStatus, errorThrown);
                    console.log(error);
                    reject(error);
                });
            })
        }
        return new api();
    })

    _module.service('apiUser', function($q,u,APIServiceBaseWithToken) {
        function api() {}
        api.prototype = new APIServiceBaseWithToken();
        api.prototype.login = function(username, password) {
            var _self = this;
            if(!username || !password){
                return $q(function(resolve,reject) {
                    reject(u.Error('Username and password must not be empty')); 
                });
            }
            return _self.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/AppUser/Login',{
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                    data:{
                        sCompanyCode:'HATT',
                        sUserName:username,
                        sPassword:password
                    }
                })
            }).then(function(data){
                _self.user = data;
                return data;
            }).catch(function(error){
                if(error.domain == u.ErrorDomain.ServerInfracture && error.code == 1){
                    throw {
                        domain:u.ErrorDomain.ClientApplication, 
                        code:0, 
                        description:"User doesn\'t match with any password"
                    };
                }else{
                    throw error;   
                }
            });
        }
        api.prototype.getById = function(id) {
            var _self = this;
            return this.withToken(function(){
                console.log('apiUser.getById tokened');
                return $.ajax(_self.apiService.apiBase + 'api/AppUser/'+id,{
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
                });
            })
        }
        return new api();
    });  
    _module.service('apiEvent', function($q,u,APIServiceBaseWithToken) {
        function api(){}
        api.prototype = new APIServiceBaseWithToken();
        api.prototype.getAll = function() {
            var _self = this;
            return this.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/WhatNews/GetAllEvent',{
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
                })
            }).then(function(data){
                _self.values = _.each(data, function(o) {
                    o.RoadShow.StartDate = new Date(o.RoadShow.StartDate);
                    o.RoadShow.EndDateTime  = new Date(o.RoadShow.EndDateTime);
                    Object.defineProperty(o.RoadShow, 'status', {
                        get: function () {
                            var now = Date.now();
                            if(now < this.StartDate.getTime()) return 'pending';
                            else if(now > this.EndDateTime.getTime()) return 'closed';
                            else return 'ongoing';
                        }
                    });
                    Object.defineProperty(o.RoadShow, 'timeline', {
                        get: function () {
                            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            return this.StartDate.getDate() + ' ' + months[this.StartDate.getMonth()] + ' - ' + this.EndDateTime.getDate() + ' ' + months[this.EndDateTime.getMonth()] + ' ' + this.EndDateTime.getFullYear();
                        }
                    });
                    Object.defineProperty(o.RoadShow, 'eqInPeriod', {
                        get: function () {
                            var eqip = eqip || 0;
                            eqip = Math.min(Math.max(0, eqip),1);
                            if(eqip < 0.01) return sprintf("%.1f%%", eqip*100);
                            else { return sprintf("%.0f%%", eqip*100); }
                        }
                    });
                    Object.defineProperty(o.RoadShow, 'salesPercentageInPeriod', {
                        get: function () {
                            var spip = (!this.TotalSaleInPeriod || !this.SalesTarget)  ? 0 : this.TotalSaleInPeriod / this.SalesTarget;
                            spip = Math.min(Math.max(0, spip),1);
                            if(spip < 0.01) return sprintf("%.1f%%", spip*100);
                            else { return sprintf("%.0f%%", spip*100); }
                        }
                    });
                });
                return data;
            });
        }
        api.prototype.getById = function(id) {
            var _self = this;
            if(_self.useCache && _self.values){
                return $q(function(resolve,reject){
                    if(typeof id == 'string') id = parseInt(id);
                    var found = _.find(_self.values, function(o) {
                        return o.EventId  == id; 
                    });
                    if(found){
                        resolve(found);
                    }
                    else reject(u.Error('Not found'));
                });
            }else{
                return this.withToken(function(){
                    return $.ajax(_self.apiService.apiBase + 'api/WhatNews/GetWhatNewsById?eventid='+id,{
                        headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
                    }).done(function(data, textStatus, jqXHR) {
                        var found = data;
                        found.RoadShow.StartDate = new Date(found.RoadShow.StartDate);
                        found.RoadShow.EndDateTime  = new Date(found.RoadShow.EndDateTime);
                        Object.defineProperty(found.RoadShow, 'status', {
                            get: function () {
                                var now = Date.now();
                                if(now < this.StartDate.getTime()) return 'pending';
                                else if(now > this.EndDate.getTime()) return 'closed';
                                else return 'ongoing';
                            }
                        });
                        Object.defineProperty(found.RoadShow, 'timeline', {
                            get: function () {
                                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                return this.StartDate.getDate() + ' ' + months[this.StartDate.getMonth()] + ' - ' + this.EndDateTime.getDate() + months[this.EndDateTime.getMonth()] + ' ' + this.EndDateTime.getYear();
                            }
                        });
                        Object.defineProperty(found.RoadShow, 'eqInPeriod', {
                            get: function () {
                                var eqip = eqip || 0;
                                eqip = Math.min(Math.max(0, eqip),1);
                                if(eqip < 0.01) return sprintf("%.1f%%", eqip*100);
                                else { return sprintf("%.0f%%", eqip*100); }
                            }
                        });
                        Object.defineProperty(found.RoadShow, 'salesPercentageInPeriod', {
                            get: function () {
                                var spip = (!this.TotalSaleInPeriod || !this.SalesTarget) ? 0 : this.TotalSaleInPeriod / this.SalesTarget;
                                spip = Math.min(Math.max(0, this.spip),100);
                                if(spip < 0.01) return sprintf("%.1f%%", spip*100);
                                else { return sprintf("%.0f%%", spip*100); }
                            }
                        });
                        return data;
                    });
                })
            }
        }
        return new api();
    });            
})();
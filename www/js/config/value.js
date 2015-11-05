(function() {
    var _module = angular.module('value', []);
    _module.value('App', {
        versionNumber:"0.0.0",
        versionCode:0,
        minimumCheckAppVersionTimeSpan:24*3600
    }).value('APIService', {
        token:{},
        apiBase:'http://103.9.149.59:6080/',
        resourceBase:'http://103.9.149.59:6080/data/HATTEN/',
        apiUserName:'90731C01@hatt',
        apiUserPassword:'F2568907B18C'
    });
})();
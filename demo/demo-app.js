var DemoApp;
(function (DemoApp) {
    'use strict';
    var DemoCtrl = (function () {
        function DemoCtrl($q, $timeout, deferCacheService) {
            this.$q = $q;
            this.$timeout = $timeout;
            this.deferCacheService = deferCacheService;
            this.loading = false;
        }
        DemoCtrl.prototype.loadData = function () {
            var _this = this;
            console.log('load started');
            this.loading = true;
            this.loadSomeDataFromBackend().then(function (result) {
                console.log('load finished');
                _this.data = result;
                _this.loading = false;
            });
        };
        DemoCtrl.prototype.removeCache = function () {
            this.deferCacheService.destroy('cacke.key1');
        };
        DemoCtrl.prototype.loadSomeDataFromBackend = function () {
            var _this = this;
            return this.deferCacheService.getDeferred('cacke.key1', function () {
                console.log('call to backend - not cached');
                return _this.$q(function (resolve) {
                    var items = [
                        { name: 'name1' },
                        { name: 'name2' }
                    ];
                    _this.$timeout(function () {
                        resolve(items);
                    }, 2000); //let's say we get data from server after 2 seconds
                });
            });
        };
        DemoCtrl.$inject = ['$q', '$timeout', 'deferCacheService'];
        return DemoCtrl;
    })();
    angular.module('demoApp', ['deferCacheService'])
        .controller('demoCtrl', DemoCtrl);
})(DemoApp || (DemoApp = {}));
//# sourceMappingURL=demo-app.js.map
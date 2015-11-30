/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="IDeferCacheService.ts" />
(function () {
    'use strict';
    var DeferCacheService = (function () {
        function DeferCacheService($q) {
            this.$q = $q;
            this.defers = {};
            this.caches = {};
        }
        DeferCacheService.prototype.getDeferred = function (key, callbackFn) {
            var _this = this;
            var defer = this.getDefer(key);
            if (defer && defer.promise.$$state.status === 0) {
                return defer.promise;
            }
            if (!defer) {
                defer = this.createDefer(key);
            }
            var cache = this.getOrCreateCache(key);
            if (cache) {
                defer.resolve(cache);
            }
            else {
                callbackFn().then(function (result) {
                    _this.addToCache(key, result);
                    defer.resolve(result);
                });
            }
            return defer.promise;
        };
        DeferCacheService.prototype.get = function (key) {
            return this.caches[key];
        };
        DeferCacheService.prototype.destroy = function (key) {
            this.caches[key] = undefined;
            this.defers[key] = undefined;
        };
        DeferCacheService.prototype.getDefer = function (key) {
            return this.defers[key];
        };
        DeferCacheService.prototype.createDefer = function (key) {
            this.defers[key] = this.$q.defer();
            return this.defers[key];
        };
        DeferCacheService.prototype.getOrCreateCache = function (key) {
            if (!this.caches[key]) {
                this.caches[key] = undefined;
            }
            return this.caches[key];
        };
        DeferCacheService.prototype.addToCache = function (key, data) {
            this.caches[key] = data;
        };
        DeferCacheService.$inject = ['$q'];
        return DeferCacheService;
    })();
    angular.module('deferCacheService', []).service('deferCacheService', DeferCacheService);
})();
//# sourceMappingURL=defer-cache-service.js.map
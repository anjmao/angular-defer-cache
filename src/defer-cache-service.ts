/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="IDeferCacheService.ts" />

(() => {
    'use strict';

    class DeferCacheService implements IDeferCacheService {

        static $inject = ['$q'];
        constructor(private $q: ng.IQService) { }

        private defers: { [id: string]: any } = {};
        private caches: { [id: string]: any } = {};

        getDeferred<T>(key: string, callbackFn: () => ng.IPromise<any>): ng.IPromise<T> {

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
            } else {
                callbackFn().then((result) => {
                    this.addToCache(key, result);
                    defer.resolve(result);
                });
            }

            return defer.promise;
        }

        get<T>(key: string) {
            return this.caches[key];
        }

        destroy(key: string) {
            this.caches[key] = undefined;
            this.defers[key] = undefined;
        }

        private getDefer(key: string) {
            return this.defers[key];
        }

        private createDefer(key: string) {
            this.defers[key] = this.$q.defer();
            return this.defers[key];
        }

        private getOrCreateCache(key: string) {

            if (!this.caches[key]) {
                this.caches[key] = undefined;
            }

            return this.caches[key];
        }

        private addToCache(key: string, data) {
            this.caches[key] = data;
        }
    }

    angular.module('deferCacheService', []).service('deferCacheService', DeferCacheService);
    
})();
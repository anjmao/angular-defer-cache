/// <reference path="../typings/angularjs/angular.d.ts" />
interface IDeferCacheService {
	getDeferred<T>(key: string, callbackFn: () => ng.IPromise<any>): ng.IPromise<T>;
	get<T>(key: string);
	destroy(key: string);
}
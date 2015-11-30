/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../src/IDeferCacheService.ts" />
describe('Deffer cache service should', function () {
    'use strict';
    var deferCacheService, $q, $rootScope;
    beforeEach(angular.mock.module('deferCacheService'));
    beforeEach(inject(function (_$q_, _$rootScope_, _deferCacheService_) {
        $q = _$q_;
        $rootScope = _$rootScope_,
            deferCacheService = _deferCacheService_;
    }));
    it('get with promise', function (done) {
        //act
        deferCacheService.getDeferred('key1', function () { return mockedRequest('name1', 'name2'); }).then(function (res) {
            //assert
            expect(res[0].name).toBe('name1');
            expect(res[1].name).toBe('name2');
            done();
        });
        $rootScope.$digest();
    });
    it('get cached by calling two times', function (done) {
        //act
        deferCacheService.getDeferred('key1', function () { return mockedRequest('name1', 'name2'); }).then(function (res) {
            //assert
            expect(res.length).toBe(2);
            deferCacheService.getDeferred('key1', function () { return mockedRequest('name1', 'name2'); }).then(function (res2) {
                expect(res2.length).toBe(2);
                done();
            });
        });
        $rootScope.$digest();
    });
    it('destroy cache and deffer', function (done) {
        deferCacheService.getDeferred('key1', function () { return mockedRequest('name1', 'name2'); }).then(function (res) {
            expect(res.length).toBe(2);
            deferCacheService.destroy('key1');
            var cache = deferCacheService.get('key1');
            //assert
            expect(cache).not.toBeDefined();
            done();
        });
        $rootScope.$digest();
    });
    function mockedRequest(name1, name2) {
        var defer = $q.defer();
        var items = [{ name: name1 }, { name: name2 }];
        defer.resolve(items);
        return defer.promise;
    }
});
//# sourceMappingURL=defer-cache-service.spec.js.map
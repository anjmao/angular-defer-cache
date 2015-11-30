/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../src/IDeferCacheService.ts" />

interface TestItem {
    name: string;
}

describe('Deffer cache service should', () => {
    'use strict';

    var deferCacheService: IDeferCacheService,
        $q: ng.IQService,
        $rootScope;

    beforeEach(angular.mock.module('deferCacheService'));

    beforeEach(inject((_$q_, _$rootScope_, _deferCacheService_) => {
        $q = _$q_;
        $rootScope = _$rootScope_,
        deferCacheService = _deferCacheService_;
    }));

    it('get with promise', (done) => {

        //act
        deferCacheService.getDeferred<TestItem[]>('key1', () => { return mockedRequest('name1', 'name2'); }).then((res) => {

            //assert
            expect(res[0].name).toBe('name1');
            expect(res[1].name).toBe('name2');
            
            done();
        });
        
        $rootScope.$digest();
    });

    it('get cached by calling two times', (done) => {
        
        //act
        deferCacheService.getDeferred<TestItem[]>('key1', () => { return mockedRequest('name1', 'name2'); }).then((res) => {
            
            //assert
            expect(res.length).toBe(2);

            deferCacheService.getDeferred<TestItem[]>('key1', () => { return mockedRequest('name1', 'name2'); }).then((res2) => {

                expect(res2.length).toBe(2);

                done();

            });

        });

        $rootScope.$digest();

    });
    
    it('destroy cache and deffer', (done) => {
        
        deferCacheService.getDeferred<TestItem[]>('key1', () => { return mockedRequest('name1', 'name2'); }).then((res) => {
            
            expect(res.length).toBe(2);
            
            deferCacheService.destroy('key1');

            var cache = deferCacheService.get('key1');

            //assert
            expect(cache).not.toBeDefined();

            done();
        });
        
        $rootScope.$digest();
    });

    function mockedRequest(name1, name2): ng.IPromise<TestItem> {
        
        var defer = $q.defer();
        var items: TestItem[] = [{ name: name1 }, { name: name2 }];
        defer.resolve(items);

        return defer.promise;
        
    }
    
});
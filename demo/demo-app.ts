namespace DemoApp {
	'use strict';
	
	interface DemoItem {
		name: string;
	}
	
	class DemoCtrl {

		static $inject = ['$q','$timeout','deferCacheService'];
		
		constructor(private $q: ng.IQService,private $timeout: ng.ITimeoutService, private deferCacheService: IDeferCacheService) {}
		
		data: DemoItem[];
		loading: boolean = false;
		
		loadData() {
			
			console.log('load started');
			this.loading = true;
			
			this.loadSomeDataFromBackend().then((result) => {
				console.log('load finished');
				this.data = result;
				this.loading = false;
			});
		}
		
		removeCache() {
			this.deferCacheService.destroy('cacke.key1');
		}
		
		
		private loadSomeDataFromBackend(): ng.IPromise<DemoItem[]> {
			
			return this.deferCacheService.getDeferred<DemoItem[]>('cacke.key1', () => {
				
				console.log('call to backend - not cached')
				
				return this.$q((resolve) => {
					var items: DemoItem[] = [
						{name: 'name1'},
						{name: 'name2'}
					];
					
					this.$timeout(() => {
						resolve(items);
					}, 2000); //let's say we get data from server after 2 seconds
					
					
					
				});
			})
			
		}
	}
	
	angular.module('demoApp',['deferCacheService'])
		.controller('demoCtrl', DemoCtrl)
}
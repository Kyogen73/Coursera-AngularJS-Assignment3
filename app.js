(function(){
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    


    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http){
        const service = this;

        service.getMatchedMenuItems = function(searchTerm){

            let promise = $http({
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
            })

            return promise.then(function (result){
                let foundItems = result.data.menu_items;

                //filter returns the array filtered by the condition of the function: every element
                //that make the condition true will be in the new filtered array
                return foundItems.filter(function(item){ 

                    //search returns the position of the match if there is one, -1 otherwise
                    return item.description.search(searchTerm) !== -1;
                });
            })
            .catch(function (error){
                console.log(error);
            });
        }
    }


    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        const ctrl = this;

        ctrl.nothingFound = false;
        ctrl.searchTerm = '';

        ctrl.search = function() {            
            if(ctrl.searchTerm.length === 0){
                ctrl.nothingFound = true;
                return;
            }                
            MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                .then(function (result){
                    console.log(result);
                    ctrl.nothingFound = (result.length === 0);
                    ctrl.found = result;
                })
                .catch(function (error){
                    ctrl.nothingFound = true;
                    console.log(error);
                });
        };


        ctrl.removeItem = function(index) {
            ctrl.found.splice(index, 1);
        };


    }

    function FoundItemsDirective(){
        let ddo = {
            restrict: "E",
            scope:{
                foundItems: "<",
                onRemove: "&"
            },

            templateUrl: "templates/itemTemplate.html"
        };

        return ddo;
    }






})();
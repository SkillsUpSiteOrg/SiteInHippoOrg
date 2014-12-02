/*!
 * Copyright 2014 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
    "use strict";

    angular.module('hippo.theme', ['hippo.plugins', 'ui.tree']);
})();

(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:chart
     * @restrict A
     *
     * @description
     * Visualize a list of data with a pie-chart.
     *
     * @scope
     * @param {Array} data A list of data to be visualised, each object of the list having a 'label' and 'value' property.
     */
    .directive('hippo.theme.chart', [

        function() {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                link: function(scope, elem, attrs) {
                    var chart = null;
                    var opts = {
                        series: {
                            pie: {
                                show: true,
                                highlight: {
                                    opacity: 0.25
                                },
                                stroke: {
                                    color: '#fff',
                                    width: 2
                                },
                                startAngle: 2
                            }
                        },
                        legend: {
                            show: true,
                            position: "ne",
                            labelBoxBorderColor: null
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        }
                    };

                    scope.$watch('data', function(v) {
                        // re-map data, ready to be parsed by the flot library
                        if (v) {
                            var data = _.map(v, function(item) {
                                return {
                                    label: item.label,
                                    data: item.value
                                };
                            });

                            if (!chart) {
                                chart = $.plot(elem, data, opts);
                                elem.show();
                            } else {
                                chart.setData(data);
                                chart.setupGrid();
                                chart.draw();
                            }
                        }
                    });
                }
            };
        }
    ]);
})();

(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:divider
     * @restrict A
     *
     * @description
     * When passed true as value, it adds a DOM node as divider to the element.
     */
    .directive('hippo.theme.divider', [

        function() {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    var active = scope.$eval(attrs['hippo.theme.divider']);
                    if (active) {
                        elem.before('<li role="presentation" class="divider"></li>');
                    }
                }
            };
        }
    ]);
})();

(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:focusMe
     * @restrict A
     *
     * @description
     * Sets the focus on an element.
     * Credits to Mark Rajcok: http://stackoverflow.com/a/14837021/363448
     */
    .directive('hippo.theme.focusMe', ['$timeout', '$parse',
        function($timeout, $parse) {
            return {
                link: function(scope, element, attrs) {
                    scope.focusMe = false;

                    scope.$watch('focusMe', function(value) {
                        if (value === true) {
                            $timeout(function() {
                                element[0].focus();
                            });
                        }
                    });

                    element.blur(function () {
                        scope.focusMe = false;
                        scope.$apply();
                    });
                }
            };
        }
    ]);
})();

/* global MarkerClusterer: true, google: true */
(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:map
     * @restrict A
     *
     * @description
     * Uses Google Maps to display a map with the markers provided.
     * The markers are grouped when they are close to each other.
     *
     * @scope
     * @param {Array} points A list of point objects, having a longitude- and latitude property, to be visualised. Each having a longitude and latitude property.
     */
    .directive('hippo.theme.map', [

        function() {
            return {
                restrict: 'A',
                scope: {
                    points: '=markers'
                },
                link: function(scope, elem, attrs) {
                    // map options
                    var latlng = new google.maps.LatLng(52.359448, 4.901317);
                    var options = {
                        zoom: 8,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: latlng
                    };
                    var map = new google.maps.Map(elem[0], options);
                    var markerCluster = new MarkerClusterer(map, []);

                    scope.$watch('points', function(points) {
                        // points to Google latLng objects
                        var latLngList = _.map(points, function(point) {
                            return new google.maps.LatLng(point.latitude, point.longitude);
                        });

                        // (re)draw map with markers
                        drawMarkers(latLngList);
                    });

                    function drawMarkers(latLngList) {
                        // create markers
                        var markers = _.map(latLngList, function(latLng) {
                            return new google.maps.Marker({
                                'position': latLng
                            });
                        });

                        // add markers to map
                        markerCluster.clearMarkers();
                        markerCluster.addMarkers(markers);
                        markerCluster.redraw();

                        // map viewpoint based on all markers
                        var bounds = new google.maps.LatLngBounds();
                        angular.forEach(latLngList, function(latLng) {
                            bounds.extend(latLng);
                        });

                        if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                            var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.015, bounds.getNorthEast().lng() + 0.015);
                            var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.015, bounds.getNorthEast().lng() - 0.015);
                            bounds.extend(extendPoint1);
                            bounds.extend(extendPoint2);
                        }

                        //  fit these bounds to the map
                        map.fitBounds(bounds);
                    }
                }
            };
        }
    ]);
})();

(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:panelDefault
     * @restrict A
     *
     * @description
     * Component for the Bootstrap default panel.
     */
    .directive('hippo.theme.panelDefault', [

        function() {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<div class="panel panel-default">' +
                    '<div class="panel-heading">{{ panel.title }}</div>' +
                    '<div class="panel-body">' +
                    '<div><div ng-transclude></div></div>' +
                    '</div>' +
                    '</div>',
                scope: {
                    title: '='
                },
                link: function(scope) {
                    scope.panel = {
                        title: scope.title
                    };
                }
            };
        }
    ]);
}());

(function () {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc service
     * @name hippo.theme.service:ViewportSizes
     *
     * @description
     * Holds the different possible viewport sizes.
     * It is able to return the current viewport size and provides a method to set the current viewport size.
     */
            .service('hippo.theme.ViewportSizes', [function () {
                    var viewportSizes = {};

                    var sizes = [
                        {
                            order: 0,
                            name: 'xs',
                            active: false
                        },

                        {
                            order: 1,
                            name: 'sm',
                            active: false
                        },

                        {
                            order: 2,
                            name: 'md',
                            active: false
                        },

                        {
                            order: 3,
                            name: 'lg',
                            active: false
                        }
                    ];

                    /**
                     * @ngdoc method
                     * @name hippo.theme#getAll
                     * @methodOf hippo.theme.service:ViewportSizes
                     *
                     * @description
                     * Returns all the possible viewport sizes
                     *
                     * @returns {Array} List of viewport sizes
                     */
                    viewportSizes.getAll = function () {
                        return sizes;
                    };

                    /**
                     * @ngdoc method
                     * @name hippo.app#setCurrent
                     * @methodOf hippo.theme.service:ViewportSizes
                     * @param {Object} viewport The viewport to set as active
                     *
                     * @description
                     * Sets the current active viewport. It also updates the $rootScope `activeViewport` property with the active viewport;
                     */
                    viewportSizes.setCurrent = function (viewport) {
                        _.each(sizes, function (size) {
                            size.active = (viewport.name == size.name);
                        });
                    };

                    /**
                     * @ngdoc method
                     * @name hippo.theme#getCurrent
                     * @methodOf hippo.theme.service:ViewportSizes
                     *
                     * @description
                     * Fetches the current active viewport
                     *
                     * @returns {Object} The current active viewport
                     */
                    viewportSizes.getCurrent = function () {
                        return _.find(sizes, function (size) {
                            return size.active === true;
                        });
                    };

                    return viewportSizes;
                }
            ])

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:viewportTest
     * @restrict A
     * @requires $window
     *
     * @description
     * Detects the current active viewport by creating an empty div-element and attaching Bootstrap 3 classes to it.
     * When the created element is hidden, the related viewport for the class given is set to active.
     *
     * When the window gets resized, the possible new viewport will automatically be detected and set as active.
     */
            .directive('hippo.theme.viewportTest', ['$window', 'hippo.theme.ViewportSizes',
                function ($window, ViewportSizes) {
                    return {
                        restrict: 'A',
                        replace: true,
                        template: '<div></div>',
                        link: function (scope, elem) {
                            // initial detection
                            detectViewportSize();

                            // window resize
                            angular.element($window).bind('resize', function () {
                                detectViewportSize();
                            });

                            // detect viewport size
                            function detectViewportSize() {
                                // optimized version of http://stackoverflow.com/a/15150381/363448
                                var emptyDiv = angular.element('<div>');
                                elem.append(emptyDiv);

                                var sizes = ViewportSizes.getAll();

                                for (var i = sizes.length - 1; i >= 0; i--) {
                                    var size = sizes[i];

                                    emptyDiv.addClass('hidden-' + size.name);
                                    if (emptyDiv.is(':hidden')) {
                                        emptyDiv.remove();
                                        ViewportSizes.setCurrent(size);
                                        return;
                                    }
                                }
                            }
                        }
                    };
                }
            ]);
}());

(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
     * @ngdoc directive
     * @name hippo.theme.directive:selectBox
     * @restrict A
     *
     * @description
     * Converts a plain HTML select input field to a jQuery Chosen select box
     */
    .directive('hippo.theme.selectBox', [
        '$log',
        function($log) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    if (!angular.isDefined(attrs.options)) {
                        $log.warn("No 'data-options' attribute specified for hippo.theme.selectBox. Changes to the ng-options attribute value will not be reflected in the UI.");
                    }

                    // watch options
                    scope.$watch(attrs.options, function() {
                        element.trigger('chosen:updated');
                        element.trigger('chosen:updated.chosen');
                    }, true);

                    // watch selected option
                    if (attrs.ngModel) {
                        scope.$watch(attrs.ngModel, function() {
                            element.trigger('chosen:updated');
                            element.trigger('chosen:updated.chosen');
                        }, true);
                    }

                    element.chosen({
                        width: "100%",
                        no_results_text: attrs.noResultsText,
                        single_text: attrs.placeholder,
                        multiple_text: attrs.placeholder
                    });
                }
            };
        }
    ]);
}());

(function() {
    "use strict";

    angular.module('hippo.theme')

    /**
   * @ngdoc service
   * @name hippo.theme.service:URLParser
   *
   * @description
   * Whenever the current state changes, the URLParser service will parse the new URL and provide an array containing each part,
   *
   * The URL is divided by forward slashes, so /page/subpage/detail will result in an array containing 'page', 'subpage' and 'detail'.
   
   * Modified version of the [Angular App breadcrumb service](https://github.com/angular-app/angular-app/blob/master/client/src/common/services/breadcrumbs.js)
   */
    .service('hippo.theme.URLParser', ['$rootScope', '$location',
        function($rootScope, $location) {
            var urlParts = [];
            var urlParserService = {};

            //we want to update the parts only when a route is actually changed
            //as $location.path() will get updated immediately (even if route change fails!)
            $rootScope.$on('$stateChangeSuccess', function(event, current) {
                var pathElements = $location.path().split('/'),
                    result = [],
                    i;
                var partPath = function(index) {
                    return '/' + (pathElements.slice(0, index + 1)).join('/');
                };

                pathElements.shift();
                for (i = 0; i < pathElements.length; i++) {
                    result.push({
                        name: pathElements[i],
                        path: partPath(i)
                    });
                }

                urlParts = result;
            });

            /**
             * @ngdoc method
             * @name hippo.theme#getAll
             * @methodOf hippo.theme.service:URLParser
             *
             * @description
             * Get all the URL parts
             *
             * @returns {Array} List of URL parts
             */
            urlParserService.getAll = function() {
                return urlParts;
            };

            /**
             * @ngdoc method
             * @name hippo.theme#getFirst
             * @methodOf hippo.theme.service:URLParser
             *
             * @description
             * Get the first part of the URL
             *
             * @returns {String} The first part of the URL
             */
            urlParserService.getFirst = function() {
                return urlParts[0] || {};
            };

            /**
             * @ngdoc method
             * @name hippo.theme#getAllWithoutLast
             * @methodOf hippo.theme.service:URLParser
             *
             * @description
             * Get all the URL parts without the last part. This can be useful when the last part is an id that you don't want to use.
             *
             * @returns {Array} List of URL parts, without the last part
             */
            urlParserService.getAllWithoutLast = function() {
                var tmp = urlParts.slice(0);
                tmp.pop();
                return tmp;
            };

            /**
             * @ngdoc method
             * @name hippo.theme#getParent
             * @methodOf hippo.theme.service:URLParser
             *
             * @description
             * Get the parent / previous state of the current view
             *
             * @returns {String} The state name for the parent / previous view
             */
            urlParserService.getParent = function() {
                return urlParts[urlParts.length - 2] || null;
            };

            return urlParserService;
        }
    ]);
}());

(function () {
    'use strict';

    angular.module('hippo.theme')

        /**
         * @ngdoc directive
         * @name hippo.theme.directive:tree
         * @restrict A
         *
         * @description
         * Tree component for the Hippo Theme based on [NestedSortable](https://github.com/JimLiu/Angular-NestedSortable).
         *
         * @param {array} items The items to use for the Tree. Each item is an object with `title` (String) and `items` (Array) property.
         * @param {Object} selectedItemId The id of the item that should be marked as selected.
         * @param {callbacks} callbacks The available callbacks. A list of all available callbacks is available at
         * the [Hippo Theme demo](http://onehippo.github.io/hippo-theme-demo/) page.
         */
        .directive('hippo.theme.tree', ['$compile', '$templateCache', function($compile, $templateCache) {
            $templateCache.put('hippo.theme.tree.include', ''
                + '<div ui-tree-handle>'
                + '  <div hippo.theme.tree.template></div>'
                + '</div>'
                + '<ol ui-tree-nodes ng-model="item.items" ng-show="!collapsed">'
                + '  <li ng-repeat="item in item.items" ui-tree-node ng-include="\'hippo.theme.tree.include\'" data-ng-class="{active: selectedItemId === item.id}"'
                + '      data-collapsed="item.collapsed"></li>'
                + '</ol>'
            );

            return {
                restrict: 'A',
                transclude: true,
                scope: {
                    treeItems: '=items',
                    options: '=callbacks',
                    selectedItemId: '='
                },
                template: ''
                    + '<div id="uiTreeId" ui-tree="options">'
                    + '  <ol ui-tree-nodes ng-model="treeItems">'
                    + '    <li ng-repeat="item in treeItems" ui-tree-node ng-include="\'hippo.theme.tree.include\'" data-ng-class="{active: selectedItemId === item.id}"'
                    + '        data-collapsed="item.collapsed"></li>'
                    + '  </ol>'
                    + '</div>',
                controller: 'hippo.theme.tree.TreeCtrl'
            };
        }])

        .controller('hippo.theme.tree.TreeCtrl', ['$transclude', '$scope', function($transclude, $scope) {
            this.renderTreeTemplate = $transclude;

            function collectNodes(items, map) {
                _.each(items, function(item) {
                    map[item.id] = item;
                    collectNodes(item.items, map);
                });
                return map;
            }

            function copyCollapsedState(srcNodes, targetNodes) {
                _.each(srcNodes, function(srcNode) {
                    var targetNode = targetNodes[srcNode.id];
                    if (targetNode) {
                        targetNode.collapsed = srcNode.collapsed;
                    }
                });
            }

            $scope.toggleItem = function() {
                this.toggle();
                this.$modelValue.collapsed = !this.$modelValue.collapsed;
            };

            $scope.$watch('treeItems', function(newItems, oldItems) {
                var oldNodes = collectNodes(oldItems, {}),
                    newNodes = collectNodes(newItems, {});
                copyCollapsedState(oldNodes, newNodes);
            });
        }])

        .directive('hippo.theme.tree.template', function() {
            return {
                require: '^hippo.theme.tree',
                link: function(scope, element, attrs, controller) {
                    controller.renderTreeTemplate(scope, function(dom) {
                        element.replaceWith(dom);
                    });
                }
            };
        });

})();

(function () {
    "use strict";

    angular.module('hippo.theme')

        /**
         * @ngdoc directive
         * @name hippo.theme.directive:confirmationDialog
         * @restrict A
         * @scope
         *
         * @param {string} confirmIcon The name of a FontAwesome icon to show, without the fa-* prefix
         * @param {string} confirmLabel The label to show for the confirmation button
         * @param {string} cancelLabel The label to show for the cancel link
         * @param {expression} performConfirmation Function to call when the confirm button is clicked.
         * @param {expression} performCancel Function to call when the cancel button is clicked.
         * @param {boolean} show Will set the .s-invisible or .s-visible class on the element.
         *
         * @description
         * Renders a confirmation dialog that can show any message and provides a confirm- and cancel button.
         * It has two states, `s-visible` and `s-invisible`, which are represented by CSS-classes.
         * The CSS property `top` will animate when the value is changed in CSS.
         *
         * *Note*: the confirmation dialog won't show or hide itself. You can do this easily by assigning the desired
         * CSS properties for the `.s-visible` and `.s-invisible` classes in your own CSS.
         */
        .directive('hippo.theme.confirmationDialog', [function () {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '' +
                    '<div class="alert alert-warning confirmation-dialog" data-ng-class="{\'s-visible\': show, \'s-invisible\': !show}">' +
                        '<div ng-transclude></div>' +
                        '<p class="text-right buttons">' +
                            '<button class="btn btn-default" data-ng-click="performConfirmation()">' +
                                '<i class="fa fa-{{ confirmIcon }}" data-ng-show="confirmIcon"></i> {{ confirmLabel }}' +
                            '</button>' +
                            '&nbsp;&nbsp;' +
                            '<button class="btn btn-default" data-ng-click="performCancel()">' +
                                '{{ cancelLabel }}' +
                            '</button>' +
                        '</p>' +
                    '</div>',
                scope: {
                    confirmIcon: '@',
                    confirmLabel: '@',
                    cancelLabel: '@',
                    performConfirmation: '&',
                    performCancel: '&',
                    show: '='
                },
                link: function (scope, elem, attrs) {

                }
            };
        }]);
})();

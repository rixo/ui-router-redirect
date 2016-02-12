angular.module('rx.ui-router-redirect', [
  'ui.router'
]).run(function($rootScope, $state, $injector) {
    'use strict';
    /* eslint-disable angular/on-watch */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      var redirectTo = toState.redirectTo;

      if (redirectTo) {
        event.preventDefault();

        if (typeof redirectTo === 'function') {
          redirectTo = $injector.invoke(redirectTo, toState, {
            $params: toParams
          });
          if (redirectTo.then) {
            redirectTo.then(go);
          } else {
            go(redirectTo);
          }
        } else {
          go(redirectTo);
        }
      }

      function go(state) {
        if (Array.isArray(state)) {
          $state.go.apply($state, state);
        } else {
          $state.go(state, toParams);
        }
      }
    });
  }).config(function($stateProvider) {
    $stateProvider.alias = function(alias, state) {
      return $stateProvider.state(alias, {
        redirectTo: state
      });
    }
  })
;

'use strict';

/**
 * @ngdoc service
 * @name oasApp.USERROLES
 * @description
 * # USERROLES
 * Constant in the oasApp.
 */
angular.module('oasApp')
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    user: 'user'
  });

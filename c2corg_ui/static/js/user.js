goog.provide('app.UserController');
goog.provide('app.userDirective');

goog.require('app');
goog.require('app.Alerts');
goog.require('ngeo.Location');
goog.require('app.utils');


/**
 * This directive is used to display the user tools if authenticated or
 * the sign up button if not.
 *
 * @return {angular.Directive} The directive specs.
 * @ngInject
 */
app.userDirective = function() {
  return {
    restrict: 'E',
    controller: 'AppUserController',
    controllerAs: 'userCtrl',
    bindToController: true,
    templateUrl: '/static/partials/user.html'
  };
};

app.module.directive('appUser', app.userDirective);


/**
 * @param {app.Authentication} appAuthentication
 * @param {ngeo.Location} ngeoLocation ngeo Location service.
 * @param {app.Alerts} appAlerts
 * @param {app.Api} appApi
 * @param {string} authUrl Base URL of the authentication page.
 * @param {function(string):string} gettext Marker function provided
 *   by angular-gettext.
 * @constructor
 * @export
 * @ngInject
 */
app.UserController = function(appAuthentication, ngeoLocation,
    appAlerts, appApi, authUrl, gettext) {

  /**
   * @type {app.Authentication}
   * @export
   */
  this.auth = appAuthentication;

  /**
   * @type {app.Api}
   * @private
   */
  this.api_ = appApi;

  /**
   * @type {string}
   * @private
   */
  this.authUrl_ = authUrl;

  /**
   * @type {ngeo.Location}
   * @private
   */
  this.ngeoLocation_ = ngeoLocation;

  /**
   * @type {app.Alerts}
   * @private
   */
  this.alerts_ = appAlerts;

  /**
   * @type {function(string):string}
   * @private
   */
  this.gettext = gettext;

  if (this.ngeoLocation_.hasParam('logout')) {
    // Logout from API by removing User data
    this.auth.removeUserData();
  }
};


/**
 * @export
 */
app.UserController.prototype.showLogin = function() {
  app.utils.redirectToLogin(this.authUrl_);
};


/**
 * @export
 */
app.UserController.prototype.logout = function() {
  this.api_.logoutFromApiAndDiscourse().then(function() {
    this.alerts_.addSuccess(this.gettext('You have been disconnected'));
  }.bind(this)).finally(function() {
    this.auth.removeUserData();
    var path = this.ngeoLocation_.getPath();
    if (path.indexOf('/edit/') !== -1 || path.indexOf('/account') !== -1) {
      // The user is editing a document or viewing the account configuration.
      // Going to the authentication page.
      this.showLogin();
    }
  }.bind(this));
};


/**
 * @param {string} doctype
 * @param {Object} options
 * @return {boolean}
 * @export
 */
app.UserController.prototype.hasEditRights = function(doctype, options) {
  return this.auth.hasEditRights(doctype, options);
};

app.module.controller('AppUserController', app.UserController);

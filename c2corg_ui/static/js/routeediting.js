goog.provide('app.RouteEditingController');

goog.require('app');
goog.require('app.DocumentEditingController');
goog.require('app.Alerts');
goog.require('app.Document');
goog.require('app.Lang');


/**
 * @param {!angular.Scope} $scope Scope.
 * @param {angular.JQLite} $element Element.
 * @param {angular.Attributes} $attrs Attributes.
 * @param {angular.$http} $http
 * @param {Object} $uibModal modal from angular bootstrap.
 * @param {angular.$compile} $compile Angular compile service.
 * @param {app.Lang} appLang Lang service.
 * @param {app.Authentication} appAuthentication
 * @param {ngeo.Location} ngeoLocation ngeo Location service.
 * @param {app.Alerts} appAlerts
 * @param {app.Api} appApi Api service.
 * @param {string} authUrl Base URL of the authentication page.
 * @param {app.Document} appDocument
 * @param {app.Url} appUrl URL service.
 * @param {!string} imageUrl URL to the image backend.
 * @constructor
 * @extends {app.DocumentEditingController}
 * @ngInject
 * @export
 */
app.RouteEditingController = function($scope, $element, $attrs, $http,
    $uibModal, $compile, appLang, appAuthentication, ngeoLocation, appAlerts,
    appApi, authUrl, appDocument, appUrl, imageUrl) {

  goog.base(this, $scope, $element, $attrs, $http, $uibModal, $compile,
    appLang, appAuthentication, ngeoLocation, appAlerts, appApi, authUrl,
    appDocument, appUrl, imageUrl);

  if (this.auth.isAuthenticated()) {
    // allow association only for a new route to existing waypoint
    if (ngeoLocation.hasFragmentParam('w')) {
      var waypointId = parseInt(ngeoLocation.getFragmentParam('w'), 10);
      appApi.getDocumentByIdAndDoctype(waypointId, 'w', appLang.getLang()).then(function(doc) {
        this.documentService.pushToAssociations(doc.data['waypoints'].documents[0], 'waypoints', true);
      }.bind(this));
    }
  }
};
goog.inherits(app.RouteEditingController, app.DocumentEditingController);


app.module.controller('appRouteEditingController', app.RouteEditingController);

(function() {
    'use strict';

    var EyesUtils = require('eyes.utils');
    var PositionProvider = EyesUtils.PositionProvider,
        BrowserUtils = EyesUtils.BrowserUtils,
        ArgumentGuard = EyesUtils.ArgumentGuard;

    /**
     * @constructor
     * @param {Logger} logger A Logger instance.
     * @param {EyesWebDriver} executor
     * @param {PromiseFactory} promiseFactory
     * @augments PositionProvider
     */
    function ScrollPositionProvider(logger, executor, promiseFactory) {
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(executor, "executor");

        this._logger = logger;
        this._driver = executor;
        this._promiseFactory = promiseFactory;
    }

    ScrollPositionProvider.prototype = new PositionProvider();
    ScrollPositionProvider.prototype.constructor = ScrollPositionProvider;

    /**
     * @returns {Promise<{x: number, y: number}>} The scroll position of the current frame.
     */
    ScrollPositionProvider.prototype.getCurrentPosition = function () {
        var that = this;
        that._logger.verbose("getCurrentScrollPosition()");
        return BrowserUtils.getCurrentScrollPosition(this._driver, this._promiseFactory).then(function (result) {
            that._logger.verbose("Current position: ", result);
            return result;
        });
    };

    /**
     * Go to the specified location.
     * @param {{x: number, y: number}} location The position to scroll to.
     * @returns {Promise<void>}
     */
    ScrollPositionProvider.prototype.setPosition = function (location) {
        var that = this;
        that._logger.verbose("Scrolling to:", location);
        return BrowserUtils.scrollTo(this._driver, location, this._promiseFactory).then(function () {
            that._logger.verbose("Done scrolling!");
        });
    };

    /**
     * @returns {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
     */
    ScrollPositionProvider.prototype.getEntireSize = function () {
        var that = this;
        return BrowserUtils.getEntirePageSize(this._driver, this._promiseFactory).then(function (result) {
            that._logger.verbose("Entire size: ", result);
            return result;
        });
    };

    /**
     * @returns {Promise<{x: number, y: number}>}
     */
    ScrollPositionProvider.prototype.getState = function () {
        return this.getCurrentPosition();
    };

    /**
     * @param {{x: number, y: number}} state The initial state of position
     * @returns {Promise<void>}
     */
    ScrollPositionProvider.prototype.restoreState = function (state) {
        var that = this;
        return this.setPosition(state).then(function () {
            that._logger.verbose("Position restored.");
        });
    };

    module.exports = ScrollPositionProvider;
}());
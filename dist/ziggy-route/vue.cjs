/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
'use strict';

var chunk7LH2HYNO_cjs = require('../chunk-7LH2HYNO.cjs');
require('../chunk-4M7PUXSA.cjs');

var rzlZiggyVue = {
  /** -------------------------------------------------------
   * * ***Rzl **Ziggy Route** Install Route to Vue.***
   * -------------------------------------------------------
   */
  install: function(app, options) {
    function rt(name, params, absolute) {
      return chunk7LH2HYNO_cjs.route(name, params, absolute, options);
    }
    if (parseInt(app.version) > 2) {
      app.config.globalProperties.route = rt;
      app.provide("route", rt);
    } else {
      app.mixin({
        methods: {
          route: rt
        }
      });
    }
  }
};

exports.rzlZiggyVue = rzlZiggyVue;

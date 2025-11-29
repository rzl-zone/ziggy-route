/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
import { route } from '../chunk-FY7J5NOI.esm.js';
import '../chunk-IWMGSFDN.esm.js';

var rzlZiggyVue = {
  /** -------------------------------------------------------
   * * ***Rzl **Ziggy Route** Install Route to Vue.***
   * -------------------------------------------------------
   */
  install: function(app, options) {
    function rt(name, params, absolute) {
      return route(name, params, absolute, options);
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

export { rzlZiggyVue };

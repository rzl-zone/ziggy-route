/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.13.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
import { App, ComponentOptions } from 'vue';
import { C as Config } from '../index-BWEFzAgA.js';

interface Vue2CompatApp {
    version: string;
    mixin: (m: ComponentOptions) => void;
    [key: string]: any;
}
type VueApp = App | Vue2CompatApp;
/** -------------------------------------------------------
 * * ***Vue Plugin of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 * **Rzl **Ziggy Route** includes a Vue plugin to make it easy to use the `route()` helper throughout your Vue app.**
 *
 * @see [**More docs use with **Vue****](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#vue)
 */
declare const rzlZiggyVue: {
    /** -------------------------------------------------------
     * * ***Rzl **Ziggy Route** Install Route to Vue.***
     * -------------------------------------------------------
     */
    install: (app: VueApp, options?: Config) => void;
};

export { rzlZiggyVue };

import{App,ComponentOptions}from 'vue';import{C as Config}from './index-tPLl8Qcg.js';interface Vue2CompatApp{version:string;mixin:(m:ComponentOptions)=>void;[key:string]:any;}type VueApp=App | Vue2CompatApp;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's Vue Plugin.***
 * -------------------------------------------------------
 *
 * Rzl Ziggy includes a Vue plugin to make it easy to use the route() helper throughout your Vue app:
 *
 * @see [More docs use with vue: #Rzl Ziggy Vue.](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#vue)
 */
declare const rzlZiggyVue:{
/** -------------------------------------------------------
     * * ***Rzl Ziggy's Install Route to Vue.***
     * -------------------------------------------------------
     */
install:(app:VueApp,options?:Config)=>void;};export{rzlZiggyVue};
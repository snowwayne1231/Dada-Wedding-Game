// Import Vue
import Vue from 'vue';

// Import F7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

Framework7.use(Framework7Vue);

// Import Icons and App Custom Styles
// import IconsStyles from './css/icons.css';
import AppStyles from './css/app.css';
import AppStylus from './css/app.styl';

// Import App Component
import App from './app.vue';
import store from './store';

// Init App
new Vue({
  el: '#app',
  template: '<app/>',

  // Register App Component
  components: {
    app: App
  },
  store,
});

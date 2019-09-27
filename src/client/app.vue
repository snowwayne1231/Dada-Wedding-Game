<template>
  <!-- App -->
  <f7-app :params="f7params">

    <!-- Left Panel -->
    <!-- <f7-panel left reveal theme-dark>
        <leftPanel>
        </leftPanel>
    </f7-panel> -->

    <!-- Main View -->
    <f7-view id="main-view" url="/" main class="safe-areas"></f7-view>

  </f7-app>
</template>

<script>
// Import Routes
import routes from './routes.js';
import leftPanel from './pages/panel-left';

export default {
    data() {
        return {
            // Framework7 parameters here
            f7params: {
                id: 'io.framework7.yoda', // App bundle ID
                name: 'Yoda', // App name
                theme: 'auto', // Automatic theme detection
                // App routes
                routes: routes,
                view: {
                    pushState: true,
                }
            },
        }
    },
    mounted() {
        this.$store.dispatch('GET_QUESTIONS');
    },
    components: {
        leftPanel,
    },
}
</script>

<template>
  <f7-page>
    <f7-navbar>
      <!-- <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left> -->
      <f7-nav-title>Master YODA</f7-nav-title>
    </f7-navbar>

    <f7-block strong>
        <p>Hi {{name}}</p>
        <p>Welcome to our wedding, please feel free in this pleasure moment.</p>
    </f7-block>
    <f7-block-title>games</f7-block-title>
    <f7-list>
      <f7-list-item link="/puzzle/" title="猜謎"></f7-list-item>
      <f7-list-item link="/bingo/" title="賓果"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {

        };
    },
    computed: {
        ...mapState(['name']),
    },
    mounted() {

        this.$store.dispatch('SET_NAME');
    },
}
</script>

<template>
  <div class="left-panel">
    <f7-block-title>Load page in panel</f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About"></f7-list-item>
      <f7-list-item link="/form/" title="Form"></f7-list-item>
    </f7-list>
    <f7-block-title>Load page in main view</f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About" view="#main-view" panel-close></f7-list-item>
      <f7-list-item link="/form/" title="Form" view="#main-view" panel-close></f7-list-item>
    </f7-list>
  </div>
</template>
<script>
export default {}
</script>

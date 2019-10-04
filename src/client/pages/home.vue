<template>
  <f7-page>
    <f7-navbar>
      <!-- <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left> -->
      <f7-nav-title>YODA大師的婚禮</f7-nav-title>
    </f7-navbar>

    <f7-block>
        <p>Hi</p>
        <p>Welcome to our wedding, please feel free in this pleasure moment.</p>
    </f7-block>
    <f7-block-title>您的資料</f7-block-title>
    <f7-list class="home-list">
        <f7-list-input
            label="名字"
            type="text"
            placeholder="您的大名.."
            clear-button
            :value="inname"
            @input="inname = $event.target.value.substr(0,8)"
        >
        </f7-list-input>

        <f7-list-input
            label="桌號"
            type="tel"
            placeholder="您的桌號.."
            clear-button
            :value="showTable"
            @input="table = Math.min(parseInt($event.target.value, 10), 3000)"
        >
        </f7-list-input>

        <f7-list-input
            label="想說的話"
            type="text"
            placeholder="您想對新人說的話.."
            clear-button
            :value="say"
            @input="say = $event.target.value.substr(0, 31)"
        >
        </f7-list-input>
    </f7-list>
    <f7-button fill round @click="onClickOk">儲存</f7-button>
    <f7-block-title v-if="canShowQuestion">猜謎</f7-block-title>
    <f7-list v-if="canShowQuestion">
      <f7-list-item link="/puzzle/" title="主持人示範"></f7-list-item>
      <f7-list-item link="/puzzle/2/" title="YODA猜謎"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {inname: '', table: 0, say: ''};
    },
    computed: {
        ...mapState(['name']),
        showTable(self) {
            return self.table > 0 ? self.table : '';
        },
        canShowQuestion(self) {
            return !!self.name;
        },
    },
    mounted() {

        // this.$store.dispatch('SET_NAME');
        this.loadLocally();
    },
    methods: {
        onClickOk() {
            this.$store.dispatch('SET_NAME', {
                name: this.inname,
                table: this.table,
                say: this.say,
            });
            this.saveLocally();
            // window.alert('儲存成功');
            // this.$f7
            this.$f7.dialog.alert('儲存成功', '系統提示');
        },
        saveLocally() {
            window.localStorage.setItem('_yoda_tmp', JSON.stringify({
                name: this.inname,
                table: this.table,
                say: this.say,
            }));
        },
        loadLocally() {
            var data = window.localStorage.getItem('_yoda_tmp');
            if (data) {
                var jsondata = JSON.parse(data);
                if (jsondata && jsondata.name) {
                    this.inname = jsondata.name;
                    this.table = jsondata.table;
                    this.say = jsondata.say;

                    this.$store.dispatch('SET_NAME', {
                        name: this.inname,
                        table: this.table,
                        say: this.say,
                    });
                }
            }
        },
    },
}
</script>

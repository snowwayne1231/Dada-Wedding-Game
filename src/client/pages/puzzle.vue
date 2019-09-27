<template>
  <f7-page id="puzzle">
    <f7-navbar title="猜謎嚕" back-link="返回"></f7-navbar>
    <div v-if="canShow" :class="{animation: true}">
        <f7-block-title>第 {{nowRound}} 題: <br/>{{question.headline}}</f7-block-title>
        <f7-list>
            <f7-list-item v-for="(opt, idx) in options" :key="idx" :title="opt"></f7-list-item>
        </f7-list>
        <f7-button :outline="true">確定答案</f7-button>
    </div>
    <div v-else>
        <f7-block-title>尚未開始猜謎, 請等待大會開啟 </f7-block-title>
    </div>


  </f7-page>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            timeSpendMs: 0,
        };
    },
    computed: {
        ...mapState(['questions', 'showing_question']),
        question(self) {
            return self.questions[self.showing_question] || {};
        },
        options(self) {
            return self.question.options || [];
        },
        canShow(self) {
            return self.showing_question >= 0;
        },
        nowRound(self) {
            return self.showing_question + 1;
        }
    },
    mounted() {
        console.log('puzzle', this);
    },
}
</script>

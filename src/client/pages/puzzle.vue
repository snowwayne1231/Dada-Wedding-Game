<template>
  <f7-page id="puzzle">
    <f7-navbar :title="sessionTitle" back-link="返回"></f7-navbar>
    <div v-if="canShow" :class="{animation: true, answered: answered, isright: isRight}">
        <!-- <div><input id="puzzle-interval-timer" type="text" readonly /><div> -->
        <f7-block-title>第 {{nowRound}} 題: <br/>{{question.headline}}</f7-block-title>
        <f7-list>
            <f7-list-item v-for="(opt, idx) in options" :key="idx" :title="opt" @click="onClickOption(idx)" class="option" :class="{picking: pickingOption == idx, answer: answer == idx}"></f7-list-item>
        </f7-list>
        <f7-button :class="{hide: answered}" :outline="true" @click="onClickAnswering"><span>確定答案</span></f7-button>
        <f7-block-title v-if="answered">{{spendTime}}秒</f7-block-title>
    </div>
    <div v-else>
        <f7-block-title> 猜謎目前關閉中, 請等待大會開啟 </f7-block-title>
    </div>

  </f7-page>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            timeSpendMs: 0,
            pickingOption: -1,
            answer: -1,
        };
    },
    computed: {
        ...mapState(['name', 'questions', 'answers', 'opening']),
        session(self) {
            return self.$f7route.path.match(/puzzle.2./g) ? 1 : 0;
        },
        sessionTitle(self) {
            return self.session == 0 ? '猜謎[首場]' : '猜謎[中場]';
        },
        thisQuestions(self) {
            return self.questions[self.session] || [];
        },
        question(self) {
            return self.thisQuestions[self.opening.question] || {};
        },
        options(self) {
            return self.question.options || [];
        },
        canShow(self) {
            return self.opening.session == self.session && self.options.length > 0;
        },
        nowRound(self) {
            if (this._tmp_question != self.opening.question) {
                this.answer = -1;
            }
            this._tmp_question = self.opening.question;
            return self.opening.question + 1;
        },
        answered(self) {
            return self.answer >= 0;
        },
        isRight(self) {
            return self.answer == self.question.answer;
        },
        spendTime(self) {
            return self.answered
                ? (self.answers[self.opening.session][self.opening.question].t) / 1000
                : 0;
        },
    },
    mounted() {
        console.log('puzzle', this);
        this.$store.dispatch('GET_OPENING');
        if (!this.name) {
            this.$store.dispatch('SET_NAME');
        }
        // this.startInterval();
    },
    methods: {
        startInterval() {
            if (this._timer) { window.clearInterval(this._timer); }
            this._timer = window.setInterval(this.interval, 100);
        },
        interval() {
            var dom = document.getElementById('puzzle-interval-timer');
            if (dom && this.opening.starttime) {
                dom.value = new Date().getTime() - this.opening.starttime;
            }
        },
        onClickOption(idx) {
            if (this.answer >= 0) {

            } else {
                this.pickingOption = idx;
            }
        },
        onClickAnswering() {
            if (this.answered) {return;}
            if (this.pickingOption < 0) {return;}

            this.answer = this.pickingOption;
            this.pickingOption = -1;

            this.$store.dispatch('ANSWERING', this.answer);
        },
    },
    beforeDestroy() {
        if (this._timer) { window.clearInterval(this._timer); }
    },
}
</script>

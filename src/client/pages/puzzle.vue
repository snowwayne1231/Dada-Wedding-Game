<template>
  <f7-page id="puzzle">
    <f7-navbar :title="sessionTitle" back-link="返回"></f7-navbar>
    <div v-if="canShow" class="animation" :class="{answered: answered, isright: isRight}">
        <!-- <div><input id="puzzle-interval-timer" type="text" readonly /><div> -->
        <f7-block-title class="headline">第 {{nowRound}} 題: <br/>{{question.headline}}</f7-block-title>
        <f7-list :class="{hasimg: hasOptionImage}">
            <f7-list-item v-for="(opt, idx) in options" :key="idx" :title="opt" @click="onClickOption(idx)" class="option" :class="{picking: pickingOption == idx, answer: answer == idx}">
                <img v-if="hasOptionImage" :src="optionImages[idx]" class="option-image" />
            </f7-list-item>
        </f7-list>
        <f7-block-title v-if="answered">停止作答!</f7-block-title>
        <f7-button :class="{hide: answered}" :outline="true" @click="onClickAnswering"><span>確定答案</span></f7-button>
        <div v-if="!answered" class="loading-bar"><div id="loading-bar-inner" class="bar"></div></div>
    </div>
    <div v-else class="animation">
        <f7-block-title> 猜謎目前關閉中, 請等待大會開啟 </f7-block-title>
    </div>

  </f7-page>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            maxMSecond: 8000,
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
            return self.session == 0 ? '範例' : 'YODA猜謎';
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
        optionImages(self) {
            return self.question.options_img || [];
        },
        hasOptionImage(self) {
            return self.optionImages.length > 0;
        },
        canShow(self) {
            return self.opening.session == self.session && self.options.length > 0;
        },
        nowRound(self) {
            if (self._tmp_question != self.opening.question) {
                self.answer = -1;
                self._delay_timer = window.setTimeout(self.doWhenTimeEnd, self.maxMSecond);
            }
            self._tmp_question = self.opening.question;
            return self.opening.question + 1;
        },
        answered(self) {
            return self.answer >= 0;
        },
        isRight(self) {
            return self.answer == self.question.answer;
        },
        // spendTime(self) {
        //     return self.answered
        //         ? (self.answers[self.opening.session][self.opening.question].t) / 1000
        //         : 0;
        // },
    },
    mounted() {
        if (!this.name) {
            window.alert('未登錄個人資料');
            location.href = '/';
            return;
        }
        console.log('puzzle', this);
        this.$store.dispatch('GET_OPENING');
        // this.startInterval();

        var anss = this.answers;
        var oping = this.opening;
        if (anss && anss[oping.session] && anss[oping.session][oping.question] && anss[oping.session][oping.question].a != -1) {
            this.answer = anss[oping.session][oping.question].a || -1;
        }
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
            if (this._delay_timer) {
                window.clearTimeout(this._delay_timer);
            }
        },
        doWhenTimeEnd() {
            if (this.answer >= 0) {return;}
            this.answer = this.pickingOption >= 0 ? this.pickingOption : 9;
            this.pickingOption = -1;
            this._delay_timer = null;
            this.$store.dispatch('ANSWERING', this.answer);
        },
    },
    beforeDestroy() {
        if (this._delay_timer) {
            window.clearTimeout(this._delay_timer);
        }
    },
}
</script>

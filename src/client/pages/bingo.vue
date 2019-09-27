<template>
  <f7-page id="bingo">
    <f7-navbar title="賓果" back-link="返回"></f7-navbar>
    <f7-block-title>賓果遊戲</f7-block-title>
    <a id="bingo-selector" class="smart-select" data-open-in="popover" v-on:smartselect:closed="onSelectorClosed" ref="bingo-selector">
        <select name="superhero" v-model="nowSelected" @change="onSelectorChange">
            <option v-for="n in selectorOps" :key ="n" :value="n" :selected="nowSelected == n">{{n}}</option>
        </select>
    </a>
    <f7-block strong class="full">
        <div class="bingo-grid">
            <div v-for="(y, idx) in gridShape" :key="idx" class="grid-y">
                <div v-for="(x, xidx) in y" :key="xidx" class="grid-x">
                    <span v-if="x >= 0">{{x}}</span>
                    <span v-else class="grid-choice" @click="onClickChoice(idx, xidx)">選擇</span>
                </div>
            </div>
        </div>
    </f7-block>


  </f7-page>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            x: 5,
            y: 5,
            gridShape: [],
            nowSelected: -1,
        };
    },
    computed: {
        ...mapState(['questions']),
        selectorOps(self) {
            const ary = self.gridShape.flat();
            const allExist = ary.filter(e => e > 0);
            const max = self.x * self.y;
            return new Array(max).fill(0).map((e, i) => i + 1).filter(e => !allExist.includes(e));
        },
    },
    mounted() {
        console.log('bingo', this);
        this.gridShape = new Array(this.y).fill(0).map(e => {
            return new Array(this.x).fill(-1);
        });
    },
    methods: {
        onClickChoice(y,x) {
            // console.log(y,x);
            this._y = y;
            this._x = x;
            this.$refs['bingo-selector'].click();
        },
        onSelectorClosed(evt) {
            // console.log('onSelectorClosed', this, evt);
            this.nowSelected = -1;
        },
        onSelectorChange(evt) {
            if (!this.nowSelected || this.nowSelected < 0) return;
            this.$f7.smartSelect.close(this.$refs['bingo-selector']);
            // console.log('onSelectorChange', this.nowSelected);
            this.gridShape[this._y][this._x] = parseInt(this.nowSelected, 10);
            this.gridShape = this.gridShape.filter(e => e);
        },
    },
}
</script>

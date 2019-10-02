import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const locate = 'ws://localhost:8080/';
const WS = newWsConnect();

const store = new Vuex.Store({
    state: {
        name: null,
        questions: [],
        answers: [],
        showing_question: 0,
        bingoMap: [],
    },
    getters: {

    },
    actions: {
        GET_QUESTIONS({state}) {
            WS.send({
                type: 'get_questions',
            });
        },
        SET_NAME({state, dispatch}) {
            if (state.name && state.name.length >= 2) {
                return;
            }
            const name = window.prompt('請輸入您的大名', '');
            if (!name || name.length < 2) {
                window.alert('請輸入兩個字以上');
                dispatch('SET_NAME');
            } else {
                WS.send({
                    type: 'name',
                    name,
                });
            }
        },
    },
    mutations: {
        'UPDATE:TYPE': (state, response) => {
            console.log('UPDATE:TYPE', response);
            switch (response.type) {
                case 'name':
                    state.name = response.payload.name;
                    state.answers = response.payload.answers;
                break;
                case 'get_questions':
                    state.questions = response.payload;
                    console.log('questions', state.questions);
                break;
            }
        }
    },
});





function newWsConnect(locate) {

    // const socket = io();

    const $self = {};
    // var ws = $self.socket = new WebSocket(locate);
    const ws = $self.socket = locate ? io(locate) : io();

    var _isWsOpening = false;
    // var _leftRetryTimes = 10;
    var _wsSendingQueue = [];

    ws.on('connect', wsOnOpen);
    ws.on('disconnect', wsOnClose);
    ws.on('message', wsOnMessage);
    $self.send = (obj) => wsSend(obj);

    return $self;

    function wsOnOpen() {
        _isWsOpening = true;
        if (_wsSendingQueue.length > 0) {
            _wsSendingQueue.map(obj => {
                wsSend(obj);
            });
            _wsSendingQueue = [];
        }
    }

    function wsOnClose() {
        _isWsOpening = false;
    }

    function wsSend(obj) {

        if (_isWsOpening) {
            console.log('wsSend', ws, obj, ws.connected);
            console.log('_isWsOpening', _isWsOpening);
            ws.emit('message', JSON.stringify(obj));
        } else {
            _wsSendingQueue.push(obj);
        }
    }

    function wsOnMessage(income) {
        try {
            const data = (typeof income === 'string')
                ? JSON.parse(income)
                : income;

            if (data.type == 'error') {
                data.msg && window.alert(data.msg);
            } else {
                store.commit('UPDATE:TYPE', data);
            }

            data.dispatch && store.dispatch(data.dispatch);

            console.log('wsOnMessage: ', data);
        } catch (err) {
            console.log('wsOnMessage Error: ', err);
        }
    }
}

export default store;

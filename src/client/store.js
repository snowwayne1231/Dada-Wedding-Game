import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const locate = 'ws://localhost:8080/';
const WS = newWsConnect(locate);

const store = new Vuex.Store({
    state: {
        name: null,
        questions: [],
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
                    state.name = response.payload;
                break;
                case 'get_questions':
                    state.questions = response.payload;
                break;
            }
        }
    },
});





function newWsConnect(locate) {

    const $self = {};
    var ws = $self.socket = new WebSocket(locate);
    $self.send = (obj) => wsSend(obj);
    var _isWsOpening = false;
    var _leftRetryTimes = 10;
    var _wsSendingQueue = [];

    ws.onopen = wsOnOpen;
    ws.onclose = wsOnClose;
    ws.onmessage = wsOnMessage;

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
        if ((_leftRetryTimes--) > 0) {
            console.log('websocket closed.. it will reconnect after 3 seconds.');
            window.setTimeout(() => {
                ws = new WebSocket(locate);
                ws.onopen = wsOnOpen;
                ws.onclose = wsOnClose;
                ws.onmessage = wsOnMessage;
            }, 3000);
        } else {
            window.alert('connect error please reload.');
            location.reload();
        }
    }

    function wsSend(obj) {
        if (_isWsOpening) {
            ws.send(JSON.stringify(obj));
        } else {
            _wsSendingQueue.push(obj);
        }
    }

    function wsOnMessage(evt) {

        try {
            const data = (typeof evt.data === 'string')
                ? JSON.parse(evt.data)
                : data;

            if (data.type == 'error') {
                data.msg && window.alert(data.msg);
                data.dispatch && store.dispatch(data.dispatch);
            } else {
                store.commit('UPDATE:TYPE', data);
            }
            console.log('wsOnMessage: ', data);
        } catch (err) {
            console.log('wsOnMessage Error: ', err);
        }
    }
}

export default store;

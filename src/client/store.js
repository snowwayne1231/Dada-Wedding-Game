// import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// const locate = 'ws://localhost:8080/';
const WS = newWsConnect();

const store = new Vuex.Store({
    state: {
        name: null,
        table: -1,
        say: '',
        questions: [],
        answers: [],
        opening: {
            session: -1,
            question: -1,
        },
    },
    getters: {

    },
    actions: {
        GET_QUESTIONS({state}) {
            WS.send({
                type: 'get_questions',
            });
        },
        GET_OPENING() {
            WS.send({
                type: 'get_opening',
            });
        },
        SET_NAME({state, dispatch}, {name, table, say}) {
            // if (state.name && state.name.length >= 1) {
            //     return;
            // }

            WS.send({
                type: 'name',
                name,
                table,
                say,
            });
        },
        ANSWERING({state}, answer) {
            WS.send({
                type: 'answering',
                answer,
            });
        },
    },
    mutations: {
        'UPDATE:TYPE': (state, response) => {
            // console.log('UPDATE:TYPE', response);
            switch (response.type) {
                case 'name':
                    state.name = response.payload.name;
                    state.answers = response.payload.answers;
                    state.table = response.payload.table;
                    state.say = response.payload.say;
                break;
                case 'get_questions':
                    state.questions = response.payload;
                    // console.log('questions', state.questions);
                break;
                case 'get_opening':
                    state.opening = response.payload;
                    // console.log('opening', state.opening);
                break;
                case 'answering':
                    state.answers = response.payload;
                break;
                default:
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

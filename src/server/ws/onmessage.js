'use strict';

const fs = require('fs');
const questions = JSON.parse(fs.readFileSync(__dirname + '/../json/questions.json', 'utf8'));
const nameMapData = {};
const opening = {
    session: 0,
    question: -1,
    starttime: new Date().getTime(),
};
const ends = [];

function onmessage(ws, clients, msg) {
    console.log('onmessage received: %s', msg);
    var incomeData = {};
    try {
        incomeData = JSON.parse(msg);
    } catch (err) {
        incomeData.error = err.message;
    }

    switch (incomeData.type) {
        case 'get_questions':
            emit(questions);
            break;
        case 'get_opening':
            emit(opening);
            break;
        case 'get_admin':
            emit({
                opening,
                questions,
                ends,
                map: nameMapData,
            });
            break;
        case 'change_opening':
            var nextSession = parseInt(incomeData.session, 10);
            var nextQuestion = parseInt(incomeData.question, 10);
            if (nextQuestion==-1) {

            } else if (isNaN(nextSession) || isNaN(nextQuestion) || (!questions[nextSession] || !questions[nextSession][nextQuestion])) {
                emit({error: '錯誤的題目號'});
                break;
            }

            if(opening.session >= 0 && opening.question >= 0) {
                var endTimeObject = {
                    s: opening.session,
                    q: opening.question,
                    st: opening.starttime,
                    ed: new Date().getTime(),
                };
                var qidx = ends.findIndex(e => e.s == endTimeObject.s && e.q == endTimeObject.q);
                if (qidx >= 0) {
                    ends[qidx] = endTimeObject;
                } else {
                    ends.push(endTimeObject);
                }
            }

            opening.starttime = new Date().getTime();
            opening.session = nextSession;
            opening.question = nextQuestion;

            // console.log('change_opening', opening);

            broadcast({
                type: 'get_opening',
                payload: opening,
            });
            break;
        case 'name':
            var name = incomeData.name;
            var data = nameMapData[name];
            var isDoubleNaming = !!data;
            var address = ws.handshake ? (ws.handshake.address || '::WiFi') : 'none';
            if (isDoubleNaming) {
                if (data.address == address) {
                    // is self
                    ws.name = name;
                    emit(data);
                } else {
                    emit({error: '名稱與他人重復, 請重新輸入其他名稱', dispatch: 'SET_NAME'});
                }

            } else {
                var newAnswers = questions.map((q) => new Array(q.length).fill(0).map(e => {return {a:-1, t:0}}));
                var newDate = {name, address, answers: newAnswers};
                nameMapData[name] = newDate;
                ws.name = name;
                emit(newDate);
            }
            break;
        case 'answering':
            var name = ws.name;
            var data = nameMapData[name];
            var ans = parseInt(incomeData.answer, 10);

            if (data) {
                if (ans>=0) {
                    if (data.answers && data.answers[opening.session] && data.answers[opening.session][opening.question]) {
                        data.answers[opening.session][opening.question].a = ans;
                        data.answers[opening.session][opening.question].t = new Date().getTime() - opening.starttime;
                        emit(data.answers);
                    } else {
                        emit({error: '題號資料錯誤'});
                    }
                } else {
                    emit({error: '輸入錯誤'});
                }
            } else {
                emit({error: '名稱未記錄'});
            }
            break;
        default:

    }

    if (incomeData.error) { emit(incomeData); }

    return incomeData;


    function emit(data) {
        if (data.error) {
            return ws.emit('message', returnError(data.error, data.dispatch));
        } else {
            return ws.emit('message', returnPayload(data));
        }
    }

    function returnPayload(data) {
        return {
            type: incomeData.type,
            payload: data,
        };
    }

    function returnError(msg = '', dispatch = null) {
        return {
            type: 'error',
            msg,
            dispatch,
        };
    }

    function broadcast(data) {
        ws.broadcast.emit('message', data);
    }
}


function getMap() {
    return nameMapData;
}



module.exports = {
    onmessage,
    getMap,
}

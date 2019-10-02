'use strict';

const fs = require('fs');
const questions = JSON.parse(fs.readFileSync(__dirname + '/../json/questions.json', 'utf8'));
const nameMapData = {};
const metaSetting = {
    opening: [],
};

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
        case 'name':
            var name = incomeData.name;
            var data = nameMapData[name];
            var isDoubleNaming = !!data;
            var address = ws.handshake ? (ws.handshake.address || '::WiFi') : 'none';
            if (isDoubleNaming) {
                if (data.address == address) {
                    // is self
                    emit(data);
                } else {
                    emit({error: '名稱與他人重復, 請重新輸入其他名稱', dispatch: 'SET_NAME'});
                }

            } else {
                var newDate = {name, address, answers: []};
                nameMapData[name] = newDate;
                emit(newDate);
            }
            break;
        case 'answering':
            if (socket.address == address) {

            } else {
                emit({error: '手機端位址錯誤'});
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
        return JSON.stringify({
            type: incomeData.type,
            payload: data,
        });
    }

    function returnError(msg = '', dispatch = null) {
        return JSON.stringify({
            type: 'error',
            msg,
            dispatch,
        });
    }
}



module.exports = {
    onmessage,
}

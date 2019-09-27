'use strict';

const fs = require('fs');
const questions = JSON.parse(fs.readFileSync(__dirname + '/../json/questions.json', 'utf8'));

function onmessage(ws, clients, msg) {
    console.log('onmessage received: %s', msg);

    const incomeData = JSON.parse(msg);
    switch (incomeData.type) {
        case 'get_questions':
            return ws.send(returnPayload(questions));
        case 'name':
            if (clients.filter(e => e.name == incomeData.name).length > 0) {
                return ws.send(returnError('名稱重復, 請重新輸入其他名稱', 'SET_NAME'));
            } else {
                ws.name = incomeData.name;
                return ws.send(returnPayload(incomeData.name));
            }
            break;
        default:

    }

    return incomeData;


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

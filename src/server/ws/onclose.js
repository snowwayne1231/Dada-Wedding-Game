function onclose(ws, clients) {
    const idx = clients.findIndex(cws => cws == ws);
    clients.splice(idx, 1);
    console.log('Closed.. ', ws.name);
    console.log('Total Connecting: ', clients.length);
}

module.exports = {
    onclose,
}

function onclose(ws, clients) {
    const idx = clients.findIndex(cws => cws == ws);
    clients.splice(idx, 1);
}

module.exports = {
    onclose,
}

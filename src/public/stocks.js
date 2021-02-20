window.addEventListener('load', () => {
    const socket = io();
    socket.on('connect', () => {
        console.log('CONNECTION ESTABLISHED');
        socket.emit('join', {id: '123'});
    });
    socket.on('refresh', data => {
        console.log('REFRESH', data);
        document.getElementById("stock").innerHTML = data.value +"$";
    });
});

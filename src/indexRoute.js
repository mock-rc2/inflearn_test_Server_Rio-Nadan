module.exports = function(app){
    app.get('/inflearn/test/video', (req, res) =>{
        return res.status(200).sendFile(__dirname+'/html/stream.html');
    });
}
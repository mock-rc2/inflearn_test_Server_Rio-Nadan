module.exports = function(app){
    app.get('/inflearn/test/video', (req, res) =>{
        return res.status(200).sendFile('D:\\rigingTest Project\\inflearn_test_Server_Rio-Nadan\\src\\html\\stream.html');
    });
}
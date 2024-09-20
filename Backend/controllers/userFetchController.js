module.exports = function (app, dataBase) {
    var dataBase = dataBase;
    var app = app;

    // Fetch User Data
    app.get('/getUser', function(request, response) {
        var sql = "SELECT * FROM `user`;";
        dataBase.query(sql, function(error, data){
            if (error) {
                console.log(error);
            } else {
                response.json(data);
            }
        });
    });
}
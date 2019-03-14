var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
var listofrows=[];


app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/getall', function(req,res){
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        if (err) console.log(err);
        conn.query('Select * from Salesforce.ApexPage',[2],function(err,result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
            res.json(results);
        });

});
});

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.ApexPage SET Markup = $1 WHERE LOWER(Name) = LOWER($2)',
            [req.body.Markup.trim(), req.body.Name.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.ApexPage (Markup, Name) VALUES ($1, $2)',
                  [req.body.Markup.trim(), req.body.Name.trim()],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                     }
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
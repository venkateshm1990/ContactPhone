var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
var listofrows=[];
  

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());


app.put('/checkrecords', function(req,res){
    pg.connect(process.env.DATABASE_URL, function (err, conn, _done) {
        if (err) console.log(err);
        conn.query('SELECT Name,Markup FROM salesforce.ApexPage WHERE Markup NOT LIKE $1',
        ['%lightningStylesheets="true"%'],
        function(err,result,fields){
            if(err){
                console.log(err);
                alert('errors'+err);
                res.status(400).json({error: err.message});
            }else{
                res.status(200).send(result.rows);
                res.json(fields);
            }
        });
       
    });
});


app.put('/getall', function(req,res){
    pg.connect(process.env.DATABASE_URL, function (err, conn, _done) {
        if (err) console.log(err);
        conn.query('SELECT Name,Markup,IsAvailableInTouch FROM salesforce.ApexPage',function(err,result,fields){
            if(err){
                console.log(err);
                alert('errors'+err);
                res.status(400).json({error: err.message});
            }else{
            res.status(200).send(result.rows);
            console.log(fields);
            res.json(fields);
            //listofrows=res.json(fields);

            }
        });
       
    });
});

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.ApexPage SET Markup = $1,IsAvailableInTouch = $2 WHERE LOWER(Name) = LOWER($3)',
            [req.body.Markup.trim(),'true',req.body.Name.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
        //consloe.log('test '+req.body.Markup.trim());
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
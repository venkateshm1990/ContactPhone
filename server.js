var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
var listofrows=[];


app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.put('/getall', function(req,res){
    pg.connect(process.env.DATABASE_URL, function (err, conn, _done) {
        if (err) console.log(err);
        conn.query('SELECT id,Markup FROM salesforce.ApexPage',function(err,result,fields){
            if(err){
                console.log(err);
                alert('error'+err);
                res.status(400).json({error: err.message});
            }else{
            res.status(200).send(result.rows);
            console.log(fields);
            res.json(fields);
            //listofrows=res.json(fields);

            }
        });
        conn.query(
            'UPDATE salesforce.ApexPage SET Markup = $1 ',
            [res.json.fields.Markup],
            function(err, result) {
                
                done();
                if (err) {
                    res.status(400).json({error: err.message});
                }
                else {
                    
                    res.json(result);
                }
            }
        );
    });
});

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.ApexPage SET Markup = REPLACE(Markup,"<apex:page","<apex:page lightningStylesheets="true") WHERE LOWER(Name)="Sample" ',
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
            }
        );
    });
});

app.post('/updates', function(req, res) {
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
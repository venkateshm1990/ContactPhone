var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();
var listofrows=[];

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/pull', function (req, res) {
    pg.connect(process.env.DATABASE_URL,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }
       client.query('SELECT Name, Markup from Salesforce.ApexPage' ,function(err,result) {
          //call `done()` to release the client back to the pool
          
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           alert(res.status(200).send(result.rows));
            res.status(200).send(result.rows);
            done(); 
           res.json(result);
           alert(result);
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
                        alert(res.json(result));
                    }
                  });
                }
                else {
                    done();
                    alert(res.json(result));

                    res.json(result);
                }
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
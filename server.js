var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
alert('in update');
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
	alert('before query');
        conn.query(
            'UPDATE salesforce.ApexPage SET Markup ="<apex:page>Hello</apex:page>" where Name="Sample"',
            [req.body.Name.trim(), req.body.Markup.trim()],
            function(err, result) {
                done();
                    if (err) {
			alert('in err'+err.message);
                        res.status(400).json({error: err.message});
                    }
                else {
                    done();
                    alert('result'+result);                   
                    res.json(result);
                }
            }
        );
	alert('after query');
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

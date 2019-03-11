var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/update', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.Contact SET Phone = 9090909, MobilePhone = 0808088 WHERE FirstName = "venkatesh" AND LastName = "malasani"',
            [req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim()],
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
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
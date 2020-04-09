const express = require('express')
const mysql=require('mysql');
const app = express()
app.use(express.json())
require('date-utils')
port = 1337

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
function parse(str){
	var y= str.substr(0,4);
	var m=str.substr(4,2);
	var d=str.substr(6,2);
	var h=str.substr(8,2);
	return new Date(y,m-1,d,h);
}

app.get('/device', function(req, res) {
    r = req.query
    var da=new Date();
    da.setHours(da.getHours()+9)
    r.time = (da).toFormat("YYYY-MM-DD HH:MI:SS")
    r.status="ok"
    if(res.statusCode=200){
    //connection.connect();
    var sql="insert into sensorT(date,temper,device_id,number) value(";
    var timeS=da.toISOString().slice(0,19).replace('T',' ');
    timeS+="";
    sql+="'";
    sql+=timeS;
    sql+="'";
    sql+=",";
    sql+=r.temperature_value;
    sql+=",";
    sql+=r.device_id;
    sql+=",";
    sql+=r.sequence_number;
    sql+=")";
    //console.log(r)
    console.log(sql)
    var query = connection.query(sql, function(err, rows, cols) {
  	if (err) throw err;
  	console.log("done");
    });
    //connection.end()
    }
    //res.send(JSON.stringify(r))
    res.writeHead(200,{'Content-Type':'application/json'})
    str='{"device_id":'+r.device_id+', "status" : "ok", ' + '"time":"'+r.time+'"}';
    //console.log(str);
    //res.end(JSON.stringify(str));
    res.end(str);
})

app.post('/req', function(req, res) {
    r = req.body
    r.ip = req.ip.replace(/^.*:/, '')
    r.time = (new Date()).toFormat("YYYY-MM-DD HH:MI:SS")
    r.email = "gom626@gmail.com"
    r.stuno = "20151600"
    console.log(req.body)
    res.send(JSON.stringify(r))
})

app.get('device/:a/:b/:c', function(req, res) {
    r = req.params
    //ip = req.ip.replace(/^.*:/, '')
    r.status="ok";
    r.time = (new Date()).toFormat("YYYY-MM-DD HH:MI:SS")
    console.log(r)
    res.send(JSON.stringify(r))
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

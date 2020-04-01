const url="http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=4113552000";
const mysql=require('mysql');
var cron=require('node-cron');

//mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})

var parseString=require('xml2js').parseString;
var request=require('request');

cron.schedule('00 * * * *',function(){


request(url,function(err,res,date){
	if(!err&&res.statusCode==200){
		//console.log(data);
		//var target=data.rss
		//console.log(target)
		parseXml(date)
	}
})
});
function parse(str){
	var y= str.substr(0,4);
	var m=str.substr(4,2);
	var d=str.substr(6,2);
	var h=str.substr(8,2);
	return new Date(y,m-1,d,h);
}


function parseXml(xml){
	parseString(xml,function(err,obj){
		if(err){
			console.log(err);
			return;
		}
		//console.log(obj);
		var target=obj.rss.channel[0].item[0].description
		//console.log(target);
		var time=target[0].header[0].tm[0]
		var weather=target[0].body[0].data
		connection.connect();
		//console.log(time);
		//console.log(parse(time))
		var tt=parse(time);
		//console.log(tt.toISOString());
		//console.log(weather)
		var nextday=0;
		var lst=[]
		var ho=[]
		time=tt.toISOString().slice(0,19).replace('T',' ')
		time+="";
		var cnt=0;
		lst.push(time);
		var temp=weather[0].temp[0];
		var sql="insert into Rss";
		sql+="(time , temper) values(";
		//console.log(value)
		sql+="'";
		sql+=time
		sql+="'"
		sql+=","
		sql+=temp
		sql+=")"
		/*
		var sql="insert into sensors(time,3hour,6hour,9hour,12hour,15hour,18hour,21hour,24hour,27hour,30hour,33hour,36hour,39hour,42hour,45hour,48hour) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
		connection.query(sql,lst,function(err,rows,fields){
			if(err){
				console.log(err);
			}
			else{
				console.log(rows.insertId);
			}
		})*/
		//console.log(sql)
		var query = connection.query(sql, function(err, rows, cols) {
  			if (err) throw err;
  				console.log("done");
		});
		connection.end()
	})
}

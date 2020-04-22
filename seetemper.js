var express = require('express');
var app = express();
var AsyncLock = require('async-lock');
var mysql =require('sync-mysql');

//mysql = require('mysql');
//var connection = mysql.createConnection({
var connection=new mysql({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
//connection.connect();

function format(data){
	
	var ans=data.getFullYear(data)+"-";
	if((data.getMonth()+1)<10){
		ans+="0";
		ans+=(data.getMonth()+1);
	}
	else{
		ans+=(data.getMonth()+1);
	}
	ans+="-"
	if(data.getDate()<10){
		ans+="0";
		ans+=data.getDate();
	}
	else{
		ans+=data.getDate();
	}
	ans+="-";
	if(data.getHours()<10){
		ans+="0";
		ans+=data.getHours();
	}
	else{
		ans+=data.getHours();
	}
	ans+="-";
	if(data.getMinutes()<10){
		ans+="0";
		ans+=data.getMinutes();
	}
	else{
		ans+=data.getMinutes();
	}
	ans+="-";
	if(data.getSeconds()<10){
		ans+="0";
		ans+=data.getSeconds()
	}
	else{
		ans+=data.getSeconds()
	}
	ans+=""
	return ans;
}


app.get("/temper", function(req, res) {
	console.log("param=" + req.query);
  	r=req.query
	var result;
	var senddata;
	var time= new Date();
	time.setHours(time.getHours()+9);
	console.log(time);
	var timeS=new Date(time);
	timeS.setDate(time.getDate()-1);
	var etime=format(time);
	var stime=format(timeS);
	console.log(stime)
	console.log(etime)
	//select JSON_OBJECT('sequence number' ,number,'time',date,'temperature',temper,'device_id',device_id)from sensorT 
	//### Using JOSN ObJECT
	//var qstr = "select JSON_OBJECT('sequence number' ,number,'time',date,'temperature',temper,'device_id',device_id)from sensorT  "
	//### Using Jdon Object
	var qstr="select number,date,temper,device_id from sensorT ";
	qstr+="where str_to_date('";
	qstr+=stime;
	qstr+="', '%Y-%m-%d-%H-%i-%s') < date and date < str_to_date('";
	qstr+=etime;
	qstr+="', '%Y-%m-%d-%H-%i-%s')";
	console.log(qstr);
	var html={};
	
	if(typeof r.device_id=="undefined"){
		console.log("1")
		let rows=connection.query(qstr);
		console.log("1Got "+rows.length+" records");
                        for(var i=0;i<rows.length;i++){
				var line={}
                                line['sequence number']=rows[i].number
                                line['time']=rows[i].date
                                line['temperature']=rows[i].temper
				line['device_id']=rows[i].device_id
               			html[i]=line;
                        }
		/*connection.query(qstr,function(err,rows,cols){
			if(err){
				throw err;
				res.send('query error ' +qstr);
				return;
			}
			console.log("1Got "+rows.length+" records");
			for(var i=0;i<rows.length;i++){
				if(i!==0){
					html+=",";
				}
				var line ="{'sequence number' : " + rows[i].number+','
				line+="'time' : "+ rows[i].date+','
				line+="'temperature' : "+ rows[i].temper+','
				line+="'device_id' : " + rows[i].device_id
				line+="}"
				html+=line;
			}
		});*/
	}
	else{
		var race=false;
		var qstr2=qstr+"and device_id='";
		qstr2+=r.device_id;
		qstr2+="'";
		var flag=false;
		console.log("2");
		let rows=connection.query(qstr2)
		if(rows.length!==0){
			console.log("2 Got "+rows.length+" records");
				for(var i=0;i<rows.length;i++){
                                var line={}
                                line['sequence number']=rows[i].number
                                line['time']=rows[i].date
                                line['temperature']=rows[i].temper
                                line['device_id']=rows[i].device_id
                                html[i]=line;
                        	}
                                flag=true;
                                console.log(flag)
                                race=true;
                                //console.log(html)
		}
	
		/*connection.query(qstr2,function(err,rows,cols){
                        if(err){
                                throw err;
                                res.send('query error ' +qstr);
                                return;
                        }
			if(rows.length!==0){
                        	console.log("2 Got "+rows.length+" records");
                        	for(var i=0;i<rows.length;i++){
                                	//console.log(rows[i])
					if(i!==0){
                                        	html+=",";
                                	}
                                	var line ="{'sequence number' : " + rows[i].number+','
                                	line+="'time' : "+ rows[i].date+','
                                	line+="'temperature' : "+ rows[i].temper+','
                                	line+="'device_id' : " + rows[i].device_id
                                	line+="}"
					//console.log(line)
                                	html+=line;
                        	}
				flag=true;
				console.log(flag)
				race=true;
				//console.log(html)
			}
                });*/

		if(flag===false){
			console.log("3")
			let rows=connection.query(qstr)
			console.log("3Got "+rows.length+" records");
			for(var i=0;i<rows.length;i++){
                                var line={}
                                line['sequence number']=rows[i].number
                                line['time']=rows[i].date
                                line['temperature']=rows[i].temper
                                line['device_id']=rows[i].device_id
                                html[i]=line;
                        }
			/*
			connection.query(qstr,function(err,rows,cols){
                        	if(err){
                                	throw err;
                                	res.send('query error ' +qstr);
                                	return;
                       	 	}
                        	console.log("3Got "+rows.length+" records");
                        	for(var i=0;i<rows.length;i++){
                                	if(i!==0){
                                        	html+=",";
                                	}
                                	var line ="{'sequence number' : " + rows[i].number+','
                                	line+="'time' : "+ rows[i].date+','
                                	line+="'temperature' : "+ rows[i].temper+','
                                	line+="'device_id' : " + rows[i].device_id
                                	line+="}"
                                	html+=line;
                        	}
                	});
			*/
		}
	}
	//console.log(html);
	/*
########  USING JOSN OBJECT CODE
	var html=""
  	if(typeof r.device_id=="undefined"){
  		connection.query(qstr, function(err, rows, cols) {
        		if (err) {
                		throw err;
                		res.send('query error: '+ qstr);
                		return;
        		}
			console.log("Got "+ rows.length +" records");
        		for (var i=0; i< rows.length; i++) {
                		html += JSON.stringify(rows[i]);
        		}
			senddata=html
		});	
  	}
	else{
		var qstr2=qstr+"and device_id='";
		qstr2+=r.device_id;
		qstr2+="'"
		connection.query(qstr2, function(err, rows, cols) {
        		if (err) {
                		throw err;
                		res.send('query error: '+ qstr);
                		return;
			}
			console.log(rows.length)	
			if(rows.length===0){
                                connection.query(qstr, function(err, rows, cols) {
                                        if (err) {
                                                throw err;
                                                res.send('query error: '+ qstr);
                                                return;
                                        }
                                
                                	console.log("Got "+ rows.length +" records");
                        		for (var i=0; i< rows.length; i++) {
                                		html += JSON.stringify(rows[i]);
                        		}
				});
                	}
			else{
				console.log("Got "+ rows.length +" records");
                                for (var i=0; i< rows.length; i++) {
                                       // console.log(JSON.parse(rows[i])) 
					html += JSON.stringify(rows[i]);
                                }
				console.log(html);
				senddata=html;
			}
		});

	}
  	//select * from sensorT
  	//where str_to_date('2020-04-07-12', '%Y-%m-%d-%H') < date and date <str_to_date('2020-04-07-15','%Y-%m-%d-%H');	
    	*/
//	console.log(html)
	//res.writeHead(200,{'Content-Type':'application/json'})
	res.send(JSON.stringify(html,null,'\t'));
	res.end(html)
});


var server = app.listen(8555, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});

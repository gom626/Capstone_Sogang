const http=require('http')
const express=require('express')
const bodyParser=require('body-parser')
const moment=require('moment')
const ip=require('ip')
//const hostname='127.0.0.1'
const hostname='172.31.41.102'
const port=8000
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul")
//서버를 생성합니다.
var app=express();
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//request 이벤트 리스너를 설정합니다.
/*
app.use(function(request,response){
	//response.writeHead(200,{'Content-Type':'text/html'})
	//response.end('<h1>hello world</h1>')
	//app.get('/', (req, res) => res.send('Hello World!'))
	console.log("TT")
	//r=request.body
	//console.log(request.body)
	var output=[];
	for(var i=0;i<3;i++){
		output.push({count:i,name:'name -'+i});
	}
	//response.send(output)
	//response.send(JSON.stringify(r))
	//response.end()
	next();
})*/
app.get('/',function(request,response){
	var tim=moment().format("YYYY-MM-DD HH:MI:SS")
	console.log(tim+" : recieve get request")
	r=request.query
	r.ip=ip.address()
	r.time=moment().format("YYYY-MM-DD HH:MI:SS")
	r.email="gom626@gmail.com"
	r.stuno="20151600"
	console.log(r)
	response.send(JSON.stringify(r))
})
app.post('/',function(request,response){
	
	var tim=moment().format("YYYY-MM-DD HH:MI:SS")
	console.log(tim+" : recieve post request")
	var mjson=request.body
	//console.log(mjson)
	//“email”: “본인이메일”, “stuno”:”본인학번”, “time”:”2020-3-30 03:34:13”, “ip”:”212.32.12.11
	mjson.ip=ip.address()
	mjson.time=moment().format("YYYY-MM-DD HH:MI:SS")
	mjson.email="gom626@gmail.com"
	mjson.stuno="20151600"
	console.log(mjson)
	response.send(JSON.stringify(mjson))
})
//서버를 실행합니다.
app.listen(port,hostname,function(){
	console.log(`Server Running at http://${hostname}:${port}/`)
})


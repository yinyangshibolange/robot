var path = require('path')
var fs = require('fs')
//var config = require('./config/index.js')
var api = require('./api/index')
//var lol = require('./mog/index')
var express = require('express')
//var db = require('./db')
var bodyParser = require('body-parser')
// var cookieParser = require('cookie-parser')
var logger = require('morgan'); //记录日志，输出到控制台
//var {uploadfunc} = require('./api/upload/postfile.js')
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
var app = new express()

//允许跨域访问
// app.all('*',function (req, res, next) {
//     console.log(req,res)
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.use(logger('dev'));
/*解析body的中间件*/
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(cookieParser())



//app.use(express.bodyParser()) //Version3.0x，废弃了
/**
 * 中间件是所有接口都会经过的，用于预处理、验证、或错误处理
 */
api(app)
//uploadfunc(app)

//加载静态文件
if(process.argv[2] === '--prod'){
    console.log('this is production')
    app.use(express.static(path.resolve( __dirname, './dist')))
    app.get('/', function (req, res) {
        const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
        res.send(html)
    })
}else if(process.argv[2] === '--sdev'){
    console.log('developing...')
}

// var ip = '127.0.0.1'
// console.log(ip)
// app.set('trust proxy',ip)
// if (cluster.isMaster) {
//     console.log(`主进程 ${process.pid} 正在运行`);
  
//     // 衍生工作进程。
//     for (let i = 0; i < numCPUs; i++) {
//       cluster.fork();
//     }
  
//     cluster.on('exit', (worker, code, signal) => {
//       console.log(`工作进程 ${worker.process.pid} 已退出`);
//     });
//   } else {
//     // 工作进程可以共享任何 TCP 连接。
//     // 在本例子中，共享的是 HTTP 服务器。
//     app.set('port', 3105)

//     app.listen(app.get('port'), () => {
//         console.log('server listen on port ' + app.get('port'))
//     })
  
//     console.log(`工作进程 ${process.pid} 已启动`);
//   }

app.set('port', 10086)

app.listen(app.get('port'), () => {
    console.log('server listen on port ' + app.get('port'))
})


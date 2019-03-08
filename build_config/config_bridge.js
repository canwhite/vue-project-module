const cprocess = require('child_process');//webpack子进程

var colors = require( "colors");
//自定义主题
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

//任务类型 devserver:起本地服务   buildserver:打包
let doType = process.argv[process.argv.length - 2];
//打包项目模块
let entryDir = process.argv[process.argv.length - 1];

if( (""+entryDir+""=="devserver") || (""+entryDir+""=="buildserver")){
	console.log("请输入打包模块名称！".red + "eg: ".yellow + "npm run dev demo".green);
	return;
}
console.log("类型：" + doType.green)
console.log("模块：" + entryDir.green)

//定义子进程任务
/*let cmd;
if(""+doType+"" == "devserver"){
	cmd = 'npm run startdev -- --env.name=' + entryDir 
}else{
	cmd = 'rimraf dist/' +entryDir+ '&& npm run startbuild -- --env.name=' + entryDir 
}
//启动子进程
let son = cprocess.exec(cmd, {'maxBuffer':200*1024} ,function(error, stdout, stderr) {
	console.log(stdout)
	console.log(stderr)
    if(error){
    	console.log(error)
	}
})
//合并消息
//son.stdout.pipe(process.stdout)
//son.stderr.pipe(process.stderr)
*/

let cmd;
if(""+doType+"" == "devserver"){
	cmd = 'npm run startdev -- --env.name=' + entryDir 
}else{
	cmd = 'rimraf dist/' +entryDir+ '&& npm run startbuild -- --env.name=' + entryDir 
}

let son = cprocess.spawn('cmd.exe', ['/s', '/c', cmd]);
son.stdout.on('data', function(data) {
	console.log('stdout: ' + data);
});
son.stderr.on('data', function(data) {
	console.log('stderr: ' + data);
});
/*son.on('close', function(code) {
	console.log('child process exited with code :' + code);
});*/
//公共参数配置

var NODE_ENV = process.env.NODE_ENV.trim();

var BASE={};
if(NODE_ENV == 'dev'){
	BASE.baseURL = 'https://uct.sit.uc56.com/uct-app-webapi';
}
else if(NODE_ENV == 'sit'){
	BASE.baseURL = 'https://uct.sit.uc56.com/uct-app-webapi';
}
else if(NODE_ENV == 'uat'){
	BASE.baseURL = 'https://uct.uat.uc56.com/uct-app-webapi';
}
else if(NODE_ENV == 'prod'){
	BASE.baseURL = 'https://uct.uce.cn/uct-app-webapi';
}
else if(NODE_ENV == 'production'){
	BASE.baseURL = window.location.origin+'/uct-app-webapi';
}else{
	console.error("环境参数baseURL错误！")
}
//BASE.baseURL = "https://uct.sit.uc56.com/uct-app-webapi";


const API = {
	//收藏列表
	findStarList : BASE.baseURL + '/userCollect/findList.do',
	//删除
	deleteURL: BASE.baseURL + '/userCollect/delete.do'
};

export default API;


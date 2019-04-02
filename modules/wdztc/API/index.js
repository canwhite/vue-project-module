//公共参数配置
var NODE_ENV = process.env.NODE_ENV.trim();

var BASE={};
if(NODE_ENV == 'dev'){
	BASE.baseURL = 'https://uwt.sit.uc56.com/uwt-app-web-main';
}
else if(NODE_ENV == 'sit'){
	BASE.baseURL = 'https://uwt.sit.uc56.com/uwt-app-web-main';
}
else if(NODE_ENV == 'uat'){
	BASE.baseURL = 'https://uwt.uat.uc56.com/uwt-app-web-main';
}
else if(NODE_ENV == 'prod'){
	BASE.baseURL = 'https://uwt.uce.cn/uwt-app-web-main';
}
else if(NODE_ENV == 'production'){
	BASE.baseURL = window.location.origin+'/uwt-app-web-main';
}else{
	console.error("环境参数baseURL错误！")
}
//BASE.baseURL = "https://uwt.sit.uc56.com/uwt-app-web-main";


const API = {
	//权限校验
	findAuthorityDataURL : BASE.baseURL + '/website/findAppAuthority',
	//问题上报
	reportQuestionURL : BASE.baseURL + '/question/reportQuestion.do',
	//问题分类
	findListURL : BASE.baseURL + '/question/findList.do',
	//问题上报列表，搜索列表，历史列表
	findQuestionsURL : BASE.baseURL + '/question/findQuestions.do',
	//问题详情
	findQuestionDetailURL : BASE.baseURL + '/question/findQuestionDetail.do',
	//评价
	commentURL: BASE.baseURL + '/question/comment.do',
	//申诉
	appealURL: BASE.baseURL + '/question/appeal.do',
	//催办
	urgeURL: BASE.baseURL + '/question/urge.do',
	//新增评论、回复
	addQuestionCommentURL: BASE.baseURL +'/questionComment/comment.do',
	//问题评论列表
	findCommentsURL: BASE.baseURL + '/questionComment/findComments.do',
	//点赞-取消点赞
	praiseURL: BASE.baseURL+'/questionComment/praise.do',
	//问题评论回复列表
	findCommentDetailURL: BASE.baseURL + '/questionComment/findCommentDetail.do',
	//收藏
	collectURL: BASE.baseURL + '/questionComment/collect.do'
};

export default API;


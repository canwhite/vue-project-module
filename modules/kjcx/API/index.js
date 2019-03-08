//公共参数配置

var NODE_ENV = process.env.NODE_ENV.trim();

var BASE={};
if(NODE_ENV == 'dev'){
	BASE.baseURL = 'https://uct.sit.uc56.com/uct-app-webapi';
}
else if(NODE_ENV == 'production'){
	BASE.baseURL = window.location.origin+'/uct-app-webapi';
}else{
	console.error("环境参数baseURL错误！")
}
//BASE.baseURL = "https://uct.sit.uc56.com/uct-app-webapi";

const API = {
	//运单详情
	findWaybllInfoByCodeURL : BASE.baseURL + '/waybillNos/findWaybllInfoByCode.do',
	//物流轨迹
	findTraceInfoByCodeURL : BASE.baseURL + '/waybillNos/findTraceInfoByCode.do',
	//问题件
	findProblemBillRL : BASE.baseURL + '/waybillNos/findProblemBill.do',
	//省市区地址
	findProvincesURL : BASE.baseURL + '/provinces/findProvinces.do',
	//大头笔目的站
	findByConditionURL : BASE.baseURL + '/website/findByCondition.do',
	//网点名称模糊匹配
	findWebsiteNameURL : BASE.baseURL + '/website/findWebsiteName.do',
	//网点详情
	getCmsWordDetailURL : BASE.baseURL + '/cmsOrgQuery/getCmsWordDetail.do',
	//地图
	orgRangeForGisURL: BASE.baseURL+ '/website/orgRangeForGis.do',
	//大头笔目的站
	findMarkerForGisURL : BASE.baseURL + '/website/findMarkerForGis.do',
	//运费查询
	findCarriageURL: BASE.baseURL + '/website/findCarriage.do',
	//地址库
	findProvincesInfoURL :BASE.baseURL + '/website/findProvincesInfo.do'
};

export default API;
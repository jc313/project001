//生产
///*
// 静态资源
// * */
//  var urlHead = 'http://180.76.140.84/';
//	var urlHead = 'http://yiguanjiaclub.org/';
///*
// 接口
// * */
//	var consult_url = 'http://192.168.1.214:8080/';
	var consult_url = 'http://139.196.194.93:8001/';
///*
// 图片
// * */
//	var imgHeader = "http://img.app.yiguanjiaclub.org/"
/*
 209
 * */
	
//	var urlHead = 'http://mail.luichi.info:8880/';
//	var consult_url = "http://192.168.1.209:8001/";
//	var imgHeader = "http://img.apptest.yiguanjiaclub.org/";
//	
/*
 dahai
 * */
//	var imgHeader = "http://img.apptest.yiguanjiaclub.org/";
//	var urlHead = 'http://192.168.1.66/';
//	var consult_url = "http://192.168.1.66:8080/";
/*
 xiaomei
 * */
//	var imgHeader = "http://img.apptest.yiguanjiaclub.org/";
//	var urlHead = 'http://192.168.1.209/';
//	var consult_url = "http://192.168.1.27:8080/";
/*
 mtj
 * */
//	var imgHeader = "http://img.apptest.yiguanjiaclub.org/";
//	var urlHead = 'http://192.168.1.209/';
//	var consult_url = "http://192.168.1.150:8080/";
/*
 207
 * */
//	var imgHeader = "http://img.apptest.yiguanjiaclub.org/";
//	var urlHead = "http://mail.luichi.info:8881/";
//	var consult_url = "http://mail.luichi.info:8885/";
/*
 线上测试
 * */
// 	var imgHeader = "http://img.apptest.yiguanjiaclub.org/";
//	var urlHead = "http://mail.luichi.info:8881/";
//	var consult_url = "http://test.luichi.info:8001/";
	var postToServer = function(urls,requestJson,successFunc){
		try{
			$.ajax({
				type: "POST",
				ifModified:true,
				timeout:12000,
				url: consult_url + urls,
				data: requestJson,
				dataType: "text",
				accepts: "text",
				success: function(json) {
					var obj = jQuery.parseJSON(json)
					successFunc(obj);
				},	
				error: function(XMLHttpRequest, exception) {
//					if (XMLHttpRequest.status == 0) {
//						alert('网络不给力，请稍后再试！');
//					}else if (XMLHttpRequest.status == 404) {
//						alert('资源地址不存在');
//					}else if (XMLHttpRequest.status == 408) {
//						alert('网络不给力，请稍后再试！');
//					}else if (XMLHttpRequest.status == 500) {
//						alert('服务器出错啦')
//					}else if (XMLHttpRequest.status == 502) {
//						alert('Web服务器用作网关或代理服务器时收到了无效响应');
//					}else if (XMLHttpRequest.status == 503) {
//						alert('服务不可用');
//					}else if (XMLHttpRequest.status == 504) {
//						alert('网关超时！');
//					}else{
//						alert(XMLHttpRequest);
//						alert(exception)
//					}
				},
				complete:function(){}
			})
		}catch(e){}
	}
	var fetchToServer = function(urls,type,requestJson,successFunc){
		fetch(
			consult_url+urls,
			{
//				credentials: 'include',
				mode: 'cors',
				method: type,
				headers: {
			    	"Accept":"*/*",
			    	"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
				},
			body: requestJson,
		}).then(function(res) {
		  if (res.ok) {
	    	 	res.json().then(function(data) {
	    	 		successFunc(data)
			    });
		  } else if (res.status == 401) {
		    	mui.toast()
		  }
		}).then(function(){
			try{
				mask.close()
			}catch(e){
			}
		})
	}
	var fetchToServerGet = function(urls,successFunc){
		fetch(
			consult_url+urls,
			{
				credentials: true,
				method: 'GET',
				headers: {
			    	"Accept":"*/*",
			    	"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
				},
			}
		)
		.then(function(res) {
		  if (res.ok) {
	    	 	res.json().then(function(data) {
	    	 		successFunc(data)
			    });
		  } else if (res.status == 401) {
		    	mui.toast()
		  }
		}).then(function(){
			try{
				mask.close()
			}catch(e){
				//TODO handle the exception
			}
		})
	}
	
			
	

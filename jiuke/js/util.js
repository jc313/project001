	var DataStrategy = function(){
		var strategy = {
			listModule : function(data){
				var _adapter = {
					sid:'',
					type:"",
					userTypeId:'',
					img:"",
					title:"",
					houseType:"",
					area:"",
					action:"",
					city:"",
					sale:'',
					date:"",
					price:"",
					state:"",
					claz:"font7",
					reason:"",
					module:"",
					link:"",
					deleteType:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			messageList : function(data){
				var _adapter = {
					userHeadPic:'',
					userNickName:'',
					fcCommentTime:'',
					fcCommentContent:''
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			communityListModule : function(data){
				var _adapter = {
					sid:'',
					userServiceTypeId:"",
					serviceName:'',
					img:"../images/luchi.png",
					address:"",
					longitude:"",
					latitude:"",
					distance:'',
					clickNum:"",
					count:150,
					servicePrice:"",
					serviceUnit:"",
					discount:"",
					link:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			communityMessageListModule : function(data){
				var _adapter = {
					sid:'',
					userPic:"../images/luchi.png",
					userName:'',
					leaveMessage:"",
					createTime:"",
					fcCommentList:"",
					clas:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			
			serviceTypeListModule : function(data){
				var _adapter = {
					sid:'',
					userType:'',
					userTypeName:'',
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			
			
			addressListModule : function(data){
				var _adapter = {
					sid:'',
					communityName:'',
					comment:'',
					latitude:'',
					longitude:'',
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			
			serverModule : function(data){
				var _adapter = {
					sid:"",
					img0:"",
					img1:"",
					img2:"",
					img:"images/luchi.png",
					name:"",
					length:"",
					text:"",
					link:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			serverImgModule : function(data){
				var _adapter = {
					sid:"",
					img:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			indicatorModule: function(data){
				var _adapter = {
					clas:"",
					img:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			loopModule: function(data){
				var _adapter = {
					clas:"",
					img:"",
					src:'',
					title:'',
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			provinceModule: function(data){
				var _adapter = {
					text:"",
					value:"",
					clas:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			cityModule: function(data){
				var _adapter = {
					text:"",
					CityID:"",
					clas:"",
					ProID:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			countryModule: function(data){
				var _adapter = {
					text:"",
					CityID:"",
					clas:"",
					Id:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			optionModule: function(data){
				var _adapter = {
					title:"",
					clas:"",
					text:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			tprList: function(data){
				var _adapter = {
					maxBuyNum:'',
					minBuyNum:"",
					price:"",
					serviceId:"",
					sid:"",
					unit:"",
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			addressList: function(data){
				var _adapter = {
					defaultAddress:'',
					detailAddress:'',
					payPrice:'',
					postcode:'',
					sid:'',
					telephone:'',
					userId:'',
					userName:'',
					userRegion:'',
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			commerList: function(data){
				var _adapter = {
					link:'',
					sid:'',
					serviceName:'',
					servicePrice:'',
					img:'',
				}
				for(var i in _adapter){
					_adapter[i] = data[i] || _adapter[i];
				}
				return _adapter;
			},
			
		}
		return {
			getObject :function(type,data){
				return strategy[type] && strategy[type](data)
			}
		}
	}()
	function getDataObjet(type,data){
		if(type == 'indicatorModule'){
			data[0].clas = 'mui-active';
		}
		if(type == 'loopModule'){
			var start = data[0];
			var end = data[data.length-1];
			data.unshift(start);
			data.push(end);
		}
		var dataList = [];
		var len = data.length;
		var id = localStorage.getItem('provinceId');
		var cityId = localStorage.getItem('cityId');   
		var d = null;
		if(type == 'cityModule'){
			for(var i = 0 ; i < len ; i++){
				if(data[i].ProID == id){
					d = DataStrategy.getObject(type,data[i]);
					dataList.push(d);
				}
			}
		}else if(type == 'countryModule'){
			for(var i = 0 ; i < len ; i++){
				if(data[i].CityID == cityId){
					d = DataStrategy.getObject(type,data[i]);
					dataList.push(d);
				}
			}
		}else if(type == 'tprList'){
			for(var i = 0 ; i < len ; i++){
				if(i == len-1){
					data[i].maxBuyNum = data[i].unit+'以上';
					data[i].unit = '';
					d = DataStrategy.getObject(type,data[i]);
				}else{
					data[i].minBuyNum = data[i].minBuyNum + '-';
					d = DataStrategy.getObject(type,data[i]);
					
				}
				dataList.push(d);
			}
		}else{
			for(var i = 0 ; i < len ; i++){
				d = DataStrategy.getObject(type,data[i]);
				dataList.push(d);
			}
		}
		return dataList;
	}
	function getParamValueOfURL(url,paras) {
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        for (var i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length)
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if(typeof (returnValue) == "undefined"){
            return "";
        }else{
            return returnValue;
        }
	} 
	var vm = null;
	var ua = navigator.userAgent.toLowerCase();
	var u = navigator.userAgent, app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	function clone3(obj){  
	    function Clone(){}  
	    Clone.prototype = obj;  
	    var o = new Clone();  
	    for(var a in o){  
	        if(typeof o[a] == "object") {  
	            o[a] = clone3(o[a]);  
	        }  
	    }  
	    return o;  
	}  
	function aaa() {
        var d = Deferred();
        setTimeout(function() {
            d.resolve()
        })
        return d.promise
    }
    	


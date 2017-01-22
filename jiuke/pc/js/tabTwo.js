	require.config({
        paths: {
			avalon: '../../js/avalon',
			deferred: '../../js/deferred',
			jquery:'../../js/jquery',
        	bootstrap:'../../js/bootstrap',
            ajax:'../../js/ajax/ajax',
            fetch:'../../js/ajax/jquery',
            util:'../../js/util',
        },
        shim: {
            avalon:{exports:"avalon"},
			fetch:{exports:"fetch"},
			jquery:{exports:"jquery"},
            bootstrap:{deps:['jquery'],exports:'bootstrap'},
		  	ajax:{deps:['jquery'],exports:'ajax'},
		  	util:{exports:'util'},
	    }
    });
	requirejs(['avalon','bootstrap','ajax','util','deferred'], function(avalon,bootstrap,ajax,util,deferred) {
		avalon.ready(function () {
			avalon.config({debug: false});
			vm = avalon.define({
				$id:"init",
				searchText:'',
				searchType:'课程',
				searchTypeChange:function(key){
					vm.searchType = key
				},
				search:function(){
					if(vm.searchType == '课程'){
						vm.start = 0;
						vm.page = 1;
						queryBoutiqueList();
					}else if(vm.searchType == '教师'){
						location.href = 'tabOne.html?searchText='+vm.searchText;
					}
				},
				start:0,
				page:1,
				pageSize:12,
				count:0,
				courseName:'',
				loginName:"",
				password:"",
				list:[],
				listDemo:[],
				paginationList:[],
				hide1:true,
				hide2:false,
				hide3:false,
				code:'获取验证码',
				second:60,
				verificationCode:'',
				send:function(){
					if(vm.loginName == ""){alert('请输入手机号码！');return}
					if(vm.second == 60){
						sendReq()						
					}
				},
				zxhide1:false,
				zxhide2:false,
				hove1:function(){
					vm.zxhide1 = true;
				},
				out1:function(){
					vm.zxhide1 = false;
				},
				hove2:function(){
					vm.zxhide2 = true;
				},
				out2:function(){
					vm.zxhide2 = false;
				},
				login:function(){
					login()
				},
				loginOut:function(){
					localStorage.removeItem('userInfoJiuKe')
					vm.hide1 = true;
					vm.hide2 = false;
				},
				register:function(){
					if(vm.loginName == ""){alert('请输入手机号码！');return}
					if(vm.password == ""){alert('请输入密码！');return}
					if(vm.verificationCode == ""){alert('请输入验证码！');return}
					register()
				},
				userInfo:function(){
					if(vm.hide1){
						$('#login').modal('show')
					}else{
						location.href = '../user/userInfo.html'
					}
				},
				tab:function(href){
					location.href = href;
				},
				detail:function(id){
					window.open('../detail/expandDetail.html?sid='+id);
//					location.href = '../detail/expandDetail.html?sid='+id;
				},
				pages:function(start,page){
					vm.start = start;
					vm.page = page;
					queryBoutiqueList();
				},
				search:function(){
					vm.start = 0;
					vm.page = 1;
					queryBoutiqueList();
					
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
                	vm.searchText = decodeURI(getParamValueOfURL(window.location.href,'searchText'));
                	var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userName = obj.userName;
						vm.hide1 = false;
						vm.hide2 = true;
					}
                }).ensure(function() {
                	queryBoutiqueList()
                })
		    })
			avalon.scan(document.body);
		})
		function queryBoutiqueList(){
			vm.list = [];
			vm.listDemo = [];
			vm.paginationList = [];
			postToServer('eduWeb/expand/queryExpandList',
			{start:vm.start,pageSize:vm.pageSize,courseName:vm.searchText},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {} ,studyNum = 0 ,img ='';
					vm.count = json.data.count;
					if(vm.count == 0){
						vm.hide3 = false;
						vm.paginationList = [];
					}else{
						vm.hide3 = true;
						if(vm.count <= vm.pageSize){
							vm.paginationList.push({page:1,start:0,active:'active'})
						}else{
							var a = Math.ceil(vm.count/vm.pageSize);
							if(a*vm.pageSize <= vm.count){
								for(var i = 1;i<a;i++){
									if(vm.page == i){
										vm.paginationList.push({page:i,start:(i-1)*vm.pageSize,active:'active'})
									}else{
										vm.paginationList.push({page:i,start:(i-1)*vm.pageSize,active:''})
									}
								}
							}else{
								for(var i = 1;i<a+1;i++){
									if(vm.page == i){
										vm.paginationList.push({page:i,start:(i-1)*vm.pageSize,active:'active'})
									}else{
										vm.paginationList.push({page:i,start:(i-1)*vm.pageSize,active:''})
									}
								}
							}
						}
						avalon.each(json.data.expandCourseList, function(index, el){
							if(el.expandCourse.studyNum == null){
								studyNum = 0;
							}
							try{
								img = el.picList[0].realPicUrl
							}catch(e){
							}
							item = {
								sid:el.expandCourse.sid,
								courseName:el.expandCourse.courseName,
								src:img,
								courseTeacher:'主讲师：' + el.expandCourse.teacherName,
								price:'￥' + el.expandCourse.price,
								openCourseCity:'开课城市：' + el.expandCourse.openCourseCity,
								openCourseTime:'开课时间：' + el.expandCourse.openCourseTime,
								courseContent:el.expandCourse.courseContent,
							}
							vm.listDemo.push(item);
						})
						vm.list = vm.listDemo;
					}
				}else{
					
				}
				
			})
		}
		/*
		登录
		 * */
		function login(){
			postToServer('eduWeb/user/login',{loginName:vm.loginName,password:vm.password},function(json){
				if(json.code == 2000){
					$('#login').modal('hide');
					vm.userName = json.data.loginName;
					vm.hide1 = false;
					vm.hide2 = true;
					var user = {
						sid:json.data.sid,
						loginName:json.data.loginName,
						realPicUrl:json.data.realPicUrl,
						userName:json.data.userName,
						userHead:json.data.userHead,
						password:json.data.password,
						userInfo:json.data.userInfo,
						userRole:json.data.userRole,
						lastLoginTime:json.data.lastLoginTime,
						approveStatus:json.data.approveStatus,
						isUse:json.data.isUse,
					}
					localStorage.setItem('userInfoJiuKe',JSON.stringify(user))
				}else{
					alert(json.message)
				}
			})
		}
		/*
		/*
		注册
		 * */
		function register(){
			postToServer('eduWeb/user/userRegister',{loginName:vm.loginName,password:vm.password,verificationCode:vm.verificationCode},function(json){
				if(json.code == 2000){
					$('#register').modal('hide')
					$('#login').modal('show')
				}else if(json.code == 5000){
					alert(json.message)
				}
			})
		}
		/*
		 发送验证码
		 * */
		function sendReq(){
			time();
			postToServer('eduWeb/user/pushCode',{telephone:vm.loginName},function(json){
				if(json.code == 2000){
				}else if(json.code == 5000){
					alert(json.message)
				}
			})
		}
		/*
		 定时器
		 * */
		function time(){
			vm.code = '剩余' + vm.second + '秒';
			vm.second = vm.second - 1;
			if(vm.second == 0){
				vm.code = "获取验证码";
				vm.second = 60;
				return
			}
			setTimeout(function(){
				time();
			},1000)
		}
	});
		
			
	    	




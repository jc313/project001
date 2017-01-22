	require.config({
        paths: {
			avalon: '../../js/avalon',
			deferred: '../../js/deferred',
//			jquery:'../../js/jquery',
			jquery:'//cdn.bootcss.com/jquery/1.12.4/jquery.min',
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
			avalon.config({debug: true})
			vm = avalon.define({
				$id:"init",
				searchText:'',
				searchType:'课程',
				searchTypeChange:function(key){
					vm.searchType = key
				},
				search:function(){
					if(vm.searchType == '课程'){
						location.href = 'tabThree.html?searchText='+vm.searchText;
					}else if(vm.searchType == '教师'){
						location.href = 'tabOne.html?searchText='+vm.searchText;
					}
				},
				loginName:"",
				password:"",
				verificationCode:'',
				code:'获取验证码',
				second:60,
				hide1:true,
				hide2:false,
				cause1:'active',
				cause2:'',
				queryBoutiqueList:[],
				queryForeignTeacher:[],
				queryHotBoutiqueList:[],
				queryNewsList:[],
				list:[],
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
				send:function(){
					if(vm.loginName == ""){alert('请输入手机号码！');return}
					if(vm.second == 60){
						sendReq()						
					}
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
				more:function(href){
					location.href = href;
				},
				cause:function(id){
					if(id == 1){
						vm.cause1 = 'active';
						vm.cause2 = '';
						list();
					}else if(id == 2){
						vm.cause1 = '';
						vm.cause2 = 'active';
						queryExpandList();
					}
				},
				detail:function(id,type){
					if(type == 1){
						window.open('../detail/excellentDetail.html?sid='+id)
//						location.href = '../detail/excellentDetail.html?sid='+id;
					}else if(type == 2){
						window.open('../detail/expandDetail.html?sid='+id)
//						location.href = '../detail/expandDetail.html?sid='+id;
					}else if(type == 3){
						window.open('../detail/teacherDetail.html?sid='+id)
//						location.href = '../detail/teacherDetail.html?sid='+id;
					}else if(type == 4){
						window.open('../detail/newsDetail.html?sid='+id)
//						location.href = '../detail/newsDetail.html?sid='+id;
					}
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userName = obj.userName;
						vm.hide1 = false;
						vm.hide2 = true;
					}
                }).ensure(function() {
                	queryBoutiqueList();
                	queryForeignTeacher();
                	queryExpandList();
                	queryHotBoutiqueList();
                	queryNewsList();
                })
		    })
			avalon.scan(document.body);
		})
		/*
		热门讲师 
		 * */
		function queryBoutiqueList(){
			vm.queryBoutiqueList = [];
			postToServer('eduWeb/teacher/queryForeignTeacher',{start:0,pageSize:4,courseName:''},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {} ,studyNum = 0;
					vm.count = json.data.teacherCount;
					if(vm.count == 0){
						
					}else{
						avalon.each(json.data.teacherList, function(index, el){
							item = {
								type:3,
								sid:el.sid,
								src:el.headUrl,
								name:el.name,
								position:el.position,
								officeUnit:el.officeUnit,
								cnIntroduce:el.cnIntroduce,
							}
							vm.queryBoutiqueList.push(item);
						})
					}
				}else{
				}
			})
		}
		/*
		热英美外教 
		 * */
		function queryForeignTeacher(){
			vm.queryForeignTeacher = [];
			postToServer('eduWeb/teacher/queryForeignTeacher',{start:0,pageSize:4,courseName:''},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {} ,studyNum = 0;
					vm.count = json.data.teacherCount;
					if(vm.count == 0){
						
					}else{
						avalon.each(json.data.teacherList, function(index, el){
							item = {
								type:3,
								sid:el.sid,
								src:el.headUrl,
								name:el.name,
								position:el.position,
								officeUnit:el.officeUnit,
								cnIntroduce:el.cnIntroduce,
							}
							vm.queryForeignTeacher.push(item);
						})
					}
				}else{
				}
			})
		}
		/*
		精品课程
		 * */
		function list(){
			vm.list = [];
			postToServer('eduWeb/boutique/queryBoutiqueList',
			{start:0,pageSize:5,courseName:''},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {} ,studyNum = 0;
					if(vm.count == 0){
					}else{
						avalon.each(json.data.boutiqueCourseList, function(index, el){
							try{
								imgUrl = el.businessPicture[0].realPicUrl
							}catch(e){
								//TODO handle the exception
							}
							item = {
								type:1,
								sid:el.boutiqueCourse.sid,
								courseName:el.boutiqueCourse.courseName,
								src:imgUrl,
								courseTeacher:'主讲师：' + el.boutiqueCourse.courseTeacher,
								price:'￥' + el.boutiqueCourse.price,
								studyNum:studyNum + '人学过',
							}
							vm.list.push(item);
						})
					}
				}else{
				}
			})
		}
		/*
		拓展课程
		 * */
		function queryExpandList(){
			vm.list = [];
			postToServer('eduWeb/expand/queryExpandList',
			{start:0,pageSize:5,courseName:''},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {};
					if(vm.count == 0){
					}else{
						avalon.each(json.data.expandCourseList, function(index, el){
							try{
								imgUrl = el.picList[0].realPicUrl;
							}catch(e){
								//TODO handle the exception
							}
							item = {
								type:2,
								sid:el.expandCourse.sid,
								courseName:el.expandCourse.courseName,
								src:imgUrl,
								courseTeacher:'主讲师：' + el.expandCourse.teacherName,
							}
							vm.list.push(item);
						})
					}
				}else{
				}
			})
		}
		/*
		热门课程
		 * */
		function queryHotBoutiqueList(){
			vm.queryHotBoutiqueList = [];
			postToServer('eduWeb/boutique/queryHotBoutiqueList',
			{start:0,pageSize:5},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {} ,studyNum = 0;
					if(vm.count == 0){
					}else{
						avalon.each(json.data.boutiqueCourseList, function(index, el){
							try{
								imgUrl = el.businessPicture[0].realPicUrl;
							}catch(e){
							}
							item = {
								type:1,
								sid:el.boutiqueCourse.sid,
								courseName:el.boutiqueCourse.courseName,
								src:imgUrl,
								courseTeacher:'主讲师：' + el.boutiqueCourse.courseTeacher,
								studyNum:studyNum + '人学过',
							}
							vm.queryHotBoutiqueList.push(item);
						})
					}
				}else{
				}
			})
		}
		/*
		九科头条
		 * */
		function queryNewsList(){
			vm.queryNewsList = [];
			postToServer('eduWeb/news/queryNewsList',{start:0,pageSize:4},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '../img/img1.png' , item = {};
					avalon.each(json.data.newsList, function(index, el){
						try{
							img = el.businessPicture[0].realPicUrl
						}catch(e){
						}
						item = {
							type:4,
							sid:el.eduNews.sid,
							courseName:el.eduNews.title,
							src:imgUrl,
							courseTeacher: el.eduNews.createTime,
							content: el.eduNews.content,
						}
						vm.queryNewsList.push(item);
					})
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
		
			
	    	




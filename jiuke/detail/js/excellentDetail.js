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
			avalon.config({debug: false})
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
				sid:'',
				userId:'',
				userName:'',
				pic:'',
				courseName:'',
				courseHourNum:'',
				price:'',
				courseType:1,
				joinText:'加入学习',
				courseComment:'',
				enrollStatus:false,
				cnIntroduce:'',
				name:'',
				position:'',
				headUrl:'',
				start:0,
				page:1,
				pageSize:5,
				count:0,
				loginName:"",
				password:"",
				hide1:true,
				hide2:false,
				hide3:true,
				hide4:false,
				hide5:false,
				hide6:false,
				hide7:false,
				type1:'active1',
				type2:'active3',
				type3:'active3',
				courseTimeList:[],
				queryCourseCommentList:[],
				paginationList:[],
				code:'获取验证码',
				second:60,
				verificationCode:'',
				send:function(){
					if(vm.loginName == ""){alert('请输入手机号码！');return}
					if(vm.second == 60){
						sendReq()						
					}
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
				saveUserCourse:function(){
					if(vm.hide1){
						$('#login').modal('show')
					}else{
						if(!vm.enrollStatus){
							if(vm.courseType == 1){
								saveUserCourse()
							}else if(vm.courseType == 2){
								alert("收费课程请联系管理员！")
							}
						}
					}
				},
				introduceType:function(type){
					if(vm.hide1){
						$('#login').modal('show');
						return
					}
					if(type == 1){
						vm.type1 = 'active1';
						vm.type2 = '';
						vm.type3 = '';
						vm.hide3 = true;
						vm.hide4 = false;
						vm.hide5 = false;
						vm.hide6 = false;
						vm.hide7 = false;
					}else if(type == 2){
						vm.type1 = '';
						vm.type2 = 'active1';
						vm.type3 = '';
						vm.hide3 = false;
						vm.hide4 = true;
						vm.hide5 = false;
						vm.hide6 = false;
						vm.hide7 = false;
					}else if(type == 3){
						vm.type1 = '';
						vm.type2 = '';
						vm.type3 = 'active1';
						vm.hide3 = false;
						vm.hide4 = false;
						vm.hide5 = true;
						queryCourseComment();
						if(vm.enrollStatus){
							vm.hide7 = true;
						}
					}
				},
				pages:function(start,page){
					vm.start = start;
					vm.page = page;
					queryCourseComment();
				},
				saveCourseComments:function(){
					if(vm.courseComment == ''){
						alert('评论内容不能为空！');
						return
					}
					saveCourseComment();
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					vm.sid = getParamValueOfURL(window.location.href,'sid');
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userId = obj.sid;
						vm.userName = obj.userName;
						vm.hide1 = false;
						vm.hide2 = true;
					}
                }).ensure(function() {
                	boutiqueCourseDetail();
                })
		    })
			avalon.scan(document.body);
		})
		/*
		报名 
		**/
		function saveUserCourse(){
			postToServer('eduWeb/userCourse/saveUserCourse',{courseId:vm.sid,userId:vm.userId,courseType:vm.courseType},function(json){
				if(json.code == 2000){
					vm.enrollStatus = true;
					vm.joinText = '已报名';
				}else{
					alert(json.message)
				}
			})
		}
		/*
		评论
		**/
		function saveCourseComment(){
			postToServer('eduWeb/courseComment/saveCourseComment',{courseId:vm.sid,userId:vm.userId,userName:vm.userName,courseComment:vm.courseComment},function(json){
				if(json.code == 2000){
					alert("发布成功");
					queryCourseComment()
				}else{
					alert(json.message)
				}
			})
		}
		/*
		课程详情 
		**/
		function boutiqueCourseDetail(){
			postToServer('eduWeb/boutique/boutiqueCourseDetail',{sid:vm.sid,userId:vm.userId},function(json){
				if(json.code == 2000){
					try{
						vm.pic = json.data.picList[0].realPicUrl;
					}catch(e){}
					vm.courseName = json.data.boutique.courseName;
					vm.courseHourNum = json.data.boutique.courseHourNum + '课时';
					vm.studyObejct = json.data.boutique.studyObejct;
					vm.courseIntro = json.data.boutique.courseIntro;
					vm.teacherIntroduce = json.data.boutique.teacherIntroduce;
					//teacher
					try{
						vm.headUrl = json.data.teacher.headUrl;
						vm.name = json.data.teacher.name;
						vm.position = json.data.teacher.position;
						vm.cnIntroduce = json.data.teacher.cnIntroduce;
					}catch(e){
					}
					vm.enrollStatus = json.data.enrollStatus;
					if(vm.enrollStatus){
						vm.joinText = '已报名';
					}else{
					}
					if(json.data.boutique.isFree == 0){
						vm.price = '￥' + json.data.boutique.price;
						vm.courseType = 2;
					}else if(json.data.boutique.isFree == 1){
						vm.price = '免费';
						vm.courseType = 1;
					}
					avalon.each(json.data.courseTimeList, function(index, el){
						vm.courseTimeList.push({number:index+1,courseTitle:el.courseTitle})
					})
				}else{
					alert(json.message)
				}
			})
		}
		/*
		评论列表 
		**/
		function queryCourseComment(){
			vm.queryCourseCommentList = [];
			vm.paginationList = [];
			postToServer('eduWeb/courseComment/queryCourseComment',{courseId:vm.sid,start:vm.start,pageSize:vm.pageSize},function(json){
				if(json.code == 2000){
					var item = null;
					vm.count = json.data.count;
					if(vm.count == 0){
						vm.hide6 = false;
						vm.paginationList = [];
					}else{
						vm.hide6 = true;
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
					}
					avalon.each(json.data.commentList, function(index, el){
						item = {
							courseComment:el.courseComment,
							userName:el.userName,
							createTime:el.createTime,
						}
						vm.queryCourseCommentList.push(item);
					})
				}else{
					alert(json.message)
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
		
			
	    	




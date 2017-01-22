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
				userId:'',
				start:0,
				page:1,
				pageSize:6,
				count:0,
				courseName:'',
				list:[],
				listDemo:[],
				paginationList:[],
				hide3:false,
				detail:function(id){
					parent.location.href = '../detail/excellentDetail.html?sid='+id;
				},
				pages:function(start,page){
					vm.start = start;
					vm.page = page;
					queryBoutiqueList();
				},
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
                	var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userId = obj.sid;
					}
                }).ensure(function() {
                	queryUserCourse()
                })
		    })
			avalon.scan(document.body);
		})
		function queryUserCourse(){
			vm.list = [];
			vm.listDemo = [];
			vm.paginationList = [];
			postToServer('eduWeb/userCourse/queryUserCourse',
			{start:vm.start,pageSize:vm.pageSize,userId:vm.userId,courseType:2},
			function(json){
				if(json.code == '2000'){
					var imgUrl = '' , item = {};
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
						avalon.each(json.data.userCourseList, function(index, el){
							try{
								imgUrl = el.businessPicture[0].realPicUrl
							}catch(e){}
							
							item = {
								sid:el.userCourse.courseId,
								courseName:el.userCourse.courseName,
								src:imgUrl,
								courseTeacher:'主讲师：' + el.userCourse.courseTeacher,
							}
							vm.listDemo.push(item);
							
						})
						vm.list = vm.listDemo;
					}
				}else{
					
				}
				
			})
		}
	});
		
			
	    	




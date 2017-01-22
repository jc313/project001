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
				userId:'',
				start:0,
				page:1,
				pageSize:8,
				count:0,
				courseName:'',
				list:[],
				listDemo:[],
				paginationList:[],
				hide3:false,
				checkStatus:0,
				type:function(id){
					if(id == 1){
						vm.checkStatus = 0;
						avalon(document.getElementById("span1")).addClass('active2')
						avalon(document.getElementById("span2")).removeClass('active2')
						avalon(document.getElementById("span3")).removeClass('active2')
					}else if(id == 2){
						vm.checkStatus = 1;
						avalon(document.getElementById("span2")).addClass('active2')
						avalon(document.getElementById("span1")).removeClass('active2')
						avalon(document.getElementById("span3")).removeClass('active2')
					}else if(id == 3){
						vm.checkStatus = 2;
						avalon(document.getElementById("span3")).addClass('active2')
						avalon(document.getElementById("span2")).removeClass('active2')
						avalon(document.getElementById("span1")).removeClass('active2')
					}
					queryMyCourse()
				},
				pages:function(start,page){
					vm.start = start;
					vm.page = page;
					queryBoutiqueList();
				},
				del:function(id,module){
					var flag = confirm("确认删除");
					if(flag){
						if(module == 'edu_boutique_course'){
							deleteBoutiqueCourse(id);
						}else if(module == 'edu_expand_course'){
							deleteExpandCourse(id);
						}
					}
				},
				edit:function(id,module){
					if(module == 'edu_boutique_course'){
						location.href = 'editCourse.html?sid='+id+'&module='+module;
					}else if(module == 'edu_expand_course'){
						location.href = 'editCourse.html?sid='+id+'&module='+module;
					}
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userId = obj.sid;
					}
                }).ensure(function() {
                	queryMyCourse()
                })
		    })
			avalon.scan(document.body);
		})
		function deleteBoutiqueCourse(id){
			postToServer('eduWeb/boutique/deleteBoutiqueCourse',{sid:id},function(json){
				if(json.code == 2000){
					alert('删除成功');
					queryMyCourse();
				}else{
					alert(json.message)
				}
			})
		}
		function deleteExpandCourse(id){
			postToServer('eduWeb/expand/deleteExpandCourse',{sid:id},function(json){
				if(json.code == 2000){
					alert('删除成功')
				}else{
					alert(json.message)
				}
			})
		}
		function queryMyCourse(){
			vm.list = [];
			vm.listDemo = [];
			vm.paginationList = [];
			postToServer('eduWeb/user/queryMyCourse',
			{start:vm.start,pageSize:vm.pageSize,userId:vm.userId,courseName:'',checkStatus:vm.checkStatus},
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
						avalon.each(json.data.courseList, function(index, el){
							try{
								imgUrl = el.businessPicture[0].realPicUrl
							}catch(e){}
							
							item = {
								sid:el.userCourseList.courseId,
								courseName:el.userCourseList.courseName,
								src:imgUrl,
								module:el.userCourseList.module,
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
		
			
	    	




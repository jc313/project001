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
				approveStatus:'',
				disabled:true,
				userHead:'',
				userHeadKey:'',
				userName:'',
				userInfo:'',
				position:'',
				officeUnit:'',
				achieve:'',
				usIntroduce:'',
				cnIntroduce:'',
				teacherType:2,
				sid:'',
				userObj:null,
				updateUser:function(){
					if(vm.userName == ''){alert('昵称不能为空');return}
					if(vm.userHead == ''){alert('头像不能为空');return}
					updateUser()
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userObj = obj;
						vm.sid = obj.sid;
						vm.userName = obj.userName;
						vm.userInfo = obj.userInfo;
						vm.userHead = obj.userHead;
						
					}
                }).ensure(function() {
                	userDetail();
                })
		    })
			avalon.scan(document.body);
		})
		/*
		用户详情 
		**/
		function userDetail(){
			postToServer('eduWeb/user/userDetail',{userId:vm.sid,},
				function(json){
				if(json.code == 2000){
				vm.approveStatus = json.data.user.approveStatus;
				if(vm.approveStatus == 1){
                	vm.disabled = false;
                	vm.position = json.data.teacher.position;
					vm.officeUnit = json.data.teacher.officeUnit;
					vm.achieve = json.data.teacher.achieve;
					vm.usIntroduce = json.data.teacher.usIntroduce;
					vm.cnIntroduce = json.data.teacher.cnIntroduce;
	                vm.teacherType = json.data.teacher.teacherType;
                }else{
	               
                }
					
				}else{
					alert(json.message)
				}
			})
		}
		/*
		跟新 
		**/
		function updateUser(){
			postToServer('eduWeb/user/updateUser',
			{
				sid:vm.sid,
				userHead:vm.userHeadKey,
				userName:vm.userName,
				userInfo:vm.userInfo,
				position:vm.position,
				officeUnit:vm.officeUnit,
				achieve:vm.achieve,
				usIntroduce:vm.usIntroduce,
				cnIntroduce:vm.cnIntroduce,
				teacherType:vm.teacherType,
			},
				function(json){
				if(json.code == 2000){
					alert(json.message)
					vm.userObj.userName = vm.userName;
					vm.userObj.userInfo = vm.userInfo;
					vm.userObj.userHead = vm.userHead;
					localStorage.setItem('userInfoJiuKe',JSON.stringify(vm.userObj))
				}else{
					alert(json.message)
				}
			})
		}
		document.getElementById("file").addEventListener("change", function(event){
        	var file = event.target.files[0];
            var img = new Image();
            var url = URL.createObjectURL(file);
            vm.src = url
            var form = new FormData();
           	var xhr = new XMLHttpRequest();
			form.append("file", file); 
            xhr.open("post", consult_url+'eduWeb/image/uploadImg', true);
  			xhr.onreadystatechange = function() {
	    		if (xhr.readyState == 4 && xhr.status == 200) {
	    			vm.userHead = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.userHeadKey = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	}); 
	});
		
			

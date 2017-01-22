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
				userObj:null,
				userId:'',
				userRealName:'',
				userIdCardno:'',
				userFrontCardpic:'',
				userFrontCardpicKey:'',
				userVersoCardpic:'',
				userVersoCardpicKey:'',
				certJsonStr1:'',
				certJsonStr2:'',
				certJsonStr3:'',
				certJsonStr1Key:'',
				certJsonStr2Key:'',
				certJsonStr3Key:'',
				certJsonStr:[],
				save:function(){
					if(vm.userRealName == ''){alert('用户真实姓名不能为空');return}
					if(vm.userIdCardno == ''){alert('用户身份证号不能为空');return}
					if(vm.userFrontCardpic == ''){alert('请上传身份证正面照');return}
					if(vm.userVersoCardpic == ''){alert('请上传身份证反面照');return}
					if(vm.certJsonStr1 == ''){alert('请上传资质证书');return}
					vm.certJsonStr.push({sid:vm.userId,userPicKey:vm.certJsonStr1Key})
					if(vm.certJsonStr2 != ''){
						vm.certJsonStr.push({sid:vm.userId,userPicKey:vm.certJsonStr2Key})
					}
					if(vm.certJsonStr3 != ''){
						vm.certJsonStr.push({sid:vm.userId,userPicKey:vm.certJsonStr3Key})
					}
					saveCertificate();
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userObj = obj;
						vm.userId = obj.sid;
						vm.userName = obj.userName;
						vm.userInfo = obj.userInfo;
						vm.userHead = obj.userHead;
					}
                }).ensure(function() {
                	userCertificateInfo()
                })
		    })
			avalon.scan(document.body);
		})
		
		/*
		详情
		 * */
		function userCertificateInfo(){
			postToServer('eduWeb/certificate/userCertificateInfo',{
				userId:vm.userId,
			},
			function(json){
				if(json.code == 2000){
					vm.userRealName = json.data.userDetail.userRealName;
					vm.userIdCardno = json.data.userDetail.userIdCardno;
					
					
					vm.userFrontCardpic = json.data.userDetail.userFrontCardUrl;
					vm.userVersoCardpic = json.data.userDetail.userVersoCardUrl;
					
					vm.userFrontCardpicKey = json.data.userDetail.userFrontCardpic;
					vm.userVersoCardpicKey = json.data.userDetail.userVersoCardpic;
					
					
					avalon.each(json.data.certificateList, function(index, el){
						if(index == 0){
							vm.certJsonStr1 = el.realPicUrl
							vm.certJsonStr1Key = el.userPicKey
						}else if(index == 1){
							vm.certJsonStr2 = el.realPicUrl
							vm.certJsonStr2Key = el.userPicKey
						}else if(index == 2){
							vm.certJsonStr3 = el.realPicUrl
							vm.certJsonStr3Key = el.userPicKey
						}
					})
				}else{
					alert(json.message)
				}
			})
		}
		/*
		上传 
		 * */
		function saveCertificate(){
			postToServer('eduWeb/certificate/saveCertificate',{
				userId:vm.userId,
				userRealName:vm.userRealName,
				userIdCardno:vm.userIdCardno,
				userFrontCardpic:vm.userFrontCardpicKey,
				userVersoCardpic:vm.userVersoCardpicKey,
				certJsonStr:JSON.stringify(vm.certJsonStr),
			},
			function(json){
				if(json.code == 2000){
					alert('上传成功')
				}else if(json.code == 5000){
					alert(json.message)
				}
			})
		}
		document.getElementById("userFrontCardpic").addEventListener("change", function(event){
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
	    			vm.userFrontCardpic = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.userFrontCardpicKey = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	}); 
    	document.getElementById("userVersoCardpic").addEventListener("change", function(event){
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
	    			vm.userVersoCardpic = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.userVersoCardpicKey = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	});
    	document.getElementById("certJsonStr1").addEventListener("change", function(event){
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
	    			vm.certJsonStr1 = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.certJsonStr1Key = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	}); 
    	document.getElementById("certJsonStr2").addEventListener("change", function(event){
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
	    			vm.certJsonStr2 = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.certJsonStr2Key = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	}); 
    	document.getElementById("certJsonStr3").addEventListener("change", function(event){
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
	    			vm.certJsonStr3 = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.certJsonStr3Key = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	}); 
		
		
	});
		
			
	    	




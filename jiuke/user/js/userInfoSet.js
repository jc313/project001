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
				oldPwd:'',
				newPwd:'',
				userName:'',
				updatePwd:function(){
					if(vm.oldPwd == ''  || vm.oldPwd == null){
						alert('旧密码不能为空')
						return
					}
					if(vm.newPwd == ''  || vm.newPwd == null){
						alert('新密码不能为空')
						return
					}
					updatePwd()
				}
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userId = obj.sid;
						vm.userName = obj.loginName;
					}
                }).ensure(function() {
                	
                })
		    })
			avalon.scan(document.body);
		})
		
		function updatePwd(){
			postToServer('eduWeb/user/updatePwd',{userId:vm.userId,oldPwd:vm.oldPwd,newPwd:vm.newPwd},function(json){
				if(json.code == 2000){
					alert(json.message)
					vm.oldPwd = '';
					vm.newPwd = '';
				}else{
					alert(json.message)
				}
				
			})
		}
	});
		
			
	    	




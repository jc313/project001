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
				loginName:"",
				password:"",
				code:"",
				login:function(){
					
				},
				register:function(){
					
				},
				userInfo:function(){
					location.href = '../user/userInfo.html'
				},
				tab:function(href){
					location.href = href;
					
				},
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					
                }).ensure(function() {
//              	initDate()
                })
		    })
			avalon.scan(document.body);
		})
		
		function initDate(){
			postToServer('eduWeb/teacher/queryHotTeacher',{start:1,pageSize:4},function(obj){
				
			})
		}
	});
		
			
	    	




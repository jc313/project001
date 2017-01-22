	require.config({
        paths: {
			avalon: '../../js/avalon',
			deferred: '../../js/deferred',
			jquery:'../../js/jquery',
        	bootstrap:'../../js/bootstrap',
            ajax:'../../js/ajax/ajax',
            fetch:'../../js/ajax/jquery',
            util:'../../js/util',
            wangEditor:'../../wangEditor/dist/js/wangEditor',
        },
        shim: {
            avalon:{exports:"avalon"},
			fetch:{exports:"fetch"},
			jquery:{exports:"jquery"},
            bootstrap:{deps:['jquery'],exports:'bootstrap'},
            wangEditor:{deps:['jquery'],exports:'wangEditor'},
		  	ajax:{deps:['jquery'],exports:'ajax'},
		  	util:{exports:'util'},
	    }
    });
    var editor = null;
	requirejs(['avalon','bootstrap','ajax','util','deferred','wangEditor'], function(avalon,bootstrap,ajax,util,deferred,wangEditor) {
		avalon.ready(function () {
			avalon.config({debug: true})
			vm = avalon.define({
				$id:"init",
				userId:'',
				show1:true,
				show2:false,
				src:'',
				key:'',
				number:1,
				courseTitle:[],
				courseMins:[],
				courseUrl:[],
				causeType:'精品课程',
				courseName:'',
				courseTeacher:'',
				price:1,
				studyObejct:'',
				teacherIntroduce:'',
				isHot:1,
				isFree:0,
				courseHourNum:0,
				courseLanguage:'',
				coursePurpose:'',
				courseOutline:'',
				openCourseCity:'',
				openCourseTime:'',
				bpEntityArray:[],
				courseTimeArray:[],
				classList:[],
				addClass:function(){
					vm.number++;
					vm.classList.push({'classNumber':'第'+vm.number+'节'})
				},
				removeClass:function(){
					vm.number--;
					avalon.Array.removeAt(vm.classList,vm.number)
				},
				save:function(){
					if(vm.courseName == ''){alert('课程标题不能为空');return}
					if(vm.courseTeacher == ''){alert('主讲教师不能为空');return}
					if(vm.teacherIntroduce == ''){alert('教师介绍不能为空');return}
					if(vm.isFree == 1){
						if(vm.price == ''){alert('课程价格不能为空');return}
					}
					if(vm.src == ''){alert('课程封面不能为空');return}
					
					vm.bpEntityArray.push({"businessPicKey":vm.key,"isMain":"1"})
					if(vm.show1){
						avalon.each(document.getElementsByClassName('courseTitle'), function(index, el){
							if(el.value == '' || el.value == null){
								alert('课时标题不能为空')
								vm.courseTitle = [];
								return
							}else{
								vm.courseTitle.push(el.value)
							}
							
						})
						avalon.each(document.getElementsByClassName('courseMins'), function(index, el){
							if(el.value == '' || el.value == null){
								alert('课时长度不能为空')
								vm.courseMins = [];
								return
							}else{
								vm.courseMins.push(el.value)
							}
						})
						avalon.each(document.getElementsByClassName('courseUrl'), function(index, el){
							if(el.value == '' || el.value == null){
								alert('课时链接不能为空')
								vm.courseUrl = [];
								return
							}else{
								vm.courseUrl.push(el.value)
							}
						})
						avalon.each(vm.classList, function(index, el){
							vm.courseHourNum = vm.courseHourNum +1;
							vm.courseTimeArray.push({"courseTitle":vm.courseTitle[index],"courseMins":vm.courseMins[index],"courseUrl":vm.courseUrl[index]})
						})
						saveBoutiqueCourse();
					}else{
						saveExpandCourse();
					}
				},
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
					vm.classList.push({'classNumber':'第'+vm.number+'节'})
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userObj = obj;
						vm.userId = obj.sid;
					}
                }).ensure(function() {
                	init()
                })
			   	vm.$watch('causeType', function(a){
			     	if(a == '精品课程'){
			     		vm.show1 = true;
						vm.show2 = false;
			     	}else if(a == '拓展课程'){
			     		vm.show1 = false;
						vm.show2 = true;
			     	}
			    })
		    })
			avalon.scan(document.body);
		})
		/*
		新增精品课程 
		 * */
		function saveBoutiqueCourse(){
			postToServer('eduWeb/boutique/saveBoutiqueCourse',
			{
				courseName:vm.courseName,
				courseTeacher:vm.courseTeacher,
				price:vm.price,
				courseIntro:editor.$txt.html(),
				studyObejct:vm.studyObejct,
				teacherIntroduce:vm.teacherIntroduce,
				userSid:vm.userId,
				isHot:vm.isHot,
				isFree:vm.isFree,
				bpEntityArray:JSON.stringify(vm.bpEntityArray),
				courseTimeArray:JSON.stringify(vm.courseTimeArray),
				courseHourNum:vm.courseHourNum,
			},function(json){
				if(json.code == 2000){
					alert('新增成功')
					vm.courseTimeArray = [];
				}else{
					alert(json.message)
				}
			})
		}
		/*
		新增拓展课程 
		**/
		function saveExpandCourse(){
			postToServer('eduWeb/expand/saveExpandCourse',
			{
				courseName:vm.courseName,
				teacherName:vm.courseTeacher,
				courseContent:editor.$txt.html(),
				courseType:'',
				courseLanguage:vm.courseLanguage,
				coursePurpose:vm.coursePurpose,
				courseOutline:vm.courseOutline,
				introduce:vm.teacherIntroduce,
				userSid:vm.userId,
				bpEntityArray:JSON.stringify(vm.bpEntityArray),
				price:vm.price,
				isFree:vm.isFree,
				openCourseCity:vm.openCourseCity,
				openCourseTime:vm.openCourseTime,
			},function(json){
				if(json.code == 2000){
					alert('新增成功')
					vm.courseTimeArray = [];
				}else{
					alert(json.message)
				}
			})
		}
		function init(){
			editor = new wangEditor('editor-trigger');

	        // 上传图片
	        editor.config.uploadImgUrl = 'http://192.168.1.214:8080/eduWeb/image/upload';
	        // 自定义上传事件
	        editor.config.uploadImgFns.onload = function (resultText, xhr) {
	            // resultText 服务器端返回的text
	            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
	            // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
	            var originalName = editor.uploadImgOriginalName || ''; 
//	            var url = jQuery.parseJSON(resultText).keyUrl
			// 如果 resultText 是图片的url地址，可以这样插入图片：
	            editor.command(null, 'insertHtml', '<img src="' + resultText + '" alt="' + originalName + '" style="max-width:100%;"/>');
	            // 如果不想要 img 的 max-width 样式，也可以这样插入：
	            // editor.command(null, 'InsertImage', resultText);
	        };
	        editor.create();
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
	    			vm.src = jQuery.parseJSON(xhr.responseText).keyUrl;
	    			vm.key = jQuery.parseJSON(xhr.responseText).key;
				}
    		};
            xhr.send(form);
    	}); 
	});
		
			
	    	




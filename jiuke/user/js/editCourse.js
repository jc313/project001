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
				sid:'',
				module:'',
				show1:true,
				show2:false,
				src:'',
				key:'',
				number:0,
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
				courseHourNum:'1',
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
					vm.classList.push({'classNumber':'第'+vm.number+'节',courseTitle:'',courseUrl:'',courseMinsel:''})
				},
				removeClass:function(){
					vm.number--;
					avalon.Array.removeAt(vm.classList,vm.number)
				},
				save:function(){
					if(vm.hide1){
						$('#login').modal('show');
						return
					}
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
							vm.courseTimeArray.push({"courseTitle":vm.courseTitle[index],"courseMins":vm.courseMins[index],"courseUrl":vm.courseUrl[index]})
						})
						updateBoutiqueCourse();
					}else{
						updateExpandCourse();
					}
				},
			});
			vm.$watch('onReady', function(){
                aaa().then(function() {
                	vm.sid = getParamValueOfURL(window.location.href,'sid');
                	vm.module = getParamValueOfURL(window.location.href,'module');
					var obj = jQuery.parseJSON(localStorage.getItem('userInfoJiuKe'));
					var flag = avalon.isObject(obj)
					if(flag){
						vm.userObj = obj;
						vm.userId = obj.sid;
					}
					if(vm.module == 'edu_boutique_course'){
						vm.causeType = '精品课程';
						vm.show1 = true;
						vm.show2 = false;
					}else if(vm.module == 'edu_expand_course'){
						vm.causeType = '拓展课程';
						vm.show1 = false;
						vm.show2 = true;
					}
                }).ensure(function() {
                	init()
                	if(vm.module == 'edu_boutique_course'){
						boutiqueCourseDetail();
					}else if(vm.module == 'edu_expand_course'){
						expandCourseDetail();
					}
                })
		    })
			avalon.scan(document.body);
		})
		
		/*
		精品课程详情 
		 * */
		function boutiqueCourseDetail(){
			postToServer('eduWeb/boutique/boutiqueCourseDetail',
			{
				sid:vm.sid,
				userId:vm.userId,
			},function(json){
				if(json.code == 2000){
					var number = 1;
					vm.courseName = json.data.boutique.courseName;
					vm.courseTeacher = json.data.boutique.courseTeacher;
					vm.teacherIntroduce = json.data.boutique.teacherIntroduce;
					editor.$txt.append(json.data.boutique.courseIntro);
					
					vm.isHot = json.data.boutique.isHot;
					try{
						vm.src = json.data.picList[0].realPicUrl;
						vm.key = json.data.picList[0].businessPicKey;
					}catch(e){
						//TODO handle the exception
					}
					vm.studyObejct = json.data.boutique.studyObejct;
					vm.isFree = json.data.boutique.isFree;
					vm.price = json.data.boutique.price;
					vm.courseHourNum = json.data.boutique.courseHourNum;
					
					avalon.each(json.data.courseTimeList, function(index, el){
						number = index + 1;
						vm.number = vm.number +1
						vm.classList.push(
							{
								index:number,
								classNumber:'第'+number+'节',
								courseTitle:el.courseTitle,
								courseUrl:el.courseUrl,
								courseMinsel:el.courseMins
							}
						);
						
					})
				}else{
					alert(json.message)
				}
			})
		}
		/*
		拓展课程详情 
		 * */
		function expandCourseDetail(){
			postToServer('eduWeb/expand/expandCourseDetail',
			{
				sid:vm.sid,
				userId:vm.userId,
			},function(json){
				if(json.code == 2000){
					vm.courseName = json.data.expandCourse.courseName;
					vm.courseTeacher = json.data.expandCourse.teacherName;
					vm.teacherIntroduce = json.data.expandCourse.introduce;
					editor.$txt.append(json.data.expandCourse.courseContent);
					vm.isHot = json.data.expandCourse.isHot;
					try{
						vm.src = json.data.picList[0].realPicUrl;
						vm.key = json.data.picList[0].businessPicKey;
					}catch(e){
						//TODO handle the exception
					}
					vm.isFree = json.data.expandCourse.isFree;
					vm.price = json.data.expandCourse.price;
					vm.courseLanguage = json.data.expandCourse.courseLanguage;
					vm.coursePurpose = json.data.expandCourse.coursePurpose;
					vm.courseOutline = json.data.expandCourse.courseOutline;
					vm.openCourseCity = json.data.expandCourse.openCourseCity;
					vm.openCourseTime = json.data.expandCourse.openCourseTime;
					
				}else{
					alert(json.message)
				}
			})
		}
		/*
		编辑精品课程 
		 * */
		function updateBoutiqueCourse(){
			postToServer('eduWeb/boutique/updateBoutiqueCourse',
			{
				sid:vm.sid,
				courseName:vm.courseName,
				courseTeacher:vm.courseTeacher,
				price:vm.price,
				courseIntro:editor.$txt.html(),
				studyObejct:vm.studyObejct,
				teacherIntroduce:vm.teacherIntroduce,
				userSid:vm.userId,
				bpEntityArray:JSON.stringify(vm.bpEntityArray),
				courseTimeArray:JSON.stringify(vm.courseTimeArray),
				courseHourNum:vm.courseHourNum,
				isFree:vm.isFree,
			},function(json){
				if(json.code == 2000){
					alert('修改成功')
					location.href = 'userInfoQuestion.html';
				}else{
					alert(json.message)
				}
			})
		}
		/*
		编辑拓展课程 
		 * */
		function updateExpandCourse(){
			postToServer('eduWeb/expand/updateExpandCourse',
			{
				sid:vm.sid,
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
				pice:vm.price,
				isFree:vm.isFree,
				openCourseCity:vm.openCourseCity,
				openCourseTime:vm.openCourseTime,
			},function(json){
				if(json.code == 2000){
					alert('修改成功')
					location.href = 'userInfoQuestion.html';
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
		
			
	    	




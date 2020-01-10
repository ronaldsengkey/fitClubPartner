var urlService = 'http://localhost:8888//ronaldSengkey/fitClub/api/v1/';
var fieldTextInput = '<input type="text" class="form-control fieldText">';
var fieldEmailInput = '<input type="email" class="form-control fieldEmail">';
var fieldPswdInput = '<input type="password" class="form-control fieldPswd">';
var fieldSelect = '<select class="form-control select2"></select>';
var target, uri, dom, data, userId, userName, userRole = '';
var backBtn = '<button type="button" id="backBtn" data-target="index" style="position:fixed;right:7%;bottom:5%;" class="btn bg-blue btn-circle-lg waves-effect waves-circle waves-float">'+
	'<i class="material-icons">keyboard_arrow_left</i>'+
'</button>';
$(function() {
	if($('#indexPage').length > 0){
		// validate();
	}
	if($('#loginPage').length > 0){
		// validate('login');
		// $('body').append(backBtn);
		// controlBackBtn('registration');
	}
	if($('#registerPage').length > 0){
		// $('body').append(backBtn);
		// controlBackBtn('index');
		// validate();
		select2Activated();
	}if($('#profilePage').length > 0){
		// validate();
	}if($('#classHistoryPage').length > 0){
		// validate('memberClass');
	}if($('#classDetail').length > 0){
		// validate('classDetail');
	}
	if($('#classSchedule').length > 0){
		// validate('classSchedule');
	}
	setTimeout(function() {
		$('.page-loader-wrapper').fadeOut( 400, "linear" );
	}, 300);
});
$(document).on('click', '.memberClass', function(){
	let memberClass = {classDetail:$(this).data('classId')};
	let json = JSON.stringify(memberClass);
	localStorage.removeItem('classDetail')
	localStorage.setItem('classDetail',json)
})

$(document).on('click', '#logout', function(){
	logout();
})

$(document).on('click','#newProgress',(function(e){	
	$('#bodyProgress').modal('show');
}))

$(document).on('submit','#imgProfile',(function(e) {
	e.preventDefault();
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
	if (regex.test($('#profilePicture').val().toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			$.ajax({
				url: urlService+'/update/user',
				type: "POST",
				data:  new FormData(this),
				mimeType:"multipart/form-data",
				contentType: false,
				cache: false,
				processData:false,
				success: function(callback)
				{
					var json = JSON.parse(callback);
					notification(json.response,"Update success");
					if($('#name').val() != '' && $('#gender').val() != ''
						&& $('#phone').val() != '' && $('#address').val() != ''){
							$('#updateProfile').remove();
							$('#skipNav').find('span').html("Let's Go");
					}
					var userId = localStorage.getItem("userId");
					var param = {'token':12345678,'filter':'getProfile','dataId':userId};
					postData('read','user',param);
				},complete: function() {
					
				}
			 });
		} else {
			alert("File can't readed.");
		}
	} else {
		notification(200,"Update success");
		// alert("Please upload a valid image file.");
	}
}));


$(document).on('click','.clickable',function(){
	target = $(this).data('target');
	uri = $(this).data('uri');
	dom = $(this).data('dom');
	if(dom  !== undefined && uri === undefined && target !== undefined){
		getPage(dom,target,'');
	}
	if(dom === undefined && uri === undefined && target !== undefined){
		getPage("",target,'');
	}
	if(uri !== undefined && target !== undefined){
	}
});

$(document).on('click','#getImge',function(){
	$('#profilePicture').click();
});
$(document).on('change','#profilePicture',function(){
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
	if (regex.test($(this).val().toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();
			reader.onload = function (e) {
				$("#dvPreview").attr("src", e.target.result).css({'width':'90px','height':'90px'});
			}
			reader.readAsDataURL($(this)[0].files[0]);
		} else {
			alert("File can't readed.");
		}
	} else {
		alert("Please upload a valid image file.");
	}
})


$(document).on('click','button, a',function(){
	target = $(this).data('target');
	uri = $(this).data('uri');
	dom = $(this).data('dom');
	filter = $(this).data('filter');
	switch (target) {
		case "memberRegistration":
			getPage("", target, "");
			break;
	}
	if(dom  !== undefined && uri === undefined && target !== undefined){
		getPage(dom,target,'');
	}
	if(dom === undefined && uri === undefined && target !== undefined){
		getPage("",target,'');
	}
	if(uri !== undefined && target !== undefined){
		if(uri == 'create'){
			if(filter == 'memberRegister' && target == 'user'){
				data = {'token':12345678,'filter':filter,'name':$('#name').val(),'phone':$('#phone').val(),'email':$('#email').val(),'password':$('#password').val()};
			}else if(filter == 'trainerRegister' && target == 'user'){
				data = {'token':12345678,'filter':filter,'name':$('#name').val(),'email':$('#email').val(),'password':$('#password').val(),
				'specialization':specialization};
			}
		}else if(uri == 'read'){
			if(filter == 'confirmCode' && target == 'user'){
				data = {'token':12345678,'filter':filter,'verificationCode':$('#verificationCode').val(),'dataId':$(this).data('id')}
			}else if(filter == 'login'){
				data = {'filter':filter,'email':$('#email').val(),'password':$('#password').val()}
			}
			// data = {'name':$('#name').val(),'email':$('#email').val(),'password':$('#password').val()}
		}else if(uri = 'update'){
			if(filter == 'resendCode' && target == 'user'){
				data = {'token':12345678,'filter':filter,'dataId':$(this).data('id')}
			} else if(filter == 'profileUser' && target == 'user'){
				data = {'token':12345678,'filter':filter,'dataId':$(this).data('id'),'name':$('#name').val(),
				'gender':$('#gender').val(),'phone':$('#phone').val(),'address':$('#address').val()}
			}
		}
		console.log("check data =>", data);
		postData(uri,target,data);
	}
});

$(document).on('click','#joinClass', function(){
	window.location = 'classSchedule.html';
});

$(document).on('click', '.selectClass', function(){
	alert('run')
})

$(document).on('keyup','.search', function(){
	var filter = $(this).val(), count = 0;
	
	var idTarget = '#'+$(this).data('target');
	var path = $(idTarget).closest('.wrapcontentList');
	
	$(idTarget+' li').each(function(){

		if ($(this).text().search(new RegExp(filter, "i")) < 0) {
			$(this).fadeOut();

		} else {
			$(this).show();
			count++;
		}
	});

	var numberItems = count;
	var hasil = "<b class='filterResult font-bold col-pink'>Matching records found = "+numberItems+"</b>";
	$('.filterResult').remove();
	$(hasil).insertAfter(path);
});


function logout(){
	localStorage.removeItem("dataProfile");
	window.location.href = "index.html";
}

function notification(cat,T){
	if(cat == 200){
		swal({
		  title: "Proccess success!",
		  text: T,
		  icon: "success",
		  button: "Thanks!",
		});
	$(".sweet-alert").css({'background-color':'#2196F3'});
	}else if(cat == 500){
		swal({
		  title: "Proccess failed!",
		  text: T,
		  icon: "error",
		  button: "Thanks!",
		});
		$(".sweet-alert").css({'background-color':'#F44336'});
	}
	
	$(".sweet-alert").find('p').css({'color':'#fff'});
	$(".sweet-alert").find('h2').css({'color':'#fff'});
	$(".sweet-alert").find('button').css({'background':'#03A9F4'});
}

function controlBackBtn(page){
	$('#backBtn').attr('data-target',page);
}

function loadingActive(){
	$('.page-loader-wrapper').fadeIn( 400, "linear" );
}
function loadingDeactive(){
	$('.page-loader-wrapper').fadeOut( 400, "linear" );
}

async function validate(param){
	let dataProfile = localStorage.getItem("dataProfile");
	try{
		if(dataProfile){
			switch(param){
				case "login":
					window.location = "classHistory.html";
					break;
				case "memberClass":
					let c =  await getData("memberClass");
					console.log(c);
					let a = document.getElementById('classHistroryWrap');
					if(c.responseCode == '404'){
						let html = "<img style='width:50%;' src='https://uploads-ssl.webflow.com/5d1f053cee3b9da3d699a858/5d2aaced187e9368f0c098c9_gym.svg'>"+
						"<h4>Oops you haven't follow any class yet</h4>"+
						"<button class='btn btn-block btn-primary mt-3' id='joinClass'>Join Class Now ?</button>";
						a.innerHTML= html;
					}
					else if(c.responseCode == '401'){
						logout();
					}
					break;
				case "classDetail":
					let gd = await getData(param);
					break;
				case "classSchedule":
					let gda  = await getData(param);
					break;
				// default:
				// 	window.location = "index.html";
				// 	break;
			}
			// if($('#profilePage').length > 0 ){
				// $('#userName').html(userName);
				// $('#name').val(userName);
				// $('.wrapImg').attr('data-id',userId);
				// $('#updateProfile').attr('data-id',userId);
				// $('#bodyProgress').attr('data-id',userId);
				// $('#uploadImgProfile').val(userId);
				// var param = {'token':12345678,'filter':'getProfile','dataId':userId};
				// postData('read','user',param);
			// }if($('#classHistoryPage').length > 0){
			// 	$('#userName').html(dataProfile.name);
			// 	$('#name').val(dataProfile.name);
			// 	var param = {'dataId':dataProfile.memberId};
				// postData('read','classHistory',param);
			// }
			// else{ getPage("",'profile',''); }
		}else{
			alert(dataProfile);
			// switch(param){
			// 	case "memberClass":
			// 		logout();
			// 		break;
			// }
			// window.location = "index.html";
			// logout();
		// 	if($('#indexPage').length == 0 && $('#registerIntroPage').length == 0 && $('#registerPage').length == 0 && $('#loginPage').length == 0){
		// 		getPage("","index",'');
		// 	}
		}
	}catch(err){
		console.log(err)
		return 500;
	}
}

function callModal(content){
	$('#largeModal').modal({backdrop: 'static', keyboard: false, show:true}); 
	$('.modal-body').empty(''); 
	$('.modal-body').html(''); 
	$('.modal-body').html(content); 
}


$(document).on('click', '#submitOtp', function(){
	let otpCode = $('#otpCode').val();
	let email = $('#email').val();
	let phone = $('#phone').val();
	let dd = {otpCode:otpCode, phone:phone, email:email};
	$.ajax({
		url: urlService+'otp',
		  crossDomain: true,
		  method: "PUT",
		  headers: {
			  "Content-Type": "application/json",
			  "Accept": "*/*",
			  "Cache-Control": "no-cache",
			  "Host": "localhost:8888",
			  "Accept-Encoding": "gzip, deflate",
			  "Connection": "keep-alive",
	  },
		data: JSON.stringify(dd),
		success: function(callback){
			let text = "";
			switch(callback){
				case 500:
					text = "Oops internal server error, please try again!"
					break;
				default:
					text = "Confirmation Success, Please login"
					break;
			}
			notification(callback,text)
			setTimeout(function () {
				if($(".sweet-alert").length > 0){
					swal.close();
					if(callback == "200"){
						getPage("","index","");
					}else{
						location.reload();
					}
				}
			}, 1000);
		}
	})
});
function getData(data) {
	return new Promise(async function (resolve, reject) {
        try{
			let profile = JSON.parse(localStorage.getItem('dataProfile'));
			let directory = '';
			switch(data){
				case "memberClass":
					directory = 'class/memberClass/'+profile.data.accessToken;
					break;
				case "classDetail":
					let p = JSON.parse(localStorage.getItem('classDetail'));
					directory = 'class/detail/'+profile.data.accessToken+'/'+p.classId;
					break;
				case "classSchedule":
					directory = 'class/'+profile.data.accessToken;
					break
			}
			$.ajax({
				url: urlService+directory,
				crossDomain: true,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Accept": "*/*",
					"Cache-Control": "no-cache",
					"Accept-Encoding": "gzip, deflate",
					"Connection": "keep-alive",
			},
				success: function(callback){
					resolve(callback);
				}
			})
		}catch(err){
			console.log(err)
			return 500;
		}
	})
}
// function getData(param){
// 	let profile = JSON.parse(localStorage.getItem('dataProfile'));
// 	let directory = '';
// 	switch(param){
// 		case "memberClass":
// 			directory = 'class/memberClass/'+profile.data.accessToken;
// 			break;
// 	}
// 	$.ajax({
// 		url: urlService+directory,
// 		  crossDomain: true,
// 		  method: "GET",
// 		  headers: {
// 			  "Content-Type": "application/json",
// 			  "Accept": "*/*",
// 			  "Cache-Control": "no-cache",
// 			  "Accept-Encoding": "gzip, deflate",
// 			  "Connection": "keep-alive",
// 	  },
// 		success: function(callback){
// 			console.log('wkwkwkwk ======>', callback);
// 			return callback;
// 		}
// 	})
// }

function postData(uri,target,dd){
	loadingActive();
	console.log("check", uri, "check", target, "check", dd);
	if(target == 'login'){
		$.ajax({
			url: urlService+'/'+target,
			type: "POST",
			data:dd,
			success: function(callback){
				switch (callback.responseCode){
					case "200":
						notification(200,"Login success");
						break;
				}
				loadingDeactive();
				localStorage.setItem("dataProfile",  JSON.stringify(callback.data));
				window.location.href = 'classHistory.html';
			}
		});
	}else if(target == 'classHistory'){
		$.ajax({
			url: urlService+'/class/history'+dd.dataId,
			type: "GET",
			success: function(callback){
				loadingDeactive();
				console.log('ini ya =====>',callback)
			}
		});
	}else{
		let link = "";
		switch (data.filter){
			case "memberRegister":
				link = urlService + "register"
				break;
		}
		$.ajax({
		  url: link,
			crossDomain: true,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*",
				"Cache-Control": "no-cache",
				"Host": "localhost:8888",
				"Accept-Encoding": "gzip, deflate",
				"Content-Length": "178",
				"Connection": "keep-alive",
				"cache-control": "no-cache"
		},
		  data: JSON.stringify(dd),
		  success: function(callback){
				loadingDeactive();
				// var json = JSON.parse(callback);
				// console.log("check json ==>", json)
					// console.log(dd.filter);
					if(dd.filter == 'resendCode' || dd.filter == 'memberRegister' || dd.filter == 'trainerRegister'){
						console.log(callback);
						switch (callback.responseCode) {
							case "200":
								let content = '<input type="text" class="form-control" id="otpCode">'+
								"<b><small style='color:#fff;'>Your verification code has been send in your email address, Please check your email, and verify your account</small></b>"
								callModal(content);

								console.log(callback)
								// alert();	
								break;
							case "406":
								alert(callback.responseMessage);	
								break;
						}
						// if(callback.response == 200){
						// 	notification(json.response,"Please check your inbox mail, to have your verification code");
						// 	getPage('.container-wrap','verification',json.dataId);
						// }else{
						// 	notification(json.response,json.reason);
						// }
					}else if(dd.filter == 'confirmCode'){
						$.each($(json), function(i) {
							localStorage.setItem("userId", json[i].id);
							localStorage.setItem("userName", json[i].name);
						});
						window.location.href = 'profile.html';
					}else if(dd.filter == 'profileUser'){
						$('#imgProfile').submit();
					}else if(dd.filter == 'getProfile'){
						var gc = '';
						$.each($(json), function(i) {
							if(json[i].gender == 1){
								gc = '<option value="'+json[i].gender+'">Male</option>'+
								'<option value="2">Female</option>';
							}else{
								gc = '<option value="'+json[i].gender+'">Female</option>'+
								'<option value="1">Male</option>';
							}
							$('#gender').empty();$('#gender').append(gc);
							$('#phone').val(json[i].phone);
							$('#address').val(json[i].address);
							$('#dvPreview').attr("src",json[i].imgProfile).css({'width':'90px','height':'90px'});
							console.log(json);
						});
						if($('#name').val() != '' && $('#gender option:selected').val() != ''
							&& $('#phone').val() != '' && $('#address').val() != ''){
								$('#updateProfile').remove();
								$('#skipNav').find('span').html("Let's Go");
						}
						if($('#classHistoryPage').length > 0){
							$.each($(json), function(i) {
								$('#userName').html(json[i].name);
								$('#imgUser').attr("src",json[i].imgProfile).css({'width':'90px','height':'90px'});
							});
						}
					}
				setTimeout(function () {
					if($(".sweet-alert").length > 0){
						swal.close();
					}
				}, 950);
		  }
		});

	}
}

function select2Activated(){
	$(".select2").select2({
		placeholder: 'Select Here'
	});$(".tags").select2({
		tags: true,
		tokenSeparators: [','],
		placeholder: 'Select Here'
	});
	$('.select2').css({"width":"100%"});
}

function getPage(dom,target,param){
	if(dom != ''){
		$.ajax({
			url:target+'.html',
			success: function(response) {
				$(dom).empty();
				$(dom).html();
				$(dom).html(response);
				if(target == 'forgotPassword'){
					controlBackBtn('login');
				}
				if(target == 'verification'){
					$('.container-wrap').css({'margin-top':'60%'});
					$('#resendCode').attr('data-id',param);
					$('#confirmCode').attr('data-id',param);
					controlBackBtn('login');
				}
				loadingDeactive();
			}
		});
	}else{
		window.location.href = target+'.html';
	}
}

function dataTablleActivated(){
	$('.dataTable').dataTable();
}
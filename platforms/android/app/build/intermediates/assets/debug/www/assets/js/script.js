// var urlService = 'http://localhost/fc/services/';
var urlService = 'https://fitclubservice.000webhostapp.com/service/';
var fieldTextInput = '<input type="text" class="form-control fieldText">';
var fieldEmailInput = '<input type="email" class="form-control fieldEmail">';
var fieldPswdInput = '<input type="password" class="form-control fieldPswd">';
var fieldSelect = '<select class="form-control select2"></select>';
var target, uri, dom, data, userId, userName, userRole = '';
var backBtn = '<div style="position:fixed;right:7%;bottom:7.5%;z-index:12;"><button type="button" id="backBtn" data-target="index" class="btn bg-blue btn-circle-lg waves-effect waves-circle waves-float">'+
	'<i class="material-icons">keyboard_backspace</i>'+
'</button></div>';
var status = '';
$(function() {
	
	if($('#indexPage').length > 0){
		validate();
	}
	if($('#loginPage').length > 0){
		$('body').append(backBtn);
		controlBackBtn('registration');
	}if($('#classSchedulePage').length > 0){
		// $('body').append(backBtn);
		// controlBackBtn('classHistory');
	}if($('#registerPage').length > 0){
		// $('body').append(backBtn);
		// controlBackBtn('index');
		validate();
		select2Activated();
	}if($('#profilePage').length > 0){
		validate();
	}if($('#classHistoryPage').length > 0){
		validate();
	}if($('#classTrain').length > 0){
		var data = {'token':12345678,'filter':'classList'}
		postData('read','class',data);
	}if($('#membershipPage').length > 0){
		// $('body').append(backBtn);
		// controlBackBtn('classHistory');
		validate();
	}if($('#bodyProgressPage').length > 0){
		// $('body').append(backBtn);
		// controlBackBtn('classHistory');
		validate();
	}
	setTimeout(function() {
		$('.page-loader-wrapper').fadeOut( 400, "linear" );
	}, 300);
});

$(document).on('click','#newProgress',function(){
	var param = {'token':12345678,'filter':'optionCategory'};
	postData('read','bodyProgress',param);
	$('#myModal').modal('show');
});

$(document).on('click','#callAdmin',function(){
	window.location.href = "tel:085854223422";
});
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
							// $('#updateProfile').remove();
							// $('#skipNav').find('span').html("Let's Go");
							if($('#classHistoryPage').length == 0)
							{
								getPage('','classHistory','');
							}
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

$(document).on('click','.logout',function(){
	logout();
});

$(document).on('click','.clickable',function(){
	var target = $(this).data('target');
	var uri = $(this).data('uri');
	var dom = $(this).data('dom');
	if(dom  !== undefined && uri === undefined && target !== undefined){
		getPage(dom,target,'');
	}
	if(dom === undefined && uri === undefined && target !== undefined){
		getPage("",target,'');
	}
	if(uri !== undefined && target !== undefined){
		var filter = $(this).data('filter');
		var param = $(this).data('id');
		var dom = $(this).data('dom');
		var data = '';
		if(filter == 'classDetail'){
			data = {'token':12345678,'filter':filter,'dom':dom,'param':param}
		}if(filter == 'classListDetail'){
			var classId = $(this).data('classid');
			var userId = $(this).data('userid');
			data = {'token':12345678,'filter':filter,'dom':dom,'classId':classId,'userId':userId}
		}if(filter == 'timeDetail'){
			var date = $(this).data('param')
			data = {'token':12345678,'filter':filter,'dom':dom,'date':date,'memberId':$(this).data('memberid')};
		}if(filter == 'coachProfile'){
			data = {'token':12345678,'filter':filter,'dom':dom,'coachId':$(this).data('id')};
		}
		postData(uri,target,data);
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
	if(dom  !== undefined && uri === undefined && target !== undefined){
		getPage(dom,target,'');
	}
	if(dom === undefined && uri === undefined && target !== undefined){
		getPage("",target,'');
	}
	if(uri !== undefined && target !== undefined){
		if(uri == 'create'){
			if(filter == 'memberRegister' && target == 'user'){
				data = {'token':12345678,'filter':filter,'name':$('#name').val(),'email':$('#email').val(),'password':$('#password').val()};
			}else if(filter == 'trainerRegister' && target == 'user'){
				data = {'token':12345678,'filter':filter,'name':$('#name').val(),'email':$('#email').val(),'password':$('#password').val(),
				'specialization':$('#classTrain').val()};
			}else if(filter == 'gabungClass'){
				var listClass =[];
				if($('.classOption:checked').length > 1){
					$.each($('.classOption:checked'), function(i) {
						listClass.push($(this).data('id'));
					});
				}else{
					listClass = $('.classOption:checked').data('id');
				}
				data = {'token':12345678,'filter':filter,'memberId':$(this).data('memberid'),'listClass':listClass};
			}else if(filter == 'joinMember' && target == 'member'){
				data = {'token':12345678,'filter':filter,'memberId':$(this).data('memberid'),'userId':$(this).data('userid'),'memberCat':$(this).data('membercat')};
			}else if(filter == 'personalBodyProgress' && target == 'bodyProgress'){
				var userId = localStorage.getItem("userId");
				data =  {'token':12345678,'filter':filter,'userId':userId,'category':$('#categories').val(),'value':$('#progressValue').val()}
			}else if(filter == 'coachSchedule' && target == 'class'){
				var userId = localStorage.getItem("userId");
				data =  {'token':12345678,'filter':filter,'userId':userId,'class':$('#classOptionList').val(),
				'classDate':$('#classDate').val(),'startTime':$('#startTime').val(),'endTime':$('#endTime').val()}
			}
		}else if(uri == 'read'){
			if(filter == 'confirmCode' && target == 'user'){
				data = {'token':12345678,'filter':filter,'verificationCode':$('#verificationCode').val(),'dataId':$(this).data('id')}
			}else if(filter == 'login'){
				data = {'token':12345678,'filter':filter,'email':$('#email').val(),'password':$('#password').val()}
			}else if(filter == 'classList' && target == 'class'){
				$('#blankClass').remove();
				data = {'token':12345678,'filter':filter,'userId':$(this).data('id')}
			}else if(filter == 'checkMember' && target == 'member'){
				var userId = localStorage.getItem("userId");
				data = {'token':12345678,'filter':filter,'classId':$(this).data('id'),'userId':userId}
			}else if(filter == 'classSchedule' && target == 'class'){
				var userId = localStorage.getItem("userId");
				data = {'token':12345678,'filter':filter,'classId':$(this).data('id'),'className':$(this).data('classname'),'userId':userId}
			}else if(filter == 'viewProgress' && target == 'bodyProgress'){
				var userId = localStorage.getItem("userId");
				data = {'token':12345678,'filter':filter,'catProgress':$(this).data('catid'),'userId':userId}
			}else if(filter == 'memberCat' && target == 'member'){
				$(this).hide();
				var userId = localStorage.getItem("userId");
				data = {'token':12345678,'filter':filter,'userId':userId}
			}else if(filter == 'memberCatList' && target == 'member'){
				$(this).hide();
				data = {'token':12345678,'filter':filter,'memberId':$(this).data('memberid'),'userId':$(this).data('userid')}
			}else if(filter == 'coachActivity' && target == 'coach'){
				var userId = localStorage.getItem("userId");
				data = {'token':12345678,'filter':filter,'userId':userId}
			}
			// data = {'name':$('#name').val(),'email':$('#email').val(),'password':$('#password').val()}
		}else if(uri = 'update'){
			if(filter == 'resendCode' && target == 'user'){
				data = {'token':12345678,'filter':filter,'dataId':$(this).data('id')}
			} else if(filter == 'profileUser' && target == 'user'){
				data = {'token':12345678,'filter':filter,'dataId':$(this).data('id'),'name':$('#name').val(),
				'gender':$('#gender').val(),'phone':$('#phone').val(),'address':$('#address').val()}
			}else if(filter == 'konfirmasiBayar'){
				// data = {'token':12345678,'filter':filter,'userId':$(this).data('userid'),'memberId':$(this).data('memberid')}
				
			}
		}
		// console.log(data);
		postData(uri,target,data);
	}
});

$(document).on('click','#paymentConfirmation',function(){
	alert('run');
	var content = '<div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
	'<input type="file" data-filter="konfirmasiBayar" data-target="member" data-uri="konfirmasiBayar" data-target="member">'+
	'</div></div>';
	callModal(content);
});

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
	localStorage.removeItem("userId");
	localStorage.removeItem("userName");
	localStorage.removeItem("status");
	window.location.href = "index.html";
}

function notification(cat,T){
	if(cat == 200){
		swal({
		  title: "Success!",
		  text: T,
		  icon: "success",
		  button: "Thanks!",
		});
	$(".sweet-alert").css({'background-color':'#2196F3'});
	$(".sweet-alert").find('button').css({'background':'#03A9F4'});
	}else if(cat == 500){
		swal({
		  title: "Oopss..!",
		  text: T,
		  icon: "error",
		  button: "Thanks!",
		});
		$(".sweet-alert").css({'background-color':'rgb(232, 34, 92)'});
		$(".sweet-alert").find('button').css({'background':'rgb(255, 109, 151)'});
	}
	
	$(".sweet-alert").find('p').css({'color':'#fff'});
	$(".sweet-alert").find('h2').css({'color':'#fff'});
	
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

function validate(){
	if( localStorage.getItem("userId") !== null ){
		var userId = localStorage.getItem("userId");
		var userName = localStorage.getItem("userName");
		var userStatus = localStorage.getItem("status");
		
		if($('#profilePage').length > 0 ){
			$('#userName').html(userName);
			$('#name').val(userName);
			$('.wrapImg').attr('data-id',userId);
			$('#updateProfile').attr('data-id',userId);
			$('#bodyProgress').attr('data-id',userId);
			$('#uploadImgProfile').val(userId);
			if(userStatus == 2){
				$('#bodyProgressNav').remove();
			}
			var param = {'token':12345678,'filter':'getProfile','dataId':userId};
			postData('read','user',param);
		}else if($('#classHistoryPage').length > 0){
			$('#addClass').attr('data-id',userId);
			if(userStatus == 2){
				$('#bodyProgressNav').remove();
				var p = {'token':12345678,'filter':'getCoachSchedule','dataId':userId};
				postData('read','coach',p);
			} 
			var param = {'token':12345678,'filter':'getProfile','dataId':userId};
			postData('read','user',param);
		}else if($('#loginPage').length > 0){
			getPage("","classHistory","");
		}else if($('#membershipPage').length > 0){
			var data = {'token':12345678,'filter':'checkMember','userId':userId};
			postData("read","member",data);
		}else if($('#bodyProgressPage').length > 0){
			var data = {'token':12345678,'filter':'progressCategory'};
			postData("read","bodyProgress",data);
		}
		else{ getPage("",'classHistory',''); }
	}else{
		if($('#indexPage').length == 0 && $('#registerIntroPage').length == 0 && $('#registerPage').length == 0 && $('#loginPage').length == 0){
			getPage("","index",'');
		}
	}
}

function callModal(content){
	$('#largeModal').modal('show'); 
	$('.modal-body').empty(''); 
	$('.modal-body').html(''); 
	$('.modal-body').html(content); 
}


function postData(uri,target,dd){
	loadingActive();
	$.ajax({
	  url: urlService+uri+'/'+target,
	  type: "POST",
	  data: dd,
	  success: function(callback){
		  if(callback.length > 0){
			var json = JSON.parse(callback);
				if(dd.filter == 'resendCode' || dd.filter == 'memberRegister' || dd.filter == 'trainerRegister'){
					if(json.response == 200){
						notification(json.response,"Please check your inbox mail, to have your verification code");
						getPage('#formContent','verification',json.dataId);
					}else{
						notification(json.response,json.reason);
					}
				}else if(dd.filter == 'gabungClass'){
					if(json.response == 200){
						notification(json.response,"Join class success, you are registered");
						$('#largeModal').modal('hide'); 
					}else{
						notification(json.response,"Can't join class again");
						$('#largeModal').modal('hide'); 
					}
				}else if(dd.filter == 'memberPeriod'){
					var ch = '';
					$.each($(json), function(i) {
						ch +='<option class="text-white bg-indigo" value="'+json[i].id+'">'+json[i].timePeriode+'</option>';
					});
					$('#memberPeriod').empty();
					$('#memberPeriod').html(ch);
				}else if(dd.filter == 'memberCat'){
					var ch = '';
					$.each($(json), function(i) {
						ch +='<option class="text-white bg-indigo" value="'+json[i].id+'">'+json[i].categoryName+'</option>';
					});
					$('#memberCat').empty();
					$('#memberCat').html(ch);
				}else if(dd.filter == 'checkMember'){
					if(json[0].status == 0){
						$('#info').empty();
						$('#info').html();
						$('#info').html('Please do confirm your payment immediately to activate your membership and get all the benefits');
						$('#upgradeMember').hide();$('#joinMember').hide();
						$('#paymentConfirmation').show();
						$('#paymentConfirmation').attr('data-memberid',json[0].memberId);
						$('#paymentConfirmation').attr('data-userid',json[0].userId);
					}else{
						if(json[0].memberId != '' || json[0].memberId > 0){
							$('#joinMember').hide();
							$('#upgradeMember').show();
							$('#upgradeMember').attr('data-memberid',json[0].memberId);
							$('#upgradeMember').attr('data-userid',json[0].userId);
						}else{
							$('#joinMember').show();
							$('#upgradeMember').hide();
						}
						$('#userName').html(json[0].name);
						$('#memberCatName').html(json[0].categoryName);
						$('#expDate').html(json[0].endDate);
					}
				}else if(dd.filter == 'classSchedule'){
						var weekday = new Array(7);
						weekday[0] = "Sunday";
						weekday[1] = "Monday";
						weekday[2] = "Tuesday";
						weekday[3] = "Wednesday";
						weekday[4] = "Thursday";
						weekday[5] = "Friday";
						weekday[6] = "Saturday";
					var c ='';
					var cn = dd.className;
					$.each($(json), function(i) {
						var d = new Date(json[i].date);
						c += '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 animated flipInY clickable" data-uri="read" data-dom="modal" data-filter="timeDetail" data-id="'+json[i].scheduleId+'" data-param="'+json[i].date+'" data-memberid="'+json[i].memberId+'" data-target="class" style="padding:0px;margin:0px;">'+
							'<div class="card" style="box-shadow:none;margin:0px;background:transparent;">'+
								'<div class="body  bg-default" style="background:transparent;">'+
									'<div class="text-center">'+
										'<h4 class="text-white" style="margin:0px;">'+json[i].tggl+'</h4>'+
										'<small class="text-white">'+weekday[d.getDay()]+'</small>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
					});
					$.ajax({
					url:'classSchedule.html',
					success:function(result){
						$('body').empty();
						$('body').html();
						$('body').html(result);
						if($('#scheduleDate').length > 0){
							$('#scheduleDate').empty();
							$('#scheduleDate').html();
							$('#scheduleDate').html(c);
						}
						$('body').append(backBtn);
						$('#titleClass').text(cn);
						controlBackBtn('classHistory');
					}
					});
					
				}else if(dd.filter == 'timeDetail'){
					var content = '<ul class="list-group"><div class="clearfix"></div><br>';
					$('#gabungClass').attr('data-memberid',dd.memberId);
					$.each($(json), function(i) {
					content += '<li style="border:none;background:transparent !important;" class="list-group-item">'+
								'<div class="row" style="padding-top:3%;margin:0px;">'+
									'<div class="col-lg-4 col-xs-4">'+
										'<small class="text-white">'+json[i].startTime +'</small>'+
									'</div>'+
									'<div class="col-lg-6 col-xs-6">'+
										'<b class="text-white">'+json[i].coachName+'</b>'+
									'</div>'+
									'<div class="col-lg-2 col-xs-2">'+
										'<input type="checkbox" class="chk-col-pink filled-in classOption" id="'+json[i].scheduleId+'" data-id="'+json[i].scheduleId+'">'+
										'<label style="font-size:0.25px;color:transparent !important" for="'+json[i].scheduleId+'">Remember Me</label>'+
									'</div>'+
								'</div>'+
							'</li>';
					});
                    content +='</ul>';
					callModal(content);
				}
				else if(dd.filter == 'confirmCode'){
					$.each($(json), function(i) {
						localStorage.setItem("userId", json[i].id);
						localStorage.setItem("userName", json[i].name);
						localStorage.setItem("status", json[i].status);
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
						$('#memberCode').html(json[i].code);
						$('#phone').val(json[i].phone);
						$('#address').val(json[i].address);
						$('#dvPreview').attr("src",json[i].imgProfile).css({'width':'90px','height':'90px'});
					});
					if($('#name').val() != '' && $('#gender option:selected').val() != ''
						&& $('#phone').val() != '' && $('#address').val() != ''){
							// $('#updateProfile').remove();
							// $('#skipNav').find('span').html("Let's Go");
							// if($('#classHistoryPage').length == 0){
								// getPage('','classHistory','');
							// }
					}else{
						$('#skipNav').show();
					}
					if($('#classHistoryPage').length > 0){
						var content = '';
						$.each($(json), function(i) {
							$('#userName').html(json[i].name);
							$('#imgUser').attr("src",json[i].imgProfile).css({'width':'90px','height':'90px'});
							if(json[i].code != ''){
								$('#memberCode').html(json[i].code);
								$('.clickable').attr('data-memberid',json[i].memberId);
								$('.clickable').attr('data-userid',json[i].id);
								status = localStorage.getItem("status");
								if(status == 2){
									var c = '<div class="col-lg-12 col-md-12 col-sm-12"><div class="clearfix"></div><br><div class="text-center">'+
										"<p>You don't have any schedule</p>"+
									'</div></div>';
									$('#blankClass').empty();
									$('#blankClass').html();
									$('#blankClass').html(c);
									$('#membershipNav').attr('data-target','addCoachSchedule');
									$('#membershipNav').attr('data-dom','modal');
									$('#membershipNav').empty();
									$('#membershipNav').html();
									$('#membershipNav').html('Class Schedule');
									$('#addClass').remove();
									$('#classArea').remove();
									$('#classNav').attr('data-target','coach');
									$('#classNav').attr('data-uri','read');
									$('#classNav').attr('data-filter','coachActivity');
								}else{
									$('#membershipNav').attr('data-memberid',json[i].memberId);
									$('#addClass').attr('data-memberid',json[i].memberId);
								}
								$('#membershipNav').attr('data-userid',json[i].id);
							}
							if(json[i].nameClass != '' &&  json[i].nameClass !== null ){
								$('#blankClass').remove();
								content += '<div style="margin:0px;" class="row animated flipInX" data-uri="read" data-filter="classDetail" data-dom="classDetail" data-target="class" data-id="'+json[i].classId+'">'+
								'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
									'<div class="card" style="margin-bottom:3px;">'+
										'<div class="ribbon"><span>Ready</span></div>'+
										'<div class="body bgClassRoom" style="padding-bottom:0px;color:#fff;">'+
												'<div class="row">'+
													'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center" style="padding-bottom:0px;">'+
														'<h4>'+json[i].nameClass+'</h4>'+
														'<span>'+json[i].date+'</span><br>'+
														'<label class="radius5" style="background: rgba(0, 0, 0, 0.5);padding:2%;">'+json[i].startTime+'&nbsp;<i class="fa fa-arrow-right"></i>&nbsp;'+json[i].endTime+'</label>'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>';
							}
						});
						$('#classArea').empty();
						$('#classArea').html();
						$('#classArea').html(content);
						$('#classArea').append('<div class="clearfix"></div><br><div class="clearfix"></div><br>');
					}
				}else if(dd.filter == 'getCoachSchedule'){
					var content = '';
					$.each($(json), function(i) {
						if(json[i].nameClass != '' &&  json[i].nameClass !== null ){
							$('#blankClass').remove();
							content += '<div style="margin:0px;" class="row animated flipInX" data-uri="read" data-filter="classDetail" data-dom="classDetail" data-target="class" data-id="'+json[i].classId+'">'+
							'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
								'<div class="card" style="margin-bottom:3px;">'+
									'<div class="body bgClassRoom" style="padding-bottom:0px;color:#fff;">'+
											'<div class="row">'+
												'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center" style="padding-bottom:0px;">'+
													'<h4>'+json[i].namaKelas+'</h4>'+
													'<span>'+json[i].date+'</span><br>'+
													'<label class="radius5" style="background: rgba(0, 0, 0, 0.5);padding:2%;">'+json[i].startTime+'&nbsp;<i class="fa fa-arrow-right"></i>&nbsp;'+json[i].endTime+'</label>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
						}
					});
					$('#contentCore').empty();
					$('#contentCore').html();
					$('#contentCore').html(content);
				}else if(dd.filter == 'login'){
					$.each($(json), function(i) {
						localStorage.setItem("userId", json[i].id);
						localStorage.setItem("userName", json[i].name);
						localStorage.setItem("status", json[i].status);
					});
					window.location.href = 'classHistory.html';
				}else if(dd.filter == 'classList'){
					// $('body').append(backBtn);
					// controlBackBtn('classHistory');
					var content = '';
					content += "<div class='text-center'><b style='font-size:12.5px;text-transform: uppercase;'>Let's start your class</b><br><small class='text-white'>Click to select</small></div><div class='clearfix'></div><br>"
					$.each($(json), function(i) {
						var len = json[i].classDescryption.length;
						var dt = '';
						if(len>48)
						{
						  dt = json[i].classDescryption.substr(0,48)+'...';
						}
						content += '<div class="row animated flipInX clickable" data-dom="classDetail" data-classid="'+json[i].id+'" data-uri="read" data-target="class" data-filter="classListDetail" style="margin:0px;">'+
								'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
									'<div class="info-box hover-expand-effect" style="margin-bottom:3px;color:#fff;background: #4568DC; background: -webkit-linear-gradient(to right, #B06AB3, #4568DC);'+
											'background: linear-gradient(to right, #B06AB3, #4568DC);">'+
										'<div class="icon">'+
											'<img src="https://ifpa-fitness.com/wp-content/uploads/2014/01/LifestlyefitnesCoach2-600x405.jpg" style="margin-top:25%;width:100%;">'+
										'</div>'+
										'<div class="content">'+
											'<div class="text"><b>'+json[i].name+'</b><br><small>'+dt+'</small></div><div class="clearfix"></div><br>'+
											// '<div class="number count-to" data-from="0" data-to="125" data-speed="15" data-fresh-interval="20">125</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
					});
					$('#classArea').empty();
					$('#classArea').html();
					$('#classArea').html(content);
					$('#classArea').append('<div class="clearfix"></div><br><div class="clearfix"></div><br>');
					
					if($('#classList').length > 0){
						var c = '';
						$.each($(json), function(i) {
							var len = json[i].classDescryption.length;
							var dt = '';
							if(len>18)
							{
							  dt = json[i].classDescryption.substr(0,18)+'...';
							}
							c += '<li class="col-xs-6 col-lg-6 grid-group-item animated flipInY clickable" data-dom="classDetail" data-classid="'+json[i].id+'" data-uri="read" data-target="class" data-filter="classListDetail">'+
										'<div class="thumbnail" style="background:rgba(000,000,000,0.3);color:#fff;border:0px;">'+
											'<img class="group list-group-image" src="https://ifpa-fitness.com/wp-content/uploads/2014/01/LifestlyefitnesCoach2-600x405.jpg" alt="">'+
											'<div class="caption text-left">'+
												'<h4 class="group inner list-group-item-heading text-white">'+
													json[i].name+'</h4>'+
												'<small><i style="font-size:12px;" class="group inner list-group-item-text text-white">'+dt+'</i></small>'+
												'<div class="clearfix"></div><br>'+
												// '<div class="row">'+
													// '<div class="col-xs-12 col-md-6">'+
														// '<p class="lead text-white">$21.000</p>'+
													// '</div>'+
													// '<div class="col-xs-12 col-md-6">'+
														// '<a class="btn btn-primary" href="http://www.jquery2dotnet.com">Add to cart</a>'+
													// '</div>'+
												// '</div>'+
											'</div>'+
										'</div>'+
									'</li>';
						});
						$('#classList').empty();
						$('#classList').html(c);
					}
					
					if($('#classTrain').length > 0){
						var html = '';
						$.each($(json), function(i) {
							html += '<option value="'+json[i].id+'">'+json[i].name+'</option>'
						});
						$('#classTrain').empty();
						$('#classTrain').append(html);
					}if($('#classOptionList').length > 0){
						var html = '';
						$.each($(json), function(i) {
							html += '<option value="'+json[i].id+'">'+json[i].name+'</option>'
						});
						$('#classOptionList').empty();
						$('#classOptionList').append(html);
					}
				}else if(dd.filter == 'classDetail'){
					$.ajax({
					url: dd.dom+'.html',
					success:function(result){
						$('.mainWrap').empty();
						$('.mainWrap').html();
						$('.mainWrap').html(result);
						// $('body').append(backBtn);
						// controlBackBtn('classHistory');
						var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
						
						var ci = '';
						console.log(json);
						$.each($(json), function(i) {
							// var d = new Date(json[i].date);
							// var dayName = days[d.getDay()];
							$('#titleClass').html(json[i].name);
							// $('#dayClass').html(dayName);
							// $('#startTime').html(json[i].startTime);
							// $('#endTime').html(json[i].endTime);
							$('#descClass').html(json[i].classDescryption);
							$('#joinClass').attr('data-id',json[i].id);
							$('#joinClass').attr('data-classname',json[i].name);
							ci = json[i].id;
						});
						var data = {'token':12345678,'filter':'coachList','classId':ci}
						postData('read','user',data);
						var d = {'token':12345678,'filter':'classList'}
						postData('read','class',d);
					}
					});
				}else if(dd.filter == 'classListDetail'){
					$.ajax({
					url: dd.dom+'.html',
					success:function(result){
						var ci = '';
						$('.mainWrap').empty();
						$('.mainWrap').html();
						$('.mainWrap').html(result);
						var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
						console.log(json);
						$.each($(json), function(i) {
							// var d = new Date(json[i].date);
							// var dayName = days[d.getDay()];
							$('#titleClass').html(json[i].name);
							// $('#dayClass').html(dayName);
							// $('#startTime').html(json[i].startTime);
							// $('#endTime').html(json[i].endTime);
							$('#descClass').html(json[i].classDescryption);
							$('#joinClass').attr('data-id',json[i].id);
							$('#joinClass').attr('data-classname',json[i].name);
							ci = json[i].id;
						});
						// $('body').append(backBtn);
						// controlBackBtn('classHistory');
						
						var data = {'token':12345678,'filter':'coachList','classId':ci}
						postData('read','user',data);
						
						var d = {'token':12345678,'filter':'classList'}
						postData('read','class',d);
					}
					});
				}else if(dd.filter == 'coachList'){
					var ct = '';
					$.each($(json), function(i) {
						ct += '<li class="col-lg-3 col-md-3 col-sm-3 col-xs-8 clickable" data-dom="" data-uri="read" data-filter="coachProfile" data-target="user" data-id="'+json[i].coachId+'">'+
							'<div class="info-box bg-light-blue hover-expand-effect">'+
								'<div class="icon">'+
								   '<img src="'+json[i].imgProfile+'" style="width:100%;">'+
								'</div>'+
								'<div class="content">'+
									'<div class="text">'+json[i].coachName+'</div>'+
									// '<div class="number count-to" data-from="0" data-to="257" data-speed="1000" data-fresh-interval="20">257</div>'+
								'</div>'+
							'</div>'+
						'</li>'
					});
					$('#coachList').empty();
					$('#coachList').html(ct);
				}else if(dd.filter == 'coachProfile'){
					// console.log(json);
					var content = '';
					var coachId = '';
					$.each($(json), function(i) {
						coachId = json[i].coachId;
					content += 
						'<div class="row" style="margin:0px;">'+
							'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
								'<div class="text-center">'+
									'<div class="wrapImg" id="getImge">'+
											'<img class="avatar" id="dvPreview"  src="'+json[i].imgProfile+'">'+
										// '<div class="clearfix"></div><br>'+
									'</div>'+
									'<h3>'+json[i].coachName+'</h3><div class="clearfix"></div><br>'+
								'</div>'+
								'<div class="text-justify"><b>Class&nbsp;:&nbsp;</b><br>'+
								'<ul id="coachClass"></ul></div>'+
							'</div>'+
						'<div class="clearfix"></div><br></div>';
					});
					$.ajax({
						  url: urlService+'read'+'/'+'class',
						  type: "POST",
						  data: {'token':12345678,'filter':'coachClass','coachId':coachId},
						  success: function(cb){
							  var j = JSON.parse(cb);
							var cn = '';
							$.each($(j), function(a) {
								cn += '<li>'+j[a].name+'</li>';
							});
							$('#coachClass').empty();
							$('#coachClass').html();
							$('#coachClass').html(cn);
					}});
					callModal(content);
				}else if(dd.filter == 'progressCategory'){
					var c = '';
					$.each($(json), function(i) {
						c += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding:0px;box-shadow:none;">'+
							'<div class="card" style="margin:0px;">'+
								'<div class="body">'+
									'<div class="text-center"><h4 class="text-gradient">'+json[i].code+'<br><small>'+json[i].categoryName+'</small></h4>'+
										'<button style="background: #4568DC;background: -webkit-linear-gradient(to right, #B06AB3, #4568DC);background: linear-gradient(to right, #B06AB3, #4568DC);"data-catid="'+json[i].id+'" type="button" data-uri="read" data-filter="viewProgress" data-target="bodyProgress" class="btn btn-primary waves-effect">View</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
						// c += '<li class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="margin-right:8%;">'+
								// '<button data-catid="'+json[i].id+'" type="button" data-uri="read" data-filter="viewProgress" data-target="bodyProgress" style="border-radius:10px;border:1px solid #fff;background:transparent !important;box-shadow:none;" class="text-white btn btn-default waves-effect">'+json[i].categoryName+'</button>'+
							// '</li>';
					});
						$('#catList').empty();
						$('#catList').html();
						$('#catList').html(c);
				}else if(dd.filter == 'optionCategory'){
					var c = '';
					$.each($(json), function(i) {
						if($('#categories').length > 0) {
							c += '<option value="'+json[i].id+'">'+json[i].categoryName+'&nbsp;('+json[i].code+')</option>';
						}
					});
					$('#categories').empty();
					$('#categories').html();
					$('#categories').html(c);
				}else if(dd.filter == 'personalBodyProgress'){
					if(json.response == 200){
						notification(json.response,"Progress Added");
						getPage('','bodyProgress','');
					}else{
						notification(json.response,json.reason);
					}
				}else if(dd.filter == 'coachSchedule'){
					if(json.response == 200){
						notification(json.response,"Schedule Added");
						getPage('','classHistory','');
					}else{
						notification(json.response,json.reason);
					}
				}else if(dd.filter == 'viewProgress'){
					new Chart(document.getElementById("line_chart").getContext("2d"), displayMyChart('line',json));
				}else if(dd.filter == 'memberCatList'){
					var ct ='';
					var memberId = dd.memberId;
					var userId = dd.userId;
					$.each($(json), function(i) {
						var bilangan = json[i].fee;
						var	number_string = bilangan.toString(),
							sisa 	= number_string.length % 3,
							rupiah 	= number_string.substr(0, sisa),
							ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
								
						if (ribuan) {
							separator = sisa ? '.' : '';
							rupiah += separator + ribuan.join('.');
						}
						ct += '<li class="item  col-xs-8 col-lg-8">'+
								'<div class="thumbnail" style="border-radius:5px;">'+
									'<div class="caption">'+
										'<h3 class="group inner list-group-item-heading">'+json[i].categoryName+'</h3>'+
										'<p>'+json[i].info+'<br><i>Time periode</i>&nbsp;'+json[i].timePeriode+'&nbsp;<i>Days</i></p>'+
										'<div class="row">'+
											'<div class="col-xs-12 col-md-12">'+
												'<h4 class="lead">Rp&nbsp;'+rupiah+'</h4>'+
											'</div>'+
											'<div class="col-xs-12 col-md-12">'+
												'<button data-uri="create" data-filter="joinMember" data-target="member" data-userid="'+userId+'" data-membercat="'+json[i].id+'" data-memberid="'+memberId+'" class="btn btn-lg btn-success">Join Now</button>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</li>';
					});
					$('#membershipList').empty();
					$('#membershipList').html();
					$('#membershipList').html(ct);
					console.log(json);
				}else if(dd.filter == 'coachActivity'){
					var content = '';
					$.each($(json), function(i) {
						if(json[i].nameClass != '' &&  json[i].nameClass !== null ){
							$('#blankClass').remove();
							content += '<div style="margin:0px;" class="row animated flipInX" data-uri="read" data-filter="classDetail" data-dom="classDetail" data-target="class" data-id="'+json[i].classId+'">'+
							'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
								'<div class="card" style="margin-bottom:3px;">'+
								'<div class="ribbon"><span>Ready</span></div>'+
									'<div class="body bgClassRoom" style="padding-bottom:0px;color:#fff;">'+
											'<div class="row">'+
												'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center" style="padding-bottom:0px;">'+
													'<h4>'+json[i].className+'</h4>'+
													'<span>'+json[i].date+'</span><br>'+
													'<label class="radius5" style="background: rgba(0, 0, 0, 0.5);padding:2%;">'+json[i].startTime+'&nbsp;<i class="fa fa-arrow-right"></i>&nbsp;'+json[i].endTime+'</label>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
						}
					});
					$('#contentCore').empty();
					$('#contentCore').html();
					$('#contentCore').html(content);
				}else if(dd.filter == 'memberCat'){
					console.log(json);
				}else if(dd.filter == 'joinMember'){
					if(json.response == 200 && json.dataId > 0){
						localStorage.setItem("memberId", json.dataId);
						notification(json.response,"Join member success, Please do confirm your payment immediately");
						setTimeout(function () {
							window.location.href = window.location.href;
						}, 3000);
					}else{
						notification(json.response,"Join member failed");
					}
				}else if(dd.filter == 'konfirmasiBayar'){
					
				}
			loadingDeactive();
			setTimeout(function () {
				if($(".sweet-alert").length > 0){
					swal.close();
				}
			}, 3000);
		}else{
			loadingDeactive();
			if(dd.filter == 'checkMember'){
				notification(500,"Please join member first");
			}else{
				notification(500,"Data not found");
			}
			setTimeout(function () {
				if($(".sweet-alert").length > 0){
					swal.close();
					if(dd.filter == 'checkMember'){
						getPage('body','joinMember','');
						var data = {'token':12345678,'filter':'memberCat'}
						postData('read','member',data);
						var data1 = {'token':12345678,'filter':'memberPeriod'}
						postData('read','member',data1);
						// window.location.href = 'joinMember.html';
					}
				}
			}, 3000);
		}
	  },error:function(result){
		  notification(500,"Connection error");
			setTimeout(function () {
				if($(".sweet-alert").length > 0){
					swal.close();
				}
			}, 3000);
	  }
	});
}

function datePickerActive(){
	$('.datePicker').dateDropper();
}
function timePickerActive(){
	$('.timePicker').timeDropper();
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
					$(dom).css({'margin-top':'60%'});
					$('#resendCode').attr('data-id',param);
					$('#confirmCode').attr('data-id',param);
					controlBackBtn('login');
				}if(target == 'addCoachSchedule'){
					if(dom == 'modal'){
						callModal(response);
						datePickerActive();
						timePickerActive();
						var d = {'token':12345678,'filter':'classList'}
						postData('read','class',d);
						var userId = localStorage.getItem("userId");
						var p = {'token':12345678,'filter':'getCoachSchedule','dataId':userId};
						postData('read','coach',p);
					}
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
/* utilnav.js  Sapphire-EEsof  2014-11-20  jrg, jp */

var utilNavWidth = 60;
var watchListCookieVal = "";
var recentViewedCookieVal = "";

jQuery(document).ready(function($) {
	if(self != top) return;
	$('#utillinks ul').css({'display':'block'});
	$('<div id="disablingDiv" ></div>').prependTo('body').click(function() {
		if($('body').hasClass('lbmodal') == false)
			closeUtilityNav();
	});
	var utilTop = Math.max($('#header').offset().top - document.body.scrollTop, parseInt($('body').css('padding-top')));
	$('#utillinks').css({'position':'fixed',height:$(window).height() - utilTop, top: utilTop});
	$('#utilcontent').css({'height':$(window).height() - utilTop,top: utilTop});
	$('#utillinks').css({'width':utilNavWidth,'display':'block','overflow':'hidden','whiteSpace':'nowrap'});
	$( ".navlabel" ).show();

	$('#utillinks').hover(function() {
		$(this).data("hovered",true);
		$(this).delay(200).queue(function() {
			if($(this).data("hovered") == true) {
				if($(this).hasClass('expand') == false) {
					var w = $(this).children().width();
					$(this).animate({'width': w},"fast",function() {
						if($(this).hasClass('expand'))
							$(this).css({'width': utilNavWidth});
					});
				}
			}
			$(this).dequeue();
		});
	}, function() {
		$(this).data("hovered", false);
		$(this).delay(200).queue(function() {
			if($(this).data("hovered") == false) {
				$(this).animate({'width': utilNavWidth},"fast");
			}
			$(this).dequeue();
		});
	});

	watchListCookieVal = getCookie("AGWL");
	recentViewedCookieVal = getCookie("rvprod");

	$(window).resize(leftUtilResize);
	$(window).load(leftUtilResize);
	$(window).scroll(leftUtilResize);

	$('#utillinks li').bind('click', function() {
		if($(this).hasClass('selected') == false && $('body').hasClass('lbmodal') == false)
			utilShowContent.apply(this);
	});
	$('#closebtn').live('click', closeUtilityNav);

	/*
	if($('#utilprofile').length != 0 && getCookie("USER_CREDENTIALS") == "VALID" && getCookie("utilprofile") != "1") {
		utilShowContent.apply($('#utilprofile').get(0));
		setSessionCookie("utilprofile",1);
	}
	*/
	
});

function closeUtilityNav() {
	var $ = jQuery;
	$('#utilcontent').animate({'width':0},'fast');
	$('#disablingDiv').css('display','none').removeClass('modal');
	$('#utillinks').removeClass('expand');
	$('body').removeClass('lbmodal');
	$('#utillinks li').removeClass('modal');
	$('body').css({'overflow':'visible'});
	if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) == 7) {
		$('body').removeAttr('scroll');
	}
	refreshNav();
	try { varMeasureBarPosition(); } catch(e) {}
	try {
		if(lbCookieCheckFlag)
			clearInterval(lbTimer);
	} catch(e) {}
	try { quoteInit(); } catch(e) {}

	var wlCookieVal = getCookie("AGWL");
	if(watchListCookieVal != wlCookieVal) {
		watchListCookieVal = wlCookieVal;
		try { initWatchList(); } catch(e) {}
		try { $('.wlreload').get(0).click(); } catch(e) {}
	}
	LbCloseHandler();
	LbCloseHandler = function() {}
	return false;
}

function leftUtilResize() {
	var $ = jQuery;
	var scrollTop =  document.documentElement.scrollTop;
	if(scrollTop == 0)
		scrollTop = document.body.scrollTop;
	var utilTop = Math.max($('#header').offset().top - scrollTop, parseInt($('body').css('padding-top')));
	$('#utillinks').css({height:$(window).height() - utilTop, top: utilTop});
	$('#utilcontent').css({'height':$(window).height() - utilTop,top: utilTop});

	$('#utillinks').height($(window).height());
	if(($('#utilcontent').css('display'))=='block') {
		$('#utilcontent > div').each(function() {
			if($(this).css('display')=='block') {
				var cont=$(this).attr('class');

				if(cont!='utillogin' && cont!='utilquote' && cont != 'utilwatchlist' && cont != 'utilnews') {
					$('#utilcontent > div.'+cont).css({'height':$(window).height()-24-utilTop});
				}
				else {
					$('.'+cont+' iframe').css({'height':$(window).height()-24-utilTop});
				}
			}
		});

	}
}

function utilShowContent() {
	var $ = jQuery;
	$('#disablingDiv').css('display','block');
	$('body').css({'overflow':'hidden'});
	if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) == 7) {
		$('body').attr('scroll','no');
	}
	refreshNav();
	$('#utillinks').addClass('expand');
	var container=$(this).attr('id');
	$(this).addClass('selected');
	$('#utillinks').css({width: utilNavWidth});
	$('#utilcontent').children('div').css('position','absolute');
	var content = $('div.'+container);
	content.css('position','static');
	$('#utilcontent').animate({'width':content.width()+5},'fast');
	leftUtilResize();
	return false;
}

function refreshNav() {
	var $ = jQuery;
	$('#utillinks ul li.selected').each(function() {
			$(this).removeClass('selected');
	});
}

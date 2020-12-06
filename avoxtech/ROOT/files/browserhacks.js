/* browserhacks.js  Sapphire-EEsof  2014-10-22  jrg */

var isTouchDevice = (typeof window.ontouchstart != "undefined");
var LbCloseHandler = function() {}

var scripts = document.getElementsByTagName("SCRIPT");
for(var i=0; i < scripts.length; i++) {
	if(/(.*)main\/assets\/css\/browserhacks\.js$/.test(scripts[i].src))
		break;
}

var cdn = RegExp.$1;

jQuery(document).ready(function($) {
	$("body").addClass("jsenabled");

	function searchValidate() {
		var k = document.getElementById('searchterm');
		k.value = $.trim(k.value);
		if(k.value == "") {
			k.focus();
			return false;
		}
		return true;
	}
	$("#header form").has("#searchterm").submit(searchValidate);


	function doGetSearch() {
		var str = searchFormAction + (searchFormAction.indexOf('?') == -1 ? "?" : "&" ) +
			"k=" + encodeURIComponent($('#searchterm').val());
		$('#searchdiv input[type=hidden]').each(function() {
			str += "&" + $(this).attr("name") + "=" + encodeURIComponent($(this).val());
		});
		location.href = str;
	}

	if($('#searchdiv').parent('form').length == 0) {
		$('#searchbtn').click(function() {
			if(searchValidate() == true)
				doGetSearch();
			return false;
		});
		$("#searchterm").keypress(function(e) {
			if(e.which == 13 && searchValidate() == true)
				doGetSearch();
		});
	}

	$('#country').click(function(e) {
		e.stopPropagation();
	});

	$('<span title="' + $('#country img:first').attr('title') + '"></span>').insertBefore('#country a:first'); //myAvox fix
	$('#country a:first,#country > li > span').not('.expand').click(function() {
		$('#country').not('.active').addClass('expand nmod');
		return false;
	});

	$('<a href="" class="close"></a>').prependTo('#countrymenu').click(function() {
		$('#country').removeClass('expand');
		return false;
	});

	$('#countrymenu > p strong').html($('#countrymenu > p strong').text());

	$(document).click(function() {
		$('.nmod').removeClass('expand');
	});

	$("#country a, .country a").click(function(event) {
		var hash = location.hash.replace("#","");
		if(hash != "") {
			location.href = this.href.replace(/#.*$/,'') + "#" + hash;
			event.preventDefault();
		}
	});

	if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 9)
		$('.rightcol .panel:last-child, .collection #overview.nonav #intro *:last-child').css('margin-bottom',0);

	$("h4#tcprice span").insertAfter($("h4#tcprice").parents("div.flyout").addClass('typicalconfig')).addClass("tcpricespan").wrap('<div style="text-align:right">');
	flyoutHover($("#util li.flyout"));
	flyoutHover($("#pricing div.flyout"),flyoutLeftOver,flyoutLeftOut);
	flyoutHover($(".panel div.flyout"),flyoutLeftBottomOver,flyoutLeftOut);

	if(isTouchDevice)
		initTouchFlyouts();
});

if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 9) {
	jQuery(document).ready(function($) {
		$('#searchbtn, #searchterm, #loginbtn,#h2boffer .button, .bluebtn, .orangebtn, .miscdownloads span.rcq, .scq, #quickcheckout .button, .viewall, .download, .continue, .primaryAction').each(function() {
			$(this).css({'position':'relative','z-index': 1})
			PIE.attach(this);
		});
	});
}

function initLanding() {
	$("#landnav > li").hover(function() {
		$(this).addClass("hover");
		var div = $(this).children("div");
		var top = $(this).offset().top;
		var height = div.outerHeight();
		var viewportHeight = document.documentElement.clientHeight;
		var scrollTop = document.documentElement.scrollTop;
   		if(scrollTop == 0)
       		scrollTop = document.body.scrollTop;
		if(top+height > scrollTop+viewportHeight) {
			div.css("top",(scrollTop+viewportHeight)-(top+height));
		}
	}, function() {
		$(this).removeClass("hover");
		$(this).children("div").css("top",-1);
	});
	var link = $(".landing #feature p.more a").clone(true).empty();
	link.css({'display':'block','position':'absolute','width':'100%','height': '100%','z-index':2,'top':0,'left':0,'margin':0,'background':'url(' + cdn + 'spacer.gif' + ')'});
	$(".landing #feature").append(link);
}

function flyoutHover(elem,over,out) {
	var $ = jQuery;
	var timer = isTouchDevice ? 0 : 250;
	elem.hover(function() {
		$(this).data("hovered",true);
		$(this).delay(timer).queue(function() {
			if($(this).data("hovered") == true) {
				if(over)
					over.apply(this);
				else
					$(this).addClass("hover");
			}
			$(this).dequeue();
		});
	}, function() {
		$(this).data("hovered", false);
		$(this).delay(timer).queue(function() {
			if($(this).data("hovered") == true) { $(this).dequeue();return; }
			if(out)
				out.apply(this);
			else
				$(this).removeClass("hover");
			$(this).dequeue();
		});
	});
}
jQuery(window).resize(function() {
	var $ = jQuery;
	$('#gnavbar li > div').each(function() {
		var tmp = $(this).find('ul:first');
		$(this).find('div.col > ul > li').each(function() {
			$(this).appendTo(tmp);
		});
		$(this).find('div.col,div.clearer').remove();
	});

	initGNavMenuColumns();
});
function initGlobalNav() {
	var $ = jQuery;
	$('body').addClass('jsenabled');

	$('#gnavbar li > div').each(function() {
		var temp = $(this).siblings('a').clone().prependTo($(this).find('div div')).wrap('<h4>');
		$('<a href="" class="closeX" title="' + fClose + '"></a>').appendTo($(this)).click(function() {
			$('#gnavbar ul:first > li.selected').removeClass('selected');
			return false;
		});
	});
	$('#gnavbar ul:first > li').has('div').children('a').click(function(e) {
		var li = $(this).parent();
		if(li.hasClass('selected')) return false;
		$('#gnavbar ul:first > li.selected').removeClass('selected');
		li.addClass('selected');
		return false;
	});
	$('#gnavbar ul:first > li').click(function(e) {
		e.stopPropagation();
	});
	$(document).click(function() {
		$('#gnavbar ul:first > li.selected').removeClass('selected');
	});

	initGNavMenuColumns();
}

function initGNavMenuColumns() {
	var $ = jQuery;
	var tmp = $('#gnavbar li > div').css('width','100%');
	var containerWidth = $('#gnavbar li div > div > div').width();
	tmp.css('width','auto');
	var columnWidth = $('#gnavbar li div > div > div > ul').width();
	var level2ColumnCount = parseInt(containerWidth / columnWidth);

	function computeGnavIndices(items) {
		var groupCount = level2ColumnCount;
		var combos = new Array();
		var itemCount = items.length;
		function findCombos(str, itemIndex, groupIndex) {
			if(groupIndex == groupCount) {
				combos.push(str.substr(1));
				return;
			}
			for(var i=itemIndex; i <= itemCount - groupCount + groupIndex; i++) {
				findCombos(str + "," + i, i+1, groupIndex+1);
				if(itemIndex == 0) return;
			}
		}
		findCombos("",0,0);

		var finalCombo;
		var minVariance = 1000000000;

		for(var i=0; i < combos.length; i++) {
			var indices = combos[i].split(",");
			var values = new Array();
			for(var j=0; j < indices.length; j++) {
				var tmpVal = 0;
				var kEnd;
				if(j < indices.length - 1) {
					kEnd = parseInt(indices[j+1]);
				} else {
					kEnd = itemCount;
				}
				for(var k=parseInt(indices[j]); k < kEnd; k++) {
					tmpVal += items[k];
				}
				values.push(tmpVal);
			}
			var variance = calcVariance(values);
			if(variance <= minVariance) {
				minVariance = variance;
				finalCombo = indices;
				if(variance == 0)
					return finalCombo;
			}
		}
		function calcVariance(n) {
			var sum = 0;
			var mean = 0;
			for (var i = 0; i<n.length;i++) {
				sum += parseFloat(n[i]); // must be a number
			}
			mean = sum/n.length;

			var variance = 0;
			for (var i = 0; i<n.length; i++) {
				variance += (n[i]-mean)*(n[i]-mean);
			}
			variance = variance / (n.length-1)
			return variance;
		}
		return finalCombo;

	}
	$('#gnavbar li div > div > div').each(function() {
		var heights = $(this).data("heights");
		var items = $(this).find('> ul > li');
		if(typeof heights == "undefined") {
			heights = [];
			items.each(function() {
				heights.push($(this).height());
			});
			$(this).data("heights",heights);
		}

		var indices = computeGnavIndices(heights);
		for(i=0; i < indices.length; i++) {
			var c = $('<ul></ul>').appendTo($('<div class="col"></div>').appendTo($(this)));
			if(i < indices.length - 1) {
				for(j=indices[i]; j < indices[i+1]; j++) {
					c.append(items.eq(j));
				}
			}
			else {
				for(j=indices[i]; j < items.length; j++) {
					c.append(items.eq(j));
				}

			}
		}
		$(this).append('<div class="clearer"></div>');

	});
}
var rememberedLogin = "";
function initLogin(loginUrl) {
	var $ = jQuery;
	var link = $("#utillogin");
	if(rememberedLogin != "")
		link.addClass("remember");
	link.click(function() {
		if($('body').hasClass('lbmodal')) return;
		if($('.utillogin iframe').length == 0) {
			loginUrl = loginUrl.replace(/(.*)%3F\s*$/i,"$1");
			$('.utillogin').html('<div><iframe src="' + loginUrl + '" frameborder="0" allowtransparency="true"></iframe></div>');
			setTimeout("jQuery('.utillogin').css('background','none')",3000);
		}
	});
}

function decryptROT13(emailID){
	var inputStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	var input = inputStr.split("");
	var outputStr= "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm0987654321";
	var output = outputStr.split("");
	var email =  emailID.split("");
	for(var i=0; i < email.length; i++) {
		var b = outputStr.indexOf(email[i]);
		var a;
		if (b>=0)
			a = input[b];
		else
			a = email[i];
		email[i]=a;
	}
	return email.join("");
}
function getCookie(c_name) {
	if (document.cookie.length>0) {
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1) {
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}

function getRememberedLogin() {
	var remLoginCookie = getCookie("AGRL");
	if(remLoginCookie != "")
		rememberedLogin = decryptROT13(decodeURIComponent(remLoginCookie).split("|")[0]);
}
getRememberedLogin();

function selectGNavContext(index) {
	jQuery("#gnavbar .centerwrapper > ul > li:eq(" + index + ")").addClass("context");
}
function Point(iX, iY) {
	this.x = iX
	this.y = iY
}
function fGetXY(aTag) {
	var oTmp = aTag
	var pt = new Point(0,0)
	do {
		pt.x += oTmp.offsetLeft;
		pt.y += oTmp.offsetTop;
		oTmp = oTmp.offsetParent;
	} while(oTmp.tagName!="BODY" && oTmp.tagName!="HTML");
	return pt;
}

function flyoutTopOver() {
	$(this).children(".fo1").css("display","block");
	var fo2 = $(this).find(".fo2");
	var span = fo2.children("span.tip");
	var spanLeft = span.get(0).offsetLeft;
	var fo2Left = fGetXY(fo2.get(0)).x;
	var newLeft = fo2Left;
	var viewportWidth = document.documentElement.clientWidth;
	var scrollLeft = document.documentElement.scrollLeft;
	if(scrollLeft == 0)
		scrollLeft = document.body.scrollLeft;
	if(fo2Left < scrollLeft) {
		newLeft = fo2.get(0).offsetLeft - fo2Left + scrollLeft;
		fo2.get(0).style.left = newLeft + "px";
		span.get(0).style.left = spanLeft + fo2Left - scrollLeft + 13 + "px";
	}
	newLeft = fGetXY(fo2.get(0)).x;
	if((newLeft + fo2.width()) > (viewportWidth + scrollLeft)) {
		fo2.get(0).style.left = (viewportWidth + scrollLeft) - (newLeft + fo2.width()) + "px";
		span.get(0).style.left = spanLeft - (viewportWidth + scrollLeft) + (newLeft + fo2.width()) + 13 + "px";
	}
	if(!isTouchDevice) {
		var fo2Top = fo2.offset().top;
		var scrollTop = document.documentElement.scrollTop;
		if(scrollTop == 0)
			scrollTop = document.body.scrollTop;
		if(fo2Top < scrollTop) {
			var fo3 = $(this).find('.fo3');
			$(this).find('.fo3').css({overflow:'auto',height:fo3.height() - (scrollTop-fo2Top)});
		}
	}
}
function flyoutTopOut() {
	$(this).children(".fo1").css("display","none");
	$(this).find(".fo2,.fo3,.tip").removeAttr('style');
}

function flyoutBottomOver() {
	$(this).children(".fo1").css("display","block");
	$(this).addClass('hover');
	var fo2 = $(this).find(".fo2");
	var span = fo2.children("span.tip");
	var spanLeft = span.get(0).offsetLeft;
	var fo2Left = fGetXY(fo2.get(0)).x;
	var newLeft = fo2Left;
	var viewportWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var scrollLeft = document.documentElement.scrollLeft;
	if(scrollLeft == 0)
		scrollLeft = document.body.scrollLeft;
	if(fo2Left < scrollLeft) {
		newLeft = fo2.get(0).offsetLeft - fo2Left + scrollLeft;
		fo2.get(0).style.left = newLeft + "px";
		span.get(0).style.left = spanLeft + fo2Left - scrollLeft + 13 + "px";
	}
	if((newLeft + fo2.width()) > (viewportWidth + scrollLeft)) {
		fo2.get(0).style.left = (viewportWidth + scrollLeft) - (newLeft + fo2.width()) + "px";
		span.get(0).style.left = spanLeft - (viewportWidth + scrollLeft) + (newLeft + fo2.width()) + 13 + "px";
	}
	if(!isTouchDevice) {
		var fo2Top = fo2.offset().top;
		var fo2Height = fo2.outerHeight();
		var fo2Bottom = fo2Top + fo2Height;

		var scrollTop = document.documentElement.scrollTop;
		if(scrollTop == 0)
			scrollTop = document.body.scrollTop;
		if(fo2Bottom > scrollTop + clientHeight) {
			var fo3 = $(this).find('.fo3');
			fo3.css({overflow:'auto',height:scrollTop + clientHeight - fo2Top - 18 - 30});
		}
	}
}
function flyoutBottomOut() {
	$(this).children(".fo1").css("display","none");
	$(this).find(".fo2,.fo3,.tip").removeAttr('style');
	$(this).removeClass('hover');
}

var touchedFlyout = null;
function initTouchFlyouts() {
	var $ = jQuery;
	$('.flyout > a,.translation > a,#landnav > li > a').not('.touchinit').addClass('touchinit').click(function(e) {
		var parent = $(this).parent().get(0);
		if(parent != touchedFlyout) {
			touchedFlyout = parent;
			e.stopPropagation();
			return false;
		}
	});
	$('body > div').not('.touchinit').addClass('touchinit').click(function() {
		touchedFlyout = null;
	});
}

var extPrivAcceptFlag = null;
var extPrivPageType;
function initExtendedPrivacy(pageType) {
	if($("#extprivacy").length == 0) return;
	extPrivPageType = pageType;
	var hdnAccept = $('#tfa_XPRVCTRLaccept');
	var action = getExtPrivacyCookie(pageType);
	if(
		action == 1 ||
		(hdnAccept.length == 0 && action != "" && action == 0)
	) {
		$('#extprivacy').remove();
		return;
	}
	if($('#extprivacy .intro').length > 0) {
		setExtPrivacyCookie(pageType,0);
	} else {
		$('#extprivacy .intpop').click(function() {setExtPrivacyCookie(pageType,0);});
	}
	//$('form').each(function() { this.reset(); });
	function procAccept() {
		if(this.checked) {
			$('.checkout,input[type=submit]').removeClass('disabled').filter('input').attr('disabled',false);
			extPrivAcceptFlag = true;
		} else {
			$('.checkout,input[type=submit]').addClass('disabled').filter('input').attr('disabled',true);
			extPrivAcceptFlag = false;
		}
		if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 9) {
			$('.checkout,input[type=submit]').each(function() {
				PIE.detach(this);
				PIE.attach(this);
			});
		}
	}
	function procHighlight() {
		if(this.checked) {
			$('#extprivacyform').addClass('error');
		} else {
			$('#extprivacyform').removeClass('error');
		}
	}
	if(hdnAccept.length > 0) {
		var hdnAcceptId = hdnAccept.val();
		$('#'+hdnAcceptId).each(procAccept).click(procAccept);
		$('input[type=radio]').not('#'+hdnAcceptId).click(function() { procAccept.apply($('#'+hdnAcceptId).get(0)) });
	}
	var hdnDecline = $('#tfa_XPRVCTRLdecline');
	if(hdnDecline.length > 0) {
		var hdnDeclineId = hdnDecline.val();
		$('#'+hdnDeclineId).each(procHighlight).click(procHighlight);
		$('input[type=radio]').not('#'+hdnDeclineId).click(function() { procHighlight.apply($('#'+hdnDeclineId).get(0)) });
	}
}
function setExtPrivacyCookie(pageType,value) {
	var cname = "AG_XPrivacy";
	var htmlLC;
	try {
		htmlLC = $('meta[http-equiv="Content-Language"]').attr('content').substring(3);
	} catch(e) {
		htmlLC = $('meta[httpEquiv="Content-Language"]').attr('content').substring(3);
	}
	var cVal = getCookie(cname);
	var cLC = cVal.substring(0,2);
	if(htmlLC != cLC)
		cVal = htmlLC + ':';
	else
		cVal = cVal.replace(new RegExp(pageType + "\\|\\d;"),"");
	cVal += pageType + "|" + value + ";";
	setDomainCookie(cname,cVal,90);
}
function getExtPrivacyCookie(pageType) {
	var cname = "AG_XPrivacy";
	var htmlLC;
	try {
		htmlLC = $('meta[http-equiv="Content-Language"]').attr('content').substring(3);
	} catch(e) {
		htmlLC = $('meta[httpEquiv="Content-Language"]').attr('content').substring(3);
	}
	var cVal = getCookie(cname);
	var cLC = cVal.substring(0,2);
	if(htmlLC != cLC)
		return "";
	new RegExp(pageType + "\\|(\\d);").test(cVal);
	return RegExp.$1;
}
function setDomainCookie(c_name,value,expiredays) {
	var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);
	var cookieVal=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
	if(location.hostname.match(/\.avoxtechnologies\.ca$/)) {
		cookieVal += ";path=/;domain=.avoxtechnologies.ca";
	}
	document.cookie = cookieVal;
}
function setSessionCookie(c_name, value){
	var cookieVal=c_name+ "=" +escape(value);
	if(location.hostname.match(/\.avoxtechnologies\.ca$/)) {
		cookieVal += ";path=/;domain=.avoxtechnologies.ca";
	}
	document.cookie = cookieVal;
}
function flyoutLeftOver() {
	$(this).addClass("hover");
	var fo2 = $(this).find('.fo2');
	var tip = $(this).find('.tip');
	var scrollTop = document.documentElement.scrollTop;
	if(scrollTop == 0)
		scrollTop = document.body.scrollTop;
	var fo2Top = fo2.offset().top;
	var clientHeight = document.documentElement.clientHeight;
	if($('body.lightbox').length > 0)
		clientHeight -= 2;
	var fo2Height = fo2.outerHeight();
	var fo2Bottom = fo2Top + fo2Height;
	if(fo2Bottom > scrollTop + clientHeight) {
		var diff = scrollTop + clientHeight - fo2Bottom;
		fo2.css('top',parseInt(fo2.css('top')) + diff);
		tip.css('margin-top',parseInt(tip.css('margin-top')) - diff);
		fo2Top += diff;
	}
	if(fo2Top < scrollTop) {
		var diff = scrollTop - fo2Top;
		fo2.css('top',parseInt(fo2.css('top')) + diff);
		tip.css('margin-top',parseInt(tip.css('margin-top')) - diff);
		fo2Top += diff;
		fo2Bottom = fo2Top + fo2Height;
		if(!isTouchDevice && fo2Bottom > scrollTop + clientHeight) {
			var fo3 = $(this).find('.fo3');
			$(this).find('.fo3').css({overflow:'auto',height:clientHeight-(fo3.outerHeight() - fo3.height())});
		}
	}
}
function flyoutLeftOut() {
	$(this).removeClass("hover");
	$(this).find('.fo2,.fo3,.tip').removeAttr('style');
}
function flyoutLeftBottomOver() {
	$(this).addClass("hover");
	var fo2 = $(this).find('.fo2');
	var tip = $(this).find('.tip');
	var scrollTop = document.documentElement.scrollTop;
	if(scrollTop == 0)
		scrollTop = document.body.scrollTop;
	var fo2Top = fo2.offset().top;
	var clientHeight = document.documentElement.clientHeight;
	var fo2Height = fo2.outerHeight();
	var fo2Bottom = fo2Top + fo2Height;
	if(fo2Top < scrollTop) {
		var diff = scrollTop - fo2Top;
		fo2.css('bottom',parseInt(fo2.css('bottom')) - diff);
		tip.css('bottom',parseInt(tip.css('bottom')) + diff);
		fo2Top += diff;
		fo2Bottom = fo2Top + fo2Height;
	}
	if(fo2Bottom > scrollTop + clientHeight) {
		var diff = scrollTop + clientHeight - fo2Bottom;
		fo2.css('bottom',parseInt(fo2.css('bottom')) - diff);
		tip.css('bottom',parseInt(tip.css('bottom')) + diff);
		fo2Top += diff;
		if(!isTouchDevice && fo2Top < scrollTop) {
			var fo3 = $(this).find('.fo3');
			$(this).find('.fo3').css({overflow:'auto',height:clientHeight-(fo3.outerHeight() - fo3.height())});
		}
	}
}
function fixWrap(str) {
	return str.replace(/(\S+\S*\))/g,'<em style="font-style:normal;white-space: nowrap">$1</em>');
}

// Flag to check lightbox commands from cookie (true or false). Check for Firefox 23+.
//var lbCookieCheckFlag = /Firefox\/(\d+)\.(\d+)/.test(navigator.userAgent) && RegExp.$1 >= 23;
var lbCookieCheckFlag = true;
if(lbCookieCheckFlag) {
	lbCookieName = "lbcmd";
	function initLbCookieCheck() {
		lbTimer = setInterval(lbCookieCheck,250);
	}
	function lbCookieCheck() {
		var cVal = getCookie(lbCookieName);

		if(cVal == "") return;

		setDomainCookie(lbCookieName,"",-1);

		var $ = jQuery;
		var qPairs = cVal.split("&");
		var qVal = new Array();
		for(var i=0; i < qPairs.length; i++) {
			var tmp = qPairs[i].split("=");
			try {
				qVal[tmp[0]] = decodeURIComponent(tmp[1]);
			} catch(e) {
				qVal[tmp[0]] = "";
			}
		}
		try {
			if(qVal['close'] && qVal['close'] == 'true') {
				$.fancybox.close();
				closeUtilityNav(function() {
					$('#closebtn').removeClass('modal');
				});
			}
		} catch(e) {}
		try {
			if(qVal['w']) {
				var width = qVal['w'];
				$('#utilquoteform iframe').css('width',width);
				$('.utilquote').css('width',width);
				utilShowContent.apply($('#utilquote').get(0));
			}
		} catch(e) {}
		try {
			if(qVal['lbmodal'] && qVal['lbmodal'] == 'false') {
				$('body').removeClass('lbmodal');
				$('#fancybox-overlay').click(lbOverlayClickClose);
			}
		} catch(e) {}
		try {
			if(qVal['refreshlocale'] && qVal['refreshlocale'] == 'true') {
				LbCloseHandler = refreshLocale;
			}
		} catch(e) {}
		try {
			if(qVal['width'] && qVal['height']) {
				resizeGCFancyBox(qVal['width'],qVal['height']);
			}
		} catch(e) {}
		try {
			if(qVal['modal'] && qVal['modal'] == 'false')
				makeFancyBoxNonModal();
		} catch(e) {}
		try {
			if(qVal['closetimer'] && qVal['closetimer'] == 'true')
				closeTimer();
		} catch(e) {}
		try {
			if(qVal['download']) {
				var iframe = document.createElement("IFRAME");
				iframe.style.position = "absolute";
				iframe.style.left = "-999em";
				iframe.style.top = "-999em";
				iframe.src = qVal['download'];
				document.body.appendChild(iframe);
			}
		} catch(e) {}
		try {
			if(qVal['ungate'] && qVal['ungate'] == 'true') {
				ungateAll();
			}
		} catch(e) {}
		try {
			if(qVal['utilquote'] && qVal['utilquote'] == 'refresh') {
				updateUtilQuote();
			}
		} catch(e) {}
		try {
			if(qVal['utilqcount'] && qVal['utilqcount'] == 'refresh') {
				updateUtilQCount();
			}
		} catch(e) {}

	}
	if(self != top) {
		jQuery(document).ready(function($) {
			insertFrame = function(src) {
				var cVal = src.split("\?")[1];
				setLbCookie(cVal);
			}
		});
		function setLbCookie(val) {
			var cVal = getCookie(lbCookieName) + "&" + val;
			cVal = cVal.replace(/^&/,'');
			setSessionCookie(lbCookieName,cVal);
		}
	}
}
var quoteLightboxHeight = 100000000000000;

function resizeLightbox() {
	if(checkLightbox())
		setLbCookie("h=" +  ($('body').height()+2));
}

function checkLightbox() {
	if(self != top) {
		try { document.body.className += " lightbox"; } catch(e) {}
		$(document).ready(function() {
			$('body').addClass("lightbox");
			$('#contact a').attr("target","_top");
			if(/MSIE (\d+)/.test(navigator.userAgent) == false)
				resizeLightbox();
		});
		if(/MSIE (\d+)/.test(navigator.userAgent)) {
			$(window).load(function() {
				resizeLightbox();
			});
		}
		checkLightbox = function() {
			return true;
		}
		return true;
	}
	return false;
}
var sgbTimer;
function scrollbarToggle() {
	var $ = jQuery;
	var wrap = $("#fancybox-wrap");
	if(document.documentElement.clientHeight < wrap.outerHeight() || document.documentElement.clientWidth < wrap.outerWidth()) {
		if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 8)
			document.body.parentNode.style.overflow = "auto";
		else
			document.body.style.overflow = "auto";
	} else {
		if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) < 8)
			document.body.parentNode.style.overflow = "hidden";
		else
			document.body.style.overflow = "hidden";
	}
	stretchGrayBg();
	if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) > 7)
		sgbTimer = setTimeout("stretchGrayBg()", 500);
}

function stretchGrayBg() {
	var $ = jQuery;
	clearTimeout(sgbTimer);
	$('#fancybox-overlay').css('width',$('body').get(0).offsetWidth);
}
function lbOverlayClickClose() {
	jQuery.fancybox.close();
}
function refreshLocale() {
	var newcclc = getCookie("AG_LOCALE");
	var tmp = location.href.split("#");
	var redirect;
	if(tmp.length > 1)
		redirect = tmp[0] + (tmp[0].indexOf("?") == -1 ? "?" : "&") + "NEWCCLC=" + newcclc + "#" + tmp[1];
	else
		redirect = tmp[0] + (tmp[0].indexOf("?") == -1 ? "?" : "&") + "NEWCCLC=" + newcclc;
	location.href = redirect;
}

function initUtilWatchlist(url) {
	var $ = jQuery;
	var link = $("#utilwatchlist");
	if($('#utilprofile').length != 0)
		$('body').append('<iframe src="'+url+'" style="position: absolute; left: -999em; top: -999em" />');
	link.click(function() {
		if($('body').hasClass('lbmodal')) return;
		var wlCookieVal = getCookie("AGWL");
		var rvCookieVal = getCookie("rvprod");
		if($('.utilwatchlist iframe').length == 0 || watchListCookieVal != wlCookieVal || recentViewedCookieVal != rvCookieVal) {
			watchListCookieVal = wlCookieVal;
			recentViewedCookieVal = rvCookieVal;
			$('.utilwatchlist').html('<div><iframe src="' + url + '" frameborder="0" allowtransparency="true"></iframe></div>');
		}
	});
}

function initNews(newsUrl) {
	var $ = jQuery;
	var link = $("#utilnews");
	link.click(function() {
		if($('body').hasClass('lbmodal')) return;
		if($('.utilnews iframe').length == 0)
			$('.utilnews').html('<div><iframe src="' + newsUrl + '" frameborder="0" allowtransparency="true"></iframe></div>');
	});
}

var s7viewerIndex = 0;
function initS7Video(containerId,videoAsset,imageUrl,alt,onClick,captionUrl) {
	var container = $("#"+containerId);
	if(!onClick)
		onClick = "";
	container.html('<a href="" class="video" onclick="' + onClick + '"><b><img src="'+imageUrl+'" alt="'+alt+'" /></b>' + container.html() + '</a>');
	container.children('a').click(function(e) {
		var link = $(this);
		var w = 820;
		var h = 470;
		var viewerId = "s7viewer" + s7viewerIndex++;
		$('<i></i>').appendTo('body').fancybox({
			content:'<div id="'+viewerId+'" style="width:'+w+'px;height:'+h+'px;"></div>',
			scrolling: 'no',
			onStart: function() {
				$('#fancybox-content').addClass('lbloading');
				$('body').css({'overflow':'hidden'});
				if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) == 7) {
					$('body').attr('scroll','no');
				}
				try {
					varMeasureBarPosition();
					link.trigger("mouseover"); //to resume promo hover function
				} catch(e) {}
			},
			onCleanup: function() {
				$('#fancybox-content').removeClass('lbloading');
			},
			onClosed: function() {
				$('body').css({'overflow':'visible'});
				if(/MSIE (\d+)/.test(navigator.userAgent) && parseInt(RegExp.$1) == 7) {
					$('body').removeAttr('scroll');
				}
				try { varMeasureBarPosition(); } catch(e) {}
			},
			onComplete: function() {
				var videoViewer = new s7viewers.VideoViewer();
				videoViewer.setContainerId(viewerId);
				videoViewer.setParam("serverurl",s7ImageServerUrl);
				videoViewer.setParam("videoserverurl",s7VideoServerUrl);
				videoViewer.setParam("stagesize", w+","+h);
				videoViewer.setParam("autoplay", "1");
				videoViewer.setParam("posterimage","none");
				videoViewer.setParam("config","Avox/Universal_HTML5_Video");
				videoViewer.setParam("contenturl","http://s7.images.avoxtechnologies.ca/skins/");
				if(captionUrl && captionUrl != "")
					videoViewer.setParam("caption", captionUrl+",0");
				videoViewer.setAsset(videoAsset);
				videoViewer.init();
			}
		}).click().remove();
		e.preventDefault();
	});
}

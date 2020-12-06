/*  favorites.js  Sapphire  jrg  2014-04-28  */

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
function setDomainCookie(c_name,value,expiredays) {
	var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);
	var cookieVal=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
	if(location.hostname.match(/\.avoxtechnologies\.ca$/)) {
		cookieVal += ";path=/;domain=.avoxtechnologies.ca";
	}
	document.cookie = cookieVal;
}
function expireDomainCookie(c_name) {
	setDomainCookie(c_name,"x",-1);
}

var favCookie = getCookie("FavoritePartners");
var favorites = new Object();
var favCount = 0;
if(favCookie != "") {
	var favSplit = favCookie.split(",");
	for(var i=0; i < favSplit.length; i++) {
		favorites["_" + favSplit[i]] = true;
	}
	for(var key in favorites) {
		favCount++;
	}
}

function setFavCookie() {
	var favArray = [];
	for(var key in favorites) {
		if(favorites[key]) {
			favArray.push(key.replace("_",""));
		}
	}
	if(favArray.length > 0)
		setDomainCookie("FavoritePartners",favArray.join(","),365)
	else
		expireDomainCookie("FavoritePartners");
}


function setFavImg(img) {
	var tooltip;
	var clickHandler;
	var $ = jQuery;
	if(favorites["_" + img.partnerId]) {
		img.className = "remove";
		img.onclick = removeFavorite;
		img.onmousedown = function() { this.className = "active"; }
		img.title = favRemove;
		$(img).addClass("pointer");
	} else if(favCount == 3) {
		img.className = "max";
		img.onclick = null;
		img.onmousedown = null;
		img.title = favMax;
		$(img).removeClass("pointer");
	} else {
		img.className = "";
		img.onclick = addFavorite;
		img.onmousedown = function() { this.className = "active"; }
		img.title = favAdd;
		$(img).addClass("pointer");
	}
}

function addFavorite() {
	if(favCount == 3) return;
	favorites["_" + this.partnerId] = this;
	favCount++;
	setFavImg(this);
	setFavCookie();
	if(favCount == 3) {
		jQuery("td.fav b").each(function() {
			setFavImg(this);
		})
	}
	jQuery(this).trigger("addFavorite");
}

function addFavorite2(partnerId) {
	addFavorite.call(document.getElementById("partnerfav" + partnerId));
}

function removeFavorite() {
	favorites["_" + this.partnerId] = false;
	favCount--;
	setFavImg(this);
	setFavCookie();
	if(favCount == 2) {
		jQuery("td.fav b").each(function() {
			setFavImg(this);
		})
	}
	jQuery(this).trigger("removeFavorite");
}

function removeFavorite2(partnerId) {
	removeFavorite.call(document.getElementById("partnerfav" + partnerId));
}
jQuery(document).ready(function($) {
	setDomainCookie("cookies","cookies",365);
	if(getCookie("cookies") != "cookies") {
		return;
	}
	expireDomainCookie("cookies");
	$("#partnerbanner.sales").each(function() {
		var img = document.createElement("B");
		img.className = "fav";
		var href = $(this).find("div.partnername a").attr("href");
		/\bpartnerId=(\d+)\b/.test(href);
		img.partnerId = RegExp.$1;
		img.id = "partnerfav" + img.partnerId;
		$(this).find("img").before(img);
		setFavImg(img);
	});
	$("#logocontact.sales").each(function() {
		var img = document.createElement("B");
		img.className = "fav";
		$(img).css("float","left");
		var href = location.href;
		if(/\bpartnerId=(\d+)\b/.test(href) == false) return;
		img.partnerId = RegExp.$1;
		img.id = "partnerfav" + img.partnerId;
		$(this).find("img").before(img);
		setFavImg(img);
	});
});

/* headerfooter.js  kkh  2014-06-14 */

/* locale cookie name */
var localecookie = 'AG_LOCALE';

function getElemRef(elem) {

    /* returns a reference to the indicated element, either because
     * elem is already a reference or it is a valid element ID
     */
    var node = "";
    if (document.getElementById(elem)) { node = document.getElementById(elem); }
    else if (elem.parentNode) { node = elem; };
    return node;
}

function getCookie(name) {

    /* returns the value of cookie name, if any 
     */
    if (document.cookie.length>0) {
	var c_start=document.cookie.indexOf(name + "=");
	if (c_start!=-1) {
	    c_start=c_start + name.length+1;
	    var c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) c_end=document.cookie.length;
	    return unescape(document.cookie.substring(c_start,c_end));
	}
    }
    return "";
}

function setCookie(name,value,days) {

    /* sets cookie name to value with expiry of +days for domain
     * .avoxtechnologies.ca and path.  Gets the cookie and returns its value,
     * confirming the cookie was set (or not)
     */
    if (days) {
	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/; domain=.avoxtechnologies.ca";
    return getCookie(localecookie);
}

function removeFromQueryString(url,param) {
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    if (url.match(re)) { url = url.replace(re,'$1'); };
    url = url.replace(/[?|&]$/,'');
    return url;
}

function addToQueryString(url,param,value) {
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    if (url.match(re)) { url = url.replace(re,'$1'); };
    url = url.replace(/[?|&]$/,'');

    if (url.match(/\?.+/)) { 
	url += '&'+param+'='+encodeURIComponent(value);
    }
    else {
	url += '?'+param+'='+encodeURIComponent(value);
    };
    return url;
}

function fixlocale(url, newcclc) {

    /* removes NEWCCLC and adds corrected cc and lc to the url 
     */
    if (newcclc) {
	url = removeFromQueryString(url,'NEWCCLC', newcclc);
	url = addToQueryString(url,'cc', newcclc.substring(0,2));
	url = addToQueryString(url,'lc', newcclc.substring(2));
    };
    return url;
}

function unsetContext(index) {
  jQuery("#gnavbar .centerwrapper > ul > li:eq(" + 3 + ")").removeClass("context");
}

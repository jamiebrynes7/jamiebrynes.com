var twitterHandle = 'jamiebrynes7';

function tweetCurrentPage(title) {
    window.open('https://twitter.com/share?url='+escape(window.location.href)+'&text='+ escape(title) + ' via @' + twitterHandle, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false; 
}

function shareOnFacebook() {
    window.open('https://www.facebook.com/sharer/sharer.php?u='+escape(window.location.href), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    return false;
}

function shareViaEmail(title) {
    window.open('mailto:?subject=' + title + '&body=Check out this article ' + window.location.href);
    return false;
}
/*
 * DOM ready function 
 * http://dustindiaz.com/smallest-domready-ever
 */
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

r(function() {
  /*
   * Create Kudos Please widget
   */
  var kudosPlease = new KudosPlease({ 
    el : '.kudos',
    duration : 1500,
    persistent : false,
    status : {
      alpha : 'fontawesome-star',
      beta : 'fontawesome-glass',
      gamma : 'fontawesome-bolt'
    }
  });
});
(function() {
    if (window.location.host != "www.jamiebrynes.com") {
        return;
    }
    
    var script = document.createElement('script');
    window.counter = 'https://jamiebrynes_com.goatcounter.com/count'
    script.async = 1;
    script.src = '//gc.zgo.at/count.js';

    var ins = document.getElementsByTagName('script')[0];
    ins.parentNode.insertBefore(script, ins)
})();
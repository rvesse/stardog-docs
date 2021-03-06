window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));

// place any jQuery/helper plugins in here, instead of separate, slower script files.
// easing
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
  def: "easeOutQuad",
  swing: function(e, a, c, b, d) {
    return jQuery.easing[jQuery.easing.def](e, a, c, b, d)
  },
  easeInQuad: function(e, a, c, b, d) {
    return b * (a /= d) * a + c
  },
  easeOutQuad: function(e, a, c, b, d) {
    return -b * (a /= d) * (a - 2) + c
  },
  easeInOutQuad: function(e, a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a + c : -b / 2 * (--a * (a - 2) - 1) + c
  },
  easeInCubic: function(e, a, c, b, d) {
    return b * (a /= d) * a * a + c
  },
  easeOutCubic: function(e, a, c, b, d) {
    return b * ((a = a / d - 1) * a * a + 1) + c
  },
  easeInOutCubic: function(e, a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a * a + c : b / 2 * ((a -= 2) * a * a + 2) + c
  },
  easeInQuart: function(e, a, c, b, d) {
    return b * (a /= d) * a * a * a + c
  },
  easeOutQuart: function(e, a, c, b, d) {
    return -b * ((a = a / d - 1) * a * a * a - 1) + c
  },
  easeInOutQuart: function(e, a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a * a * a + c : -b / 2 * ((a -= 2) * a * a * a - 2) + c
  },
  easeInQuint: function(e, a, c, b, d) {
    return b * (a /= d) * a * a * a * a + c
  },
  easeOutQuint: function(e, a, c, b, d) {
    return b * ((a = a / d - 1) * a * a * a * a + 1) + c
  },
  easeInOutQuint: function(e, a, c, b, d) {
    return 1 > (a /= d / 2) ? b / 2 * a * a * a * a * a + c : b / 2 * ((a -= 2) * a * a * a * a + 2) + c
  },
  easeInSine: function(e, a, c, b, d) {
    return -b * Math.cos(a / d * (Math.PI / 2)) + b + c
  },
  easeOutSine: function(e, a, c, b, d) {
    return b * Math.sin(a / d * (Math.PI / 2)) + c
  },
  easeInOutSine: function(e, a, c, b, d) {
    return -b / 2 * (Math.cos(Math.PI * a / d) - 1) + c
  },
  easeInExpo: function(e, a, c, b, d) {
    return 0 == a ? c : b * Math.pow(2, 10 * (a / d - 1)) + c
  },
  easeOutExpo: function(e, a, c, b, d) {
    return a == d ? c + b : b * (-Math.pow(2, -10 * a / d) + 1) + c
  },
  easeInOutExpo: function(e, a, c, b, d) {
    return 0 == a ? c : a == d ? c + b : 1 > (a /= d / 2) ? b / 2 * Math.pow(2, 10 * (a - 1)) + c : b / 2 * (-Math.pow(2, -10 * --a) + 2) + c
  },
  easeInCirc: function(e, a, c, b, d) {
    return -b * (Math.sqrt(1 - (a /= d) * a) - 1) + c
  },
  easeOutCirc: function(e, a, c, b, d) {
    return b * Math.sqrt(1 - (a = a / d - 1) * a) + c
  },
  easeInOutCirc: function(e, a, c, b, d) {
    return 1 > (a /= d / 2) ? -b / 2 * (Math.sqrt(1 - a * a) - 1) + c : b / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + c
  },
  easeInElastic: function(e, a, c, b, d) {
    e = 1.70158;
    var f = 0,
      g = b;
    if (0 == a) return c;
    if (1 == (a /= d)) return c + b;
    f || (f = 0.3 * d);
    g < Math.abs(b) ? (g = b, e = f / 4) : e = f / (2 * Math.PI) * Math.asin(b / g);
    return -(g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f)) + c
  },
  easeOutElastic: function(e, a, c, b, d) {
    e = 1.70158;
    var f = 0,
      g = b;
    if (0 == a) return c;
    if (1 == (a /= d)) return c + b;
    f || (f = 0.3 * d);
    g < Math.abs(b) ? (g = b, e = f / 4) : e = f / (2 * Math.PI) * Math.asin(b / g);
    return g * Math.pow(2, -10 * a) * Math.sin((a * d - e) * 2 * Math.PI / f) + b + c
  },
  easeInOutElastic: function(e, a, c, b, d) {
    e = 1.70158;
    var f = 0,
      g = b;
    if (0 == a) return c;
    if (2 == (a /= d / 2)) return c + b;
    f || (f = d * 0.3 * 1.5);
    g < Math.abs(b) ? (g = b, e = f / 4) : e = f / (2 * Math.PI) * Math.asin(b / g);
    return 1 > a ? -0.5 * g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f) + c : 0.5 * g * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f) + b + c
  },
  easeInBack: function(e, a, c, b, d, f) {
    void 0 == f && (f = 1.70158);
    return b * (a /= d) * a * ((f + 1) * a - f) + c
  },
  easeOutBack: function(e, a, c, b, d, f) {
    void 0 == f && (f = 1.70158);
    return b * ((a = a / d - 1) * a * ((f + 1) * a + f) + 1) + c
  },
  easeInOutBack: function(e, a, c, b, d, f) {
    void 0 == f && (f = 1.70158);
    return 1 > (a /= d / 2) ? b / 2 * a * a * (((f *= 1.525) + 1) * a - f) + c : b / 2 * ((a -= 2) * a * (((f *= 1.525) + 1) * a + f) + 2) + c
  },
  easeInBounce: function(e, a, c, b, d) {
    return b - jQuery.easing.easeOutBounce(e, d - a, 0, b, d) + c
  },
  easeOutBounce: function(e, a, c, b, d) {
    return (a /= d) < 1 / 2.75 ? b * 7.5625 * a * a + c : a < 2 / 2.75 ? b * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? b * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c : b * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
  },
  easeInOutBounce: function(e, a, c, b, d) {
    return a < d / 2 ? 0.5 * jQuery.easing.easeInBounce(e, 2 * a, 0, b, d) + c : 0.5 * jQuery.easing.easeOutBounce(e, 2 * a - d, 0, b, d) + 0.5 * b + c
  }
});

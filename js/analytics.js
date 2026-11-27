/* Google Analytics 4, loaded only after the visitor accepts analytics cookies.

   GA_MEASUREMENT_ID: paste the GA4 measurement ID here (it looks like G-XXXXXXXXXX,
   found in Google Analytics under Admin > Data streams). While it is empty, nothing
   loads, no banner shows and no cookies are set.

   The visitor's choice is kept in localStorage under "tssp-consent" ("granted" or
   "denied"). "Cookie settings" in the footer reopens the banner so they can change it. */
(function(){
  var GA_MEASUREMENT_ID='G-LL8T6XYJ94';
  var KEY='tssp-consent';
  var loaded=false;

  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}

  /* Send a custom event. Does nothing unless analytics is on. */
  window.tssTrack=function(name,params){
    if(loaded){gtag('event',name,params||{});}
  };

  if(!GA_MEASUREMENT_ID){return;}

  function getChoice(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function saveChoice(v){try{localStorage.setItem(KEY,v);}catch(e){}}

  function load(){
    window['ga-disable-'+GA_MEASUREMENT_ID]=false;
    if(loaded){gtag('consent','update',{analytics_storage:'granted'});return;}
    loaded=true;
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    gtag('config',GA_MEASUREMENT_ID,{allow_google_signals:false,allow_ad_personalization_signals:false});
    var s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
  }

  /* Turning analytics off after it was on: stop it and clear its cookies. */
  function unload(){
    if(loaded){gtag('consent','update',{analytics_storage:'denied'});}
    window['ga-disable-'+GA_MEASUREMENT_ID]=true;
    var host=location.hostname, parts=host.split('.'), domains=[''];
    for(var i=0;i<parts.length-1;i++){domains.push('; domain=.'+parts.slice(i).join('.'));}
    document.cookie.split(';').forEach(function(c){
      var name=c.split('=')[0].trim();
      if(name==='_ga'||name.indexOf('_ga_')===0){
        domains.forEach(function(d){document.cookie=name+'=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'+d;});
      }
    });
  }

  /* Banner */
  var banner;
  function privacyHref(){
    return location.pathname.indexOf('/privacy-policy')===0?'#analytics':'/privacy-policy/#analytics';
  }
  function buildBanner(){
    banner=document.createElement('section');
    banner.className='consent';
    banner.setAttribute('aria-label','Cookie choice');
    banner.innerHTML=
      '<p>Can we use analytics cookies? They tell us which pages are useful, through Google Analytics. '+
      'Nothing is set unless you agree. <a href="'+privacyHref()+'">How we use them</a>.</p>'+
      '<div class="consent-actions">'+
        '<button type="button" class="btn btn-gold" data-choice="granted">Accept</button>'+
        '<button type="button" class="btn btn-ghost" data-choice="denied">Reject</button>'+
      '</div>';
    banner.addEventListener('click',function(e){
      var b=e.target.closest('[data-choice]');
      if(!b){return;}
      var v=b.getAttribute('data-choice');
      saveChoice(v);
      if(v==='granted'){load();}else{unload();}
      hideBanner();
    });
    document.body.appendChild(banner);
  }
  function showBanner(){
    if(!banner){buildBanner();}
    banner.hidden=false;
  }
  function hideBanner(){if(banner){banner.hidden=true;}}

  function init(){
    var choice=getChoice();
    if(choice==='granted'){load();}
    else if(choice!=='denied'){showBanner();}

    /* "Cookie settings" links in the footer */
    document.querySelectorAll('[data-cookie-settings]').forEach(function(el){
      el.hidden=false;
      el.addEventListener('click',function(e){
        e.preventDefault();
        showBanner();
        var first=banner.querySelector('button');
        if(first){first.focus();}
      });
    });
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();

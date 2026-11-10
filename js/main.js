(function(){
  document.documentElement.classList.add('js');

  /* Mobile menu */
  var menuBtn=document.querySelector('.menu-btn'), nav=document.getElementById('site-nav');
  var menuLabel=menuBtn.querySelector('.menu-label');
  function setMenu(open){
    nav.classList.toggle('open',open);
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
    menuLabel.textContent=open?'Close':'Menu';
  }
  menuBtn.addEventListener('click',function(){setMenu(!nav.classList.contains('open'));});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);menuBtn.focus();}
  });

  /* "Request a free call" links preselect the enquiry type */
  document.querySelectorAll('[data-book]').forEach(function(a){
    a.addEventListener('click',function(){var s=document.getElementById('f-need');if(s){s.value='call';}});
  });

  /* Interactive site plan */
  var areas={
    reception:{t:'Entrance and reception',d:'Visitor and contractor sign-in, site security, first aid provision and accident reporting.',shapes:['area-reception']},
    classrooms:{t:'Classrooms and corridors',d:'Basic fire door checks and escape routes, electrical safety, furniture and storage, and slips, trips and falls.',shapes:['area-classrooms']},
    hall:{t:'Hall and kitchen',d:'PE and stage equipment, working at height, and the arrangements with your catering provider.',shapes:['area-hall']},
    plant:{t:'Plant room and services',d:'Asbestos management, water hygiene and legionella, gas and electrical servicing, and permits for contractors.',shapes:['area-plant']},
    science:{t:'Science and DT',d:'Hazardous substances, fume cupboards, gas supplies and machinery guarding.',shapes:['area-science']},
    outdoor:{t:'Playground and field',d:'Play equipment inspections, surfaces, trees, boundaries and outdoor learning spaces.',shapes:['area-outdoor','area-field']},
    carpark:{t:'Car park and deliveries',d:'Traffic management, safe walking routes, drop-off and pick-up, and deliveries.',shapes:['area-carpark']}
  };
  var pins=document.querySelectorAll('.pin'), title=document.getElementById('plan-title'), text=document.getElementById('plan-text');
  function select(key){
    var a=areas[key]; if(!a) return;
    pins.forEach(function(p){p.setAttribute('aria-pressed',p.dataset.area===key?'true':'false');});
    document.querySelectorAll('.plan .area').forEach(function(s){s.classList.remove('lit');});
    a.shapes.forEach(function(id){var s=document.getElementById(id);if(s)s.classList.add('lit');});
    title.textContent=a.t; text.textContent=a.d;
  }
  pins.forEach(function(p){
    p.addEventListener('click',function(){select(p.dataset.area);});
    p.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover)').matches)select(p.dataset.area);});
  });
  select('classrooms');

  /* Enquiry form.
     FORM_ENDPOINT: paste a form-service URL here (for example a Formspree endpoint,
     https://formspree.io/f/xxxxxxxx) and enquiries are sent straight to Clare's inbox.
     While it is empty, the form opens a pre-filled email to Clare instead, so no enquiry is lost. */
  var FORM_ENDPOINT='https://formsubmit.co/ajax/clare@theschoolsafetypartnership.co.uk';
  var CONTACT_EMAIL='clare@theschoolsafetypartnership.co.uk';
  var form=document.getElementById('enquiry');
  function val(id){return document.getElementById(id).value.trim();}
  function showDone(first,fallbackNote){
    document.getElementById('done-title').textContent='Thank you, '+first;
    if(fallbackNote){document.getElementById('done-text').textContent=fallbackNote;}
    form.classList.add('sent');
    var done=form.querySelector('.form-done');
    var calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    done.scrollIntoView({block:'center',behavior:calm?'auto':'smooth'});
    done.focus({preventScroll:true});
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    var first=val('f-first');
    var need=document.getElementById('f-need');
    var needText=need.options[need.selectedIndex].text;
    var lines=[
      'Name: '+first+' '+val('f-last'),
      'School or trust: '+val('f-school'),
      'Role: '+val('f-role'),
      'Email: '+val('f-email'),
      'Phone: '+(val('f-phone')||'not given'),
      'Looking for: '+needText,
      '',
      val('f-msg')
    ];
    if(FORM_ENDPOINT){
      var btn=form.querySelector('button[type=submit]');
      btn.disabled=true;
      fetch(FORM_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          _subject:'Website enquiry from '+val('f-school'),
          _template:'table',
          _honey:'',
          name:first+' '+val('f-last'),school:val('f-school'),role:val('f-role'),
          email:val('f-email'),phone:val('f-phone'),need:needText,message:val('f-msg')
        })
      }).then(function(r){
        return r.json().then(function(j){
          if(!r.ok||!(j.success===true||j.success==='true')){throw new Error('send failed');}
        });
      }).then(function(){
        showDone(first);
      }).catch(function(){
        btn.disabled=false;
        sendByEmailApp();
      });
    }else{
      sendByEmailApp();
    }
    /* Fallback if the form service is unavailable: open a pre-filled email instead. */
    function sendByEmailApp(){
      window.location.href='mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent('Website enquiry from '+val('f-school'))+'&body='+encodeURIComponent(lines.join('\n'));
      showDone(first,'Your email app should now open with your enquiry ready to send. Please press send to reach Clare, who replies within one working day. If nothing opened, email '+CONTACT_EMAIL+'.');
    }
  });
})();

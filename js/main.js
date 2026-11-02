(function(){
  document.documentElement.classList.add('js');

  /* Placeholder highlight toggle (concept only) */
  var phBtn=document.getElementById('ph-toggle');
  if(phBtn){phBtn.addEventListener('click',function(){
    var on=document.body.classList.toggle('clean');
    phBtn.setAttribute('aria-pressed',on?'true':'false');
    phBtn.textContent=on?'Show gold boxes':'Hide gold boxes';
  });}

  /* Mobile menu */
  var menuBtn=document.querySelector('.menu-btn'), nav=document.getElementById('site-nav');
  menuBtn.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',open?'true':'false');
  });
  nav.addEventListener('click',function(e){
    if(e.target.closest('a')){nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}
  });

  /* "Book a free call" links preselect the enquiry type */
  document.querySelectorAll('[data-book]').forEach(function(a){
    a.addEventListener('click',function(){var s=document.getElementById('f-need');if(s){s.value='call';}});
  });

  /* Interactive site plan */
  var areas={
    reception:{t:'Entrance and reception',d:'Visitor and contractor sign-in, site security, first aid provision and accident reporting.',shapes:['area-reception']},
    classrooms:{t:'Classrooms and corridors',d:'Fire doors and escape routes, electrical safety, furniture and storage, and slips, trips and falls.',shapes:['area-classrooms']},
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

  /* Enquiry form. Preview only: connect to a form service before going live. */
  var form=document.getElementById('enquiry');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    var first=document.getElementById('f-first').value.trim();
    document.getElementById('done-title').textContent='Thank you, '+first;
    form.classList.add('sent');
    form.querySelector('.form-done').focus();
  });
})();

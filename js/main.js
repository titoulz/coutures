/* Interactions du site : menu mobile, animations, visionneuse, formulaire de contact */
(function () {
  document.documentElement.classList.add('js');

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Ombre de l'en-tête au défilement
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Apparition douce des blocs
  var targets = document.querySelectorAll(
    '.section__header, .about__text, .highlight, .service, .featured__card, .featured__band, .gallery__item, .zones__list, .contact__cta, .contact__info'
  );
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  }

  // Visionneuse de la galerie (sans JS, les liens ouvrent simplement la photo)
  var box = document.querySelector('.lightbox');
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery__link'));
  if (box && box.showModal && links.length) {
    var img = box.querySelector('.lightbox__img');
    var caption = box.querySelector('.lightbox__caption');
    var index = 0;
    function show(i) {
      index = (i + links.length) % links.length;
      var link = links[index];
      img.src = link.getAttribute('href');
      img.alt = link.querySelector('img').alt;
      var cap = link.parentNode.querySelector('figcaption');
      caption.textContent = cap ? cap.textContent : '';
    }
    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
        box.showModal();
      });
    });
    box.querySelector('.lightbox__close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lightbox__prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lightbox__next').addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__figure')) box.close();
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    // Balayage sur mobile
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  // Formulaire de contact (Web3Forms) : envoi sans quitter la page
  var form = document.getElementById('contact-form');
  if (form && window.fetch) {
    var status = form.querySelector('.contact-form__status');
    var submit = form.querySelector('.contact-form__submit');
    var phone = form.getAttribute('data-phone') || ''; // numéro affiché en cas de problème
    function setStatus(type, text) {
      status.className = 'contact-form__status is-' + type;
      status.textContent = text;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.access_key.value === 'VOTRE_CLE_WEB3FORMS') {
        setStatus('error', "Le formulaire n'est pas encore activé. Appelez-nous au " + phone + ".");
        return;
      }
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      if (data.name) data.subject = 'Demande site : ' + (data.type_de_demande || 'contact') + ' - ' + data.name;
      submit.disabled = true;
      setStatus('pending', 'Envoi en cours…');
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (!json.success) throw new Error(json.message);
          form.reset();
          setStatus('success', 'Merci, votre demande a bien été envoyée. Nous vous recontactons rapidement.');
        })
        .catch(function () {
          setStatus('error', "L'envoi a échoué. Réessayez ou appelez-nous au " + phone + ".");
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();

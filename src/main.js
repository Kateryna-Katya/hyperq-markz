/**
 * Project: hyperq-markz.fit
 * Role: AI Web Design Assistant
 * Description: Full logic including GSAP animations, form validation,
 * mobile menu, and cookie management.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide)
  // ---------------------------------------------------------
  const initIcons = () => {
      if (window.lucide) {
          window.lucide.createIcons();
      }
  };
  initIcons();

  // 2. МОБИЛЬНОЕ МЕНЮ (Бургер и Оверлей)
  // ---------------------------------------------------------
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (burger && mobileMenu) {
      const toggleMenu = () => {
          burger.classList.toggle('active');
          mobileMenu.classList.toggle('active');
          // Блокируем скролл основной страницы при открытом меню
          document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      };

      burger.addEventListener('click', toggleMenu);

      mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (mobileMenu.classList.contains('active')) toggleMenu();
          });
      });
  }

  // 3. ЭФФЕКТЫ СКРОЛЛА (Header & Parallax)
  // ---------------------------------------------------------
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
      // Изменение высоты и фона хедера
      if (window.scrollY > 50) {
          header.style.padding = '12px 0';
          header.style.background = 'rgba(10, 11, 13, 0.95)';
          header.style.borderBottom = '1px solid rgba(212, 255, 0, 0.2)';
      } else {
          header.style.padding = '20px 0';
          header.style.background = 'transparent';
          header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
      }
  });

  // Плавный скролл по якорям
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              e.preventDefault();
              targetElement.scrollIntoView({
                  behavior: 'smooth'
              });
          }
      });
  });

  // 4. GSAP АНИМАЦИЯ HERO (С исправлением видимости)
  // ---------------------------------------------------------
  if (document.querySelector('.hero')) {
      // Устраняем проблему невидимости ( visibility: hidden в CSS )
      gsap.set('.reveal-text', { visibility: 'visible' });

      // Разбиваем текст на слова и строки для эффекта появления
      const heroTitle = new SplitType('.hero__title', { types: 'words, chars' });
      const heroSubtitle = new SplitType('.hero__subtitle', { types: 'lines' });

      const tl = gsap.timeline({
          defaults: { ease: 'power4.out' }
      });

      tl.from(heroTitle.chars, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.02,
          delay: 0.3
      })
      .from(heroSubtitle.lines, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1
      }, "-=0.6")
      .from('.hero__actions .btn', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          clearProps: "all" // Важно: очищает инлайновые стили GSAP, чтобы работал Hover в CSS
      }, "-=0.6")
      .from('.hero__scroll-indicator', {
          opacity: 0,
          duration: 1
      }, "-=0.4");

      // Легкий параллакс для фонового изображения
      gsap.to('.hero__bg-img', {
          scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
          },
          y: '15%'
      });
  }

  // 5. КОНТАКТНАЯ ФОРМА (Валидация, Капча, AJAX)
  // ---------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
      const phoneInput = document.getElementById('phone');
      const captchaLabel = document.getElementById('captcha-label');
      const captchaInput = document.getElementById('captcha-input');
      const formStatus = document.getElementById('form-status');

      // Генерация математической капчи
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 5) + 1;
      const correctAnswer = n1 + n2;

      if (captchaLabel) {
          captchaLabel.textContent = `Подтвердите, что вы не робот: ${n1} + ${n2} =`;
      }

      // Валидация телефона (запрет всего, кроме цифр)
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });

      // Обработка отправки формы
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          // Проверка капчи
          if (parseInt(captchaInput.value) !== correctAnswer) {
              showStatus('Ошибка: Неверный ответ на математический пример.', 'error');
              return;
          }

          // Имитация отправки
          const submitBtn = contactForm.querySelector('button');
          const originalText = submitBtn.innerHTML;

          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Обработка данных...</span>';

          setTimeout(() => {
              showStatus('Успешно! Мы получили ваш запрос и свяжемся с вами в ближайшее время.', 'success');
              contactForm.reset();
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
              initIcons(); // Перерисовываем иконку в кнопке
          }, 1800);
      });

      function showStatus(msg, type) {
          formStatus.textContent = msg;
          formStatus.className = `form-status ${type}`;
          formStatus.style.display = 'block';

          setTimeout(() => {
              formStatus.style.display = 'none';
          }, 6000);
      }
  }

  // 6. COOKIE POPUP (LocalStorage)
  // ---------------------------------------------------------
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookiePopup && !localStorage.getItem('hyperq_cookies_accepted')) {
      // Показываем через 3 секунды после загрузки
      setTimeout(() => {
          cookiePopup.classList.add('active');
      }, 3000);
  }

  if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
          localStorage.setItem('hyperq_cookies_accepted', 'true');
          cookiePopup.classList.remove('active');
      });
  }
});
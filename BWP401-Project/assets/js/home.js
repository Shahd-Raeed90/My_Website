/* التحكم بسلايدر الفعاليات البارزة في الصفحة الرئيسية */
(() => {
  'use strict';
  const slider = document.querySelector('#highlight-slider');
  const nextButton = document.querySelector('#slide-next');
  const previousButton = document.querySelector('#slide-prev');
  const slides = Array.from(document.querySelectorAll('.spotlight-slide'));
  const dots = Array.from(document.querySelectorAll('.slider-dot'));

  if (!slider || !nextButton || !previousButton || slides.length === 0) return;

  // حفظ الشريحة المعروضة ومؤقت التبديل التلقائي.
  let currentIndex = 0;
  let autoPlayId = null;

  // إظهار الفعالية المحددة وتحديث نقاط التنقل.
  function showSlide(index) {
    // إبقاء رقم الشريحة ضمن عدد الشرائح حتى عند الوصول للنهاية.
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== currentIndex;
    });
    // تحديث شكل نقاط التنقل مع الشريحة الحالية.
    dots.forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  // إيقاف المؤقت عند تفاعل المستخدم مع السلايدر.
  function stopAutoPlay() {
    if (autoPlayId !== null) {
      window.clearInterval(autoPlayId);
      autoPlayId = null;
    }
  }

  // التبديل التلقائي بين الشرائح عند السماح بالحركة.
  function startAutoPlay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || autoPlayId !== null) return;
    autoPlayId = window.setInterval(() => {
      if (!document.hidden) showSlide(currentIndex + 1);
    }, 6500);
  }

  // تشغيل الأسهم ونقاط الانتقال اليدوي بين الشرائح.
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
  previousButton.addEventListener('click', () => showSlide(currentIndex - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);
  slider.addEventListener('focusin', stopAutoPlay);
  slider.addEventListener('focusout', event => {
    if (!slider.contains(event.relatedTarget)) startAutoPlay();
  });
  // إيقاف التبديل عند ترك تبويب الموقع واستئنافه عند العودة.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  });

  showSlide(0);
  startAutoPlay();
})();

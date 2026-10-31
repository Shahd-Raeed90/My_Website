/* وظائف مشتركة بين صفحات الدليل */
(() => {
  'use strict';
  // زر العودة للأعلى موجود في جميع الصفحات.
  const topButton = document.querySelector('#to-top');
  if (topButton) {
    // يظهر الزر فقط بعد النزول مسافة كافية في الصفحة.
    const update = () => topButton.classList.toggle('is-visible', window.scrollY > 300);
    window.addEventListener('scroll', update, { passive: true });
    // تمرير ناعم للأعلى إلا عند تفعيل تقليل الحركة.
    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    update();
  }
})();

/* نظام البحث والفلترة: الاسم + التصنيف + التاريخ + الموقع */
(() => {
  'use strict';
  const search = document.querySelector('#event-search');
  const category = document.querySelector('#event-category');
  const date = document.querySelector('#event-date');
  const location = document.querySelector('#event-location');
  const cards = Array.from(document.querySelectorAll('.event-column'));
  const count = document.querySelector('#events-count');
  const empty = document.querySelector('#no-results');
  const form = document.querySelector('#filter-form');
  const emptyReset = document.querySelector('#empty-reset');
  if (!search || !category || !date || !location || !count || !empty || !form) return;

  // السماح بفتح صفحة الفعاليات مع تصنيف محدد من الرابط.
  const allowedCategories = ['all', 'tech', 'workshop', 'sports'];
  const initialCategory = new URLSearchParams(window.location.search).get('category');
  if (allowedCategories.includes(initialCategory)) category.value = initialCategory;

  // تطبيق البحث والتصنيف والتاريخ والموقع معًا.
  function filterEvents() {
    const term = search.value.trim().toLocaleLowerCase();
    const wantedCategory = category.value;
    const wantedDate = date.value;
    // تجميع القيم المختارة من حقول البحث الأربعة.
    const wantedLocation = location.value;
    let visible = 0;

    cards.forEach(card => {
      // قراءة نص البطاقة ومقارنته بعبارة البحث.
      const sameSearch = card.textContent.toLocaleLowerCase().includes(term);
      const sameCategory = wantedCategory === 'all' || card.dataset.category === wantedCategory;
      const sameDate = !wantedDate || card.dataset.date === wantedDate;
      const sameLocation = wantedLocation === 'all' || card.dataset.location === wantedLocation;
      // يجب أن تتطابق جميع الشروط النشطة حتى تظهر البطاقة.
      const matches = sameSearch && sameCategory && sameDate && sameLocation;
      card.classList.toggle('d-none', !matches);
      if (matches) visible++;
    });
    // تحديث عداد النتائج ورسالة عدم وجود فعاليات.
    count.textContent = `يتم عرض ${visible} من أصل ${cards.length} فعاليات`;
    empty.classList.toggle('d-none', visible > 0);
  }

  // البحث أثناء الكتابة، وتحديث النتائج عند تغيير القوائم.
  search.addEventListener('input', filterEvents);
  [category, date, location].forEach(select => select.addEventListener('change', filterEvents));
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => {
    // تحديث النتائج بعد إعادة حقول الفلترة لقيمها الافتراضية.
    window.setTimeout(() => {
      category.value = 'all';
      filterEvents();
    }, 0);
  });
  // إعادة الحقول إلى قيمها الابتدائية عند الضغط من رسالة النتائج الفارغة.
  if (emptyReset) emptyReset.addEventListener('click', () => {
    form.reset();
    search.value = '';
    category.value = 'all';
    date.value = '';
    location.value = 'all';
    filterEvents();
    search.focus();
  });
  filterEvents();
})();

/* التفاصيل الديناميكية لكل فعالية، المشاركة والتقويم */
(() => {
  'use strict';
  const events = window.BWP_EVENTS || [];
  // تحديد الفعالية المطلوبة من عنوان الصفحة.
  const params = new URLSearchParams(window.location.search);
  const selected = events.find(event => event.id === params.get('id')) || events[0];
  if (!selected) return;
  // اختصار للوصول إلى عناصر صفحة التفاصيل بواسطة المعرف.
  const $ = id => document.getElementById(id);
  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value;
  }
  // تعبئة عنوان الصفحة ومعلومات الفعالية المختارة.
  document.title = `${selected.title} | دليل فعاليات الجامعة الافتراضية`;
  setText('detail-title', selected.title);
  setText('event-type-label', selected.categoryLabel);
  setText('detail-lead', selected.lead);
  setText('detail-date', selected.arabicDate);
  setText('detail-location', selected.locationLabel);
  setText('detail-category', selected.categoryLabel);
  // عرض صورة احتياطية إذا تعذر تحميل الصورة.
  function applyPhoto(element, url, fallback) {
    element.onerror = () => {
      element.onerror = null;
      element.src = `assets/img/${fallback}.svg`;
    };
    element.src = url;
  }
  const cover = $('detail-image');
  applyPhoto(cover, selected.image, selected.id);
  cover.alt = `صورة مرتبطة بفعالية ${selected.title}`;
  const main = $('gallery-main');
  applyPhoto(main, selected.image, selected.id);
  main.alt = `صورة لفعالية ${selected.title}`;
  const secondary = $('gallery-related');
  applyPhoto(secondary, selected.companionImage, selected.id === 'ai' ? 'cyber' : selected.id === 'chess' ? 'programming' : 'ai');
  secondary.alt = 'صورة مرتبطة بالأنشطة الجامعية';
  // إنشاء فقرات الوصف وقائمة الفوائد من بيانات الفعالية.
  const desc = $('detail-description');
  desc.replaceChildren(...selected.paragraphs.map(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    return p;
  }));
  const benefits = $('detail-benefits');
  benefits.replaceChildren(...selected.benefits.map(benefit => {
    const li = document.createElement('li');
    li.textContent = benefit;
    return li;
  }));
  setText('map-note', selected.location === 'online'
    ? 'المشاركة عبر الإنترنت.'
    : 'المكان: قاعة الأنشطة.');

  const related = $('related-events');
  // إنشاء بطاقات الفعاليات ذات الصلة.
  events.filter(e => e.id !== selected.id).forEach(ev => {
    const wrapper = document.createElement('div');
    wrapper.className = 'col-12 col-md-6 col-xl-4';
    wrapper.innerHTML = `
      <article class="event-card card h-100">
        <img src="${ev.image}"
             data-fallback="assets/img/${ev.id}.svg"
             onerror="this.onerror=null;this.src=this.dataset.fallback"
             alt="صورة مرتبطة بفعالية ${ev.title}" loading="lazy">
        <div class="event-card-body">
          <span class="event-category">${ev.categoryLabel}</span>
          <h3>${ev.title}</h3>
          <p>${ev.lead}</p>
          <div class="event-meta">
            <span>◷ ${ev.arabicDate}</span>
            <span>⌖ ${ev.locationLabel}</span>
          </div>
          <a class="event-more" href="event.html?id=${ev.id}">
            عرض التفاصيل <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>`;
    related.appendChild(wrapper);
  });

  // عرض رسائل نتيجة أزرار التفاصيل للمستخدم.
  const actionMessage = $('detail-action-message');
  function notify(message, error=false) {
    actionMessage.classList.remove('d-none');
    actionMessage.classList.toggle('is-warning', error);
    actionMessage.textContent = message;
  }
  $('calendar-button').addEventListener('click', () => {
    // حفظ الفعالية في التقويم كحدث يستمر طوال اليوم.
    const date = selected.date.replaceAll('-', '');
    const next = new Date(`${selected.date}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const nextDate = next.toISOString().slice(0,10).replaceAll('-', '');
    const icsEscape = text => String(text).replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(',','\\,').replaceAll(';','\\;');
    // تجهيز محتوى ملف ICS ليُضاف إلى تطبيق تقويم.
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BWP401//Student Event Directory//AR','CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',`UID:bwp401-${selected.id}@example.invalid`,`DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g,'').replace(/\.\d{3}/,'')}`,
      `DTSTART;VALUE=DATE:${date}`,`DTEND;VALUE=DATE:${nextDate}`,
      `SUMMARY:${icsEscape(selected.title)}`,
      `DESCRIPTION:${icsEscape(selected.lead)}`,
      `LOCATION:${icsEscape(selected.locationLabel)}`, 'END:VEVENT','END:VCALENDAR'
    ];
    // تنزيل ملف التقويم من المتصفح دون الحاجة إلى خادم.
    const blob = new Blob([lines.join('\r\n')+'\r\n'], { type: 'text/calendar;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `bwp401-${selected.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 2000);
    notify('ملف التقويم جاهز للإضافة.');
  });

  // استخدام مشاركة الجهاز عند توفرها، وإلا نسخ البيانات.
  $('share-button').addEventListener('click', async () => {
    const online = window.location.protocol === 'https:' || window.location.protocol === 'http:';
    const message = `${selected.title} – ${selected.arabicDate}`;
    const shareText = online ? `${message}\n${window.location.href}` : message;
    try {
      if (online && navigator.share) {
        await navigator.share({ title:selected.title, text: message, url: window.location.href });
        notify('تم فتح خيارات المشاركة.');
        return;
      }
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(shareText);
      else {
        const tmp = document.createElement('textarea');
        tmp.value = shareText;
        tmp.style.position = 'fixed';
        tmp.style.opacity = '0';
        document.body.appendChild(tmp);
        tmp.select();
        if (!document.execCommand('copy')) throw new Error('copy failed');
        tmp.remove();
      }
      notify(online ? 'تم نسخ رابط الفعالية.' : 'تم نسخ اسم الفعالية وتاريخها. يتوفر نسخ الرابط بعد نشر الموقع.');
    } catch (error) {
      if (error.name !== 'AbortError') notify('تعذّر النسخ تلقائيًا. يمكنك نسخ العنوان من شريط المتصفح عند رفع الموقع.',true);
    }
  });

  // نموذج إبداء الاهتمام يوضح النتيجة داخل الصفحة.
  const interestForm = $('interest-form');
  interestForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('interest-name').value.trim();
    if (!name) {
      $('interest-name').classList.add('is-invalid');
      $('interest-name').focus();
      return;
    }
    $('interest-name').classList.remove('is-invalid');
    const alert = $('interest-alert');
    alert.textContent = `شكرًا ${name}! تم حفظ اهتمامك في هذه الصفحة.`;
    alert.classList.remove('d-none');
    interestForm.reset();
  });
})();

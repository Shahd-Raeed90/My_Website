/* التحقق من بيانات نموذج التواصل */
(() => {
  'use strict';
  const form = document.querySelector('#contact-form');
  const alertBox = document.querySelector('#contact-alert');
  if (!form || !alertBox) return;
  const name = document.querySelector('#contact-name');
  const email = document.querySelector('#contact-email');
  const message = document.querySelector('#contact-message');
  // الحقول الثلاثة المطلوب التحقق منها قبل عرض رسالة النجاح.
  const fields = [name,email,message];
  // إزالة التنبيه عن الحقل فور بدء تصحيحه.
  fields.forEach(field => field.addEventListener('input', () => {
    field.classList.remove('is-invalid');
    alertBox.classList.add('d-none');
  }));
  // فحص المدخلات وإظهار رسالة مناسبة دون إرسال فعلي.
  form.addEventListener('submit', event => {
    event.preventDefault();
    fields.forEach(field => { field.value = field.value.trim(); });
    const badName = !name.value;
    const badEmail = !email.value || !email.checkValidity();
    const badMessage = !message.value;
    // حفظ حالة الخطأ لكل حقل لتلوينه عند الحاجة.
    const errors = [badName,badEmail,badMessage];
    fields.forEach((field,i) => field.classList.toggle('is-invalid', errors[i]));
    alertBox.className = 'alert mt-3';
    // إيقاف العملية عند وجود حقل فارغ أو بريد غير صالح.
    if (errors.some(Boolean)) {
      alertBox.classList.add('alert-danger');
      alertBox.textContent = badName || !email.value || badMessage
        ? 'يرجى تعبئة جميع الحقول المطلوبة قبل المتابعة.'
        : 'يرجى إدخال بريد إلكتروني بصيغة صحيحة.';
      fields[errors.indexOf(true)].focus();
      return;
    }
    // رسالة النجاح تعني صحة المدخلات فقط، ولا ترسل بريدًا.
    alertBox.classList.add('alert-success');
    alertBox.textContent = 'البيانات المدخلة صحيحة. يمكنك التواصل عبر القنوات الموجودة في الصفحة.';
    form.reset();
  });
})();

(() => {
      'use strict'
      const forms = document.querySelectorAll('.needs-validation')
      Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add('was-validated')
        }, false)
      })
    })()

    // for flash msg case of success
  document.addEventListener("DOMContentLoaded", () => {
  const toastElement = document.getElementById('flashToast');
  if (toastElement) {
    // Initialize Bootstrap Toast if using Bootstrap's JS bundle
    const toast = new bootstrap.Toast(toastElement, { 
      delay: 4000, 
      autohide: true 
    });
    toast.show();
  }
});


// for flash msg case of success

document.addEventListener("DOMContentLoaded", () => {
  const toasts = document.querySelectorAll('.toast');
  toasts.forEach(toastEl => {
    const toast = new bootstrap.Toast(toastEl, { 
      delay: 4000, 
      autohide: true 
    });
    toast.show();
  });
});
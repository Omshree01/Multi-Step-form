document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 0;

    const formData = JSON.parse(localStorage.getItem('formData')) || {
        personal: {},
        address: {},
        payment: {}
    };

    const showStep = (index) => {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        progressSteps.forEach((step, i) => {
            step.classList.toggle('active', i <= index);
        });
        prevBtn.style.display = index === 0 ? 'none' : 'inline-block';
        nextBtn.style.display = index === steps.length - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = index === steps.length - 1 ? 'inline-block' : 'none';
    };

    const saveFormData = () => {
        const stepData = {};
        switch (currentStep) {
            case 0:
                stepData.personal = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value
                };
                break;
            case 1:
                stepData.address = {
                    street: document.getElementById('street').value,
                    city: document.getElementById('city').value,
                    zip: document.getElementById('zip').value
                };
                break;
            case 2:
                stepData.payment = {
                    cardNumber: document.getElementById('cardNumber').value,
                    cvc: document.getElementById('cvc').value
                };
                break;
        }
        Object.assign(formData, stepData);
        localStorage.setItem('formData', JSON.stringify(formData));
    };

    const validateStep = () => {
        const errors = {};
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const street = document.getElementById('street');
        const city = document.getElementById('city');
        const zip = document.getElementById('zip');
        const cardNumber = document.getElementById('cardNumber');
        const cvc = document.getElementById('cvc');

        if (currentStep === 0) {
            if (!name.value) errors.nameError = 'Name is required';
            if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) errors.emailError = 'Invalid email format';
            if (!phone.value || !/^\d{10}$/.test(phone.value)) errors.phoneError = 'Invalid phone number';
        } else if (currentStep === 1) {
            if (!street.value) errors.streetError = 'Street is required';
            if (!city.value) errors.cityError = 'City is required';
            if (!zip.value) errors.zipError = 'ZIP code is required';
        } else if (currentStep === 2) {
            if (!cardNumber.value) errors.cardNumberError = 'Card number is required';
            if (!cvc.value || !/^\d{3}$/.test(cvc.value)) errors.cvcError = 'Invalid CVC';
        }

        Object.keys(errors).forEach(key => {
            document.getElementById(key).textContent = errors[key];
        });

        return Object.keys(errors).length === 0;
    };

    const showReview = () => {
        document.getElementById('reviewName').textContent = formData.personal.name || '';
        document.getElementById('reviewEmail').textContent = formData.personal.email || '';
        document.getElementById('reviewPhone').textContent = formData.personal.phone || '';
        document.getElementById('reviewStreet').textContent = formData.address.street || '';
        document.getElementById('reviewCity').textContent = formData.address.city || '';
        document.getElementById('reviewZip').textContent = formData.address.zip || '';
        document.getElementById('reviewCardNumber').textContent = formData.payment.cardNumber || '';
        document.getElementById('reviewCvc').textContent = formData.payment.cvc || '';
    };

    prevBtn.addEventListener('click', () => {
        if (validateStep()) {
            saveFormData();
            currentStep--;
            showStep(currentStep);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep()) {
            saveFormData();
            currentStep++;
            if (currentStep === steps.length - 1) {
                showReview();
            }
            showStep(currentStep);
        }
    });

    document.getElementById('multiStepForm').addEventListener('submit', (event) => {
        event.preventDefault();
        if (validateStep()) {
            saveFormData();
            alert(' Thank you!. Your Form Submitted Successfully');
            localStorage.removeItem('formData');
        }
    });

    showStep(currentStep);
});

<template lang="html">
  <div class="contact-page-wrapper">
    <!-- Left section: Contact information -->
    <div class="contact-page">
      <div class="contact-info">
        <h2>Support</h2>
        <h3>Contact Information</h3>
        <p class="contact-description">
          We are here to help you! Whether you have a question about our services, need assistance, or just want to say hello, feel free to reach out. You can contact us via email, phone, or by filling out the form on this page.
        </p>
        <div class="info-box">
          <div class="icon-wrap">
            <img src="/Graphics/Location.svg" alt="location icon" class="icon" />
          </div>
          <div class="text-wrap">
            <h4>Our Location</h4>
            <p>5830 E 2ND ST PMB 7000 Casper WY 82609</p>
          </div>
        </div>
        <div class="info-box">
          <div class="icon-wrap">
            <img src="/Graphics/Phone.svg" alt="phone icon" class="icon" />
          </div>
          <div class="text-wrap">
            <h4>Our Number</h4>
            <p>+1 (949) 547-3815</p>
          </div>
        </div>
        <div class="info-box">
          <div class="icon-wrap">
            <img src="/Graphics/EmailLogo.svg" alt="mail icon" class="icon" />
          </div>
          <div class="text-wrap">
            <h4>Our Email</h4>
            <p>Support@Nexgensalepro.com</p>
          </div>
        </div>
      </div>

      <!-- Right section: Contact form -->
      <div class="contact-form">
        <form v-if="showForm" @submit.prevent="submitForm">
          <div class="form-group">
            <input type="text" placeholder="Your Name" v-model="formData.name" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <input type="text" placeholder="Your Phone Number" v-model="formData.phone" />
            </div>
            <div class="form-group">
              <input type="email" placeholder="Your Email" v-model="formData.email" />
            </div>
          </div>
          <div class="form-group">
            <input type="text" placeholder="Subject" v-model="formData.subject" />
          </div>
          <div class="form-group">
            <textarea placeholder="Your Message" v-model="formData.message"></textarea>
          </div>
          <button type="submit" class="submit-button">
            <img src="/Graphics/LinkIcon.svg" alt="" />
            SEND EMAIL
          </button>
        </form>
        
        <!-- Error and Success Messages -->
        <div v-if="incomplete" class="form-message error">
          Please fill out all required fields.
        </div>
        <div v-if="invalidEmail" class="form-message error">
          Please enter a valid email address.
        </div>
        <div v-if="showSuccess" class="form-message success">
          Your message was sent successfully!
        </div>
        <div v-if="showError" class="form-message error">
          Something went wrong. Please try again.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const formData = ref({
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
});

const showForm = ref(true);
const showSuccess = ref(false);
const showError = ref(false);
const incomplete = ref(false);
const invalidEmail = ref(false);

const submitForm = async () => {
  if (
    formData.value.name == "" ||
    formData.value.email == "" ||
    formData.value.subject == "" ||
    formData.value.message == ""
  ) {
    invalidEmail.value = false;
    incomplete.value = true;
  } else if (
    !formData.value.email.includes("@") ||
    !formData.value.email.includes(".")
  ) {
    incomplete.value = false;
    invalidEmail.value = true;
  } else {
    try {
      const response = await fetch(
        "https://8y7wjasxc7.execute-api.us-east-2.amazonaws.com/default/send-contact-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData.value),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        showForm.value = false;
        showSuccess.value = true;
      }
    } catch (error) {
      showForm.value = false;
      showError.value = true;
    }
  }
};
</script>

<style scoped>
.contact-page-wrapper {
  background-color: #000;
  color: white;
  width: 100%;
  min-height: 100%;
  position: relative;
  /* overflow: auto; */
}

.contact-page {
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.contact-info {
  flex: 1;
  padding-right: 2rem;
}

.contact-info h2 {
  font-size: 1rem;
  color: #0197b2;
  text-transform: uppercase;
}

.contact-info h3 {
  font-size: 2.5rem;
  font-weight: bold;
}

.contact-description {
  margin: 1.5rem 0;
  line-height: 1.8;
  font-size: 1rem;
}

.info-box {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.icon-wrap {
  background-color: #0197b2;
  padding: 1rem;
  border-radius: 50%;
  margin-right: 1.5rem;
}

.icon {
  width: 24px;
  height: 24px;
}

.text-wrap h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.text-wrap p {
  font-size: 1rem;
}

.contact-form {
  flex: 1;
  padding: 2rem 0;
  border-radius: 0px;
}

.contact-form form {
  display: grid;
  grid-gap: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background-color: transparent;
  border: 1px solid rgba(73, 73, 73, 1);
  color: white;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-row .form-group {
  flex: 1;
}

.submit-button {
  background-color: #0197b2;
  color: black;
  font-weight: bold;
  padding: 1rem 2rem;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: white;
}

.submit-button img {
  height: 1rem;
  width: 1rem;
}

.form-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
}

.success {
  background-color: #0197b2;
  color: white;
}

.error {
  background-color: #d9534f;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .contact-page {
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
  }

  .contact-info {
    padding-right: 0;
    text-align: center;
  }

  .info-box {
    justify-content: flex-start;
  }

  h4 {
    text-align: left;
  }

  .contact-form {
    width: 100%;
    padding-top: 2rem;
  }

  .form-row {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .contact-info h3 {
    font-size: 2rem;
  }

  .contact-description {
    font-size: 0.9rem;
  }

  .text-wrap h4 {
    font-size: 1rem;
  }

  .text-wrap p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .contact-page {
    padding: 1rem;
  }

  .contact-info h3 {
    font-size: 1.5rem;
  }

  .contact-description {
    font-size: 0.85rem;
  }

  .info-box {
    margin-top: 1rem;
  }

  .submit-button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
}
</style>

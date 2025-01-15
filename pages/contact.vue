<template lang="html">
  <div class="body-wrapper">
    <div class="contact">
      <div class="top-left">
        <h1>Contact</h1>
        <p class="intro-message">Reach out through the form, and we'll be back to you shortly.</p>
        <div class="info">
          <h2>Send us an email</h2>
          <h3>sales@buzzed-honey.com</h3>
        </div>
        <div class="info">
          <h2>Give us a call</h2>
          <h3>+1 (801) 874-7597</h3>
        </div>
      </div>
      <div class="top-right" v-if="showForm">
        <form class="" action="index.html" method="post">
          <div class="incomplete-message" v-if="incomplete">
            <h4>*Please complete all fields before submitting.</h4>
          </div>
          <div class="incomplete-message" v-if="invalidEmail">
            <h4>*Please enter a valid email address.</h4>
          </div>
          <input type="text" name="Name" placeholder="Name" v-model="formData.name">
          <input type="text" name="Email" placeholder="Email" v-model="formData.email">
          <textarea name="Message" rows="8" cols="80" placeholder="Message" v-model="formData.message"></textarea>
          <button class="honey-button" type="button" name="submit" @click="submit()">Submit</button>
        </form>
      </div>

      <div class="success" v-if="showSuccess">
        <div class="message-wrap">
          <h2>Submission success! Thank you!</h2>
        </div>
      </div>

      <div class="error" v-if="showError">
        <div class="message-wrap">
          <h2>Sorry, there was an error submitting the form!</h2>
          <h3>Please try again or send us an email...</h3>
        </div>
      </div>
    </div>
    <section class="FAQ">
      <WebSectionsFAQ />
    </section>
  </div>
</template>

<script setup>
// SEO ADJUST
useSeoMeta({
  title: "Contact Us || HARTECHO",
  ogTitle: "Contact Us || HARTECHO",
  description:
    "Get in touch with us through our contact form or reach us directly via email or phone. We look forward to hearing from you.",
  ogDescription:
    "Get in touch with us through our contact form or reach us directly via email or phone. We look forward to hearing from you.",
  ogImage: "/AspenChiroLogo.webp",
  twitterCard: "/AspenChiroLogo.webp",
});

const formData = ref({
  name: "",
  email: "",
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
    // console.log(JSON.stringify(formData.value));
    try {
      // FUNCTION ADJUST
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
        await sendConfirmationEmail();
        showForm.value = false;
        showSuccess.value = true;
      }
    } catch (error) {
      console.log("was error");
      showForm.value = false;
      showError.value = true;
    }
  }
};

const sendConfirmationEmail = async () => {
  // console.log("formData.value.email: ", formData.value.email);
  // console.log("formData.value.message: ", formData.value.message);
  try {
    // FUNCTION ADJUST
    const response = await fetch(
      "https://jf32m0961a.execute-api.us-east-2.amazonaws.com/first/send-custom-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.value.email,
          from: "beau@nationalautohub.com",
          message:
            "Your contact submission was successful! We will get back to your shortly. Here is a preview of the message you sent: \n\n" +
            formData.value.message,
          company: "National Auto Hub",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      showForm.value = false;
      showSuccess.value = true;
    }
  } catch (error) {
    console.log("was error in sendConfirmationEmail()");
    showForm.value = false;
    showError.value = true;
  }
};

const submit = () => {
  submitForm();
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style lang="css" scoped>
.body-wrapper {
  min-height: 60rem;
  height: auto;
  width: 100%;
  position: relative;
  z-index: 3;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 0;
  /* background: url('/Bees.png') repeat; */
  /* background: black; */
}

.contact {
  height: 100%;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 45% 55%;
  grid-gap: 3rem;
  padding: 3rem;
}

.top-left {
  height: 100%;
}

h1 {
  text-align: left;
  color: #f1b55c;
  font-family: Bebas Neue, cursive;
  font-weight: bolder;
  font-size: 8rem;
  padding: 0 2rem;
  margin: 0;
}

.intro-message {
  font-size: 1.3rem;
  margin-top: 2rem;
  padding: 0 2rem;
}

.info {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-top: 2rem;
}

h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

h3 {
  font-size: 1.3rem;
  font-weight: normal;
  margin: 0;
}

.top-right {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  position: relative;
  display: grid;
  grid-template-rows: auto auto auto auto auto auto auto;
  background-color: white;
  padding: 3rem 3rem;
  border-radius: 10px;
}

.incomplete-message {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 2rem;
  color: red;
  display: flex;
  justify-content: center;
  align-items: center;
}

input,
textarea {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid black;
  padding: 2px;
  width: 100%;
  font-family: manrope;
  font-size: 1rem;
  margin-top: 2rem;
}

input:focus,
textarea:focus {
  outline: none;
}

button {
  margin-top: 2rem;
}

.success {
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #b1b1b1;
  padding: 2rem;
  width: 100%;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .body-wrapper {
    min-height: 60rem;
    height: auto;
  }

  .contact {
    grid-template-columns: 100%;
    padding: 2rem;
  }

  h1 {
    font-size: 8rem;
  }

  .intro-message {
    font-size: 1.3rem;
  }

  p {
    margin-top: 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  .top-right {
    height: 30rem;
    /* padding: 10px; */
  }

  form {
    height: 100%;
    overflow-y: scroll hidden;
    overflow-x: scroll hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem 1rem;
  }

  button {
    width: 12rem;
    margin-top: 2rem;
    height: 4rem;
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  /*  ------------  MOBILE  ------------   */
  .body-wrapper {
    min-height: 50rem;
  }

  .contact {
    padding: 1rem;
  }

  h1 {
    font-size: 5.5rem;
  }
}
</style>

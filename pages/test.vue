<template>
  <button class="google-btn" @click="onGoogleSignIn">
    <!-- your own Google icon SVG or img -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 533.5 544.3"
      class="google-logo"
    >
      <!-- …Google G‑icon paths… -->
    </svg>
    Continue with Google
  </button>
</template>
  
  <script setup>
const config = useRuntimeConfig();

let gis;
function initGoogle() {
  console.log("client id: " + config.public.GOOGLE_CLIENT_ID);
  gis = window.google.accounts.id;
  gis.initialize({
    client_id: config.public.GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
    ux_mode: "popup",
  });
}

function loadScript() {
  if (!document.getElementById("google-client-script")) {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.id = "google-client-script";
    s.async = true;
    s.defer = true;
    s.onload = initGoogle;
    document.head.appendChild(s);
  } else {
    initGoogle();
  }
}

function onGoogleSignIn() {
  if (!gis) return;
  gis.prompt(); // opens the Google sign‑in popup
}

function handleGoogleResponse(response) {
  // response.credential is the ID token; hand it off to your existing handler:
  handleGoogleLogin({ credential: response.credential });
}

onMounted(loadScript);
</script>
  
  <style scoped>
.google-btn {
  display: inline-flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.google-btn:hover {
  background: #f7f7f7;
  border-color: #aaa;
}
.google-logo {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}
</style>
  
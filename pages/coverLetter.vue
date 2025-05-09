<template>
  <div class="cover-letter">
    <NuxtImg src="/Graphics/resumeLeaves.svg" alt="" class="leaf-graphic" />

    <main class="content">
      <header class="header">
        <h1>
          <span class="first-name">THOMAS</span>
          <span class="last-name">HART</span>
        </h1>
        <p class="contact-lines">
          2175 King Street, SLC, UT • (801) 793‑5456 • thomashartdev@gmail.com
        </p>
        <p class="letter-date">May 8, 2025</p>
      </header>

      <section class="letter-body">
        <p>Dear Hiring Committee,</p>
        <p>
          I’m excited to apply for the Full Stack Web Developer
          (Programmer/Analyst) position at the Spencer S. Eccles Health Sciences
          Library, University of Utah. With over three years of experience
          creating and maintaining web applications in academic and enterprise
          settings, I bring strong backend development, database design, and
          security expertise, along with front‑end and cloud‑infrastructure
          skills.
        </p>
        <p>In my current role at HARTECHO, I:</p>
        <ul>
          <li>
            Designed and implemented Node.js/Express backends with MongoDB
            schemas optimized for performance and scalability
          </li>
          <li>
            Developed front‑end features using Vue.js (Nuxt3), React, and
            Angular, and built custom content‑management dashboards from scratch
          </li>
          <li>
            Architected and maintained Ubuntu‑based LAMP servers, handling
            Apache/Nginx configurations, security hardening (XSS, SQL injection,
            SSO/SAML), and major software migrations
          </li>
          <li>
            Deployed and scaled applications on AWS (EC2, Lambda, S3) using the
            AWS Console and infrastructure‑as‑code practices
          </li>
          <li>
            Managed cloud resources and IAM roles in Google Cloud Console,
            integrating Firestore and Cloud Functions
          </li>
          <li>
            Set up CI/CD pipelines and automated deployments on Vercel, ensuring
            zero‑downtime updates and serverless scalability
          </li>
          <li>
            Implemented Nuxt3 server‑side rendering to boost SEO and
            performance, reducing first‑paint time by 50%
          </li>
          <li>
            Collaborated with stakeholders to gather requirements, refine
            specifications, and produce thorough technical documentation
          </li>
        </ul>
        <p>
          I’m drawn to Eccles Library’s mission of advancing health sciences
          research through innovative web solutions and cross‑departmental
          collaboration. I’d love to contribute my full‑stack and security‑first
          approach to your team’s digital publications and applications.
        </p>
        <p>
          Thank you for considering my application. I look forward to discussing
          how my background aligns with your needs. Can we schedule a 15‑minute
          call next week?
        </p>
        <p>Best regards,</p>
        <p><strong>Thomas Hart</strong></p>
      </section>
    </main>
  </div>
</template>
  
  <script setup>
definePageMeta({ layout: false });
</script>
  
<style scoped>
.cover-letter {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  background: #fff;
  font-family: "Source Sans Pro", Montserrat, sans-serif;
  color: #333;
  min-height: 100vh;
}

.leaf-graphic {
  position: absolute;
  top: 0;
  right: 0;
  width: 180px;
  pointer-events: none;
}

.content {
  padding: 40px;
  box-sizing: border-box;
}

.header h1 {
  font-size: 40px;
  text-transform: uppercase;
  margin: 0;
}
.first-name {
  font-weight: 700;
  letter-spacing: 4px;
  color: #333a4c;
  margin-right: 1rem;
}
.last-name {
  font-weight: 300;
  letter-spacing: 4px;
  color: #333a4c;
}
.contact-lines {
  font-size: 12px;
  color: #333a4c;
  margin: 0.5rem 0 0;
}
.letter-date {
  font-size: 12px;
  margin: 0.25rem 0 2rem;
  color: #333a4c;
}

.letter-body p {
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.letter-body ul {
  font-size: 12px;
  color: #333a4c;
  list-style: disc inside;
  margin: 0.5rem 0 1rem;
  padding-left: 1.5rem;
}
.letter-body li {
  margin-bottom: 0.5rem;
}

@page {
  margin: 0;
}

@media print {
  html,
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin: 0;
    padding: 0;
  }
  .cover-letter {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: auto;
  }
  .leaf-graphic {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    margin: 0 !important;
  }
}
</style>

  
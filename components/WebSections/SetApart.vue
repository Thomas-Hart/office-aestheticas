<template>
  <div class="wrapper">
    <h2>Why National Auto Hub?</h2>
    <div class="light-orange">
      <div class="left">
        <div class="text-container">
          <h3>OUR MISSION</h3>
          <p>
            To provide high-quality car accessories that enhance your vehicle
            and simplify your life on the road.
          </p>
          <h3>OUR VISION</h3>
          <p>
            To be the go-to source for innovative, practical car accessories
            that improve every driving experience.
          </p>
          <h3>OUR COMPANY</h3>
          <p>
            National Auto Hub offers top-tier car accessories designed to add
            convenience, style, and functionality to your vehicle.
          </p>
        </div>
      </div>
      <div class="right">
        <h3 class="service">OUR SERVICE</h3>
        <div class="service-item">
          <img src="/steeringWheel.webp" alt="" />
          <div class="service-text">
            <h3>Accessories</h3>
            <p>
              High-quality, practical car accessories to enhance your vehicle.
            </p>
          </div>
        </div>
        <div class="service-item">
          <img src="/cart2.webp" alt="" />
          <div class="service-text">
            <h3>Selection</h3>
            <p>
              Expertly chosen products for style, convenience, and
              functionality.
            </p>
          </div>
        </div>
        <div class="service-item">
          <img src="/speedometer.webp" alt="" />
          <div class="service-text">
            <h3>Delivery</h3>
            <p>
              Fast shipping for quick and easy access to your new accessories.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.wrapper {
  padding: 7rem 0 0 0;
  width: 100%;
  height: 100%;
  border-bottom: 3px solid white;
}

h2 {
  font-size: 3rem;
  margin-bottom: 2rem;
  margin-left: 5rem;
  margin-right: 2rem;
  color: #545454;
}

.light-orange {
  background: #ffbd59;
  width: 100%;
  height: 100%;
  padding: 3rem 0;
  display: flex;
  gap: 4rem;
}

.left {
  background: #fe8b00;
  color: white;
  flex: 1;
}

.text-container {
  padding: 3rem 5rem;
}

h3 {
  font-size: 2rem;
}

p {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.right {
  flex: 1;
  padding-right: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-item {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: flex-start;
  align-items: center;
}

.service-item img {
  height: 5rem;
  width: 5rem;
}

@media (max-width: 1024px) {
  h2 {
    margin-left: 2rem;
  }

  .light-orange {
    flex-direction: column;
    gap: 0;
  }

  .left {
    padding: 2rem;
  }

  .right {
    padding: 2rem;
  }

  .text-container {
    padding: 0;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 2.5rem;
    margin-left: 1.5rem;
  }

  h3.service {
    text-align: center;
  }

  .service-item {
    flex-direction: column;
    text-align: center;
  }

  .left {
    padding: 2rem 1.5rem;
  }

  .right {
    padding: 2rem 1rem;
  }
}
</style>
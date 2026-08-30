document.addEventListener("DOMContentLoaded", () => {
  let speed = 0.5;
  let targetSpeed = 0.5;

  const loader = document.getElementById("loader");
  const loaderText = document.querySelector(".loader-text");
  let loaderSkipped = false;

  if (loader) {
    if (!sessionStorage.getItem("loaderPlayed")) {
      sessionStorage.setItem("loaderPlayed", "true");
      // Start with a high target speed for the warp entry
      targetSpeed = 50;

      setTimeout(() => {
        // Zoom out text and make background transparent to show warp
        if (loaderText) loaderText.classList.add("zoom-out");
        loader.classList.add("transparent-bg");

        setTimeout(() => {
          // Fade out the loader container entirely
          loader.classList.add("fade-out");

          // Decelerate the warp speed back to normal
          targetSpeed = 0.5;

          setTimeout(() => {
            loader.style.display = "none";
          }, 1000);
        }, 1500); // Keep the warp effect visible for a bit
      }, 1500); // Initial delay to show the "Welcome" text
    } else {
      loader.style.display = "none";
      loaderSkipped = true;
    }
  }

  const canvas = document.getElementById("warp-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let stars = [];
    const numStars = 400;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (stars.length === 0) {
        for (let i = 0; i < numStars; i++) {
          stars.push({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * width,
          });
        }
      }
    }

    window.addEventListener("resize", resize);
    resize();

    function draw() {
      ctx.fillStyle = "rgba(10, 25, 47, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      speed += (targetSpeed - speed) * 0.1;

      for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
          star.z = width;
        } else if (star.z > width) {
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
          star.z = 0.1;
        }

        const x = cx + star.x * (width / star.z);
        const y = cy + star.y * (width / star.z);
        let s = (1 - star.z / width) * 2;
        if (s < 0) s = 0;

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();

        if (Math.abs(speed) > 2) {
          let z_tail = star.z + speed * 15;
          if (z_tail <= 0) z_tail = 0.1;
          const px = cx + star.x * (width / z_tail);
          const py = cy + star.y * (width / z_tail);
          ctx.strokeStyle = "rgba(100, 255, 218, 0.8)";
          ctx.lineWidth = Math.max(0.1, s);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();

    const snapContainer = document.querySelector(".snap-container");
    if (snapContainer) {
      let isScrolling;
      let lastScrollTop = snapContainer.scrollTop;

      snapContainer.addEventListener("scroll", () => {
        let currentScroll = snapContainer.scrollTop;
        if (currentScroll > lastScrollTop) {
          targetSpeed = 25;
        } else if (currentScroll < lastScrollTop) {
          targetSpeed = 0.5;
        }
        lastScrollTop = currentScroll;

        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          targetSpeed = 0.5;
        }, 150);
      });
    }
  }

  const parallaxBg = document.querySelector(".parallax-bg");
  const snapContainer = document.querySelector(".snap-container");
  if (parallaxBg && snapContainer) {
    snapContainer.addEventListener("scroll", () => {
      const scrollY = snapContainer.scrollTop;
      parallaxBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    });
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  const mainContent = document.querySelector("main");
  if (mainContent && (!loader || loaderSkipped)) {
    mainContent.style.animationDelay = "0s";
  }
});

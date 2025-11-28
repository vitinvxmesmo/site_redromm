/* ========== PARTICLES (IMPROVED LIGHTWEIGHT) ========== */
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  const config = {
    count: 90,
    maxSize: 3.2,
    speed: 0.5,
    color: [123, 15, 26],
    linkDistance: 120
  };

  function rand(a,b){ return Math.random()*(b-a)+a; }
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; });

  class Particle {
    constructor(){
      this.reset();
    }
    reset(){
      this.x = rand(0, w);
      this.y = rand(0, h);
      this.vx = (Math.random()-0.5) * config.speed;
      this.vy = (Math.random()-0.5) * config.speed;
      this.r = rand(0.4, config.maxSize);
      this.alpha = rand(0.25, 0.75);
    }
    update(mx, my){
      // subtle attraction to mouse
      if (mx && my) {
        this.vx += (mx - this.x) * 0.00003;
        this.vy += (my - this.y) * 0.00003;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -50 || this.x > w + 50 || this.y < -50 || this.y > h + 50) this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.fillStyle = `rgba(${config.color.join(',')},${this.alpha})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  const particles = new Array(config.count).fill().map(()=>new Particle());
  let mouseX = null, mouseY = null;
  window.addEventListener('mousemove', (e)=>{ mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('mouseout', ()=>{ mouseX = null; mouseY = null; });

  function loop(){
    ctx.clearRect(0,0,w,h);
    for (let i=0;i<particles.length;i++){
      const a = particles[i];
      a.update(mouseX, mouseY);
      a.draw();
      for (let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < config.linkDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${config.color.join(',')},${(1 - d/config.linkDistance) * 0.07})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ========== SIMPLE EVENTS CAROUSEL ========== */
(function(){
  const track = document.getElementById('carouselTrack');
  const carousel = document.getElementById('eventsCarousel');
  if (!track || !carousel) return;

  const slides = Array.from(track.querySelectorAll('.event-slide'));
  const prevBtn = carousel.querySelector('[data-action="prev"]');
  const nextBtn = carousel.querySelector('[data-action="next"]');
  const dotsContainer = document.getElementById('carouselDots');

  let index = 0;
  let slideWidth = slides[0] ? slides[0].getBoundingClientRect().width + 12 : 280;
  let autoplay = true;
  let autoplayTimer = null;

  function updateDimensions(){
    slideWidth = slides[0] ? slides[0].getBoundingClientRect().width + 12 : 280;
    moveTo(index, false);
  }
  window.addEventListener('resize', updateDimensions);

  // create dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.dataset.index = i;
    d.setAttribute('aria-label', 'Ir para slide ' + (i+1));
    d.addEventListener('click', ()=>{ goTo(i); });
    dotsContainer.appendChild(d);
  });

  function setActiveDot(){
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.style.opacity = (i === index ? '1' : '0.35'));
  }

  function moveTo(i, smooth = true){
    const pos = i * slideWidth;
    track.style.scrollBehavior = smooth ? 'smooth' : 'auto';
    track.scrollLeft = pos;
    setActiveDot();
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    moveTo(index);
    restartAutoplay();
  }

  function prev(){
    goTo(index - 1);
  }
  function next(){
    goTo(index + 1);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  function startAutoplay(){
    if (!autoplay) return;
    autoplayTimer = setInterval(()=>{ next(); }, 4500);
  }
  function stopAutoplay(){
    if (autoplayTimer) clearInterval(autoplayTimer);
  }
  function restartAutoplay(){
    stopAutoplay();
    startAutoplay();
  }

  // init
  updateDimensions();
  setActiveDot();
  startAutoplay();

  // pause on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
})();

/* ========== UTILS: quando você adicionar/remover admins dinamicamente ========== */
/* Exemplo para atualizar status via JS:
   document.querySelectorAll('.admin').forEach(card => {
     // card.querySelector('.status').classList.toggle('online', condition);
   });
*/

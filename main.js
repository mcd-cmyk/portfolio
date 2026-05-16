// ============================================
// MARIA C. DORDEA — PORTFOLIO
// The Presence lives on the homepage and in the Abyss.
// Everything else: your work, clean and focused.
// ============================================

(function() {
    const isHomepage = /index\.html$/.test(location.pathname) || location.pathname.endsWith('/portfolio/') || location.pathname.endsWith('/portfolio');
    const isAbyss = /abyss\.html$/.test(location.pathname);
    const hasPresence = isHomepage || isAbyss;

    // ---- MOBILE MENU ----
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ---- NAV SCROLL ----
    const nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.style.background = window.scrollY > 100
                ? 'rgba(6,6,8,0.95)'
                : 'linear-gradient(to bottom, rgba(6,6,8,0.9), rgba(6,6,8,0))';
        });
    }

    // ---- SCROLL FADE-IN ----
    const fadeObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

    document.querySelectorAll('.project-gallery img').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ${0.08 * (i % 6)}s cubic-bezier(0.16, 1, 0.3, 1)`;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        obs.observe(el);
    });

    // ---- LIGHTBOX (all pages) ----
    (function initLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
            <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
            <img src="" alt="">
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(lightbox);

        const lbImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const counter = lightbox.querySelector('.lightbox-counter');
        let gallery = [], idx = 0;

        function open(img) {
            const g = img.closest('.project-gallery');
            if (!g) return;
            gallery = Array.from(g.querySelectorAll('img'));
            idx = gallery.indexOf(img);
            show();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function close() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
        function prev() { if (idx > 0) { idx--; show(); } }
        function next() { if (idx < gallery.length - 1) { idx++; show(); } }
        function show() {
            lbImg.src = gallery[idx].src;
            lbImg.alt = gallery[idx].alt || '';
            prevBtn.style.display = idx > 0 ? 'flex' : 'none';
            nextBtn.style.display = idx < gallery.length - 1 ? 'flex' : 'none';
            counter.textContent = `${idx + 1} / ${gallery.length}`;
        }

        let touchStartX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        lightbox.addEventListener('touchend', e => {
            const d = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(d) > 50) { d > 0 ? next() : prev(); }
        }, { passive: true });

        document.querySelectorAll('.project-gallery img').forEach(img => img.addEventListener('click', () => open(img)));
        closeBtn.addEventListener('click', e => { e.stopPropagation(); close(); });
        lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
        prevBtn.addEventListener('click', e => { e.stopPropagation(); prev(); });
        nextBtn.addEventListener('click', e => { e.stopPropagation(); next(); });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });
    })();

    // ---- THE PRESENCE (homepage + abyss only) ----
    if (!hasPresence) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, time = 0;
    let mx = 0.5, my = 0.5, mxS = 0.5, myS = 0.5;
    let lastMoveTime = 0, isStill = false;
    let animId;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', e => { mx = e.clientX / w; my = e.clientY / h; lastMoveTime = time; isStill = false; });
    window.addEventListener('touchmove', e => { const t = e.touches[0]; mx = t.clientX / w; my = t.clientY / h; lastMoveTime = time; isStill = false; }, { passive: true });

    function noise(x, t) {
        return (Math.sin(x*1.3+t)*0.4 + Math.sin(x*2.7-t*1.3)*0.3 + Math.sin(x*0.6+t*0.7)*0.5 + Math.cos(x*1.9+t*0.9)*0.2) / 1.4;
    }
    function hsla(h,s,l,a) { return `hsla(${((h%360)+360)%360},${s}%,${l}%,${Math.max(0,Math.min(1,a))})`; }

    // Entity state
    let ex = 0.5, ey = 0.5, evx = 0, evy = 0;
    let mood = 0, moodTimer = 0;

    // Particles
    const particles = [];
    for (let i = 0; i < 45; i++) {
        particles.push({
            x: Math.random(), y: Math.random(),
            size: 0.5 + Math.random() * 1.5,
            speed: 0.0001 + Math.random() * 0.0002,
            drift: Math.random() * Math.PI * 2,
            hue: 140 + Math.random() * 140,
            alpha: 0.08 + Math.random() * 0.2,
            twinkle: 0.5 + Math.random() * 2,
            twinkleOff: Math.random() * Math.PI * 2
        });
    }

    function drawParticles() {
        for (const p of particles) {
            p.x += Math.cos(p.drift + time * 0.5) * p.speed;
            p.y += Math.sin(p.drift + time * 0.3) * p.speed - 0.00003;
            if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05;
            if (p.y < -0.05) p.y = 1.05; if (p.y > 1.05) p.y = -0.05;

            const tw = 0.5 + 0.5 * Math.sin(time * p.twinkle + p.twinkleOff);
            const a = p.alpha * tw;
            const px = p.x * w, py = p.y * h;

            const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
            grd.addColorStop(0, hsla(p.hue, 45, 65, a * 0.5));
            grd.addColorStop(0.5, hsla(p.hue, 35, 45, a * 0.1));
            grd.addColorStop(1, hsla(p.hue, 30, 35, 0));
            ctx.fillStyle = grd;
            ctx.fillRect(px - p.size*3, py - p.size*3, p.size*6, p.size*6);

            ctx.beginPath();
            ctx.arc(px, py, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = hsla(p.hue, 25, 80, a * 0.6);
            ctx.fill();
        }
    }

    function draw() {
        time += 0.003;
        moodTimer += 0.003;
        mxS += (mx - mxS) * 0.02;
        myS += (my - myS) * 0.02;
        if (time - lastMoveTime > 3) isStill = true;

        if (moodTimer > 8 + Math.random() * 4) { moodTimer = 0; mood = Math.floor(Math.random() * 3); }

        // Entity behaviour
        let tx, ty, spd;
        if (mood === 0) { // curious
            const d = Math.sqrt((mxS-ex)**2 + (myS-ey)**2);
            if (d > 0.15) { tx = ex + (mxS-ex)*0.3; ty = ey + (myS-ey)*0.3; }
            else { const a = time*0.5; tx = mxS + Math.cos(a)*0.15; ty = myS + Math.sin(a)*0.15; }
            spd = 0.008;
        } else if (mood === 1) { // shy
            tx = Math.max(0.1, Math.min(0.9, ex + (ex-mxS)*0.1));
            ty = Math.max(0.1, Math.min(0.9, ey + (ey-myS)*0.1));
            spd = 0.005;
            if (isStill) { tx = ex + (mxS-ex)*0.05; ty = ey + (myS-ey)*0.05; spd = 0.003; }
        } else { // playful
            const a = time*0.8 + Math.sin(time*0.3)*2;
            tx = 0.5 + Math.cos(a)*0.3; ty = 0.5 + Math.sin(a*0.7)*0.2;
            spd = 0.015;
        }

        evx += (tx - ex) * spd; evy += (ty - ey) * spd;
        evx *= 0.95; evy *= 0.95;
        ex += evx; ey += evy;

        // Render
        ctx.fillStyle = 'rgba(5, 5, 7, 0.12)';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'screen';

        drawParticles();

        const px = ex * w, py = ey * h;
        const speed = Math.sqrt(evx**2 + evy**2);
        const size = (90 + speed * 2500 + Math.sin(time*0.8)*15) * (h/800);

        // Colour cycles through green, blue, pink, violet — non-linearly
        const colourCycle = [155, 210, 330, 270, 180, 290, 155]; // green, blue, pink, violet, cyan, violet, green
        const cLen = colourCycle.length - 1;
        const cT = ((time * 0.08 + Math.sin(time * 0.05) * 0.3) % 1) * cLen;
        const cI = Math.floor(cT);
        const cF = cT - cI;
        const hue = colourCycle[cI] + (colourCycle[Math.min(cI+1, cLen)] - colourCycle[cI]) * cF;

        // Abyss page gets a more intense presence
        const intensityMult = isAbyss ? 1.4 : 1;

        // Outer atmosphere
        const atR = size * 4;
        const atmo = ctx.createRadialGradient(px, py, size*0.2, px, py, atR);
        atmo.addColorStop(0, hsla(hue, 45, 40, 0.035 * intensityMult));
        atmo.addColorStop(0.3, hsla(hue+20, 40, 35, 0.015 * intensityMult));
        atmo.addColorStop(0.6, hsla(hue+40, 35, 30, 0.006 * intensityMult));
        atmo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = atmo;
        ctx.fillRect(px-atR, py-atR, atR*2, atR*2);

        // Core
        const core = ctx.createRadialGradient(px, py, 0, px, py, size);
        core.addColorStop(0, hsla(hue, 40, 65, (0.12 + speed*5) * intensityMult));
        core.addColorStop(0.3, hsla(hue+15, 45, 50, 0.06 * intensityMult));
        core.addColorStop(0.7, hsla(hue+30, 40, 40, 0.015 * intensityMult));
        core.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = core;
        ctx.fillRect(px-size, py-size, size*2, size*2);

        // Bright center
        const bright = ctx.createRadialGradient(px, py, 0, px, py, size*0.3);
        bright.addColorStop(0, hsla(hue, 30, 75, (0.1 + speed*6) * intensityMult));
        bright.addColorStop(0.5, hsla(hue, 35, 55, 0.03 * intensityMult));
        bright.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bright;
        ctx.fillRect(px-size*0.3, py-size*0.3, size*0.6, size*0.6);

        // Trail
        if (speed > 0.001) {
            for (let i = 0; i < 3; i++) {
                const trX = px - evx*w*(2+i*3) + (Math.random()-0.5)*15;
                const trY = py - evy*h*(2+i*3) + (Math.random()-0.5)*15;
                const trS = (2 + Math.random()*4) * (h/800);
                ctx.beginPath();
                ctx.arc(trX, trY, trS, 0, Math.PI*2);
                ctx.fillStyle = hsla(hue + 30 + Math.random()*40, 50, 60, (0.06 + speed*2) * intensityMult);
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        animId = requestAnimationFrame(draw);
    }

    setTimeout(draw, 400);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animId);
        else draw();
    });
})();

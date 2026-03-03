(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function() { initParticles(); });

    var canvas = document.getElementById("particleCanvas");
    var ctx = canvas.getContext("2d");
    var particles = [];
    var mouseX = 0, mouseY = 0;

    function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
    addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function Particle() { this.reset(); }
    Particle.prototype.reset = function() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.08;
        var colors = [
            "rgba(59,130,246," + this.opacity + ")",
            "rgba(255,215,0," + (this.opacity * 0.5) + ")",
            "rgba(255,255,255," + (this.opacity * 0.3) + ")"
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = Math.random() * 300 + 200;
        this.age = 0;
    };
    Particle.prototype.update = function() {
        var dx = this.x - mouseX, dy = this.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            var force = (100 - dist) / 100;
            this.speedX += (dx / dist) * force * 0.1;
            this.speedY += (dy / dist) * force * 0.1;
        }
        this.speedX *= 0.99; this.speedY *= 0.99;
        this.x += this.speedX; this.y += this.speedY;
        this.age++;
        if (this.age > this.life || this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) this.reset();
    };
    Particle.prototype.draw = function() {
        ctx.globalAlpha = 1 - this.age / this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    function initParticles() {
        var isMobile = innerWidth <= 600;
        var count = isMobile ? Math.min(35, Math.floor(innerWidth * 0.04)) : Math.min(80, Math.floor(innerWidth * 0.06));
        particles = [];
        for (var i = 0; i < count; i++) particles.push(new Particle());
        animateParticles();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.strokeStyle = "rgba(59,130,246," + ((1 - dist / 100) * 0.08) + ")";
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        particles.forEach(function(p) { p.update(); p.draw(); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }

    addEventListener("mousemove", function(e) { mouseX = e.clientX; mouseY = e.clientY; });

    // NAV + SCROLL PROGRESS + SECTION TRACKING
    var navbar = document.getElementById("navbar");
    var navLinks = document.querySelectorAll(".nav-links a");
    var progressBar = document.getElementById("scrollProgress");
    var speedDisplay = document.getElementById("scrollSpeed");
    var sectionDisplay = document.getElementById("currentSection");
    var sectionMap = [
        { id: "hero", label: "HOME" }, { id: "about", label: "ABOUT" },
        { id: "experience", label: "EXPERIENCE" }, { id: "education", label: "EDUCATION" },
        { id: "skills", label: "SKILLS" }, { id: "publications", label: "PUBLICATIONS" },
        { id: "volunteering", label: "COMMUNITY" }, { id: "contact", label: "CONTACT" }
    ];

    function handleScroll() {
        var scrollY = window.scrollY;
        var max = document.documentElement.scrollHeight - innerHeight;
        var pct = Math.round((scrollY / max) * 100);
        if (progressBar) progressBar.style.width = pct + "%";
        if (speedDisplay) speedDisplay.textContent = pct + "%";
        if (scrollY > 200) navbar.classList.add("visible"); else navbar.classList.remove("visible");
        navLinks.forEach(function(link) {
            var sec = document.querySelector(link.getAttribute("href"));
            if (sec) {
                var rect = sec.getBoundingClientRect();
                if (rect.top < innerHeight / 2 && rect.bottom > 0) link.classList.add("active");
                else link.classList.remove("active");
            }
        });
        if (sectionDisplay) {
            var current = "HOME";
            sectionMap.forEach(function(s) {
                var el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top < innerHeight * 0.4) current = s.label;
            });
            sectionDisplay.textContent = current;
        }
    }
    addEventListener("scroll", handleScroll, { passive: true });

    // MOBILE NAV
    var navToggle = document.getElementById("navToggle");
    var mobileNav = document.getElementById("mobileNav");
    navToggle.addEventListener("click", function() {
        navToggle.classList.toggle("active");
        mobileNav.classList.toggle("open");
    });
    document.querySelectorAll(".mobile-nav-links a").forEach(function(link) {
        link.addEventListener("click", function() {
            navToggle.classList.remove("active");
            mobileNav.classList.remove("open");
        });
    });

    // SCROLL REVEAL
    function revealOnScroll() {
        document.querySelectorAll(".timeline-item, .edu-card, .skill-category, .pub-card, .volunteer-card, .contact-card").forEach(function(el) {
            if (el.getBoundingClientRect().top < innerHeight * 0.85) el.classList.add("visible");
        });
    }
    addEventListener("scroll", revealOnScroll, { passive: true });
    document.addEventListener("DOMContentLoaded", function() { setTimeout(revealOnScroll, 100); });

    // STAT COUNTERS
    function animateCounters() {
        document.querySelectorAll(".stat-num").forEach(function(counter) {
            if (counter.dataset.animated) return;
            if (counter.getBoundingClientRect().top < innerHeight * 0.9) {
                counter.dataset.animated = "true";
                var target = parseInt(counter.getAttribute("data-target"));
                var current = 0, step = target / 50;
                var timer = setInterval(function() {
                    current += step;
                    if (current >= target) { counter.textContent = target; clearInterval(timer); }
                    else counter.textContent = Math.floor(current);
                }, 35);
            }
        });
    }
    addEventListener("scroll", animateCounters, { passive: true });
    document.addEventListener("DOMContentLoaded", function() { setTimeout(animateCounters, 200); });

    // CLICK SPARKS (subtle gold/blue)
    function spawnSparks(cx, cy) {
        for (var i = 0; i < 8; i++) {
            var spark = document.createElement("div");
            var isGold = Math.random() > 0.4;
            var color = isGold ? "#ffd700" : "#3b82f6";
            spark.style.cssText = "position:fixed;left:" + cx + "px;top:" + cy + "px;width:3px;height:3px;border-radius:50%;background:" + color + ";pointer-events:none;z-index:99999;box-shadow:0 0 4px " + color + ";";
            document.body.appendChild(spark);
            (function(spark, i) {
                var angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
                var vel = 40 + Math.random() * 50;
                var vx = Math.cos(angle) * vel, vy = Math.sin(angle) * vel;
                var px = cx, py = cy, op = 1, f = 0;
                function anim() {
                    f++; px += vx * 0.025; py += vy * 0.025 + f * 0.12; op -= 0.05;
                    spark.style.left = px + "px"; spark.style.top = py + "px";
                    spark.style.opacity = op; spark.style.transform = "scale(" + op + ")";
                    if (op > 0) requestAnimationFrame(anim); else spark.remove();
                }
                requestAnimationFrame(anim);
            })(spark, i);
        }
    }
    document.addEventListener("click", function(e) { spawnSparks(e.clientX, e.clientY); });

    // CARD TILT (desktop)
    var isTouch = matchMedia("(hover:none) and (pointer:coarse)").matches;
    if (!isTouch) {
        document.querySelectorAll(".glass-card").forEach(function(card) {
            card.addEventListener("mousemove", function(e) {
                var r = card.getBoundingClientRect();
                var rx = (e.clientY - r.top - r.height / 2) / (r.height / 2) * -2;
                var ry = (e.clientX - r.left - r.width / 2) / (r.width / 2) * 2;
                card.style.transform = "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-3px)";
            });
            card.addEventListener("mouseleave", function() { card.style.transform = ""; });
        });
    }

    // MOUSE TRAIL (desktop — subtle gold)
    if (!isTouch) {
        var trail = [];
        var trailCanvas = document.createElement("canvas");
        trailCanvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;";
        document.body.appendChild(trailCanvas);
        var tCtx = trailCanvas.getContext("2d");
        function resizeT() { trailCanvas.width = innerWidth; trailCanvas.height = innerHeight; }
        resizeT(); addEventListener("resize", resizeT);
        addEventListener("mousemove", function(e) {
            trail.push({ x: e.clientX, y: e.clientY, age: 0 });
            if (trail.length > 18) trail.shift();
        });
        function drawTrail() {
            tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            if (trail.length > 1) {
                for (var i = 1; i < trail.length; i++) {
                    var t = i / trail.length;
                    tCtx.beginPath();
                    tCtx.strokeStyle = "rgba(255,215,0," + (t * 0.18) + ")";
                    tCtx.lineWidth = t * 1.6;
                    tCtx.lineCap = "round";
                    tCtx.moveTo(trail[i - 1].x, trail[i - 1].y);
                    tCtx.lineTo(trail[i].x, trail[i].y);
                    tCtx.stroke();
                }
            }
            trail.forEach(function(p) { p.age++; });
            trail = trail.filter(function(p) { return p.age < 6; });
            requestAnimationFrame(drawTrail);
        }
        requestAnimationFrame(drawTrail);
    }
})();

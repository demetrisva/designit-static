document.addEventListener("DOMContentLoaded", () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            // Toggle menu active class
            navLinks.classList.toggle("active");

            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "auto";

            // Toggle icon (bars to times)
            const icon = navToggle.querySelector("i");
            if (icon.classList.contains("fa-bars")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
                icon.style.color = 'white'; // Ensure 'X' is white
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
                icon.style.color = 'white'; // Ensure 'bars' are white
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    const icon = navToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Contact Form Handling (using Formspree) ---
    const form = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (form) {
        // Check if the action URL is set
        if (form.action.includes("YOUR_ID_HERE") || form.action.includes("httpsIS-NOT-SET")) {
            if (formStatus) {
                formStatus.innerHTML = "<b>Important:</b> Please set up your form endpoint in <code>index.html</code>.";
                formStatus.className = "error";
            }
            form.querySelector('button[type="submit"]').disabled = true;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.innerHTML = "Thanks! Your message has been sent.";
                        formStatus.className = "success";
                    }
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (responseData && typeof responseData === 'object' && 'errors' in responseData) {
                        throw new Error(responseData["errors"].map(error => error["message"]).join(", "));
                    } else {
                        throw new Error("Oops! There was a problem submitting your form.");
                    }
                }
            } catch (error) {
                if (formStatus) {
                    formStatus.innerHTML = `<b>Error:</b> ${error.message}`;
                    formStatus.className = "error";
                }
            }
        });
    }


    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll(
        "section, .service-card, .hero-text, .step, .log-entry, .related-card, .article-nav-link, .article-shell, .contact-card, .policy-card, .impact-card, .project-card, .project-metrics .metric, .capability-card, .featured-insight"
    );

    const staggerGroups = [
        { selector: ".services-grid .service-card", step: 0.08 },
        { selector: ".method-steps .step", step: 0.07 },
        { selector: ".news-feed .log-entry", step: 0.05 },
        { selector: ".related-grid .related-card", step: 0.06 },
        { selector: ".article-nav .article-nav-link", step: 0.06 },
        { selector: ".capabilities-grid .capability-card", step: 0.07 },
        { selector: ".impact-grid .impact-card", step: 0.05 },
        { selector: ".project-metrics .metric", step: 0.05 },
    ];

    staggerGroups.forEach(group => {
        document.querySelectorAll(group.selector).forEach((el, index) => {
            el.style.transitionDelay = `${index * group.step}s`;
        });
    });

    // --- Hover Glow Surfaces ---
    const glowTargets = document.querySelectorAll(
        ".service-card, .step, .log-entry, .related-card, .article-nav-link, .article-shell, .contact-card, .policy-card, .capability-card, .featured-insight, .impact-card, .project-card, .metric"
    );

    glowTargets.forEach(el => {
        el.classList.add("glow-surface");
        const onMove = (event) => {
            const rect = el.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty("--glow-x", `${x}%`);
            el.style.setProperty("--glow-y", `${y}%`);
            el.style.setProperty("--glow-opacity", "1");
        };

        const onLeave = () => {
            el.style.setProperty("--glow-opacity", "0");
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
    });

    animatedElements.forEach(el => {
        el.classList.add("fade-in-section"); // Add the helper class
        observer.observe(el);
    });

    // --- Reading Progress Bar (Article Pages) ---
    const article = document.querySelector("article");
    if (article) {
        const progress = document.createElement("div");
        progress.className = "reading-progress";
        progress.innerHTML = "<div class=\"reading-progress-bar\"></div>";
        document.body.appendChild(progress);

        const bar = progress.querySelector(".reading-progress-bar");
        const updateProgress = () => {
            const start = article.offsetTop;
            const end = start + article.offsetHeight - window.innerHeight;
            const pos = window.pageYOffset || document.documentElement.scrollTop;
            const ratio = end > start ? (pos - start) / (end - start) : 0;
            const clamped = Math.max(0, Math.min(1, ratio));
            bar.style.width = `${clamped * 100}%`;
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
    }

    // --- Hero Toggle ---
    const heroToggle = document.querySelector(".hero-toggle");
    const heroImage = document.querySelector(".hero-illustration");
    if (heroToggle && heroImage) {
        const primary = heroToggle.dataset.heroPrimary;
        const alt = heroToggle.dataset.heroAlt;
        heroToggle.addEventListener("click", () => {
            const current = heroImage.getAttribute("src");
            heroImage.setAttribute("src", current === primary ? alt : primary);
        });
    }
});

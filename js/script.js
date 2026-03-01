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
        const submitButton = form.querySelector('button[type="submit"]');
        const submitLabel = submitButton ? submitButton.textContent : "";
        const honeypotField = form.querySelector('input[name="_gotcha"]');
        const messageField = form.querySelector("#message");

        const setFormStatus = (type, message) => {
            if (!formStatus) {
                return;
            }

            formStatus.textContent = message;
            formStatus.className = type;
        };

        // Check if the action URL is set
        if (form.action.includes("YOUR_ID_HERE") || form.action.includes("httpsIS-NOT-SET")) {
            setFormStatus("error", "Important: Please set up your form endpoint in contact.html.");
            if (submitButton) {
                submitButton.disabled = true;
            }
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!submitButton || submitButton.disabled) {
                return;
            }

            if (honeypotField && honeypotField.value.trim() !== "") {
                form.reset();
                setFormStatus("success", "Thanks! Your message has been sent.");
                return;
            }

            if (messageField && messageField.value.trim().length < 20) {
                setFormStatus("error", "Please add a bit more detail so we can review the request.");
                messageField.focus();
                return;
            }

            const data = new FormData(form);
            submitButton.disabled = true;
            submitButton.textContent = "SENDING...";
            setFormStatus("", "Submitting...");

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    setFormStatus("success", "Thanks! Your message has been sent.");
                    form.reset();
                } else {
                    let responseData = null;

                    try {
                        responseData = await response.json();
                    } catch (_error) {
                        responseData = null;
                    }

                    if (responseData && typeof responseData === 'object' && 'errors' in responseData) {
                        throw new Error(responseData["errors"].map(error => error["message"]).join(", "));
                    } else {
                        throw new Error("Oops! There was a problem submitting your form.");
                    }
                }
            } catch (error) {
                const fallbackMessage = "Oops! There was a problem submitting your form.";
                const message = error instanceof Error && error.message ? error.message : fallbackMessage;
                setFormStatus("error", `Error: ${message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = submitLabel;
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

    // --- Insights Search + Category Filters (Homepage) ---
    const insightsSection = document.querySelector("#insights");
    if (insightsSection) {
        const searchInput = insightsSection.querySelector("[data-insight-search]");
        const chips = [...insightsSection.querySelectorAll("[data-insight-filter]")];
        const sortSelect = insightsSection.querySelector("[data-insight-sort]");
        const clearButton = insightsSection.querySelector("[data-insight-clear]");
        const grid = insightsSection.querySelector("[data-insights-grid]");
        const cards = [...insightsSection.querySelectorAll("[data-insight-card]")];
        const emptyState = insightsSection.querySelector("[data-insight-empty]");
        const results = insightsSection.querySelector("[data-insight-results]");

        if (searchInput && chips.length > 0 && sortSelect && clearButton && grid && cards.length > 0) {
            let activeFilter = "all";
            let activeSort = "latest";
            const allowedFilters = new Set(chips.map((chip) => chip.dataset.insightFilter || "all"));
            const allowedSorts = new Set(["latest", "title", "topic"]);

            cards.forEach((card, index) => {
                card.dataset.initialIndex = String(index);
            });

            const normalize = (value) => value.trim().toLowerCase();

            const updateResults = (visibleCount) => {
                if (!results) {
                    return;
                }
                const visible = String(visibleCount).padStart(2, "0");
                const total = String(cards.length).padStart(2, "0");
                results.textContent = `${visible} / ${total} THREADS_VISIBLE`;
            };

            const setActiveChipUI = () => {
                chips.forEach((button) => {
                    const value = button.dataset.insightFilter || "all";
                    const isActive = value === activeFilter;
                    button.classList.toggle("is-active", isActive);
                    button.setAttribute("aria-pressed", String(isActive));
                });
            };

            const updateClearButtonState = (query) => {
                const isDefaultState = query.length === 0 && activeFilter === "all" && activeSort === "latest";
                clearButton.disabled = isDefaultState;
            };

            const syncUrlState = (query) => {
                const params = new URLSearchParams();
                if (query) {
                    params.set("q", query);
                }
                if (activeFilter !== "all") {
                    params.set("topic", activeFilter);
                }
                if (activeSort !== "latest") {
                    params.set("sort", activeSort);
                }

                const queryString = params.toString();
                const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
                window.history.replaceState(null, "", nextUrl);
            };

            const applyInsightFilters = () => {
                const query = normalize(searchInput.value);
                let visibleCount = 0;
                const visibleCards = [];

                cards.forEach((card) => {
                    const topicTokens = normalize(card.dataset.topic || "")
                        .split(/\s+/)
                        .filter(Boolean);
                    const title = normalize(card.querySelector("h3")?.textContent || "");
                    const summary = normalize(card.querySelector("p")?.textContent || "");
                    const searchable = `${title} ${summary} ${topicTokens.join(" ")}`;

                    const matchesTopic = activeFilter === "all" || topicTokens.includes(activeFilter);
                    const matchesQuery = query.length === 0 || searchable.includes(query);
                    const isVisible = matchesTopic && matchesQuery;

                    card.hidden = !isVisible;
                    card.setAttribute("aria-hidden", String(!isVisible));

                    if (isVisible) {
                        visibleCount += 1;
                        visibleCards.push(card);
                    }
                });

                const titleFor = (card) => normalize(card.querySelector("h3")?.textContent || "");
                const topicFor = (card) => normalize(card.dataset.topic || "").split(/\s+/).filter(Boolean)[0] || "";

                const sortedCards = [...visibleCards].sort((a, b) => {
                    if (activeSort === "title") {
                        return titleFor(a).localeCompare(titleFor(b));
                    }
                    if (activeSort === "topic") {
                        const topicCompare = topicFor(a).localeCompare(topicFor(b));
                        return topicCompare !== 0 ? topicCompare : titleFor(a).localeCompare(titleFor(b));
                    }
                    return Number(a.dataset.initialIndex) - Number(b.dataset.initialIndex);
                });

                sortedCards.forEach((card) => {
                    grid.appendChild(card);
                });

                if (emptyState) {
                    emptyState.hidden = visibleCount > 0;
                }
                updateResults(visibleCount);
                updateClearButtonState(query);
                syncUrlState(query);
            };

            chips.forEach((chip) => {
                chip.addEventListener("click", () => {
                    activeFilter = chip.dataset.insightFilter || "all";
                    setActiveChipUI();
                    applyInsightFilters();
                });
            });

            sortSelect.addEventListener("change", () => {
                const nextSort = normalize(sortSelect.value);
                activeSort = allowedSorts.has(nextSort) ? nextSort : "latest";
                applyInsightFilters();
            });

            searchInput.addEventListener("input", applyInsightFilters);

            clearButton.addEventListener("click", () => {
                searchInput.value = "";
                activeFilter = "all";
                activeSort = "latest";
                sortSelect.value = activeSort;
                setActiveChipUI();
                applyInsightFilters();
                searchInput.focus();
            });

            const isEditableElement = (element) => {
                if (!element || !(element instanceof HTMLElement)) {
                    return false;
                }
                const tag = element.tagName;
                return element.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
            };

            document.addEventListener("keydown", (event) => {
                if (event.defaultPrevented) {
                    return;
                }
                if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
                    return;
                }
                if (isEditableElement(event.target)) {
                    return;
                }

                event.preventDefault();
                searchInput.focus();
                searchInput.select();
            });

            const params = new URLSearchParams(window.location.search);
            const initialQuery = normalize(params.get("q") || "");
            const initialFilter = normalize(params.get("topic") || "all");
            const initialSort = normalize(params.get("sort") || "latest");

            if (allowedFilters.has(initialFilter)) {
                activeFilter = initialFilter;
            }
            if (allowedSorts.has(initialSort)) {
                activeSort = initialSort;
            }

            searchInput.value = initialQuery;
            sortSelect.value = activeSort;
            setActiveChipUI();

            applyInsightFilters();
        }
    }
});

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
                    if (Object.hasOwn(responseData, 'errors')) {
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
});
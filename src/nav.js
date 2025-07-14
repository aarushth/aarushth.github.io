import { gsap } from "gsap";

// fetch("./partials/nav.html")
// 	.then(res => res.text())
// 	.then(data => {
// 	document.getElementById("nav").innerHTML = data;
// 	
// });
// });
// fetch("./partials/footer.html")
// 	.then(res => res.text())
// 	.then(data => {
// 	document.getElementById("footer").innerHTML = data;
// 	});
gsap.fromTo('nav', {y:'-100%', duration: 1}, {y: '0%'});
document.querySelector(".hamburger").addEventListener("click", () => {
		const navLinks = document.querySelector(".nav-links");

		// Show the element before animating if it's currently hidden
		if (!navLinks.classList.contains("show")) {
			navLinks.style.opacity = 0;
			navLinks.classList.add("show");
			gsap.to(navLinks, { opacity: 1, duration: 0.5 });
		} else {
		// Animate out and hide after
		gsap.to(navLinks, {
			opacity: 0,
			duration: 0.5,
			onComplete: () => navLinks.classList.remove("show"),
		});
	}
})



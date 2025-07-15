import {gsap} from 'gsap';

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			gsap.fromTo(entry.target,{
				opacity: 0,
				x:100,
				duration: 0.8
			},
			{
				opacity: 1,
				x: 0
			});
		}else{
			gsap.to(entry.target,
			{
				opacity: 0,
				x: 100,
				// y:100,
				duration: 0.8,
			});
		}
	});
}, {threshold: 0.1 });
const elements = document.querySelectorAll(".ani");
// elements.forEach((el) => {el.style.opacity = 0; el.style.x = 100})
elements.forEach((el) => observer.observe(el));

window.onscroll = function hideArrow(){
	gsap.to(document.getElementById("arrow"), {opacity: 0, duration: 1});
}
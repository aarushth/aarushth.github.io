import {gsap} from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';

gsap.registerPlugin(ScrambleTextPlugin);
let player;


// Load the IFrame Player API code
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// Called when the API is ready
window.onYouTubeIframeAPIReady = function () {
	player = new YT.Player('player', {
		videoId: 'IzaRPlO3E88', // Replace with your video ID
		playerVars: {
		autoplay: 1,
		mute: 1,
		controls: 0,
		modestbranding: 1,
		rel: 0,
		playsinline: 1,
		loop: 1,
		playlist: 'IzaRPlO3E88' // Required for looping
		},
		events: {
		onReady: (event) => event.target.playVideo()
		}
	});
}
const button = document.getElementById("muteToggle");

const scrambleTo = (text, desc) => {
	const timeline = gsap.timeline();
	timeline.to(".scramble", {
		duration: 1,
		scrambleText: {
			text: text,
			speed: 0.2
		}
	});
	timeline.to(".desc", {
		duration: 3,
		scrambleText: {
			text: desc,
			speed: 0.2
		}
	}, "<");
}
const programming = "I love creating new projects and learning new systems. I am fluent in a number of programming languages including Kotlin, Java, Python, HTML, CSS, JavaScript, SQL and more. See my work in detail on the projects page, or on my Github account."
window.scrollTo({ top: 0, left: 0, behavior: "auto" });
scrambleTo("Programmer", programming);
window.addEventListener("load", () => {
	console.log("loaded")
  	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}
});
const muted = '/svg/sound-min-svgrepo-com.svg'
const unmuted = '/svg/sound-max-svgrepo-com.svg'
const arrow = document.getElementById('arrow');
const icon = document.getElementById('muteIcon');
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			if (entry.target.id === "a") {
				// player.mute();
				// icon.src = muted
				// gsap.to(icon, {opacity:0})
				// gsap.to(arrow, {opacity:1})
				scrambleTo("Programmer", programming);
			} else if (entry.target.id === "b") {
				player.mute();
				icon.src = muted
				gsap.to(icon, {opacity:0})
				// gsap.to(arrow, {opacity:1})
				scrambleTo("Digital Artist", "I enjoy working with computers to create art. I have built a number of art pieces using Touchdesigner including particle & fluid simulations, camera filters, mathematical attractors and more. See some of my work on my YouTube channel.");
				
			}else if (entry.target.id === "c") {
				gsap.to(icon, {opacity:1})
				// gsap.to(arrow, {opacity:1})
				scrambleTo("Musician", "I love playing the Electric Guitar and Piano. I have also learnt to produce my own music using FlStudio. Listen to one of my songs here, and see more on my YouTube channel.");
				
			}else if (entry.target.id === "d") {
				player.mute();
				icon.src = muted
				gsap.to(icon, {opacity:0})
				gsap.to(arrow, {opacity:1})
				scrambleTo("Runner", "I have dedicated myself to long distance running for the past 5 years. I have achieved personal best times of 18:16 in the 5K and 5:03 in the Mile events and hope to keep pushing my limits.");
				
			}else if (entry.target.id === "e") {
				// player.mute();
				// icon.src = '/src/svg/sound-min-svgrepo-com.svg'
				// gsap.to(icon, {opacity:0})
				gsap.to(arrow, {opacity:0})
				scrambleTo("Photographer", "In my free time, I love to take photos as a way of seeing the world around me through an interesting lens. See more of on the photos page or on my Instagram account.");
				
			}
		}
	});
	}, {
	threshold: 0.5 // 50% in view
});

const elements = document.querySelectorAll(".inner-container");
elements.forEach((el) => observer.observe(el));





// Toggle mute/unmute
// const button = document.getElementById('muteToggle');
button.addEventListener('click', () => {
	if (!player) return;

	if (player.isMuted()) {
		player.unMute();
		icon.src = unmuted;
	} else {
		player.mute();
		icon.src = muted;
	}
});
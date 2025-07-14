import {gsap} from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';

gsap.registerPlugin(ScrambleTextPlugin);

const t = gsap.timeline({defaults:{duration: 2}});
t.to(".name", {
		scrambleText: {
			text: "Aarush Thadani",
			speed: 1
		}
	});
t.fromTo('.anim', {opacity:0}, {opacity:1}, "<");
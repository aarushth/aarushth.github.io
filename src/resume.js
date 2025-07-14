import {gsap} from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".ani").forEach(element => {
    gsap.fromTo(element,
    { 
        opacity: 0, 
        y:100
    },
    {
        opacity: 1,
        y:0,
        duration: 0.4,
        scrollTrigger: {
        trigger: element,
        start: "top 90%",  
        end: "bottom 10%",
        toggleActions: "play reverse play reverse"
      }
    }
  );
});
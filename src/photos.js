import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {gsap} from 'gsap';

const loadingEl = document.getElementById("loading-indicator");
loadingEl.style.display = "block";
const closeButton = document.getElementById("close");
THREE.Cache.enabled = true;
const sizes = {width : window.innerWidth, height : window.innerHeight};
const scene = new THREE.Scene();

const camRadius = 9;
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height);
camera.position.z = camRadius;
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(1);

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;
controls.minPolarAngle = Math.PI / 2; // 90 degrees
controls.maxPolarAngle = Math.PI / 2;
controls.enableDamping1 = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
let rotating = false;

let clickStart = {x: 0, y: 0, time: 0};
const clickThreshold = 5;
const timeThreshold = 300;
const textureLoader = new THREE.TextureLoader();
// const sideMaterial = new THREE.MeshDepthMaterial({color: 0xffffff });
//image
const radius = 2; // radius of each circular row
const rows = 3;
const imagesPerRow = 8;
const verticalSpacing = 1.1;
const totalImages = 24;


function loadTexture(url) {
  return new Promise((resolve, reject) => {
    textureLoader.load(url, resolve, undefined, reject);
  });
}
const loadedMeshes = []; // store each mesh to animate later

controls.enabled = false;
function playRevealAnimation() {
  const t1 = gsap.timeline();

  loadedMeshes.forEach((mesh, i) => {
    t1.to(mesh.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.4,
      ease: "back.out(1.7)"
    }, "<"); // staggered start
  });
}
let loadedImages = 0;
const progress = document.getElementById("progress")
async function loadImagesSequentially() {
    for (let i = 0; i < totalImages; i++) {
        const texture = await loadTexture(`https://aarushth.github.io/portfolio-images/${i + 1}.jpg`);
        texture.colorSpace = THREE.SRGBColorSpace;
        const angle = (i % imagesPerRow / imagesPerRow) * Math.PI * 2;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(texture.image.width / texture.image.height, 1), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));

        mesh.position.x = radius * Math.cos(angle);
        mesh.position.y = (Math.floor(i / imagesPerRow) - 1) * verticalSpacing;
        mesh.position.z = radius * Math.sin(angle);
        
        mesh.lookAt(0, mesh.position.y, 0);
        mesh.rotateY(Math.PI);

        mesh.scale.set(0, 0, 0); // start hidden

        scene.add(mesh);
        loadedMeshes.push(mesh);
        loadedImages++;
        progress.value = 100*(loadedImages/totalImages)
    }

	loadingEl.style.display = "none";
	playRevealAnimation();
	controls.enabled = true;
	console.log(controls.enabled);
}



//fog
scene.fog = new THREE.Fog( 0x000000, 10, 15 );


//Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

//animation loop
const loop = () => {
  if (controls.enabled) {
    controls.update();
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();


const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let isZoomedIn = false;
let storedCameraPosition = new THREE.Vector3();
let storedCameraRotation = new THREE.Euler();
let storedTarget = new THREE.Vector3();
let selectedMesh = null;

window.addEventListener('mousedown', (event) => {
	clickStart.x = event.clientX;
	clickStart.y = event.clientY;
	clickStart.time = performance.now();
});

window.addEventListener('mouseup', (event) => {
	const dx = event.clientX - clickStart.x;
	const dy = event.clientY - clickStart.y;
	const dist = Math.sqrt(dx * dx + dy * dy);
	const time = performance.now() - clickStart.time;

	if (dist < clickThreshold && time < timeThreshold) {
		// Treat it as a click
		handleClickSelection(event);
	}
});
function handleClickSelection(event){
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		const clicked = intersects[0].object;
		// console.log('Clicked on:', clicked.name || clicked.uuid);
		zoomToObject(clicked);
	}
}
// window.addEventListener('click', (event) => {
// 	if(!rotating){
// 		// Normalize mouse coordinates
// 		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
// 		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		
// 		raycaster.setFromCamera(mouse, camera);

// 		const intersects = raycaster.intersectObjects(scene.children, true);
// 		if (intersects.length > 0) {
// 			const clicked = intersects[0].object;
// 			// console.log('Clicked on:', clicked.name || clicked.uuid);
// 			zoomToObject(clicked);
// 		}
// 	}
// });
function getCameraDistance(imageWidth, imageHeight, screenWidth, screenHeight) {
  const aspect = screenWidth / screenHeight;
  const distanceH = imageWidth / (2 * 0.4142 * aspect);
  const distanceV = imageHeight / (2* 0.4142);
  return Math.max(distanceH, distanceV) + 0.5; 
}

function zoomToObject(object) {

  if(isZoomedIn) return
  storedCameraPosition.copy(camera.position);
  storedCameraRotation.copy(camera.rotation);
  storedTarget.copy(controls.target);
  gsap.fromTo('.anim', {opacity:1}, {opacity:0});
  
  isZoomedIn = true;
  selectedMesh = object;
  controls.autoRotate = false;
  controls.enabled = false;

  // Get object center in world coordinates
  const targetPosition = new THREE.Vector3();
  object.getWorldPosition(targetPosition);
  
//   console.log("target pos:", targetPosition);

  // Get the object's forward direction (-Z)
  const outward = targetPosition.clone().sub(new THREE.Vector3(0, targetPosition.y, 0)).normalize();

  // Move camera 1.5 units in front of object
  const zoom = getCameraDistance(selectedMesh.geometry.parameters.width, selectedMesh.geometry.parameters.height, sizes.width, sizes.height);
  const cameraTarget = targetPosition.clone().add(outward.multiplyScalar(zoom));
//   console.log("window width:", sizes.width);
  // console.log("object width:", );
//   console.log("zoom:", zoom);

  const time = gsap.timeline();
  time.to(camera.position, {
    x: cameraTarget.x,
    y: cameraTarget.y,
    z: cameraTarget.z,
    duration: 1.2,
    ease: "power2.out",
    onUpdate: () => {
      camera.lookAt(targetPosition);
    }
  });
  time.to(scene.fog, {
    near: zoom,
    far: zoom+5,
    duration: 1.2,
    ease: "power2.out"
  }, "<");
  time.fromTo(closeButton, {opacity:0}, {opacity:1}, "<");
}

window.addEventListener('keydown', (event) => {
    if (event.key === "Escape" && isZoomedIn) {
      zoomOut();
    }
});

closeButton.addEventListener("click", () =>{
  zoomOut();
})

function zoomOut() {
  if (!isZoomedIn) return;
  
  const time = gsap.timeline();
  time.to(camera.position, {
    x: storedCameraPosition.x,
    y: storedCameraPosition.y,
    z: storedCameraPosition.z,
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(storedTarget);
    },
    onComplete: () => {
      // Restore rotation directly
      camera.rotation.copy(storedCameraRotation);

      // Restore OrbitControls
      controls.target.copy(storedTarget);
      controls.enabled = true;
      controls.autoRotate = true;
      isZoomedIn = false;
    }
  });
  time.to(scene.fog, {
    near:10,
    far:15,
    duration: 1.2,
    ease: "power2.inOut"
  }, "<")
  time.fromTo('.anim', {opacity:0}, {opacity:1}, "<");
  time.fromTo(closeButton, {opacity: 1}, {opacity:0}, "<");
}


loadImagesSequentially();
import {gsap} from 'gsap';
import { Observer } from 'gsap/all';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const handleOnMouseMove = e => {
    const {currentTarget: target} = e;
    const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
}

for(const card of document.querySelectorAll(".card")){
    card.onmousemove = e => handleOnMouseMove(e);
}

gsap.registerPlugin(Observer);





let sizes = {x:0, y:0};
const wrapper = document.getElementById("left");
let rect = wrapper.getBoundingClientRect();
sizes.x = rect.width
sizes.y = rect.height
// console.log("canvas size", sizes);

const canvas = document.querySelector(".half-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.x / sizes.y, 0.1, 100);
camera.position.z = 10;
camera.position.y = 3;
scene.add(camera);


const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.x, sizes.y);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, canvas);
controls.minPolarAngle = Math.PI / 3; 
controls.maxPolarAngle = Math.PI / 3;
controls.enabled = true;
controls.enableDamping1 = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;

let heightdiff = window.innerWidth > 900 ? "30vh" : "20vh";

window.addEventListener('resize', () => {
    let rect = wrapper.getBoundingClientRect();
    sizes.x = rect.width
    sizes.y = rect.height
    if(window.innerHeight > 900){
        heightdiff = "30vh"
    }else{
        heightdiff = "20vh"
    }
    // console.log("canvas size", sizes);
    camera.aspect = sizes.x/sizes.y;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.x, sizes.y);
})

const rgbeLoader = new RGBELoader();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
let currentSection = 0;
const totalSections = 4;
let moving = false;
function goTo(newSection){
    if(! moving){
        moving = true
        if(newSection >= currentSection){
            newSection = newSection % totalSections
            const el = "#a" + currentSection;
            const newEl = "#a" + newSection;

            document.querySelector(newEl).style.zIndex = 2;
            document.querySelector(el).style.zIndex = 1;  

            const timeline = gsap.timeline({
                defaults: { duration: 1 },
                onComplete: () => {
                    moving = false;
                    document.querySelector(el).style.zIndex = 0;
                }
            });
            timeline.to(el, {
                y: "-" + heightdiff,
                ease: "back.out(1.5)", 
            })
            .to(el, {
                rotateX: 90,
                ease: "expo.out"
            }, "<")
            .to(el, {
                opacity: 0,
                ease: "expo.in", 
            }, "<")
            .to(groups[currentSection].scale, {
                x: 0,
                y: 0,
                z: 0,
                ease: "expo.out"
            }, "<");
            timeline.fromTo(newEl,
                { y: heightdiff, rotateX: 90 },
                {
                y: 0,
                rotateX: 0,
                ease: "back.out(1.5)"
                },
                "<+=0.1"
            )
            .fromTo(newEl,
                { opacity: 0 },
                {
                opacity: 1,
                ease: "expo.out" 
                },
                "<"
            )
            .fromTo(groups[newSection].scale,
                {
                    x:0,
                    y:0,
                    z:0
                },{
                    x:1,
                    y:1,
                    z:1,
                    ease: "back.out(1.5)"
                },
                "<"
            )
            currentSection = newSection 
        }else if(newSection < currentSection){
            newSection = (newSection + totalSections) % totalSections
            const el = "#a" + currentSection;
            const newEl = "#a" + newSection;

            document.querySelector(newEl).style.zIndex = 2;
            document.querySelector(el).style.zIndex = 1;  

            const timeline = gsap.timeline({
                defaults: { duration: 1 },
                onComplete: () => {
                    moving = false;
                    document.querySelector(el).style.zIndex = 0;
                }
            });

            timeline.to(el, {
                y: heightdiff,
                ease: "back.out(1.5)", 
            })
            .to(el, {
                rotateX: 90,
                ease: "expo.out"
            }, "<")
            .to(el, {
                opacity: 0,
                ease: "expo.in", 
            }, "<")
            .to(groups[currentSection].scale, {
                x: 0,
                y: 0,
                z: 0,
                ease: "expo.out"
            }, "<");
            timeline.fromTo(newEl,
                { y: "-" + heightdiff, rotateX: 90 },
                {
                y: 0,
                rotateX: 0,
                ease: "back.out(1.5)"
                },
                "<+=0.1"
            )
            .fromTo(newEl,
                { opacity: 0 },
                {
                    opacity: 1,
                    ease: "expo.out" 
                },
                "<"
            )
            .fromTo(groups[newSection].scale,
                {
                    x:0,
                    y:0,
                    z:0
                },{
                    x:1,
                    y:1,
                    z:1,
                    ease: "back.out(1.5)"
                },
                "<"
            )
            currentSection = newSection 
        }
    }
}
const t = gsap.timeline();
t.fromTo("#a0",
    { y: "-" + heightdiff, rotateX: 90 },
    {
    y: 0,
    rotateX: 0,
    ease: "back.out(1.5)"
    },
    "<+=0.1"
)
.fromTo("#a0",
    { opacity: 0 },
    {
        opacity: 1,
        ease: "expo.out" 
    },
    "<"
)
rgbeLoader.load('/models/env_map.hdr', (hdrTexture) => {
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

    scene.environment = envMap;
    hdrTexture.dispose();
    pmremGenerator.dispose();
});
const loader = new GLTFLoader();

const cubeGroup = new THREE.Group();
loader.load("/models/Cube.glb", function ( gltf ) {
    let cubeModel = gltf.scene;
    
    cubeModel.scale.set(1, 1, 1);
    cubeModel.position.set(0, 0, 0);

    cubeGroup.add(cubeModel);
    cubeGroup.scale.set(0, 0, 0);
    scene.add(cubeGroup);
    },
    (xhr) => {
        // console.log("progress", xhr);
    },
    function (error) {
        // console.error('Error loading model:', error);
    }
);

const phoneGroup = new THREE.Group();
loader.load("/models/Phone.glb", function ( gltf ) {
        const phoneModel = gltf.scene;
        phoneModel.scale.set(20, 20, 20);
        phoneModel.position.set(0, -1, 0);
        phoneModel.rotation.z=Math.PI/6;
        phoneModel.rotation.y=Math.PI;
        
        phoneGroup.add(phoneModel);
        phoneGroup.scale.set(0, 0, 0);

        scene.add(phoneGroup);
    },
    (xhr) => {
        // console.log("progress", xhr);
    },
    function (error) {
        // console.error('Error loading model:', error);
    }
);



const rayTraceGroup = new THREE.Group();
const geometry1 = new THREE.SphereGeometry(0.5);
const material1 = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00,
  metalness: 0.9,
  roughness: 0.1,
  reflectivity: 0.99,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});
const mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.position.set(-1.5, -0.3, 0);

const geometry2 = new THREE.SphereGeometry(1);
const material2 = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.9,
  roughness: 0.1,
  reflectivity: 0.99,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.set(0, 0, 0);

const geometry3 = new THREE.TorusGeometry( 1, 0.2, 16, 100 ); 
const material3 = new THREE.MeshPhysicalMaterial({
  color: 0x0000ff,
  metalness: 0.9,
  roughness: 0.1,
  reflectivity: 0.99,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});
const mesh3 = new THREE.Mesh(geometry3, material3);
mesh3.position.set(1, 1, 0);
mesh3.rotation.y = Math.PI/3;
mesh3.rotation.x = -Math.PI/3;

rayTraceGroup.add(mesh1, mesh2, mesh3);
rayTraceGroup.scale.set(0, 0, 0);
scene.add(rayTraceGroup);







const sudokuGroup = new THREE.Group();

// Cell size
const cellSize = 0.5;
const boardSize = 9;

// Add grid cells
const cellGeo = new THREE.BoxGeometry(cellSize, 0.1, cellSize);
const cellMat = new THREE.MeshStandardMaterial({ color: 0xffffff });


for (let i = 0; i <= boardSize; i++) {
  const thickness = i % 3 === 0 ? 0.09 : 0.01

  // Horizontal lines
  const hBarGeo = new THREE.BoxGeometry(boardSize * cellSize, 0.05, thickness);
  const hBar = new THREE.Mesh(hBarGeo, cellMat);
  hBar.position.set(0, 0.06, i * cellSize - boardSize * cellSize / 2);
  sudokuGroup.add(hBar);

  // Vertical lines
  const vBarGeo = new THREE.BoxGeometry(thickness, 0.05, boardSize * cellSize);
  const vBar = new THREE.Mesh(vBarGeo, cellMat);
  vBar.position.set(i * cellSize - boardSize * cellSize / 2, 0.06, 0);
  sudokuGroup.add(vBar);
}

// ========== Load Font and Add Numbers ==========
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', font => {
  const nums = [
    { row: 0, col: 2, val: '2' },
    { row: 0, col: 3, val: '8' },
    { row: 0, col: 4, val: '5' },
    { row: 0, col: 6, val: '1' },

    { row: 1, col: 0, val: '1' },
    { row: 1, col: 5, val: '4' },

    { row: 2, col: 1, val: '6' },
    { row: 2, col: 2, val: '2' },
    { row: 2, col: 6, val: '7' },
    { row: 2, col: 7, val: '8' },

    { row: 3, col: 0, val: '4' },
    { row: 3, col: 3, val: '5' },
    { row: 3, col: 5, val: '8' },

    { row: 4, col: 0, val: '1' },
    { row: 4, col: 2, val: '3' },
    { row: 4, col: 3, val: '9' },
    { row: 4, col: 4, val: '6' },

    { row: 5, col: 6, val: '9' },

    { row: 6, col: 0, val: '6' },
    { row: 6, col: 1, val: '4' },
    { row: 6, col: 2, val: '8' },
    { row: 6, col: 3, val: '3' },
    { row: 6, col: 5, val: '2' },

    { row: 7, col: 0, val: '3' },
    { row: 7, col: 1, val: '1' },
    { row: 7, col: 2, val: '6' },
    { row: 7, col: 4, val: '2' },

    { row: 7, col: 6, val: '4' }
    ];

  nums.forEach(({ row, col, val }) => {
    const textGeo = new TextGeometry(val, {
      font,
      size: 0.25,
      height: 1,
      depth: 0.05,
    });

    const textMat = new THREE.MeshStandardMaterial({ color: 0x2266ff });
    const text = new THREE.Mesh(textGeo, textMat);
    text.rotation.x = Math.PI/2;
    textGeo.computeBoundingBox();
    const textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;

    text.position.set(
      col * cellSize - boardSize * cellSize / 2 + cellSize / 2 - textWidth / 2,
      0.05,
      row * cellSize - boardSize * cellSize / 2 + cellSize / 2 - 0.1
    );
    sudokuGroup.add(text);
  });
});

sudokuGroup.scale.set(0, 0, 0)
sudokuGroup.rotation.x = 7*Math.PI/6;
scene.add(sudokuGroup);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight1.position.set(4, 4, 4);
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.set(-4, -4, -4);
scene.add(directionalLight2);

const groups = [phoneGroup, cubeGroup, rayTraceGroup, sudokuGroup];






Observer.create({
  target: window, 
  type: "wheel,click",
  onUp: () => goTo(currentSection - 1),
  onDown: () => goTo(currentSection + 1),
});
Observer.create({
  target: window, 
  type: "touch",
  onUp: () => goTo(currentSection + 1),
  onDown: () => goTo(currentSection - 1),
});


const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop();


gsap.fromTo(groups[0].scale,
                {
                    x:0,
                    y:0,
                    z:0
                },{
                    x:1,
                    y:1,
                    z:1,
                    ease: "back.out(1.5)"
                },
                "<"
            )
import "./style.css";
import * as THREE from "three";
// import * as datt from "lil-gui";

// const gui = new datt.GUI();

const scene = new THREE.Scene();
//サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.2,
  100
);
camera.position.z = 6;

scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas: canvas, alpha: true });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクト
// const material = new THREE.MeshPhysicalMaterial({
//   color: "#297eb3",
//   metalness: 0.7,
//   roughness: 0.4,
//   flatShading: true,
// });

// gui.addColor(material, "color");
// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(material, "roughness").min(0).max(1).step(0.001);

const material = new THREE.MeshNormalMaterial({ wireframe: true });

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(
  new THREE.TorusGeometry(0.9, 0.4, 16, 60),
  material
);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(
  new THREE.TorusGeometry(1.1, 0.5, 16, 60),
  material
);
const mesh5 = new THREE.Mesh(
  new THREE.TorusGeometry(0.8, 0.5, 16, 60),
  material
);

mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);
mesh5.position.set(-7, -3, 8);

scene.add(mesh1, mesh2, mesh3, mesh4, mesh5);
const meshes = [mesh1, mesh2, mesh3, mesh4, mesh5];

//パーティクル
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: "#fff",
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

const directionalLight = new THREE.DirectionalLight("#fff", 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

///ブラウザのリサイズ
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//ホイール
let speed = 0;

window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.001;
});

function rotate() {
  mesh1.position.x = 2 + 3.8 * Math.cos(speed);
  mesh1.position.z = -3 + 3.8 * Math.sin(speed);

  mesh2.position.x = 2 + 3.8 * Math.cos(speed + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(speed + Math.PI / 2);

  mesh3.position.x = 2 + 3.8 * Math.cos(speed + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(speed + Math.PI);

  mesh4.position.x = 2 + 3.8 * Math.cos(speed + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(speed + 3 * (Math.PI / 2));

  mesh5.position.x = 1 + 3.5 * Math.cos(speed);
  mesh5.position.y = -1 + 3.5 * Math.sin(speed);
  mesh5.position.z = -2 + 3.5 * Math.sin(speed);
}

const cursor = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  console.log(e);
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);

  let getDeltaTime = clock.getDelta();

  rotate();

  //meshを回転させる
  meshes.map((mesh) => {
    mesh.rotation.x += 0.8 * getDeltaTime;
    mesh.rotation.y += 1 * getDeltaTime;
  });

  //カメラの制御
  camera.position.x += cursor.x * getDeltaTime * 1.2;
  camera.position.y += -cursor.y * getDeltaTime * 1.2;

  window.requestAnimationFrame(animate);
};

animate();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Perlin } from "libnoise-ts/module/generator";

const WIDTH_SEGMENTS = 40;
const HEIGHT_SEGMENTS = 40;
const NOISE_FACTOR = WIDTH_SEGMENTS / 1.5;
const SIZE = 5;

let X_OFFSET = 0.201;
let Y_OFFSET = 0.00001;

const noiseGen = new Perlin();

// -3 on -5 to 5
const scale = (val: number, min: number, max: number) => {
  const range = max - min;
  const nval = val - min;
  return nval / range;
};

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;

  _keysPressed: string[] = [];

  _grid: THREE.Mesh;
  _grid2: THREE.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.setupScene(canvas);
    this.createGrid();
    this.animate();

    this.setZ();
    this.registerKeys();
    window.addEventListener("resize", this.handleResize.bind(this), false);
  }

  setupScene(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    this.scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.y = -15;
    camera.position.z = 10;
    this.camera = camera;
    camera.lookAt(this.scene.position);
    // camera.position.y = HEIGHT_SEGMENTS * 20;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setSize(width, height);
    const backgroundColor = new THREE.Color("#000");

    var axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);

    renderer.setClearColor(backgroundColor, 1);
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = false;

    this.renderer = renderer;
  }

  registerKeys() {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (!this._keysPressed.includes(key)) {
        this._keysPressed.push(key);
      }
    });
    document.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this._keysPressed = this._keysPressed.filter((k) => k !== key);
    });
  }

  createGrid() {
    const plane = new THREE.PlaneGeometry(
      WIDTH_SEGMENTS * SIZE,
      HEIGHT_SEGMENTS * SIZE,
      WIDTH_SEGMENTS,
      HEIGHT_SEGMENTS
    );
    const plane2 = new THREE.PlaneGeometry(
      WIDTH_SEGMENTS * SIZE,
      HEIGHT_SEGMENTS * SIZE,
      WIDTH_SEGMENTS,
      HEIGHT_SEGMENTS
    );
    plane2.translate(0, 1000, 0);

    const gridMaterial = new THREE.ShaderMaterial({
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      transparent: true,
    });
    var planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      wireframe: true,
    });
    this._grid = new THREE.Mesh(plane, gridMaterial);
    this._grid2 = new THREE.Mesh(plane2, planeMaterial);
    // this._grid = new THREE.Mesh(plane, planeMaterial);
    this._grid.receiveShadow = true;

    var directionalLight = new THREE.AmbientLight(0x404040);
    this.scene.add(directionalLight);

    this.scene.add(this._grid);
    this.scene.add(this._grid2);
  }

  setZ() {
    const plane = this._grid.geometry as THREE.Geometry;
    const plane2 = this._grid2.geometry as THREE.Geometry;
    plane.verticesNeedUpdate = true;
    plane2.verticesNeedUpdate = true;

    const X_RANGE = 0.5 * WIDTH_SEGMENTS * SIZE;
    const Y_RANGE = 0.5 * HEIGHT_SEGMENTS * SIZE;

    let minZ: number = 10;
    let maxZ: number = -10;

    for (let i = 0; i < plane.vertices.length; i++) {
      const { x, y } = plane.vertices[i];

      const scaledX = scale(x, -X_RANGE, X_RANGE);
      const scaledY = scale(y, -Y_RANGE, Y_RANGE);

      const z =
        noiseGen.getValue(scaledX, scaledY, 2) * NOISE_FACTOR - NOISE_FACTOR;
      plane.vertices[i].z = z;
      plane2.vertices[i].z = z;

      if (z < minZ) {
        minZ = z;
      }
      if (z > maxZ) {
        maxZ = z;
      }
    }

    console.log(minZ, maxZ, NOISE_FACTOR);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // this.setZ();
    this.fly();

    this.renderer.render(this.scene, this.camera);
  }

  fly() {
    const STEP = 0.7;
    if (this._keysPressed.includes("w")) {
      this.camera.position.y += STEP;
    }
    if (this._keysPressed.includes("s")) {
      this.camera.position.y -= STEP;
    }
    if (this._keysPressed.includes("a")) {
      this.camera.position.x -= STEP;
    }
    if (this._keysPressed.includes("d")) {
      this.camera.position.x += STEP;
    }

    // this.camera.position.y = 460;
    // this.camera.position.y += 0.69;
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function delay(millis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), millis));
}

class TitleAnimator {
  $el: HTMLHeadingElement;
  queue: string[] = [];
  constructor(element: HTMLHeadingElement) {
    this.$el = element;
    this.animate();
  }

  async animate() {
    this.$el.innerHTML = "";
    this.$el.style.cssText = "";

    await delay(2500);

    await this.type("jas");
    await delay(50);
    await this.type("per");
    await delay(100);
    await this.type(".");
    await delay(200);
    await this.type(".");
    await delay(100);
    await this.type(".");
    await delay(500);
    await this.delete(2);
    await delay(200);
    await this.type("wtf?");
  }

  async type(text: string) {
    const chars = text.split("");
    for (let i = 0; i < chars.length; i++) {
      await this._type(chars[i], 80);
    }
  }

  async delete(amount: number) {
    for (let i = 0; i < amount; i++) {
      await this._delete();
    }
  }

  async _type(char: string, timeout: number = 100) {
    this.$el.innerHTML += char;
    await delay(timeout);
  }

  async _delete(timeout: number = 100) {
    const text = this.$el.innerHTML.split("");
    text.pop();
    this.$el.innerHTML = text.join("");
    await delay(timeout);
  }
}
const title = new TitleAnimator(document.querySelector("h1"));
const renderer = new Renderer(document.querySelector("canvas.main"));

// export default renderer;

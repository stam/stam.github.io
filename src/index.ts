import * as Three from "three";
import { Perlin } from "libnoise-ts/module/generator";

const WIDTH = 50;
const HEIGHT = 40;

let X_OFFSET = 0.201;
let Y_OFFSET = 0.101;

const noiseGen = new Perlin();

export class Renderer {
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;

  _grid: Three.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.setupScene(canvas);
    this.createGrid();
    this.animate();
    window.addEventListener("resize", this.handleResize.bind(this), false);
  }

  setupScene(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    this.scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.y = -15;
    camera.position.z = 10;
    this.camera = camera;
    camera.lookAt(this.scene.position);

    const renderer = new Three.WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setSize(width, height);
    const backgroundColor = new Three.Color("#000");

    renderer.setClearColor(backgroundColor, 0);

    this.renderer = renderer;
  }

  createGrid() {
    const plane = new Three.PlaneGeometry(200, 100, WIDTH, HEIGHT);

    const gridMaterial = new Three.ShaderMaterial({
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
    });
    this._grid = new Three.Mesh(plane, gridMaterial);

    this.scene.add(this._grid);
  }

  setZ() {
    const plane = this._grid.geometry as Three.Geometry;
    plane.verticesNeedUpdate = true;

    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        const index = col + row * (WIDTH + 1);
        // X_OFFSET += 0.004;

        const { x, y } = plane.vertices[index];
        const noiseValue = noiseGen.getValue(x / 30, Y_OFFSET + y / 20, 0) * 3;
        plane.vertices[index].z = noiseValue;
      }
      Y_OFFSET += 0.001;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.setZ();

    this.renderer.render(this.scene, this.camera);
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

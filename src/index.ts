import * as Three from "three";
import { Perlin } from "libnoise-ts/module/generator";

const WIDTH = 50;
const HEIGHT = 40;

let X_OFFSET = 0;
let Y_OFFSET = 0;

const noiseGen = new Perlin();

// const genNoise = (xOffset = 0) => {
//   const g = [];
//   for (let i = 0; i < 3; i++) {
//     g[i] = Math.round(100 * noiseGen.noise2D(i + xOffset, 0)) / 100;
//     // for (let j = 0; j < 3; j++) {
//     //   g[i][j] = noiseGen.noise2D(i + xOffset, j);
//     // }
//   }
//   console.log("noise", g);
// };

export class Renderer {
  renderer: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.Camera;

  _grid: Three.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.setupScene(canvas);
    this.createGrid();
    this.animate();
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
      canvas
    });
    renderer.setSize(width, height);
    const backgroundColor = new Three.Color("#fff");

    renderer.setClearColor(backgroundColor, 1);

    this.renderer = renderer;
  }

  createGrid() {
    const plane = new Three.PlaneGeometry(200, 100, WIDTH, HEIGHT);

    const gridMaterial = new Three.ShaderMaterial({
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent
    });
    this._grid = new Three.Mesh(plane, gridMaterial);

    this.scene.add(this._grid);

    //@ts-ignore
    window.p = plane;

    // plane.vertices.forEach((v, i) => {
    //   if (i <= 51) {
    //     console.log(v);
    //   }
    // });

    // const reducer = (acc: Vector3, currentValue: Vector3) => {
    //   console.log("currentValue", currentValue);
    //   return 0;
    // };
    // const a = plane.vertices.reduce(reducer);
  }

  setZ() {
    const plane = this._grid.geometry as Three.Geometry;
    plane.verticesNeedUpdate = true;

    for (let x = 0; x < HEIGHT; x++) {
      for (let y = 0; y < WIDTH; y++) {
        const index = y + x * (WIDTH + 1);

        // if (x === 0 && [0, 1, 3, 4].includes(y)) {
        //   console.log(plane.vertices[index]);
        // }
        // console.log(x, y, index, plane.vertices[index]);
        // }
        // if (x === 1) {
        //   console.log(x, y, plane.vertices[index]);
        // }

        // console.log("xoff", X_OFFSET);
        const noiseValue =
          X_OFFSET % WIDTH === x || X_OFFSET % HEIGHT === HEIGHT - y ? 2 : 0;
        // const noiseValue = noiseGen.getValue(x, 10, 0) * 4;
        plane.vertices[index].z = noiseValue;
        // console.log("noiseValue", noiseValue);
        // X_OFFSET += 0.000001;
      }
    }
    X_OFFSET += 1;

    // genNoise(X_OFFSET);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // setTimeout(this.animate.bind(this), 1000);
    // console.log("nosie", noise);
    this.setZ();

    this.renderer.render(this.scene, this.camera);
  }
}

const renderer = new Renderer(document.querySelector("canvas.main"));

export default renderer;

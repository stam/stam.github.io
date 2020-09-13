varying vec3 vUv;

void main() {

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vUv = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
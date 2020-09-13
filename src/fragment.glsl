#extension GL_OES_standard_derivatives : enable

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

varying vec3 vUv;
varying vec3 vNormal;

void main() {
	// Pick a coordinate to visualize in a grid
	vec3 coord = vUv.xyz;

	float rel_height = (coord.z + 30.) / 9.;

	vec2 st = gl_FragCoord.xy/u_resolution;

	float smoothZ = rel_height * 0.3 - 0.3;
	float relY = smoothstep(coord.y , -30., 0.);

	vec3 n = normalize(vNormal);
	vec3 dx = dFdx(n);
	vec3 dy = dFdy(n);
	vec3 xneg = n - dx;
	vec3 xpos = n + dx;
	vec3 yneg = n - dy;
	vec3 ypos = n + dy;
	float depth = length(vUv);
	float curvature = (cross(xneg, xpos).y - cross(yneg, ypos).x) * 4.0 / depth;


	float r = smoothZ + st.x;
	float g = relY + curvature * 10.;
	float b = 0.8;
	float a = 0.8;

	gl_FragColor = vec4(r, g, b, a);
}
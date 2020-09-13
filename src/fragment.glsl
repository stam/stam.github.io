#extension GL_OES_standard_derivatives : enable

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

varying vec3 vUv;


void main() {
	// Pick a coordinate to visualize in a grid
	vec3 coord = vUv.xyz;

	// Compute anti-aliased world-space grid lines
	vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
	float line = min(min(grid.x, grid.y), grid.z);

	// Just visualize the grid lines directly
	float intensity = 1.0 - min(line, 1.);
	float rel_height = (coord.z + 30.) / 9.;
	float f = abs(sin(u_time));

	if (intensity == 0.) {
		gl_FragColor = vec4(0., 0., 0., f);
	} else {
		vec2 st = gl_FragCoord.xy/u_resolution;

		float smoothZ = rel_height * 0.3 - 0.3;
		float relY = smoothstep(coord.y , -30., 0.);

		float r = smoothZ + st.x;
		float g = relY;
		float b = 0.8;
		float a = 0.8;

		// Just visualize the grid lines directly
		gl_FragColor = vec4(r, g, b, a);
	}
}
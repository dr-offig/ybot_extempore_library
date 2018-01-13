#version 400

// vertex positions input attribute
in vec2 vp;

void main () {
  gl_Position = vec4 (vp, 0.0, 1.0);
}

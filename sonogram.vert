#version 400

layout(location = 0) in vec2 vertex_position;
layout(location = 1) in vec3 vertex_colour;

uniform mat4 view_mat;
out vec3 colour;

float squidge(float x)
{
  return ((x / 2.0) + 0.5);
}

void main () {
  colour = vertex_colour;
  colour.x = squidge(vertex_position.x);
  colour.y = squidge(vertex_position.y);
  
  gl_Position = view_mat * vec4(vertex_position, 0.0, 1.0);
}

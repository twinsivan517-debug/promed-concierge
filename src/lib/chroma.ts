export type Painter = (video: HTMLVideoElement) => void;

const VERTEX = `
attribute vec2 at;
varying vec2 uv;
void main() {
  uv = vec2((at.x + 1.0) / 2.0, (1.0 - at.y) / 2.0);
  gl_Position = vec4(at, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D frame;
varying vec2 uv;
void main() {
  vec4 c = texture2D(frame, uv);
  float most = max(c.r, c.b);
  float green = c.g - most;
  float alpha = 1.0 - smoothstep(30.0 / 255.0, 100.0 / 255.0, green);
  vec3 rgb = vec3(c.r, green > 0.0 ? most : c.g, c.b);
  gl_FragColor = vec4(rgb * alpha, alpha);
}`;

function gpu(canvas: HTMLCanvasElement): Painter | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(program, "at");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);

  return (video) => {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
}

function cpu(canvas: HTMLCanvasElement): Painter | null {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  return (video) => {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(video, 0, 0, width, height);
    const image = ctx.getImageData(0, 0, width, height);
    const px = image.data;
    for (let i = 0; i < px.length; i += 4) {
      const most = px[i] > px[i + 2] ? px[i] : px[i + 2];
      const green = px[i + 1] - most;
      if (green > 0) {
        px[i + 1] = most;
        px[i + 3] = green >= 100 ? 0 : green <= 30 ? 255 : Math.round(255 * (1 - (green - 30) / 70));
      }
    }
    ctx.putImageData(image, 0, 0);
  };
}

export function painter(canvas: HTMLCanvasElement): Painter | null {
  return gpu(canvas) ?? cpu(canvas);
}

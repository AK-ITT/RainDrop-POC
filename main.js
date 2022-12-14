let canvas
let gl

async function loadShaderProgram(vertexURL, fragmentURL) {
    
    // Fetch shader source code from given URLs

    let res;

    res = await fetch(vertexURL);
    const vertexSource = await res.text();

    res = await fetch(fragmentURL);
    const fragmentSource = await res.text();

    // Util for loading individual shaders

    function loadShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            if (type === gl.VERTEX_SHADER) {
                throw new Error(`(WebGL vertex shader) ${gl.getShaderInfoLog(shader)}`);
            } else if (type === gl.FRAGMENT_SHADER) {
                throw new Error(`(WebGL fragment shader) ${gl.getShaderInfoLog(shader)}`);
            }
        }

        return shader;
    }
    
    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`(WebGL shader program) ${gl.getProgramInfoLog(vertexShader)}`)
    }

    return program;
}


class App {
    constructor() {
            
    }
    
    async main() {
        canvas = document.querySelector(`canvas`);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl = canvas.getContext(`webgl`);
    
        if (!gl) {
            throw new Error(`This browser does not support WebGL`);
        }
        
        const program = await loadShaderProgram(`vertex.glsl`, `fragment.glsl`);
        gl.useProgram(program);
    }
}

const app = new App();
app.main();
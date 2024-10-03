

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success)
        return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error();
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) : WebGLProgram
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success)
        return program;

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error();
}


function createProgramFromSources(gl: WebGL2RenderingContext, sources: string[]) {
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, sources[0]);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, sources[1]);
    var program = createProgram(gl, vertexShader, fragmentShader);

    return program;
}

export const webglUtils = {
    createProgramFromSources
}
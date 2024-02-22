


function loadTexture(gl, image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // Option 1 : Use mipmap, select interpolation mode
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // Option 2: At least use linear filters
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Optional ... if your shader & texture coordinates go outside the [0,1] range
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}
class Sphere {
  constructor(gl, tProjection, color, speed, shaderProgram, tParam, image1URL, n) {
    this.gl = gl;
    this.n = n;
    this.tProjection = tProjection;
    this.shaderProgram = shaderProgram;
    this.tMV = mat4.create();
    this.tMVn = mat3.create();
    this.tMVP = mat4.create();
    this.color = [];
    this.speed = speed;
    this.sphereIndecies = [];
    this.spherePositions = [];
    this.textPositions = [];
    this.tParam = tParam;
    this.image1URL = image1URL;
    let sphereInterval = 15;

    for (let i = 0; i <= sphereInterval; ++i) {
      let phi = i / sphereInterval * Math.PI;
      for (let j = 0; j <= sphereInterval; ++j) {
        let theta = j / sphereInterval * Math.PI * 2;
        this.spherePositions.push(Math.sin(theta) * Math.sin(phi));
        this.spherePositions.push(Math.cos(phi));
        this.spherePositions.push(Math.cos(theta) * Math.sin(phi));

        this.color.push(color[0]);
        this.color.push(color[1]);
        this.color.push(color[2]);

        this.textPositions.push(j / sphereInterval);
        this.textPositions.push(i / sphereInterval);
      }
    }
    for (let i = 0; i < sphereInterval; i++) {
      for (let j = 0; j < sphereInterval; j++) {
        let p1 = i * (sphereInterval + 1) + j;
        let p2 = p1 + sphereInterval + 1;
        this.sphereIndecies.push(p1);
        this.sphereIndecies.push(p2);
        this.sphereIndecies.push(p1 + 1);

        this.sphereIndecies.push(p1 + 1);
        this.sphereIndecies.push(p2);
        this.sphereIndecies.push(p2 + 1);
      }
    }
    this.sphereNormalIndexcies = [...this.spherePositions];

    this.color = new Float32Array(this.color);
    this.sphereNormalIndexcies = new Float32Array(this.sphereNormalIndexcies);
    this.spherePositions = new Float32Array(this.spherePositions);
    this.sphereIndecies = new Uint8Array(this.sphereIndecies);
    this.textPositions = new Float32Array(this.textPositions);


    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    // switch (this.n) {
    //   case 0:
    //     gl.activeTexture(gl.TEXTURE0);
    //     break;
    //   case 1:
    //     gl.activeTexture(gl.TEXTURE1);
    //     break;
    //   case 2:
    //     gl.activeTexture(gl.TEXTURE2);
    //     break;
    //   case 3:
    //     gl.activeTexture(gl.TEXTURE3);
    //     break;
    //   case 4:
    //     gl.activeTexture(gl.TEXTURE4);
    //     break;
    //   case 5:
    //     gl.activeTexture(gl.TEXTURE5);
    //     break;
    //   case 6:
    //     gl.activeTexture(gl.TEXTURE6);
    //     break;
    //   case 7:
    //     gl.activeTexture(gl.TEXTURE7);
    //     break;

    // }
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);


    let image1 = new Image();
    image1.onload = function () {
      loadTexture(gl, image1, texture1);
    }
    image1.crossOrigin = "anonymous";
    image1.src = this.image1URL;
    this.image1 = image1;
    this.texture1 = texture1;

  }


  update(tModel, tCamera) {
    mat4.multiply(this.tMV, tCamera, tModel); // "modelView" matrix
    mat3.normalFromMat4(this.tMVn, this.tMV);
    mat4.multiply(this.tMVP, this.tProjection, this.tMV);
  }





  draw(tModel, tCamera) {

    this.update(tModel, tCamera);
    let gl = this.gl;
    let shaderProgram = this.shaderProgram;

    let image1 = this.image1;
    let texture1 = this.texture1;

    loadTexture(gl, image1, texture1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);


    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);

    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);

    shaderProgram.TextAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.TextAttribute);


    // this gives us access to the matrix uniform
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram, "uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram, "uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");
    shaderProgram.time = gl.getUniformLocation(shaderProgram, "time");

    // Set up uniforms & attributes
    gl.uniformMatrix4fv(shaderProgram.MVmatrix, false, this.tMV);
    gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix, false, this.tMVn);
    gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, this.tMVP);
    gl.uniform1f(shaderProgram.time, this.tParam);


    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    let trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.spherePositions, gl.STATIC_DRAW);

    // a buffer for normals
    let triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.sphereNormalIndexcies, gl.STATIC_DRAW);

    // a buffer for colors
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.color, gl.STATIC_DRAW);

    let textBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.textPositions, gl.STATIC_DRAW);

    // a buffer for indices
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.sphereIndecies, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.vertexAttribPointer(shaderProgram.PositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.NormalAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderProgram.ColorAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, textBuffer);
    gl.vertexAttribPointer(shaderProgram.TextAttribute, 2, gl.FLOAT, false, 0, 0);



    // Do the drawing
    gl.drawElements(gl.TRIANGLES, this.sphereIndecies.length, gl.UNSIGNED_BYTE, 0);
    this.tParam += this.speed;
    this.tParam %= 2 * Math.PI;
  }

}


function start() {

  // Get canvas, WebGL context, twgl.m4
  var canvas = document.getElementById("mycanvas");
  var gl = canvas.getContext("webgl");

  // Sliders at center
  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  // var slider2 = document.getElementById('slider2');
  // slider2.value = 0;

  let tParam = 0;
  let t1 = Math.random(0, 2 * Math.PI);
  let t2 = Math.random(0, 2 * Math.PI);
  let t3 = Math.random(0, 2 * Math.PI);
  let t4 = Math.random(0, 2 * Math.PI);
  let t5 = Math.random(0, 2 * Math.PI);
  let t6 = Math.random(0, 2 * Math.PI);
  let t7 = Math.random(0, 2 * Math.PI);

  let vertexSource = document.getElementById("vertexShader").text;
  let fragmentSource = document.getElementById("fragmentShader").text;
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader)); return null;
  }

  // Compile fragment shader
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader)); return null;
  }

  // Attach the shaders and link
  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialize shaders");
  }
  gl.useProgram(shaderProgram);

  let starsCoordinates = [];
  for (let i = 0; i < 3000; ++i) {
    let r = Math.random() * 2000 + 3000;
    let phi = Math.random() * Math.PI;
    let theta = Math.random() * Math.PI * 2;
    starsCoordinates.push([r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi), r * Math.cos(theta) * Math.sin(phi)]);
  }

  let sunImageURL = "https://live.staticflickr.com/65535/52564529849_2b13c93bc7_k.jpg";
  let earthImageURL = "https://live.staticflickr.com/65535/52564254076_a60e20ae8e_k.jpg";
  let moonImageURL = "https://live.staticflickr.com/65535/52564491941_4e2e0e1e70_k.jpg";
  let mercuryImageURL = "https://live.staticflickr.com/65535/52564404441_4fdffc971d_k.jpg";
  let venusImageURL = "https://live.staticflickr.com/65535/52565020128_9af15c590f_k.jpg";
  let marsImageURL = "https://live.staticflickr.com/65535/52564406531_85e1c5f001_k.jpg";
  let jupiterImageURL = "https://live.staticflickr.com/65535/52564685439_22e8299e65_k.jpg";

  var tProjection = mat4.create();
  mat4.perspective(tProjection, Math.PI / 4, 1, 10, 100000);
  let sun = new Sphere(gl, tProjection, [1, 0, 0], 10, shaderProgram, tParam, sunImageURL, 0);
  let mercury = new Sphere(gl, tProjection, [0.905, 0.549, 0.137], 10, shaderProgram, tParam, mercuryImageURL, 1);
  let venus = new Sphere(gl, tProjection, [0.733, 0.239, 0.14], 10, shaderProgram, tParam, venusImageURL, 2);
  let earth = new Sphere(gl, tProjection, [0.14, 0.356, 0.6705], 10, shaderProgram, tParam, earthImageURL, 3);
  let moon = new Sphere(gl, tProjection, [0.705, 0.705, 0.705], 10, shaderProgram, tParam, moonImageURL, 4);
  let mars = new Sphere(gl, tProjection, [0.83, 0.074, 0.082], 10, shaderProgram, tParam, marsImageURL, 5);
  let jupiter = new Sphere(gl, tProjection, [0.827, 0.69, 0.41], 10, shaderProgram, tParam, jupiterImageURL, 6);

//   let stars = [];
//   for (let i = 0; i < 10; ++i) {
//     let star = new Sphere(gl, tProjection, [1, 1, 1], 10, shaderProgram, tParam, moonImageURL);
//     stars.push(star);
// }

  function draw() {

    // Translate slider values to angles in the [-pi,pi] interval
    var angle1 = slider1.value * 0.01 * Math.PI;
    // var angle2 = slider2.value*0.01*Math.PI;
    var tCamera = mat4.create();

    // Circle around the y-axis
    var eye = [700 * Math.sin(angle1), 300.0, 700.0 * Math.cos(angle1)];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    mat4.lookAt(tCamera, eye, target, up);

    // mat4.ortho(tProjection, -100, 100, -100, 100, -1, 1);

    // Clear screen, prepare for rendering
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let TSun = mat4.create();
    mat4.scale(TSun, TSun, [20, 20, 20]);
    mat4.rotate(TSun, TSun, tParam, [0, 1, 0]);

    sun.draw(TSun, tCamera);

    let TMercury = mat4.create();
    mat4.translate(TMercury, TMercury, [30 * Math.sin(t1), 0, 30 * Math.cos(t1)]);
    mat4.scale(TMercury, TMercury, [10, 10, 10]);
    mercury.draw(TMercury, tCamera);


    let TVenus = mat4.create();
    mat4.translate(TVenus, TVenus, [55 * Math.sin(t2), 0, 55 * Math.cos(t2)]);
    mat4.scale(TVenus, TVenus, [10, 10, 10]);
    venus.draw(TVenus, tCamera);


    let TEarth = mat4.create();
    mat4.translate(TEarth, TEarth, [120 * Math.sin(t3), 0, 120 * Math.cos(t3)]);
    mat4.scale(TEarth, TEarth, [13, 13, 13]);
    earth.draw(TEarth, tCamera);

    let TMoon = mat4.create();
    mat4.scale(TMoon, TEarth, [1/13, 1/13, 1/13]);
    mat4.translate(TMoon, TMoon, [30 * Math.sin(t7), 0, 30*Math.cos(t7)]);
    mat4.scale(TMoon, TMoon, [10, 10, 10]);
    moon.draw(TMoon, tCamera);

    let Tmars = mat4.create();
    mat4.translate(Tmars, Tmars, [175 * Math.sin(t4), 0, 175 * Math.cos(t4)]);
    mat4.scale(Tmars, Tmars, [15, 15, 15]);
    mars.draw(Tmars, tCamera);

    let TJupiter = mat4.create();
    mat4.translate(TJupiter, TJupiter, [230 * Math.sin(t5), 0, 230 * Math.cos(t5)]);
    mat4.scale(TJupiter, TJupiter, [35, 35, 35]);
    jupiter.draw(TJupiter, tCamera);


    


    // for (let i = 0; i < stars.length; i++) {
    //   let TStar = mat4.create();
    //   // mat4.translate(TStar, TStar, [Math.random(), , 55*Math.cos(t2)]);
    //   mat4.translate(TStar, TStar, [starsCoordinates[i][0], starsCoordinates[i][1], starsCoordinates[i]][2]);
    //   mat4.scale(TStar, TStar, [10, 10, 10]);
    //   stars[i].draw(TStar, tCamera);
    // }


    tParam += 0.01;
    t1 += 0.015;
    t2 += 0.012;
    t3 += 0.01;
    t4 += 0.009;
    t5 += 0.007;
    t6 += 0.003;
    t7 += 0.02;
    t1 %= 2 * Math.PI;
    t2 %= 2 * Math.PI;
    t3 %= 2 * Math.PI;
    t4 %= 2 * Math.PI;
    t5 %= 2 * Math.PI;
    t6 %= 2 * Math.PI;
    tParam %= 2 * Math.PI;
    window.requestAnimationFrame(draw);
  }


  draw();
}

window.onload = start;








window.app = {
  init() {
    //set up variables for l-system
    this.dist = 5
    this.times = 5
    this.maxTimes = 5
    this.commandString = 'F'
    this.angle = this.toRadians(30)
    this.axiom = 'F'
    this.animIndex = 0
    this.animating = false
    this.cameraSpeed = 3
      
    // pretty simple...
    this.scene = new THREE.Scene()
    this.turtle = new Turtle(this.scene, 0, 0, 0, this.dist);
      
    this.functions = {
        "F": function() { 
            app.turtle.penDown();
            app.turtle.move(app.dist);
            app.turtle.penUp();
            },
        "f": function(){app.turtle.move(app.dist);},
        "x": function(){app.turtle.rotate(new THREE.Vector3(1,0,0), -(app.angle));},
        "X": function(){app.turtle.rotate(new THREE.Vector3(1,0,0), app.angle);},
        "y": function(){app.turtle.rotate(new THREE.Vector3(0,1,0), -(app.angle));},
        "Y": function(){app.turtle.rotate(new THREE.Vector3(0,1,0), app.angle);},
        "z": function(){app.turtle.rotate(new THREE.Vector3(0,0,1), -(app.angle));},
        "Z": function(){app.turtle.rotate(new THREE.Vector3(0,0,1), app.angle);},
        "[": function(){app.turtle.push();},
        "]": function(){app.turtle.pop();},
    }
    this.rules = {
        'F': '[FZFZF]zFzFzF'
    }
      
    this.rulesForm = document.getElementById('rulesField');
    this.button = document.getElementById('updateButton');
    this.animButton = document.getElementById('animButton');
    this.rSlider = document.getElementById('repeats');
    this.tSlider = document.getElementById('theta');
    this.select = document.getElementById('preset');
      
    this.rulesForm.value = this.rules['F'];

    this.button.addEventListener('click', function(){
        if(app.animating){
            app.animating = false;
            app.animIndex = 0;
            app.turtle.reset();
        }
        
        if(app.rulesForm.value != ''){
            app.rules['F'] = app.rulesForm.value;
            app.clear();
            app.calculateLSystem()
            app.runTurtle();
        }
    });
      
    this.animButton.addEventListener('click', function(){
            app.animating = true;
    });
      
    this.rSlider.addEventListener('change', this.updateTimes);
    this.tSlider.addEventListener('change', this.updateTheta);
    this.select.addEventListener('change', this.loadPreset);

    // camera is a bit more involved...
    this.camera = new THREE.PerspectiveCamera(
      75,  // FOV 
      window.innerWidth / window.innerHeight, // aspect ratio
      .1,  // near plane
      1000 // far plane
    )
    
    // move camera back
    this.camera.position.z = 200
    
    onkeydown = function(event){
        if(event.keyCode == 87){
           app.camera.position.z -= app.cameraSpeed 
        }
        
        if(event.keyCode == 83){
           app.camera.position.z += app.cameraSpeed 
        }
        
        if(event.keyCode == 65){
           app.camera.position.x -= app.cameraSpeed
        }
        
        if(event.keyCode == 68){
           app.camera.position.x += app.cameraSpeed
        }
        
        if(event.keyCode == 69){
           app.camera.position.y += app.cameraSpeed 
        }
        
        if(event.keyCode == 67){
           app.camera.position.y -= app.cameraSpeed 
        }
        
        if(event.keyCode == 90){
           app.clear()
        }
    }
      
    this.createRenderer()
    this.createLights()
      
    /*
    const box = new THREE.BoxGeometry( 1,1,1 )
    const material = new THREE.MeshPhongMaterial({ color:0xffffff })
    this.cube = new THREE.Mesh( box, material )

    this.scene.add( this.cube )
    */
    
    this.calculateLSystem()
    this.runTurtle()
    this.render()
    
  },
  
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )

    // take the THREE.js canvas element and append it to our page
	  document.body.appendChild( this.renderer.domElement )
    
    this.render = this.render.bind( this )
	},
  
  createLights() {
    //this.ambient = new THREE.AmbientLight( 0x404040, .15 )
    //this.scene.add( this.ambient )
    
    this.pointLight = new THREE.PointLight( 0xffffff )
    this.pointLight.position.z = 200
    this.scene.add( this.pointLight )
  },
  
  render() {
    window.requestAnimationFrame( this.render )
    
    if(app.animating){
        if(app.animIndex == 0){
          app.clear();
        }
          app.functions[app.commandString[app.animIndex]]();
          app.animIndex++;   

        if(app.animIndex == app.commandString.length - 1){
            app.animIndex = 0;
            app.animating = false;
        }
    }
      
    this.renderer.render( this.scene, this.camera )  
  },
  
  toRadians(deg){
      return deg * (Math.PI / 180);
  },
    
  loadPreset() {
      if(app.animating){
            app.animating = false;
            app.animIndex = 0;
            app.turtle.reset();
      }
        var data = JSON.parse(app.select.value)
        app.rules['F'] = data.rule;
        app.rulesForm.value = data.rule;
        app.rSlider.value = data.repeats;
        app.updateTimes();
        app.tSlider.value = data.theta;
        app.updateTheta();
        app.calculateLSystem();
        app.clear();
        app.runTurtle();
  },
      
  updateTimes() {
      if(app.animating){
            app.animating = false;
            app.animIndex = 0;
            app.turtle.reset();
      }
        app.times = app.rSlider.value;
        document.getElementById("repeatLabel").innerHTML = "Repeats: " + app.rSlider.value;
        app.calculateLSystem();
        app.clear();
        app.runTurtle();
  },
    
  updateTheta() {
      if(app.animating){
            app.animating = false;
            app.animIndex = 0;
            app.turtle.reset();
      }
        app.angle = app.toRadians(app.tSlider.value);
        document.getElementById("thetaLabel").innerHTML = "&thetasym;:" + app.tSlider.value + "&#176;";
        app.clear();
        app.runTurtle();
  },

  calculateLSystem(){
    var commands = this.axiom;
    for(var i=0; i<this.times; i++){
        var newLine = '';
        for(var c of commands){
            if(this.rules[c]){
                newLine += this.rules[c];        
            }
            else{
                newLine += c;
            }
        }
        commands = newLine;
    }
      
    this.commandString = commands;
  },
  
  runTurtle() {
        app.clear();
        app.turtle.reset();
        for(var char of this.commandString){
            this.functions[char]();
        }
  },
    
  clear(){
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
        if(this.scene.children[i].isLine){
            this.scene.remove(this.scene.children[i]);
        }  
    }  
  }
}

window.onload = ()=> window.app.init()
// could also be: window.onload = app.bind( app )
// pass in canvas context, a starting x and a starting y position
const Turtle = class { 
  constructor( threeScene, startX, startY, startZ ) {
      this.scene = threeScene;
      this.startX = startX;
      this.startY = startY;
      this.startZ = startZ;
      this.pos = new THREE.Vector3( this.startX, this.startY, this.startZ);
      this.dir = new THREE.Vector3(0,1,0);
      this.pen = false;
      this.rainbow = true;
      this.lineMaterial = new THREE.LineBasicMaterial({
	       color: "rgb(255, 255, 255)",
           linewidth: 5
      });
      this.posArray = [];
      this.dirArray = [];
  };
    
  penUp()   { this.pen = false };
    
  penDown() { this.pen = true };
    
  push() {
    this.posArray.push( this.pos.clone() )
    this.dirArray.push( this.dir.clone() )
  };
  pop() {
    this.pos = this.posArray.pop()
    this.dir = this.dirArray.pop()
  };
  // THIS IS IN RADIANS!!!
  rotate( axis, amount ) {
    this.dir.applyAxisAngle( axis, amount )
  };
  move(amt){
      if(this.pen){
          if(this.rainbow){
            var r = Math.floor((Math.random()*255) + 1)
            var g = Math.floor((Math.random()*255) + 1)
            var b = Math.floor((Math.random()*255) + 1)
            var colorString = "rgb(" + r + ", " + g + ", " + b + ")"
            this.lineMaterial = new THREE.LineBasicMaterial({
               color: colorString,
               linewidth: 5
            });
          }
          
          var geometry = new THREE.Geometry()
          geometry.vertices.push(new THREE.Vector3( this.pos.x, this.pos.y, this.pos.z ))
                                 
          this.pos.x += this.dir.x * amt
          this.pos.y += this.dir.y * amt
          this.pos.z += this.dir.z * amt
                                 
          geometry.vertices.push(new THREE.Vector3( this.pos.x, this.pos.y, this.pos.z ))
          
          var line = new THREE.Line(geometry, this.lineMaterial);
          this.scene.add(line);
      }
      else{
          this.pos.x += this.dir.x * amt
          this.pos.y += this.dir.y * amt
          this.pos.z += this.dir.z * amt
      }
  };
  reset(){
      this.pos = new THREE.Vector3( this.startX, this.startY, this.startZ);
      this.dir = new THREE.Vector3( 0,1,0 );
  }
}
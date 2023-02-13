class THREEJS
{
    constructor()
    {
        const w = document.body.clientWidth
        const h = document.body.clientHeight

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor( 0x8888dd )
        this.renderer.setSize( w, h )

        this.camera = new THREE.PerspectiveCamera( 40, w / h, 0.1, 1000 )
        this.camera.position.x =  0
        this.camera.position.y = 20
        this.camera.position.z = 30
        this.trackball = new THREE.TrackballControls( this.camera )

        this.scene = new THREE.Scene()

        let directionalLight = new THREE.DirectionalLight( 0xffffff, 1 )
        directionalLight.position.set( 0.2, 0.5, 0.3 )
        this.scene.add( directionalLight )

        // this.scene.add( new THREE.AmbientLight( 0x101020 ) )

        document.body.appendChild( this.renderer.domElement )
    }

    add_mesh( _arg )
    {
        let mesh = new THREE.Mesh(
            new THREE.BoxGeometry( _arg.w, _arg.h, _arg.d ),
            new THREE.MeshLambertMaterial( { color: _arg.color } )
        )
        mesh.cannon_rigid_body = _arg.body
        this.scene.add( mesh )
    }

    render()
    {
        for ( let mesh of this.scene.children )
        {
            if ( ! mesh.cannon_rigid_body ) continue

            mesh.position.copy(   mesh.cannon_rigid_body.position   )
            mesh.quaternion.copy( mesh.cannon_rigid_body.quaternion )
        }

        this.trackball.update()
        this.renderer.render( this.scene, this.camera )
    }
}

class CANNON_PHYSICS
{
    constructor( _threejs )
    {
        this.cannon_world = new CANNON.World()
        this.cannon_world.gravity.set( 0, -9.80665, 0 )
        this.cannon_world.broadphase = new CANNON.NaiveBroadphase()
        this.cannon_world.solver.iterations = 10

        this.threejs = _threejs
    }

    create_rigid_body( _arg )
    {
        const body  = new CANNON.Body( {
            mass:       _arg.mass,
            shape:      new CANNON.Box( new CANNON.Vec3( _arg.w/2, _arg.h/2, _arg.d/2 ) ),
            position:   new CANNON.Vec3( _arg.x, _arg.y, _arg.z ),
            material:   new CANNON.Material( { friction: 0.1, } ), // 摩擦係数 0.1 マテリアルを作成
        } )
        this.cannon_world.add( body )
        this.threejs.add_mesh( { body: body, w: _arg.w, h: _arg.h, d: _arg.d, color: _arg.color } )
    }

    render( _sec )
    {
        this.cannon_world.step( _sec )
        this.threejs.render()
    }
}

// MAIN
let cannon_phy = new CANNON_PHYSICS( new THREEJS() )

cannon_phy.create_rigid_body( {
    mass: 0, x: 0, y: -0.2, z: 0, w: 50, h: 0.4, d: 50, color: 0x333333,
} )


const dataSet = [
    0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
    0,0,0,0,0,0,3,3,3,3,3,0,0,1,1,1,
    0,0,0,0,0,3,3,3,3,3,3,3,3,3,1,1,
    0,0,0,0,0,2,2,2,1,1,2,1,0,3,3,3,
    0,0,0,0,2,1,2,1,1,1,2,1,1,3,3,3,
    0,0,0,0,2,1,2,2,1,1,1,2,1,1,1,3,
    0,0,0,0,2,2,1,1,1,1,2,2,2,2,3,0,
    0,0,0,0,0,0,1,1,1,1,1,1,1,3,0,0,
    0,0,3,3,3,3,3,5,3,3,3,5,3,0,0,0,
    0,3,3,3,3,3,3,3,5,3,3,3,5,0,0,2,
    1,1,3,3,3,3,3,3,5,5,5,5,5,0,0,2,
    1,1,1,0,5,5,3,5,5,4,5,5,4,5,2,2,
    0,1,0,2,5,5,5,5,5,5,5,5,5,5,2,2,
    0,0,2,2,2,5,5,5,5,5,5,5,5,5,2,2,
    0,2,2,2,5,5,5,5,5,5,5,0,0,0,0,0,
    0,2,0,0,5,5,5,5,0,0,0,0,0,0,0,0
]

const box_size = 1.5
for ( let y=0 ; y<16; y++ ) {
    for ( let x=0 ; x<16; x++ ) {
        cannon_phy.create_rigid_body( {
            mass: 1,
            x: (x-7) * box_size * 0.95, y: box_size * 0.5, z: (y-7) * box_size * 1.2,
            w: box_size*0.1, h: box_size*1, d: box_size*1,
            color: [ 0xDCAA6B, 0xffcccc, 0x800000, 0xff0000, 0xffff00, 0x0000ff ][ dataSet[ y * 16 + x ] ],
        })
    }
}

for ( let i=0 ; i<16; i++ ) {
    cannon_phy.create_rigid_body({
        mass: 3,
        x: -7 * box_size, y: box_size * 3, z: (i-7) * box_size * 1.2,
        w: box_size, h: box_size, d: box_size,
        color: 0xeeeeee
    })
}

function animate()
{
    cannon_phy.render( 1 / 60 )
    window.requestAnimationFrame( animate )
}
window.requestAnimationFrame( animate )
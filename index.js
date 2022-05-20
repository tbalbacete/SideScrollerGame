const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5

class Player {
    constructor(){
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle= 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x: x,
            y: y
        }
        
        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x: x,
            y: y
        }
        
        this.image = image
        this.width = image.width
        this.height = image.height

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = new Image()
platformImage.src = './img/platform.png'
let hillsImage = new Image()
hillsImage.src = './img/hills.png'
let backgroundImage = new Image()
backgroundImage.src = './img/background.png'

let player = new Player()
let platforms = [
    new Platform({x: -1, y: 470, image: platformImage}), 
    new Platform({x: platformImage.width - 3, y: 470, image: platformImage}),
    new Platform({x: platformImage.width * 2 + 100, y: 470, image: platformImage})
]
let GenericObjects = [
    new GenericObject({
        x: -1,
        y: -1,
        image: backgroundImage
    }),
    new GenericObject({
        x: -1,
        y: -1,
        image: hillsImage
    })
]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
let scrollOffset = 0

function init() {
    platformImage = new Image()
    platformImage.src = './img/platform.png'

    hillsImage = new Image()
    hillsImage.src = './img/hills.png'

    backgroundImage = new Image()
    backgroundImage.src = './img/background.png'

    player = new Player()
    platforms = [
        new Platform({x: -1, y: 470, image: platformImage}), 
        new Platform({x: platformImage.width - 3, y: 470, image: platformImage}),
        new Platform({x: platformImage.width * 2 + 100, y: 470, image: platformImage})
    ]
    GenericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: backgroundImage
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: hillsImage
        })
    ]
    scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    GenericObjects.forEach(GenericObject => {
        GenericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    if(keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed

            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            GenericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
        } else if (keys.left.pressed) {
            scrollOffset -= player.speed

            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            GenericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }
    }
    //platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })
    //win condition
    if (scrollOffset > 2000) {
        console.log('You win!')
    }

    //lose condition
    if (player.position.y > canvas.height)
    {
        init()
    }
}

animate()

addEventListener('keydown', ({keyCode}) => {
    switch(keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = true
            break
        case 87:
            console.log('up')
            player.velocity.y -= 10
            break
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = false
            break
        case 87:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})
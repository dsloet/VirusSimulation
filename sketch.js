let numPeople = 1500
let canvasWidth = 480;
let canvasHeight = 270;
let diameter = 1;
let peopleSize = 4;
let crowd = [];
// 0.2;
let recovery = 1000;
// counters
let startTime = 0; // this is the start of the counter
let countTime = [];
let countHealthyPeople = [];
let countSickPeople = [];
let countRecoverePeople = [];
var infectionProbability = 0.2;

function startGame() {
    myGameArea.stop();
    myGameArea.start();
    for (i = 0; i < numPeople; ++i) {
        crowd[i] = new People(peopleSize,
            peopleSize,
            "blue",
            Math.floor(Math.random() * canvasWidth),
            Math.floor(Math.random() * canvasHeight),
            i,
            crowd,
            1);
    }
    // make 1 person ill
    crowd[1].isInfected = 2;

}

function stopGame() {
    myGameArea.stop();
    myGameArea.clear();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[1]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        this.context.clearRect(0, 0, canvasWidth, canvasHeight)
    }
}


class People {
    constructor(width, height, color, x, y, id, oid, infected) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.diameter = diameter
        this.color = color;
        this.id = id;
        this.oid = oid;
        this.ctx = myGameArea.context;
        this.isInfected = infected
        this.recoverTime = recovery
        this.vx = (Math.random() * 2) - 1;
        this.vy = (Math.random() * 2) - 1;
        // this.infectionProbability = (document.getElementById("infectionProbability").value / 100);


    }
    display() {
        if (this.isInfected == 2) {
            this.color = "red"
            this.ctx.fillStyle = this.color;
        }
        if (this.isInfected == 1) {
            this.color = "blue"
            this.ctx.fillStyle = this.color;
        }
        if (this.isInfected == 3) {
            this.color = "yellow"
            this.ctx.fillStyle = this.color;
        }

        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        // this.x += (Math.random() > 0.5) ? 1 : -1;
        // this.y += (Math.random() > 0.5) ? 1 : -1;
        let ax = (Math.random() * 2) - 1;
        let ay = (Math.random() * 2) - 1;
        let limit = 2
        this.vx += ax;
        this.vy += ay;
        if (this.vx > limit) {
            this.vx = limit
        }
        if (this.vx < -limit) {
            this.vx = -limit
        }
        if (this.vy > limit) {
            this.vy = limit
        }
        if (this.vy < -limit) {
            this.vy = -limit
        }


        // keep them inside the box!
        if (this.y > canvasHeight) {
            // this.y = canvasHeight;
            this.vy *= -1;
        }
        if (this.y < 0) {
            // this.y = 0;
            this.vy *= -1;
        }

        if (this.x > canvasWidth) {
            // this.x = canvasWidth;
            this.vx *= -1;
        }
        if (this.x < 0) {
            // this.x = 0;
            this.vx *= -1;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    recover() {
        if (this.isInfected == 2) {
            if (this.recoverTime > 0) {
                this.recoverTime -= 1
            }
            else {
                this.isInfected = 3
            }

        }

    }

    collide() {
        for (let i = this.id + 1; i < numPeople; ++i) {
            let dx = this.oid[i].x - this.x;
            let dy = this.oid[i].y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let inMySpace = this.oid[i].diameter / 2 + this.diameter / 2;
            if (this.isInfected == 2) {
                if (distance < inMySpace) {
                    if (Math.random() < infectionProbability) {
                        this.oid[i].isInfected = 2;
                    }
                }
            }
            if (this.oid[i].isInfected == 2) {
                if (distance < inMySpace) {
                    if (Math.random() < infectionProbability) {
                        this.isInfected = 2;
                    }
                }
            }
        }
    }

    walk_to_center() {
        let prop = 0.1;
        this.prevX = this.x;
        this.prevY = this.y
        for (let i = this.id + 1; i < numPeople; ++i) {
            if (Math.random() < prop) {
                this.isAtCenter = 1;
                this.x = 150;
                this.y = 150;
            }
        }
    }

    walk_back_home() {
        if (this.isAtCenter == 1) {
            this.isAtCenter = 0;
            this.x = this.prevX;
            this.y = this.prevY;
        }
    }
}

function countInfected() {
    let infectionCounter = 0;
    for (person in crowd) {
        if (crowd[person].isInfected == 2) {
            infectionCounter += 1
        }
    }
    return (infectionCounter)
}

function countSuspectible() {
    let counter = 0;
    for (person in crowd) {
        if (crowd[person].isInfected == 1) {
            counter += 1
        }
    }
    return (counter)
}
function countRecoverd() {
    let counter = 0;
    for (person in crowd) {
        if (crowd[person].isInfected == 3) {
            counter += 1
        }
    }
    return (counter)
}

function timer() {

    countTime[startTime] = startTime;
    countHealthyPeople[startTime] = countSuspectible();
    countSickPeople[startTime] = countInfected();
    countRecoverePeople[startTime] = countRecoverd();
    startTime += 1;
    // console.log(startTime)
    return ([startTime, countHealthyPeople, countSickPeople, countRecoverePeople]);
}


// Slider Values functions:

function updateGameArea() {
    if (countInfected() == 0) {
        myGameArea.stop();
    }
    infectionCounter = 0
    myGameArea.clear();
    crowd.forEach(person => {
        // person.walk_to_center();
        person.collide();
        person.move();
        person.recover();
        // person.walk_back_home();
        person.display();
    });
    // counts = timer();
    console.log(countInfected())


    // infectionCounter = countInfected();
    // susCounter = countSuspectible();
    // healthyCounter = countRecoverd();

    // // console.log(infectionCounter)
    // document.getElementById("infections").innerHTML = infectionCounter
    // document.getElementById("Susceptible").innerHTML = susCounter
    // document.getElementById("recoved").innerHTML = healthyCounter

}
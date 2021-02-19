//green 1 , braun 2, blue(white) 3 , red 4
window.onload = function () {
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    }
}

function getRandom(oneHundred) {
//stolen from https://stackoverflow.com/questions/8877249/generate-random-integers-with-probabilities
    let weights = [oneHundred["green"] / 40, oneHundred["brown"] / 40, oneHundred["blue"] / 40, oneHundred["red"] / 40]; // probabilities
    let results = [1, 2, 3, 4]; // values to return

    let num = Math.random(),
        s = 0,
        lastIndex = weights.length - 1;

    for (let i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return results[i];
        }
    }

    return results[lastIndex];
}

function run() {
    let iterations = Number(document.getElementById("input").value)
    let output = [{green: 10, brown: 10, blue: 10, red: 10}]
    const rbs = document.querySelectorAll('input[name="simulation_type"]');
    let simulation_type;
    for (const rb of rbs) {
        if (rb.checked) {
            simulation_type = rb.value;
            break;
        }
    }
    for (let i = 0; i < iterations; i++) {
        let cubeRandom = Math.floor(Math.random() * 6) + 1;
        let this_iteration = Object.assign({}, output.last());

        let firstPick = getRandom(this_iteration);
        let secondPick = getRandom(this_iteration);

        //if simulation is kaefer
        if (simulation_type === "kaefer") {
            if ((cubeRandom === 1 || cubeRandom === 2) ||
                (cubeRandom === 3 && firstPick !== 1) ||
                (cubeRandom === 4 && firstPick !== 1 && firstPick !== 2) ||
                (cubeRandom === 5 && firstPick === 3)) {
                this_iteration[PickToColor(firstPick)]--;
                this_iteration[PickToColor(secondPick)]++;
            }
        } else if (simulation_type === "spinne") {
            if ((cubeRandom === 1 || cubeRandom === 2) ||
                (cubeRandom === 3 && firstPick !== 3) ||
                (cubeRandom === 4 && firstPick !== 3 && firstPick !== 1) ||
                (cubeRandom === 5 && firstPick === 4)) {
                this_iteration[PickToColor(firstPick)]--;
                this_iteration[PickToColor(secondPick)]++;
            }
        } else if (simulation_type === "schlange") {
            if ((cubeRandom === 1 || cubeRandom === 2) ||
                (cubeRandom === 3 && firstPick !== 2) ||
                (cubeRandom === 4 && firstPick !== 2 && firstPick !== 4) ||
                (cubeRandom === 5 && firstPick === 1)) {
                this_iteration[PickToColor(firstPick)]--;
                this_iteration[PickToColor(secondPick)]++;
            }
        } else if (simulation_type === "nachtfalter") {
            if ((cubeRandom === 1 || cubeRandom === 2) ||
                (cubeRandom === 3 && firstPick !== 4) ||
                (cubeRandom === 4 && firstPick !== 4 && firstPick !== 3) ||
                (cubeRandom === 5 && firstPick === 2)) {
                this_iteration[PickToColor(firstPick)]--;
                this_iteration[PickToColor(secondPick)]++;
            }
        } else if (simulation_type === "lurch") {
            if ((cubeRandom === 1 || cubeRandom === 2) ||
                (cubeRandom === 3 && firstPick !== 4) ||
                (cubeRandom === 4 && firstPick !== 4 && firstPick !== 3) ||
                (cubeRandom === 5 && firstPick === 2)) {
                this_iteration[PickToColor(firstPick)]--;
                this_iteration[PickToColor(secondPick)]++;
            }
        }
        output.push(this_iteration)
    }
    console.log(output.last()["green"] + output.last()["brown"] + output.last()["red"] + output.last()["blue"])

    showCanvas(output)
}

function PickToColor(number) {

    if (number === 1) {
        return "green"
    }
    if (number === 2) {
        return "brown"
    }
    if (number === 3) {
        return "blue"
    }
    if (number === 4) {
        return "red"
    }
}

function showCanvas(data) {
    let brown = []
    let green = []
    let red = []
    let blue = []

    for (let i = 0; i < data.length; i++) {
        brown.push(data[i]["brown"])
        red.push(data[i]["red"])
        blue.push(data[i]["blue"])
        green.push(data[i]["green"])
    }
    new Chartist.Line('.ct-chart', {
        labels: range(0, data.length),
        series: [red, brown, green, blue]
    }, {
        height: '600px',
        low: 0,
        fullWidth: true,
        scaleMinSpace: 20,
        showPoint: false,

        chartPadding: {
            bottom: 60
        },
        // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
        axisY: {
            onlyInteger: true,
        },
        axisX: {
            showLine: false,

            labelInterpolationFnc: function (value, index) {
                return index % 20 === 0 ? value : null;
            }

        }, plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Generationen',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 30
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Populationen',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: -10
                    },
                    textAnchor: 'middle',
                    flipTitle: false
                }
            }),
            Chartist.plugins.legend({
                legendNames: ['red', 'brown', 'green', 'blue'],
                position: 'top'
            })
        ]

    });
}

const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

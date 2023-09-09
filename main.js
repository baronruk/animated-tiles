'use strict';

const colors = [
    '#f1fa8c',
    '#6272a4',
    '#ff5555',
    '#8be9fd',
    '#bd93f9',
    '#50fa7b',
    '#ff79c6',
    '#ffb86c',
];
const staggerDelay = 70;
const tileSize = 65;

let alternateIndicator;
let animationSwitch = 0;
let backgroundColorCounter = 0;
let columns;
let indicators;
let isAlternateToggled = false;
let isOutlineToggled = false;
let outlineColorCounter = backgroundColorCounter + 1;
let outlineIndicator;
let rows;
let tileGrid;

function timelineChildren(timeline) {
    switch (animationSwitch) {
        case 1:
            timeline
                .add({
                    rotateZ: 45,
                })
                .add({
                    rotateZ: 0,
                });
            break;
        case 2:
            timeline
                .add({
                    translateX: anime.stagger(15, {
                        grid: [columns, rows],
                        from: 'center',
                        axis: 'x',
                    }),
                    translateY: anime.stagger(15, {
                        grid: [columns, rows],
                        from: 'center',
                        axis: 'y',
                    }),
                })
                .add({
                    translateX: 0,
                    translateY: 0,
                });
            break;
        case 3:
            timeline
                .add({
                    translateX: anime.stagger(15, {
                        grid: [columns, rows],
                        from: 'center',
                        axis: 'x',
                    }),
                    translateY: anime.stagger(15, {
                        grid: [columns, rows],
                        from: 'center',
                        axis: 'y',
                    }),
                    rotateZ: anime.stagger(anime.random(0, 45), {
                        grid: [columns, rows],
                        from: 'center',
                        axis: 'z',
                    }),
                })
                .add({
                    translateX: 0,
                    translateY: 0,
                    rotateZ: 0,
                });
    }
}

function getAlternateParams() {
    return isAlternateToggled
        ? {
              loop: 2,
              direction: 'alternate',
          }
        : null;
}

function getOutlineParams() {
    return isOutlineToggled
        ? {
              outlineColor: colors[outlineColorCounter % (colors.length - 1)],
          }
        : null;
}

function clickHandle(tileIndex) {
    let params = {
        targets: '.tile',
        backgroundColor: colors[backgroundColorCounter % (colors.length - 1)],
        ...getOutlineParams(),
        ...getAlternateParams(),
        delay: anime.stagger(staggerDelay, {
            grid: [columns, rows],
            from: tileIndex,
        }),
    };

    if (animationSwitch < 1) {
        anime(params);
    } else {
        timelineChildren(anime.timeline(params));
    }

    outlineColorCounter++;
    backgroundColorCounter++;
}

function createTile(tileIndex) {
    let tile = document.createElement('div');
    tile.classList.add('tile');

    if (isOutlineToggled) {
        tile.style.setProperty('--outline', '0.5px solid');
    }
    tile.addEventListener('click', () => {
        clickHandle(tileIndex);
    });
    return tile;
}

function populateTileGrid(tileAmount) {
    for (let tileIndex = 0; tileIndex < tileAmount; tileIndex++) {
        tileGrid.appendChild(createTile(tileIndex));
    }
}

function createTileGrid() {
    // remove old tiles
    while (tileGrid.firstChild) {
        tileGrid.removeChild(tileGrid.firstChild);
    }

    // calculate columns and rows
    columns = Math.floor(document.documentElement.clientWidth / tileSize);
    rows = Math.floor(document.documentElement.clientHeight / tileSize);

    // set grid columns and rows CSS properties
    anime.set(tileGrid, {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
    });

    populateTileGrid(columns * rows);
    console.log(`columns: ${columns} | rows: ${rows} | total tiles: ${columns * rows}`);
}

function keyBinding(event) {
    switch (event.code) {
        case 'KeyA':
            if (isAlternateToggled) {
                isAlternateToggled = false;
            } else {
                isAlternateToggled = true;
            }
            break;
        case 'KeyH':
            let helpDisplay = document.querySelector('#key-bindings');

            if (helpDisplay.classList.contains('hidden')) {
                helpDisplay.classList.remove('hidden');
            } else {
                helpDisplay.classList.add('hidden');
            }
            break;
        case 'KeyO':
            if (animationSwitch != 1) {
                if (isOutlineToggled) {
                    isOutlineToggled = false;
                } else {
                    isOutlineToggled = true;
                }
                createTileGrid();
            }
            break;
        case 'KeyR':
            window.location.reload();
    }
}

function setAnimationSwitch(event) {
    let key = event.key;
    if (key <= 3) {
        animationSwitch = parseInt(key);
        if (animationSwitch === 1) {
            isOutlineToggled = true;
        }
        createTileGrid();
    } else {
        alert('Please pick an animation from 0 to 3');
    }
}

function updateIndicatorsDisplay() {
    // update active animation indicator
    indicators.querySelector('#active-animation').innerText = animationSwitch;

    // update alternate animation indicator
    if (isAlternateToggled) {
        alternateIndicator.classList.remove('red');
        alternateIndicator.classList.add('green');
    } else {
        alternateIndicator.classList.remove('green');
        alternateIndicator.classList.add('red');
    }

    // update tile outline indicator
    if (isOutlineToggled) {
        outlineIndicator.classList.remove('red');
        outlineIndicator.classList.add('green');
    } else {
        outlineIndicator.classList.remove('green');
        outlineIndicator.classList.add('red');
    }
}

function keydownAction(event) {
    if (event.code.includes('Digit')) {
        setAnimationSwitch(event);
    } else {
        keyBinding(event);
    }

    updateIndicatorsDisplay();
}

function initTileGrid() {
    tileGrid = document.querySelector('#tile-grid');
    indicators = document.querySelector('#indicators');
    alternateIndicator = indicators.querySelector('#alternate-animation');
    outlineIndicator = indicators.querySelector('#tile-outline');

    // initial tile grid render
    createTileGrid();
    // initial indicator update
    updateIndicatorsDisplay();

    window.addEventListener('resize', createTileGrid);
    document.addEventListener(
        'keydown',
        event => {
            keydownAction(event);
        },
        {passive: false},
    );
}

window.addEventListener('load', initTileGrid);

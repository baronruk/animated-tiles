'use strict';

const tileSize = 65;
const staggerDelay = 70;
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

let tileGrid;
let columns;
let rows;
let backgroundColorCounter = 0;
let isOutlineToggled = false;
let outlineColorCounter = backgroundColorCounter + 1;
let isAlternateToggled = false;

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
    anime({
        targets: '.tile',
        backgroundColor: colors[backgroundColorCounter % (colors.length - 1)],
        ...getOutlineParams(),
        ...getAlternateParams(),
        delay: anime.stagger(staggerDelay, {
            grid: [columns, rows],
            from: tileIndex,
        }),
    });
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

function getKeydownAction(event) {
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
            if (isOutlineToggled) {
                isOutlineToggled = false;
            } else {
                isOutlineToggled = true;
            }
            createTileGrid();
            break;
        case 'KeyR':
            window.location.reload();
    }
}

function initTileGrid() {
    tileGrid = document.querySelector('#tile-grid');
    createTileGrid();

    window.addEventListener('resize', createTileGrid);
    document.addEventListener(
        'keydown',
        event => {
            getKeydownAction(event);
        },
        {passive: false},
    );
}

window.addEventListener('load', initTileGrid);

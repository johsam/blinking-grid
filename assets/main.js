/*eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]*/

$(function() {
    const frontCols = 90;
    const frontRows = 30;

    const backCols = 5;
    const backRows = 4;

    const minDelay = 100;
    const maxDelay = 1000;

    let angle = 0;

    const flipIt = () => {
        const g2r = a => (a * Math.PI) / 180.0;

        $('.wrapper').snabbt({
            rotation: [0, g2r(angle), 0],
            duration: 800,
            easing: 'easeOut',
            complete: () => {
                if (angle >= 360 || angle <= -360) {
                    angle %= 360;
                    $('.wrapper').snabbt({ rotation: [0, g2r(angle), 0], duration: 0 });
                }
            }
        });
    };

    const newGrid = (id, selector, cols, rows) => {
        const _id = id;
        const _grid = $(selector);

        _grid.css('grid-template-columns', `repeat(${cols}, auto)`);

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                _grid.append($(`<div id="${id}_${r}_${c}"/>`).addClass('cell'));
            }
        }

        return {
            grid: () => _grid,
            hiliteCell: () => {
                const r = Math.floor(rows * Math.random());
                const c = Math.floor(cols * Math.random());

                $(`#${_id}_${r}_${c}`)
                    .stop()
                    .css('opacity', 0.9)
                    .fadeTo('slow', 0.3);
            }
        };
    };

    const front = newGrid('front', '.frontGrid', frontCols, frontRows);
    const back = newGrid('back', '.backGrid', backCols, backRows);

    $('body').on('swipeleft', (event) => {
        angle += 180;
        flipIt();
        event.preventDefault();
    });

    $('body').on('swiperight', (event) => {
        angle -= 180;
        flipIt();
        event.preventDefault();
    });

    (function loop() {
        const rand = Math.round(Math.random() * (maxDelay - minDelay)) + minDelay;
        setTimeout(() => {
            front.hiliteCell();
            back.hiliteCell();
            loop();
        }, rand);
    }());
});

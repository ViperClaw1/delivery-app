main();

function main () {

    // const btnPlus = document.getElementById('plus');
    // const btnMinus = document.getElementById('minus');
    // const divNum = document.getElementById('number');

    let currNum = parseInt(divNum.innerText); // parseInt конветирует строку в число

    // btnPlus.onclick = function () {
    //     currNum++;
    //     divNum.innerText = currNum;
    // }

    // btnMinus.onclick = function () {
    //     if (currNum > 1) currNum--;
    //     divNum.innerText = currNum;
    // }

    document.
        getElementById('minus').
        addEventListener('click', () => {
        if (currNum > 1) currNum--;
        divNum.innerText = currNum;
    })

    document.
        getElementById('plus').
        addEventListener('click', () => {
        currNum++;
        divNum.innerText = currNum;
    })
}


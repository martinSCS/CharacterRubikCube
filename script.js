function createCubeArray(size) {
    let array = new Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            array[i][j] = new Array(size).fill(null);
        }
    }
    return array;
}

document.addEventListener('DOMContentLoaded', (event) => {
    const scene = document.querySelector('.scene');
    const cubeContainer = document.getElementById('cube-container');
    let rotateX = 0;
    let rotateY = 0;
    let isDragging = false;
    let startX, startY;

    let cubeArray = createCubeArray(3);

    // Function to create a cubie
    function createCubie(x, y, z, array=null) {
        const cubie = document.createElement('div');
        cubie.classList.add('cube');
        cubie.classList.add(`cube-x-${x}`);
        cubie.classList.add(`cube-y-${y}`);
        cubie.classList.add(`cube-z-${z}`);
        cubie.style.transform = `translate3d(${x * 100}px, ${y * 100}px, ${z * 100}px)`;

        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(face => {
            const faceDiv = document.createElement('div');
            faceDiv.classList.add('face', face);
            let backgroundPosition = '';
            switch (face) {
                case 'front':
                    backgroundPosition = `${(x) * -100}px ${(y) * -100}px`;
                    break;
                case 'back':
                    backgroundPosition = `${(2 - x) * -100}px ${(y) * -100}px`;
                    break;
                case 'right':
                    backgroundPosition = `${(2 - z) * -100}px ${(y) * -100}px`;
                    break;
                case 'left':
                    backgroundPosition = `${(z) * -100}px ${(y) * -100}px`;
                    break;
                case 'top':
                    backgroundPosition = `${(x) * -100}px ${(z) * -100}px`;
                    break;
                case 'bottom':
                    backgroundPosition = `${(x) * -100}px ${(2 - z) * -100}px`;
                    break;
            }

            faceDiv.style.backgroundPosition = backgroundPosition;
            cubie.appendChild(faceDiv);
            if (array !== null) {
                array[x][y][z] = faceDiv;
            }
        });

        return cubie;
    }

    console.log(cubeArray);

    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                cubeContainer.appendChild(createCubie(i, j, k, cubeArray));
            }
        }
    }

    document.addEventListener('mousedown', (event) => {
        if (event.button === 1) { // Middle mouse button
            isDragging = true;
            startX = event.clientX;
            startY = event.clientY;
            scene.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            rotateY += deltaX * 0.3;
            rotateX -= deltaY * 0.3;
            cubeContainer.style.transform = `translate3d(0, 0, +100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, 0, -100px)`;
            startX = event.clientX;
            startY = event.clientY;
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 1) {
            isDragging = false;
            scene.style.cursor = 'grab';
        }
    });
});

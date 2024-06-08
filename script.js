/**
 * @template T
 * @param {number} size
 * @param {()=>T} initializer
 * @returns {T[][][]}
 */
function createCubeArray(size, initializer = (x, y, z) => null) {
  let array = new Array(size)
  for (let i = 0; i < size; i++) {
    array[i] = new Array(size)
    for (let j = 0; j < size; j++) {
      array[i][j] = new Array(size)
      for (let k = 0; k < size; k++) {
        array[i][j][k] = initializer(i, j, k)
      }
    }
  }
  return array
}

class Block {
  /**
   * @type {{x:number,y:number,z:number}}
   */
  position
  /**
   * @type {{x:number,y:number,z:number}}
   */
  rotateAngle
  /**
   * @type {HTMLDivElement}
   */
  div

  constructor(x, y, z) {
    this.position = { x: x, y: y, z: z }
    this.rotateAngle = { x: 0, y: 0, z: 0 }
    this.div = this.element()
  }
  /**
   * @type {number} direction
   */
  rotate(direction) {
    if (direction == 0) {
      this.rotateAngle.y -= 90 // 左
    } else if (direction == 1) {
      this.rotateAngle.y += 90 // 右
    } else if (direction == 2) {
      this.rotateAngle.x -= 90 // 上
    } else if (direction == 3) {
      this.rotateAngle.x += 90 // 下
    }
    let { x, y, z } = this.position
    // if (x == 1 && y == 1 && z == 2) {
    //   this.div.style.transform = `translate3d(${x * 100}px, ${y * 100}px, ${z * 200}px) rotateX(${
    //     this.rotateAngle.x
    //   }deg) rotateY(${this.rotateAngle.y}deg) rotateZ(${this.rotateAngle.z}deg)`
    // } else {
    this.div.style.transform = `translate3d(${x * 100}px, ${y * 100}px, ${z * 100}px) rotateX(${
      this.rotateAngle.x
    }deg) rotateY(${this.rotateAngle.y}deg) rotateZ(${this.rotateAngle.z}deg)`
    // }
  }

  /**
   * @returns {HTMLDivElement}
   */
  element() {
    const cube = document.createElement("div")
    let { x, y, z } = this.position
    cube.classList.add("cube")
    cube.classList.add(`cube-x-${x}`)
    cube.classList.add(`cube-y-${y}`)
    cube.classList.add(`cube-z-${z}`)
    cube.style.transform = `translate3d(${x * 100}px, ${y * 100}px, ${z * 100}px)`

    const faces = ["front", "back", "right", "left", "top", "bottom"]
    faces.forEach((face) => {
      const faceDiv = document.createElement("div")
      faceDiv.classList.add("face", face)
      let backgroundPosition = ""
      switch (face) {
        case "front":
          backgroundPosition = `${x * -100}px ${y * -100}px`
          break
        case "back":
          backgroundPosition = `${(2 - x) * -100}px ${y * -100}px`
          break
        case "right":
          backgroundPosition = `${(2 - z) * -100}px ${y * -100}px`
          break
        case "left":
          backgroundPosition = `${z * -100}px ${y * -100}px`
          break
        case "top":
          backgroundPosition = `${x * -100}px ${z * -100}px`
          break
        case "bottom":
          backgroundPosition = `${x * -100}px ${(2 - z) * -100}px`
          break
      }

      faceDiv.style.backgroundPosition = backgroundPosition
      cube.appendChild(faceDiv)
    })

    return cube
  }
}
/**
 * @param {Block[][][]} blocks
 */
function render(blocks) {
  const cubeContainer = document.getElementById("cube-container")
  blocks.forEach((a) => {
    a.forEach((b) => {
      b.forEach((block) => {
        try {
          document.removeChild(block.div)
        } catch {}
        cubeContainer.appendChild(block.div)
      })
    })
  })
}

document.addEventListener("DOMContentLoaded", (event) => {
  const scene = document.querySelector(".scene")
  const cubeContainer = document.getElementById("cube-container")
  let rotateX = 0
  let rotateY = 0
  let isDragging = false
  let startX, startY

  var blocks = createCubeArray(3, (x, y, z) => {
    return new Block(x, y, z)
  })

  render(blocks)

  function rotate() {
    blocks = rotateSecondLayer(blocks)
  }

  // gpt 写的 好像有点问题
  function rotateSecondLayer(matrix) {
    // 获取第二层的二维数组
    let layer = matrix[1]

    // 获取二维数组的大小
    const n = layer.length
    const m = layer[0].length

    // 创建一个新的二维数组来存储旋转后的第二层
    let rotatedLayer = new Array(m).fill(0).map(() => new Array(n).fill(0))

    // 进行顺时针旋转90度操作
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        layer[i][j].rotate(2)
        rotatedLayer[j][n - 1 - i] = layer[i][j]
      }
    }

    // 将旋转后的第二层放入新矩阵中
    matrix[1] = rotatedLayer
    return matrix
  }

  document.addEventListener("mousedown", (event) => {
    rotate()
    render(blocks)
  })

  document.addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      // Middle mouse button
      isDragging = true
      startX = event.clientX
      startY = event.clientY
      scene.style.cursor = "grabbing"
    }
  })

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY
      rotateY += deltaX * 0.3
      rotateX -= deltaY * 0.3
      cubeContainer.style.transform = `translate3d(0, 0, +100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, 0, -100px)`
      startX = event.clientX
      startY = event.clientY
    }
  })

  document.addEventListener("mouseup", (event) => {
    if (event.button === 1) {
      isDragging = false
      scene.style.cursor = "grab"
    }
  })
})

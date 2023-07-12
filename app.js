const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
// getContext()method會回傳一個canvas的drawing context
// drawing context可以在canvas內畫圖
// 由於要畫的是2d的圖，所以method內放2d
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0; // 優化新增
// min, max
// 假設100,500
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// 製作所有的brick
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}
// 追蹤滑鼠事件再canvas內 (好處是離開canvas tag的範圍不會追蹤滑鼠)
c.addEventListener("mousemove", (e) => {
  // 要讓地板移動追蹤clientX改變 ground_x
  ground_x = e.clientX;
});

function drawCircle() {
  // 確認球是否有打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++; // 優化新增
      console.log(count);
      brick.visible = false;
      // 改變x,y方向的速度，並將brick 從brickArray中移除
      //   從下方or 上方重擊改變速度與方向
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      }
      // 從左方or 右方撞擊
      else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      //   brickArray.splice(index, 1); // O(n) 由於時間花費太久 嘗試做優化
      //   if (brickArray.length == 0) {
      //     alert("遊戲結束");
      //     clearInterval(game);
      //   }
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });
  // 確認球是否碰到橘色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }

  if (circle_x >= canvasWidth - radius) {
    // 確認球有沒有碰到邊界
    // 撞到右邊邊界
    xSpeed *= -1;
  }
  // 撞到左邊邊界
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  // 撞到上面邊界
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  // 撞到下面邊界
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  // 更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  // x,y 傳統螢幕認知上的左上角座標
  // fillRect(x,y,width,height)
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  // 畫出圓球
  ctx.beginPath();
  // x,y圓心座標，radius半徑，startaugle 初始角度，endaugle結束角度
  // arc(x,y,radius,startAugle,endaugle)
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "yellow";
  ctx.stroke();
  ctx.fill();
}

let game = setInterval(drawCircle, 25);

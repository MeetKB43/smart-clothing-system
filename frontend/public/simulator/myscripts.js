/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
let strLink = 'http://localhost:4000';
let { body } = document;
// const axios = require('axios');

body.style.zoom = '80%';
let playArea = document.createElement('div');
let playAreaLeft = 0;
let playAreaTop = 0;
playArea.style.width = `${2000}px`;
playArea.style.height = `${2000}px`;
// playArea.style.background = "#ECEFEE";
playArea.style.color = 'white';
playArea.style.position = 'absolute';
playArea.style.left = `${playAreaLeft}px`;
playArea.style.top = `${playAreaTop}px`;
body.appendChild(playArea);

let wardrobe = document.createElement('div');
wardrobe.style.backgroundImage = 'url("./images/wardrobe0.jpeg")';
wardrobe.style.backgroundRepeat = 'no-repeat';
wardrobe.style.top = '20px';
wardrobe.style.left = '20px';
wardrobe.style.width = '700px';
wardrobe.style.height = '700px';
wardrobe.style.backgroundSize = 'contain';
wardrobe.style.display = 'inline-flex';
wardrobe.style.clipPath = 'inset(40px 49px 18% 80px)';

let Reader = document.createElement('div');
Reader.style.backgroundImage = 'url("./images/Reader.jpg")';
Reader.style.backgroundRepeat = 'no-repeat';
Reader.style.display = 'inline-flex';
Reader.style.position = 'absolute';
Reader.style.top = '80px';
Reader.style.left = '680px';
Reader.style.width = '150px';
Reader.style.height = '150px';
Reader.style.backgroundSize = 'contain';
Reader.style.clipPath = 'inset(10px 35px 10px 37px)';

let Iframe = document.createElement('iframe');
Iframe.setAttribute('src', strLink);
// window.location.replace(url);
Iframe.setAttribute('name', 'webApp');
Iframe.style.top = '80px';
Iframe.style.position = 'absolute';

Iframe.style.top = '42px';
Iframe.style.left = '85px';
Iframe.style.width = '830px';
Iframe.style.height = '650px';

let display = document.createElement('div');
display.style.backgroundImage = 'url("./images/tablet0.png")';
display.style.backgroundRepeat = 'no-repeat';
display.style.display = 'inline-flex';
display.style.position = 'absolute';
display.style.top = '30px';
display.style.left = '850px';
display.style.width = '1010px';
display.style.height = '1010px';
display.style.backgroundSize = 'contain';
display.style.display = 'inline-flex';
display.style.clipPath = 'inset(px 10px 10px 10px)';
display.appendChild(Iframe);

playArea.appendChild(wardrobe);
playArea.appendChild(Reader);
playArea.appendChild(display);
playArea.addEventListener('mousedown', onMouseDown);
playArea.addEventListener('mousemove', onMouseMove);
playArea.addEventListener('mouseup', onMouseUp);
let currentEle;

const Position = {
  IsOut: 0,
  ScannedGoingIn: 1,
  ScannedGoingOut: 2,
  IsIn: 3,
};
let currX = 0;
let currY = 0;
function onMouseDown(e) {
  let x = e.clientX * window.devicePixelRatio - playAreaLeft;
  let y = e.clientY * window.devicePixelRatio - playAreaTop;

  currX = e.clientX * window.devicePixelRatio;
  currY = e.clientY * window.devicePixelRatio;

  for (let i = 0; i < lstObj.length; i++) {
    let eleX = lstObj[i].ele.offsetLeft;
    let eleY = lstObj[i].ele.offsetTop;
    let eleWidth = lstObj[i].ele.offsetWidth;
    let eleHeight = lstObj[i].ele.offsetHeight;

    if (eleX <= x && x <= eleX + eleWidth && eleY <= y && y <= eleY + eleHeight) {
      currentEle = lstObj[i];
      currentEle.prevX = lstObj[i].ele.offsetLeft;
      currentEle.prevY = lstObj[i].ele.offsetTop;
      break;
    }
  }

  // Select Element
}

const sendRequest = async (rfid) => {
  const data = { RFID: rfid, deviceID: 'd520c7a8-421b-4563-b955-f5abc56b97ec' };
  const options = {
    url: `http://localhost:8000/cloth_scanned`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
    data: data || {},
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    return '';
  }
};
// moving the element
function onMouseMove(e) {
  if (currentEle == null) return;

  let difX = e.clientX * window.devicePixelRatio - currX;
  let difY = e.clientY * window.devicePixelRatio - currY;

  currX = e.clientX * window.devicePixelRatio;
  currY = e.clientY * window.devicePixelRatio;

  let newLeft = currentEle.ele.offsetLeft + difX;
  let newTop = currentEle.ele.offsetTop + difY;

  currentEle.ele.style.left = `${newLeft}px`;
  currentEle.ele.style.top = `${newTop}px`;

  let readerRect = Reader.getClientRects()[0];
  if (
    e.clientX * window.devicePixelRatio > readerRect.x &&
    e.clientX * window.devicePixelRatio < readerRect.x + readerRect.width &&
    e.clientY * window.devicePixelRatio > readerRect.y &&
    e.clientY * window.devicePixelRatio < readerRect.y + readerRect.height
  ) {
    if (currentEle.position == Position.IsOut) {
      currentEle.ele.style.backgroundImage = `url("./images/${currentEle.urlF}")`;
      currentEle.ele.style.width = `${60}px`;
      currentEle.ele.style.height = `${20}px`;
      currentEle.ele.style.backgroundSize = '100% 100%';
      currentEle.position = Position.ScannedGoingIn;
      sendRequest(currentEle.rfid);
    }

    if (currentEle.position == Position.IsIn) {
      currentEle.ele.style.backgroundImage = `url("./images/${currentEle.url}")`;
      currentEle.ele.style.width = `${currentEle.width}px`;
      currentEle.ele.style.height = `${currentEle.height}px`;
      currentEle.ele.style.backgroundSize = 'contain';
      currentEle.position = Position.ScannedGoingOut;
      sendRequest(currentEle.rfid);
    }
  }

  e.preventDefault();
  // e.stopPropagation();
}

// element drop at location
function onMouseUp(e) {
  if (currentEle == null) return;

  let difX = e.clientX * window.devicePixelRatio - currX;
  let difY = e.clientY * window.devicePixelRatio - currY;

  currX = e.clientX * window.devicePixelRatio;
  currY = e.clientY * window.devicePixelRatio;

  let newLeft = currentEle.ele.offsetLeft + difX;
  let newTop = currentEle.ele.offsetTop + difY;
  if (newLeft < 700 && newTop < 700) {
    // dropinig cloth in
    if (currentEle.position == Position.ScannedGoingIn || currentEle.position == Position.IsIn) {
      currentEle.ele.style.left = `${newLeft}px`;
      currentEle.ele.style.top = `${newTop}px`;
      currentEle.position = Position.IsIn;
    } else if (currentEle.position == Position.IsOut) {
      currentEle.ele.style.left = currentEle.prevX;
      currentEle.ele.style.top = currentEle.prevY;
    } else if (currentEle.position == Position.ScannedGoingOut) {
      // put cloth out of the wardrobe and change state to Position out
      currentEle.position = Position.IsOut;
      currentEle.ele.style.backgroundImage = `url("./images/${currentEle.url}")`;
      currentEle.ele.style.width = `${currentEle.width}px`;
      currentEle.ele.style.height = `${currentEle.height}px`;
      currentEle.ele.style.left = `${900}px`;
      currentEle.ele.style.top = `${500}px`;
    }
  } // drpoing cloth out of wardrobe
  else if (
    currentEle.position == Position.ScannedGoingOut ||
    currentEle.position == Position.IsOut
  ) {
    currentEle.ele.style.left = `${newLeft}px`;
    currentEle.ele.style.top = `${newTop}px`;
    currentEle.position = Position.IsOut;
  } else if (currentEle.position == Position.IsIn) {
    currentEle.ele.style.left = currentEle.prevX;
    currentEle.ele.style.top = currentEle.prevY;
  } else if (currentEle.position == Position.ScannedGoingIn) {
    // put cloth in the wardrobe and change state to Position IN
    currentEle.position = Position.IsIn;
    currentEle.ele.style.backgroundImage = `url("./images/${currentEle.urlF}")`;
    currentEle.ele.style.width = `${60}px`;
    currentEle.ele.style.height = `${20}px`;
    currentEle.ele.style.left = `${200}px`;
    currentEle.ele.style.top = `${100}px`;
  }
  currentEle = null;
}

let arrDraggabaleObjects = [];
let lstObj = [];
lstObj.push(
  CreateClothObject(
    'Tshirt0',
    'Tshirt0.jpeg',
    'Tshirt0F.png',
    100,
    200,
    'tShirt',
    1,
    Position.IsOut,
    10
  )
);
lstObj.push(
  CreateClothObject(
    'Tshirt1',
    'Tshirt1.jpeg',
    'Tshirt1F.png',
    100,
    200,
    'tShirt',
    1,
    Position.IsOut,
    11
  )
);
lstObj.push(
  CreateClothObject(
    'Tshirt2',
    'Tshirt2.jpeg',
    'Tshirt2F.png',
    100,
    200,
    'tShirt',
    1,
    Position.IsOut,
    12
  )
);
lstObj.push(
  CreateClothObject('jeans', 'jeans.webp', 'jeansF.webp', 100, 200, 'jeans', 1, Position.IsOut, 6)
);

lstObj.push(
  CreateClothObject('boxer', 'boxer.jpg', 'boxerF.jpg', 100, 200, 'boxer', 1, Position.IsOut, 8)
);

lstObj.push(
  CreateClothObject(
    'shorts',
    'shorts.webp',
    'shortsF.jpg',
    100,
    200,
    'shorts',
    1,
    Position.IsOut,
    9
  )
);
// create objects from data array
for (let i = 0; i < lstObj.length; i++) {
  let ele;

  ele = document.createElement('div');
  ele.style.backgroundImage = `url("./images/${lstObj[i].url}")`;
  ele.style.backgroundRepeat = 'no-repeat';
  ele.style.backgroundSize = 'contain';

  ele.style.id = `${i}`;
  ele.style.position = 'absolute';
  ele.style.display = 'inline-block';
  ele.style.width = `${lstObj[i].width}px`;
  ele.style.height = `${lstObj[i].height}px`;
  ele.style.left = `${400 + i * 100}px`;
  ele.style.top = `${750}px`;

  lstObj[i].ele = ele;
  lstObj[i].id = i;

  playArea.appendChild(ele);
}

function CreateClothObject(name, url, urlF, width, height, type, count, position, rfid) {
  data = {};
  data.name = name;
  data.url = url;
  data.urlF = urlF;
  data.width = width;
  data.height = height;
  data.type = type;
  data.count = count;
  data.position = position;
  data.rfid = rfid;

  return data;
}

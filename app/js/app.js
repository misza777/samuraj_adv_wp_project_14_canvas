
import '../sass/index.scss';
import Sky from './Sky.js';

// pobieramy i wrzucamy do obiektu
const sky = new Sky(document.querySelector('canvas'));
// console.log(document.querySelector('canvas'));

sky.run();









// // lokalizujemy element canvas
// const canvas = document.querySelector('#canvas');

// // okreslamy kontekst dwuwymiarowy
// const ctx = canvas.getContext('2d');
// ctx.fillStyle = '#F00';
// ctx.fillRect(0,0,100,50);

// ctx.beginPath();
// ctx.lineWidth = 3;
// ctx.strokeStyle = '#00FF00'
// ctx.moveTo(50, 50);
// ctx.lineTo(100,100);
// ctx.lineTo(200,150);
// //zamkniecie lini do punku poczatkowego
// ctx.closePath();
// // wywolanie linii
// ctx.stroke();
export default class Sky {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // this.stars
        //informacja kiedy zostala stworzona ostatnia konstelacja
        this.lastConstellation = 0;
        this.nextConstellation = Math.random() * 3000;
        // poniewaz odwolujemy sie do obiektu ktory nie istnieje to inicjujemy obiekt
        this.constellation = {
            stars:[],
            isClosed: false,
            width: null,
        }
        //delta
        this.lastUpdate = 0;
    }
    
    initCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0,0,this.width, this.height);
    }
    
    generateStars = (count) => {
        let stars = [];

        for (var i = 0; i < count; i++) {
            // rozmiar radius od 2 do 5
            // Math.floor(Math.random() * (max - min) ) + min;
            const radius = Math.random() * 3 + 2; 
            // console.log(radius);

           stars.push({
                //max wartosc this.window
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: radius,
                color: '#fff',
                speed: Math.random() + 0.25,
                originalRadius: radius,
                })
                // console.log(stars.y);
            
        }
        this.stars = stars; 
        // console.log(stars);
    }

    drawStars = ()=> {
        this.stars.forEach(star => {
            this.drawStar(star);      
        })
    }

    // update gwiazd potrzebny do ich animacji i przemieszczania
    updateStars() {
        this.stars.forEach(star => {
            //dalta ma ok 16 ms
            star.x += star.speed * (this.delta / 16);
            // warunek nie pozwala uciec gwiazdom z ekranu:)
            //margines to srednica gwiazdy =2*star.radius

            //ruch kulisty ziemi = lekko po luku
            //do polowy ekranu gwiazda porusza si edo gor a po polowie w dol!:)
            //podzielone bo ma isc wolniej
            star.y -= star.speed * (this.delta / 16) * ((this.width/2 - star.x)) / 1500;
            //miogotanie gwiazdy
            star.radius = star.originalRadius * (Math.random() /4 +0.9);


            if(star.x > this.width + 2 * star.radius) {
               //ma dopiero wjechac na ekran dlatego -(srednica)
                star.x = -2 * star.radius;
            }
        })
    }

    //rysujemy wybrana losowo konstelacje
    generateRandomConstellation= () => {
        // srodek ekranu * losowa liczba od 0.5 do .99
        //x,y - srodek okregu
        //this.width - this.width/2 - wartosci dodatnie i ujemne
        const x = (this.width /2) + Math.random() * 0.8 * this.width - this.width/2;
        const y = (this.height /2) + Math.random() * 0.8 * this.height - this.height/2;
        const radius = (this.height /2) * Math.random() * 0.5 + 0.5;

        this.constellation = {
            stars: this.stars.filter( star => {
             return star.x > x - radius
                && star.x < x + radius
                && star.y > y - radius
                && star.y < y + radius
            }).slice(0, Math.round(Math.random() * 7 + 3)),
            //przyjmuje wartosci true/flase
            isClosed: Math.random() > 0.5, 
            width: 5,
        }
    }

    // korekta grubosci kosnstelacji - efekt cieniowania
    updateConstellation = () => {
        if(this.constellation.width > 0) {
            this.constellation.width -= 0.05 * (this.delta / 16);
            //jesli spadnie do zera to zero
        } else this.constellation.width = 0;
    }

    drawConstellation = () => {
        const {stars, isClosed, width} = this.constellation;
        const starsCount = stars.length;

        //zabezpieczenie coby nie wychodzic poza ekran
        // if(!starsCount) return false;

        //zabezpieczenie jesli sa min 2 gwiazdy
        if(starsCount > 2) {

        const firstStar = stars[0];
        // const lastStar = stars[starsCount-1];

        //rysowanie
        this.ctx.beginPath();
        //pierwsze polaczenie, przesuniecie do pozycji pierwszej gwiazdy 
        this.ctx.moveTo(firstStar.x, firstStar.y);
        this.ctx.lineTo(stars[1].x, stars[1].y);
        
        // starsCount-1 zeby nie wyskoczyc poza zakres
        for (let i = 1; i < starsCount-1; i++) {
            const nextStar = stars[i + 1];
            this.ctx.lineTo(nextStar.x, nextStar.y);
        }
        //rysowanie ostatniej kreski do ostatniej gwiazdy
        if(isClosed) {
            this.ctx.lineTo(firstStar.x, firstStar.y);
        }

        this.ctx.strokeStyle = '#71FF33';
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    } 
    }


    //robimy winiete
    drawOverlayer() {
        //srodek poczatek
        let gradient = this.ctx.createRadialGradient(this.width/2, this.height/2, 250,this.width/2, this.height/2, this.width/2);
        //kolory
        gradient.addColorStop(0,`rgba(0,0,0,0)`);
        gradient.addColorStop(1,`rgba(0,0,0,.75)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0,0,this.width, this.height);
    }

    // trzeba wyczyscic canvasa
    clearCanvas = ()=> {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0,0,this.width, this.height);
    }

    drawStar(star) {
        //zapisanie stanu canvasa
        this.ctx.save();
        this.ctx.fillStyle = star.color;

        this.ctx.beginPath();
        //poczatek animacji w miejscu lokalizacji gwiazdy z obiektu
        this.ctx.translate(star.x,star.y);
        //przesyniecie piora
        this.ctx.moveTo(0,0 - star.radius);
        //tworzenie ramion gwiazdy *5 i tworzymy petle
        for(let i=0; i<5; i++) {
            //wspolczynnik przeksztalcajacy stopnie * ilosc stopni :)
            this.ctx.rotate((Math.PI /180) * 36);
            //rysujemy linie
            this.ctx.lineTo(0,0-star.radius * 0.45);
            this.ctx.rotate((Math.PI /180) * 36);
            this.ctx.lineTo(0,0-star.radius);
        }

        //wypelnienie gwiazdy
        this.ctx.fill();
        //przywrocenie stanu poczatkowego
        this.ctx.restore();
    }


    //czyszczenie canvasa, animowanie gwiazd
    draw(now) {
        //uplynnianie animacji
        this.delta = now - this.lastUpdate;
        // if(this.delta < 16 || this.delta > 16) console.log(this.delta);

        
        // console.log(now);
        
        this.clearCanvas();
        this.drawStars();
        this.updateStars();

        this.drawConstellation();
        this.updateConstellation();
        //metoda ostatnia winieta
        this.drawOverlayer();
        //czas tworzenia konstelacji
        if(now - this.lastConstellation > this.nextConstellation) {
            this.lastConstellation = now;
            // minimum 1sek
            this.nextConstellation = Math.random() * 1500 + 2000;
            this.generateRandomConstellation();
        }

        this.lastUpdate = now;
        // klatka 60 klatek na sekunde - funkcja odswiezania animacji!!!!
        //dajemy funkcje strzalkowa poniewaz chcemy zachowac nasz scope!
        //inaczej this jest pojebany
        //now - parametr time-stamp - czas w milisekundach
        window.requestAnimationFrame((now) => this.draw(now));
    }


    run() {
        this.initCanvas();
        this.generateStars(1000);
        //beacuse of time stamp
        // this.generatRandomConstellation();

        // pierwszy raz musi byc wywolana recznie
        //przekazujemy wartosc now=0 zeby sie dorze wyliczyla delta 
        this.draw(0);
        // this.drawStar(
            // {
            //         x: 100,
            //         y:100,
            //         color: '#fff',
            //         radius: 100
            // })
    }
}
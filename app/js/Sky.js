export default class Sky {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.stars
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
            // rozmiar radius od 2 do 5???
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
            star.x += star.speed;
            // warunek nie pozwala uciec gwiazdom z ekranu:)
            //margines to srednica gwiazdy =2*star.radius

            //ruch kulisty ziemi = lekko po luku
            //do polowy ekranu gwiazda porusza si edo gor a po polowie w dol!:)
            //podzielone bo ma isc wolniej
            star.y -= star.speed * ((this.width/2 - star.x)) / 1500;
            //miogotanie gwiazdy
            star.radius = star.originalRadius * (Math.random() /4 +0.9);


            if(star.x > this.width + 2 * star.radius) {
               //ma dopiero wjechac na ekran dlatego -(srednica)
                star.x = -2 * star.radius;
            }
        })
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
    draw() {
        this.clearCanvas();
        this.drawStars();
        this.updateStars();
        //metoda ostatnia winieta
        this.drawOverlayer();

        // klatka 60 klatek na sekunde - funkcja odswiezania animacji!!!!
        //dajemy funkcje strzalkowa poniewaz chcemy zachowac nasz scope!
        //inaczej this jest pojebany
        window.requestAnimationFrame(() => this.draw());
    }


    run() {
        this.initCanvas();
        this.generateStars(1000);
        // pierwszy raz musi byc wywolana recznie
        this.draw();
        // this.drawStar(
            // {
            //         x: 100,
            //         y:100,
            //         color: '#fff',
            //         radius: 100
            // })
    }
}
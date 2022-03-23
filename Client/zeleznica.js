import { Voz } from "./voz.js";
import { Stanica } from "./stanica.js";
import { Ruta } from "./ruta.js";
import { VozUStanici } from "./vozustanici.js";

export class Zeleznica {
    constructor(listaVozova, listaStanica, listaRuta, listaVUS) {
        this.listaStanica = listaStanica;
        this.listaVozova = listaVozova;
        this.listaRuta = listaRuta;
        this.listaVUS = listaVUS;
        this.kontejner = null;
        this.levidesni = {
            levi: 0,
            desni: 0
        };
    }

    crtaj(host) {
        let headerNavigation = document.createElement("header");
        headerNavigation.className = "Navigation";
        host.appendChild(headerNavigation);

        let divPocetna = document.createElement("div");
        divPocetna.innerHTML = "Pocetna strana"
        headerNavigation.appendChild(divPocetna);
        let divVozovi = document.createElement("div");
        divVozovi.innerHTML = "Vozovi"
        headerNavigation.appendChild(divVozovi);
        let divStanice = document.createElement("div");
        divStanice.innerHTML = "Stanice"
        headerNavigation.appendChild(divStanice);
        let divRute = document.createElement("div");
        divRute.innerHTML = "Rute"
        headerNavigation.appendChild(divRute);

        let title = document.createElement("title");
        title.innerHTML = "Železnice Srbije"
        host.appendChild(title)


        this.kontejner = document.createElement("div");
        this.kontejner.className = "GlavniKontejner";
        host.appendChild(this.kontejner);

        divVozovi.onclick = () => this.crtajVozove(this.kontejner);
        divStanice.onclick = () => this.crtajStanice(this.kontejner);
        divRute.onclick=()=>this.crtajRute(this.kontejner);
        divPocetna.onclick = () => this.PocetnaStrana(this.kontejner);

        this.PocetnaStrana(this.kontejner);
    }

    //#region Pocetna strana

    PocetnaStrana(host) {
        var child = host.lastElementChild;
        while (child) {
            host.removeChild(child);
            child = host.lastElementChild;
        }

        let divPocetna = document.createElement("div");
        divPocetna.className = "Pocetna"
        host.appendChild(divPocetna);

        let stanica = document.createElement("div");
        divPocetna.appendChild(stanica);
        stanica.className = "PolaznaStanicaDIV"
        let label = document.createElement("label")
        label.innerHTML = "Polazna stanica"
        label.className = "Naslovi"
        stanica.appendChild(label);
        let divTabela = document.createElement("div");
        stanica.appendChild(divTabela);

        let btn = document.createElement("button");
        btn.innerHTML = "IZABERI"
        btn.onclick = () => this.Proba();
        divPocetna.appendChild(btn);


        let stanica2 = document.createElement("div");
        divPocetna.appendChild(stanica2);
        stanica2.className = "KrajnjaStanicaDIV"
        label = document.createElement("label")
        label.innerHTML = "Krajnja stanica"
        label.className = "Naslovi"
        stanica2.appendChild(label);
        let divTabela2 = document.createElement("div");
        stanica2.appendChild(divTabela2);

        this.crtajIzborStanica(divTabela);
        this.crtajIzborStanica(divTabela2);

    }

    crtajIzborStanica(host) {
        var child = host.lastElementChild;
        while (child) {
            host.removeChild(child);
            child = host.lastElementChild;
        }

        let prikazStanice = document.createElement("div");
        prikazStanice.className = "prikazStanice";
        host.appendChild(prikazStanice);

        var table = document.createElement("table");
        table.className = "Tabela"
        prikazStanice.appendChild(table);

        var thead = document.createElement("thead");
        table.appendChild(thead);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        var tbody = document.createElement("tbody");
        tbody.className = "StanicePodaci";
        table.appendChild(tbody);

        let th;
        var zag = ["Naziv stanice", "Godina izgradnje"]
        zag.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })
        this.ucitajStanice(tbody);

    }

    Proba() {
        alert("TEST")
    }
    //#endregion

    //#region Voz
    crtajVozove(host) {
        var child = host.lastElementChild;
        while (child) {
            host.removeChild(child);
            child = host.lastElementChild;
        }

        let prikazVozovi = document.createElement("div");
        prikazVozovi.className = "prikazVozovi";
        host.appendChild(prikazVozovi);

        var table = document.createElement("table");
        table.className = "Tabela"
        prikazVozovi.appendChild(table);

        var thead = document.createElement("thead");
        table.appendChild(thead);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        var tbody = document.createElement("tbody");
        tbody.className = "VozoviPodaci";
        table.appendChild(tbody);

        let th;
        var zag = ["Naziv voza", "Kapacitet", "Broj putnika"]
        zag.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })

        var divOptions = document.createElement("div");
        divOptions.className = "VozoviOptions"
        prikazVozovi.appendChild(divOptions);

        this.crtajUnosVozova(divOptions);
        this.ucitajVozove(tbody);

        var div = document.createElement("div");
        divOptions.appendChild(div)
        var del = document.createElement("button");
        del.innerHTML = "OBRIŠI";
        div.appendChild(del);
        del.onclick = () => this.BrisiVozove();

        var edit = document.createElement("button");
        edit.innerHTML = "IZMENI";
        div.appendChild(edit);
        edit.onclick = () => this.IzmenaVoza();
    }

    BrisiVozove() {
        var tableObject = document.body.getElementsByClassName('VozoviRedSelected');
        var count = document.body.querySelectorAll(".VozoviRedSelected").length;
        for (var i = 0; i < count; i++) {
            fetch("https://localhost:5001/Voz/IzbrisatiVoz/" + tableObject[i].value,
                {
                    method: "DELETE"
                }).then(s => {
                    this.ucitajVozove(this.obrisiPrethodniSadrzajVoz());
                })
        }
    }

    IzmenaVoza() {
        var tableObject = document.body.getElementsByClassName('VozoviRedSelected');
        if (tableObject.length != 0) {
            let list = [];
            fetch("https://localhost:5001/Voz/PreuzmiVoz")
                .then(p => {
                    p.json().then(vozovi => {
                        vozovi.forEach(el => {
                            var v = new Voz(el.id, el.naziv, el.kapacitet, el.broj_Putnika,el.rutaID);
                            list.push(v);
                        });
                        this.listaVozova = list;
                        const pom = this.listaVozova[this.listaVozova.findIndex(p => p.ID === tableObject[0].value)]
                        this.crtajIzmenuVoza(pom)
                    });
                })
        }
    }

    crtajIzmenuVoza(pom) {
        let input = document.createElement("input")
        //console.log(document.body.querySelectorAll(".EditVozova").length)   
        if (document.body.querySelectorAll(".EditVozova").length == 0) {
            let host = document.body.querySelector(".VozoviOptions");
            let divEditVozova = document.createElement("div")
            divEditVozova.className = "EditVozova";
            host.appendChild(divEditVozova);
            let naslov = document.createElement("div");
            naslov.innerHTML = "Izmenite podatke o vozu";
            naslov.className = "Naslovi";
            divEditVozova.appendChild(naslov);

            let table = document.createElement("table");
            divEditVozova.appendChild(table);
            let tableRed = document.createElement("tr");
            table.appendChild(tableRed);


            input.type = "text"
            input.value = pom.Naziv;
            input.className = "NazivVozEdit"
            tableRed.appendChild(input);
            let label = document.createElement("label");
            label.innerHTML = "Naziv"
            tableRed.appendChild(label);

            tableRed = document.createElement("tr");
            table.appendChild(tableRed);
            input = document.createElement("input")
            input.type = "number"
            input.value = pom.Kapacitet;
            input.className = "KapacitetVozEdit"
            tableRed.appendChild(input);
            label = document.createElement("label");
            label.innerHTML = "Kapacitet"
            tableRed.appendChild(label);

            tableRed = document.createElement("tr");
            table.appendChild(tableRed);
            input = document.createElement("input")
            input.type = "number"
            input.value = pom.Broj_Putnika;
            input.className = "BrojPutnikaVozEdit"
            tableRed.appendChild(input);
            label = document.createElement("label");
            label.innerHTML = "Broj Putnika"
            tableRed.appendChild(label);

            tableRed = document.createElement("tr");
            table.appendChild(tableRed);
            input = document.createElement("input")
            input.type = "number"
            input.value = pom.rutaID;
            input.className = "CenaRuteEdit"
            tableRed.appendChild(input);
            label = document.createElement("label");
            label.innerHTML = "Cena rute"
            tableRed.appendChild(label);

            let btn = document.createElement("button");
            btn.innerHTML = "Potvrdi";
            btn.className = "IzmeniBTN"
            btn.onclick = () => this.PUTVoz(pom.ID);
            table.appendChild(btn);
        }
        else {
            //var pom=document.createElement("input")
            let edit = document.querySelector(".BrojPutnikaVozEdit")
            edit.value = pom.Broj_Putnika;
            edit = document.querySelector(".KapacitetVozEdit")
            edit.value = pom.Kapacitet;
            edit = document.querySelector(".NazivVozEdit")
            edit.value = pom.Naziv;
            var btn = document.querySelector(".IzmeniBTN")
            btn.onclick = () => this.PUTVoz(pom.ID);
        }
    }

    PUTVoz(id) {
        var naziv = document.querySelector(".NazivVozEdit").value;
        var broj_Putnika = document.querySelector(".BrojPutnikaVozEdit").value;
        var kapacitet = document.querySelector(".KapacitetVozEdit").value;
        var cenaRute = this.kontejner.querySelector('input.CenaRuteEdit').value;
        var rutaID;
        var list=[];
        fetch("https://localhost:5001/Ruta/PreuzmiRutu")
            .then(p => {
                p.json().then(rute => {
                    rute.forEach(el => {
                            var r = new Ruta(el.id,el.cena);
                        list.push(r);
                    }); 
                    this.listaRuta=list;
                    console.log(this.listaRuta);
                    
                    this.listaRuta.forEach(x=>{
                        if(x.cena==cenaRute)
                        rutaID=x.id;
                    })
                    console.log(rutaID);
                    if(rutaID==null)
                    alert("Nepostoji ruta sa unetom cenom");
                    if(broj_Putnika<kapacitet)
                    {
                        const options = {
                            method: 'PUT'
                        }
                        fetch("https://localhost:5001/Voz/PromenitiVoz/"+id+"/"+naziv+"/"+kapacitet+"/"+broj_Putnika+"/"+rutaID,options)
                        .then(() => {
                        this.ucitajVozove(this.obrisiPrethodniSadrzajVoz());
                            })
                    }
            })
            
        })
    }
        
    

    crtajUnosVozova(host) {
        let divUnosVozova = document.createElement("div")
        divUnosVozova.className = "UnosVozova";
        host.appendChild(divUnosVozova);
        let naslov = document.createElement("div");
        naslov.innerHTML = "Unesite podatke o novom vozu";
        naslov.className = "Naslovi";
        divUnosVozova.appendChild(naslov);

        let table = document.createElement("table");
        divUnosVozova.appendChild(table);
        let tableRed = document.createElement("tr");
        table.appendChild(tableRed);

        let input = document.createElement("input")
        input.type = "text"
        input.className = "NazivVozInput"
        tableRed.appendChild(input);
        let label = document.createElement("label");
        label.innerHTML = "Naziv"
        tableRed.appendChild(label);

        tableRed = document.createElement("tr");
        table.appendChild(tableRed);
        input = document.createElement("input")
        input.type = "number"
        input.className = "KapacitetVozInput"
        tableRed.appendChild(input);
        label = document.createElement("label");
        label.innerHTML = "Kapacitet"
        tableRed.appendChild(label);

        tableRed = document.createElement("tr");
        table.appendChild(tableRed);
        input = document.createElement("input")
        input.type = "number"
        input.className = "BrojPutnikaVozInput"
        tableRed.appendChild(input);
        label = document.createElement("label");
        label.innerHTML = "Broj Putnika"
        tableRed.appendChild(label);

        tableRed = document.createElement("tr");
        table.appendChild(tableRed);
        input = document.createElement("input")
        input.type = "number"
        input.className = "CenaRuteInput"
        tableRed.appendChild(input);
        label = document.createElement("label");
        label.innerHTML = "Cena rute"
        tableRed.appendChild(label);

        let btn = document.createElement("button");
        btn.innerHTML = "Dodaj";
        divUnosVozova.appendChild(btn);

        btn.onclick = (() => this.dodajNoviVoz(this.kontejner));
    }

    dodajNoviVoz() 
    {
        var naziv = this.kontejner.querySelector('input.NazivVozInput').value;
        var kapacitet = this.kontejner.querySelector('input.KapacitetVozInput').value;
        var broj_Putnika = this.kontejner.querySelector('input.BrojPutnikaVozInput').value;
        var cenaRute = this.kontejner.querySelector('input.CenaRuteInput').value;
        
        var list=[];
        fetch("https://localhost:5001/Ruta/PreuzmiRutu")
            .then(p => {
                p.json().then(rute => {
                    rute.forEach(el => {
                            var r = new Ruta(el.id,el.cena);
                        list.push(r);
                        }); 
                    this.listaRuta=list;
                    console.log(this.listaRuta);
                    var rutaID;
                    this.listaRuta.forEach(x=>{
                        if(x.cena==cenaRute)
                        rutaID=x.id;
                    })
                    console.log(rutaID);
                    if(rutaID==null)
                    alert("Nepostoji ruta sa unetom cenom");
                    //console.log(rutaID);

                    if (naziv != null && kapacitet != null && broj_Putnika != null) {
                        if (broj_Putnika < kapacitet) {
                            
                            alert("Broj putnika ne moze biti veci od kapaciteta. Ne zivimo u Indiji :)");
                        }
                        else {
                            const options = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                            }
                            fetch("https://localhost:5001/Voz/DodatiVoz"+"/"+naziv+"/"+broj_Putnika+"/"+kapacitet+"/"+rutaID,options)
                                .then(() => {
                                    this.ucitajVozove(this.obrisiPrethodniSadrzajVoz());
                                });
                        }
                    }
                    else {
                        alert("Niste uneli potrebne podatke za dodavanje voza");
                    }
                });
            })
    }

    ucitajVozove(tbody) 
    {
        var list = [];
        fetch("https://localhost:5001/Voz/PreuzmiVoz")
            .then(p => {
                p.json().then(vozovi => {
                    vozovi.forEach(el => {
                        var v = new Voz(el.id, el.naziv, el.kapacitet, el.broj_Putnika,el.rutaID);
                        list.push(v);
                    });
                    //console.log(list);
                    this.loadVozove(list, tbody);
                });

            })

    }

    loadVozove(lista, tbody) {
        this.listaVozova = lista;
        this.listaVozova.forEach(x => {
            x.crtaj(tbody);
        })
    }

    obrisiPrethodniSadrzajVoz() {
        var teloTabele = document.body.querySelector(".VozoviPodaci");
        var roditelj = teloTabele.parentNode;
        roditelj.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = "VozoviPodaci";
        roditelj.appendChild(teloTabele);
        return teloTabele;
    }

    //#endregion

    //#region Stanica
    crtajStanice(host) {
        var child = host.lastElementChild;
        while (child) {
            host.removeChild(child);
            child = host.lastElementChild;
        }

        let prikazStanice = document.createElement("div");
        prikazStanice.className = "prikazStanice";
        host.appendChild(prikazStanice);

        var table = document.createElement("table");
        table.className = "Tabela"
        prikazStanice.appendChild(table);

        var thead = document.createElement("thead");
        table.appendChild(thead);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        var tbody = document.createElement("tbody");
        tbody.className = "StanicePodaci";
        table.appendChild(tbody);

        let th;
        var zag = ["Naziv stanice", "Godina izgradnje"]
        zag.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })

        var divOptions = document.createElement("div");
        divOptions.className = "StaniceOptions"
        prikazStanice.appendChild(divOptions);

        this.crtajUnosStanica(divOptions);
        this.ucitajStanice(tbody);

        var div = document.createElement("div");
        divOptions.appendChild(div)
        var del = document.createElement("button");
        del.innerHTML = "OBRIŠI";
        div.appendChild(del);
        del.onclick = () => this.BrisiStanice();

        var vus=document.createElement("button");
        vus.innerHTML="VOZOVI U STANICI"
        div.appendChild(vus);
        let divVUS=document.createElement("div");
        divVUS.className="divVUS"
        divOptions.appendChild(divVUS);
        vus.onclick=()=>this.prikazVUS(divVUS);

        var edit = document.createElement("button");
        edit.innerHTML = "IZMENI";
        div.appendChild(edit);
        edit.onclick = () => this.IzmenaStanica();
    }

    crtajUnosStanica(host) {
        let divUnosStanica = document.createElement("div")
        divUnosStanica.className = "UnosStanica";

        host.appendChild(divUnosStanica);
        let naslov = document.createElement("div");
        naslov.innerHTML = "Unesite podatke o novoj stanici";
        naslov.className = "Naslovi";
        divUnosStanica.appendChild(naslov);

        let table = document.createElement("table");
        divUnosStanica.appendChild(table);
        let tableRed = document.createElement("tr");
        table.appendChild(tableRed);

        let input = document.createElement("input")
        input.type = "text"
        input.className = "NazivStanicaInput"
        tableRed.appendChild(input);
        let label = document.createElement("label");
        label.innerHTML = "Naziv"
        tableRed.appendChild(label);

        tableRed = document.createElement("tr");
        table.appendChild(tableRed);
        input = document.createElement("input")
        input.type = "number"
        input.className = "KapacitetVozovaStanicaInput"
        tableRed.appendChild(input);
        label = document.createElement("label");
        label.innerHTML = "Godina izgradnje"
        tableRed.appendChild(label);

        tableRed = document.createElement("tr");
        table.appendChild(tableRed);
        input = document.createElement("input")
        input.type = "number"
        input.className = "RuteCenaInput"
        tableRed.appendChild(input);
        label = document.createElement("label");
        label.innerHTML = "Cena rute"
        tableRed.appendChild(label);

        let btn = document.createElement("button");
        btn.innerHTML = "Dodaj";
        divUnosStanica.appendChild(btn);

        let btn2 = document.createElement("button");
        btn2.innerHTML = "Dodajte rutu";
        divUnosStanica.appendChild(btn2);

        var RuteIDS=[];
        btn2.onclick = () => this.dodajRutuStanica(RuteIDS);
        btn.onclick = () => this.dodajNovuStanice(RuteIDS);
    }

    dodajRutuStanica(RuteIDS)
    {
        let rCena=document.querySelector(".RuteCenaInput").value;
        let list=[];
        fetch("https://localhost:5001/Ruta/PreuzmiRutu")
                        .then(p => {
                            p.json().then(rute => {
                                rute.forEach(el => {
                                    var r = new Ruta(el.id,el.cena);
                                list.push(r);
                                }); 
                                this.listaRuta=list;
                               console.log(this.listaRuta);
                               this.listaRuta.forEach(x=>
                                {
                                   if(x.cena==rCena)
                                   RuteIDS.push(x.id);
                               })
                               //console.log(RuteIDS);
                               //this.dodajNovuStanice(RuteIDS)
                            });
                            
                        })
        //console.log(this.listaVozova);
    }

    ucitajStanice(tbody) {
        let list = [];
        fetch("https://localhost:5001/Stanica/PreuzmiStanicu")
            .then(p => {
                p.json().then(stanice => {
                    stanice.forEach(el => {
                        var v = new Stanica(el.id, el.naziv, el.godinaIzgradnje,el.ruteIDs);
                        list.push(v);
                    });
                    //console.log(list);
                    this.loadStanice(list, tbody);
                });

            })
    }


    loadStanice(list, tbody) {
        this.listaStanica = list;
        this.listaStanica.forEach(x => {
            x.crtaj(tbody).addEventListener("click", () => {
                var pom = tbody.querySelectorAll(".StanicaRedSelected").length;
                console.log(tbody.parentElement.parentElement.parentElement.classList);
                if (tbody.parentElement.parentElement.parentElement.parentElement.classList.contains("PolaznaStanicaDIV")) {
                    this.levidesni.levi = pom;
                } else {
                    this.levidesni.desni = pom;
                }
                if(this.levidesni.levi==this.levidesni.desni&& pom==1){
                    this.Proba();
                }
            });
        })
    }

    dodajNovuStanice(RuteIDS) {
        var naziv = this.kontejner.querySelector('input.NazivStanicaInput').value;
        var god = this.kontejner.querySelector('input.KapacitetVozovaStanicaInput').value;
        

        if (naziv != null && god != null && RuteIDS.length>0) {
            const options = {
                method: 'POST',
            }
            let pom="?";
            RuteIDS.forEach(x=>{
                pom=pom+"lista_ruta="+x+"&";
            })
            fetch("https://localhost:5001/Stanica/DodatiStanicu/"+god+"/"+naziv+pom, options)
                .then(() => {
                    this.ucitajStanice(this.obrisiPrethodniSadrzajStanica());
                }

                );
        }
        else {
            alert("Niste uneli potrebne podatke za dodavanje stanice");
        }
    }

    IzmenaStanica() {
        var tableObject = document.body.getElementsByClassName('StanicaRedSelected');
        if (tableObject.length != 0) {
            let list = [];
            fetch("https://localhost:5001/Stanica/PreuzmiStanicu")
                .then(p => {
                    p.json().then(stanice => {
                        stanice.forEach(el => {
                            var v = new Stanica(el.id, el.naziv, el.godinaIzgradnje,el.ruteIDs);
                            list.push(v);
                        });
                        this.listaStanica = list;
                        const pom = this.listaStanica[this.listaStanica.findIndex(p => p.ID === tableObject[0].value)]
                        this.crtajIzmenuStanice(pom);
                    });
                })
        }
    }

    crtajIzmenuStanice(pom) {
        let input = document.createElement("input")
        if (document.body.querySelectorAll(".EditStanica").length == 0) {
            console.log(pom);
            let host = document.body.querySelector(".StaniceOptions");
            let divEditVozova = document.createElement("div")
            divEditVozova.className = "EditStanica";
            host.appendChild(divEditVozova);
            let naslov = document.createElement("div");
            naslov.innerHTML = "Izmenite podatke o stanici";
            naslov.className = "Naslovi";
            divEditVozova.appendChild(naslov);

            let table = document.createElement("table");
            divEditVozova.appendChild(table);
            let tableRed = document.createElement("tr");
            table.appendChild(tableRed);


            input.type = "text"
            input.value = pom.Naziv;
            input.className = "NazivStanicaEdit"
            tableRed.appendChild(input);
            let label = document.createElement("label");
            label.innerHTML = "Naziv"
            tableRed.appendChild(label);

            tableRed = document.createElement("tr");
            table.appendChild(tableRed);
            input = document.createElement("input")
            input.type = "number"
            input.value = pom.GodinaIzgradnje;
            input.className = "KapacitetVozovaStanicaEdit"
            tableRed.appendChild(input);
            label = document.createElement("label");
            label.innerHTML = "Godina izgradnje"
            tableRed.appendChild(label);


            let btn = document.createElement("button");
            btn.innerHTML = "Potvrdi";
            btn.className = "IzmeniBTN"
            btn.onclick = () => this.PUTStanica(pom.ID);
            table.appendChild(btn);
        }
        else {
            let edit = document.querySelector(".KapacitetVozovaStanicaEdit")
            edit.value = pom.godinaIzgradnje;
            edit = document.querySelector(".NazivStanicaEdit")
            edit.value = pom.Naziv;
            var btn = document.querySelector(".IzmeniBTN")
            btn.onclick = () => this.PUTStanica(pom.ID);
        }
    }

    PUTStanica(stanica_ID) {
        var naziv = document.querySelector(".NazivStanicaEdit").value;
        var godinaIzgradnje = document.querySelector(".KapacitetVozovaStanicaEdit").value;
        const data = { stanica_ID, naziv, godinaIzgradnje, ruteIDs}
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        }
        fetch("https://localhost:5001/Stanica/PromenitiStanicu/"+stanica_ID+"/"+ godinaIzgradnje+"/"+naziv+"/"+ruteIDs,options)
            .then(() => {
                this.ucitajStanice(this.obrisiPrethodniSadrzajStanica());
            })
    }

    obrisiPrethodniSadrzajStanica() {
        var teloTabele = document.body.querySelector(".StanicePodaci");
        var roditelj = teloTabele.parentNode;
        roditelj.removeChild(teloTabele);

        teloTabele = document.createElement("tbody");
        teloTabele.className = "StanicePodaci";
        roditelj.appendChild(teloTabele);
        return teloTabele;
    }

    BrisiStanice() {
        var tableObject = document.body.getElementsByClassName('StanicaRedSelected');
        var count = document.body.querySelectorAll(".StanicaRedSelected").length;
        
        for (var i = 0; i < count; i++) {
            console.log(tableObject[i].value)
            fetch("https://localhost:5001/Stanica/IzbrisatiStanicu/" + tableObject[i].value,
                {
                    method: "DELETE"
                }).then(s => {
                    this.ucitajStanice(this.obrisiPrethodniSadrzajStanica());
                })
        }
    }
    //#endregion

    //#region Ruta
    
    crtajRute(host){
        var child = host.lastElementChild; 
        while (child) {
            host.removeChild(child);
            child = host.lastElementChild;
        }
        
        let prikazRute = document.createElement("div");
        prikazRute.className="prikazRute";
        host.appendChild(prikazRute);

        var table=document.createElement("table");
        table.className="Tabela"
        prikazRute.appendChild(table);

        var thead=document.createElement("thead");
        table.appendChild(thead);

        var tr=document.createElement("tr");
        thead.appendChild(tr);

        var tbody=document.createElement("tbody");
        tbody.className="RutePodaci";
        table.appendChild(tbody);

        let th;
        var zag=["Naziv voza","Cena","Stanice"]
        zag.forEach(el=>{
            th=document.createElement("th");
            th.innerHTML=el;
            tr.appendChild(th);
        })

        var divOptions=document.createElement("div");
        divOptions.className="PrikazVozovaNaRuti"
        prikazRute.appendChild(divOptions);

        divOptions=document.createElement("div");
        divOptions.className="RuteOptions"
        prikazRute.appendChild(divOptions);

        
        //this.crtajUnosRuta(divOptions);
        this.ucitajRute(tbody);
        
        var div=document.createElement("div");
        divOptions.appendChild(div)
        var del=document.createElement("button");
        del.className="Dugme"
        del.innerHTML="OBRIŠI";
        div.appendChild(del);

        
    }

    ucitajRute(tbody) {
        var ls=[];
        var lv=[];
        var list=[];
        fetch("https://localhost:5001/Stanica/PreuzmiStanicu")
        .then(p => {
            p.json().then(stanice => {
                stanice.forEach(el => {
                    var v = new Stanica(el.id, el.naziv, el.godinaIzgradnje,el.ruteIDs);
                    ls.push(v);
                });
                this.listaStanica=ls;
                fetch("https://localhost:5001/Voz/PreuzmiVoz")
                .then(p => {
                    p.json().then(vozovi => {
                        vozovi.forEach(el => {
                            var v = new Voz(el.id, el.naziv, el.kapacitet, el.broj_Putnika,el.rutaID);
                            lv.push(v);
                        });
                        this.listaVozova=lv;
                        fetch("https://localhost:5001/Ruta/PreuzmiRutu")
                        .then(p => {
                            p.json().then(rute => {
                                rute.forEach(el => {
                                    var r = new Ruta(el.id,el.cena);
                                list.push(r);
                                }); 
                                /*console.log(list);
                                console.log(listStanica);
                                console.log(listaVozova);*/
                                this.listaRuta=list;
                                this.loadRute(list,tbody);
                            });
                            
                        })
                    });

                })
            });
            
        })        
    }
    
    loadRute(lista,tbody){
        this.listaRuta=lista;
        this.listaRuta.forEach(x=>{
            x.crtaj(tbody);
        })
        tbody.onclick=()=>this.IzborRute();
    }

    IzborRute()
    {
        var btns=document.querySelector(".CenaSelected")
        var pom=document.querySelectorAll(".Cena");
        //console.log(pom);
        //console.log(btns);
        if(btns!=null){
            var pom=btns.parentElement;
            var btn=pom.firstChild.firstChild;
            //if(btn.ha)
            var prikazVozova=document.body.querySelector(".PrikazVozovaNaRuti");
            //console.log(prikazVozova);

            btn.onclick=()=>this.prikazVUS(this.kontejner);
        }
        
    }


    prikazVUS(host){
        let pom=document.body.querySelector(".StanicaRedSelected");
        console.log(pom);
        if(pom!=null)
        {
        
        var child = host.lastElementChild;
        while (child) {
            host.removeChild(child);
            child = host.lastElementChild;
        }

        var table = document.createElement("table");
        table.className = "Tabela"
        host.appendChild(table);

        var thead = document.createElement("thead");
        table.appendChild(thead);

        var tr = document.createElement("tr");
        thead.appendChild(tr);

        var tbody = document.createElement("tbody");
        tbody.className = "StanicePodaci";
        table.appendChild(tbody);

        let th;
        var zag = ["Naziv voza", "Pristigli putnici","Vreme odlaska","Vreme dolaska"]
        zag.forEach(el => {
            th = document.createElement("th");
            th.innerHTML = el;
            tr.appendChild(th);
        })
        let listVUS=[];
        fetch("https://localhost:5001/VozUStanici/PreuzmiVozUStanici")
        .then(p => {
            p.json().then(rute => {
                rute.forEach(el => {
                    var vus = new VozUStanici(el.id,el.pristigliPutnici,el.vreme_Odlaska,el.vreme_Dolaska,el.stanicaID,el.vozID);
                    listVUS.push(vus);
                }); 
                let list = [];
                fetch("https://localhost:5001/Voz/PreuzmiVoz")
                    .then(p => {
                        p.json().then(vozovi => {
                            vozovi.forEach(el => {
                                var v = new Voz(el.id, el.naziv, el.kapacitet, el.broj_Putnika,el.rutaID);
                                list.push(v);
                            });
                            console.log(list);
                            this.listaVozova=list;
                            this.listaVUS=listVUS;
                            //console.log(list);
                            //this.loadVozove(list, tbody);
                            this.crtajVUS(tbody)
                        });
                        
                    })
                
                /*console.log(listStanica);
                console.log(listaVozova);
                this.listaVUS=list;
                this.loadRute(list,tbody);*/
            });
            
        })
    }
    }

    crtajVUS(tbody){
        console.log(this.listaVUS);
        console.log(this.listaVozova);
        console.log(this.listaStanica);
        let idStanice=document.body.querySelector(".StanicaRedSelected").value
        if(idStanice!=null)
        console.log(idStanice);
        var naziv;
        /*this.listaVUS.forEach(x=>{

        })/** */
        this.listaVUS.forEach(x=>{
            //console.log(x);
            this.listaVozova.forEach(y=>{
                //console.log(y);
                if(x.voz_ID==y.ID&&x.stanica_ID==idStanice)
                {
                    naziv=y.Naziv;
                    console.log(naziv);
                    x.crtaj(tbody,naziv)
                }
                
            })
            
        })
    }
}
    /*
    



    obrisiPrethodniSadrzajVoz(){
        var teloTabele=document.body.querySelector(".VozoviPodaci");
        var roditelj=teloTabele.parentNode;
        roditelj.removeChild(teloTabele);

        teloTabele=document.createElement("tbody");
        teloTabele.className="VozoviPodaci";
        roditelj.appendChild(teloTabele);
        return teloTabele;
    }

    */
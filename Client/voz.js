export class Voz{

    constructor(id,naziv,kapacitet,Broj_Putnika,rutaID){
        this.ID=id;
        this.Naziv=naziv;
        this.Kapacitet=kapacitet;
        this.Broj_Putnika=Broj_Putnika;
        this.rutaID=rutaID;
    }

    crtaj(host){
        var tr = document.createElement("tr");
        tr.className="VozoviRed"
        tr.value=this.ID;
        tr.onclick=()=>this.izabraniVoz(tr);
        host.appendChild(tr);

        var el = document.createElement("td");
        el.innerHTML=this.Naziv;
        tr.appendChild(el);

        el = document.createElement("td");
        el.innerHTML=this.Kapacitet;
        tr.appendChild(el);

        el = document.createElement("td");
        el.innerHTML=this.Broj_Putnika;
        tr.appendChild(el);

    }

    izabraniVoz(host)
    {
        if(host.className==="VozoviRedSelected")
        {
            host.className="VozoviRed"
        }else
        {
            host.className="VozoviRedSelected"
        }
    }
}

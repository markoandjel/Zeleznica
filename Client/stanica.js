export class Stanica{
    constructor(id,naziv,GodinaIzgradnje,ruteIDs){
        this.ID=id
        this.Naziv=naziv
        this.GodinaIzgradnje=GodinaIzgradnje
        this.ruteIDs=ruteIDs
    }

    crtaj(host){
        var tr = document.createElement("tr");
        tr.className="StanicaRed"
        tr.value=this.ID;
        tr.onclick=(ev)=>this.izabranaStanica(tr);
        host.appendChild(tr);

        var el = document.createElement("td");
        el.innerHTML=this.Naziv;
        tr.appendChild(el);

        el = document.createElement("td");
        el.innerHTML=this.GodinaIzgradnje;
        tr.appendChild(el);
        return tr;
    }
    izabranaStanica(host){
        if(host.className==="StanicaRedSelected")
        {
            host.className="StanicaRed"
        }else
        {
            host.className="StanicaRedSelected"
        }
    }
}
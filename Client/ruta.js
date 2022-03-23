export class Ruta
{
    constructor(id, cena)
    {
        this.id=id;
        this.cena=cena;
    }

    crtaj(host)
    {
        var tr = document.createElement("tr");
        tr.className="RuteRed"
        tr.value=this.ID;
        host.appendChild(tr);

        var el = document.createElement("td");
        var btn=document.createElement("button");
        btn.className="Prikazi vozove"
        btn.innerHTML="Prikazi vozove";
        el.appendChild(btn);
        tr.appendChild(el);

        el = document.createElement("td");
        el.innerHTML=this.cena;
        el.className="Cena"
        el.onclick=()=>this.izabranaRuta(el);
        tr.appendChild(el);

        var el2 = document.createElement("td");
        btn=document.createElement("button");
        btn.className="Prikazi stanice"
        btn.innerHTML="Prikazi stanice"
        el2.appendChild(btn);
        tr.appendChild(el2);
    }

    izabranaRuta(host)
    {
        if(host.className==="CenaSelected")
        {
            host.className="Cena"
        }else
        {
            host.className="CenaSelected"
        }
    }
}


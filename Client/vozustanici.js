export class VozUStanici
{
    constructor(id,pristigliPutnici,vreme_Odlaska,vreme_Dolaska,stanica_ID,voz_ID,)
    {
        this.id=id;
        this.pristigliPutnici=pristigliPutnici;
        this.vreme_Odlaska=vreme_Odlaska;
        this.vreme_Dolaska=vreme_Dolaska;
        this.stanica_ID=stanica_ID;
        this.voz_ID=voz_ID;
    }
    crtaj(host,nazivVoza)
    {
        var tr = document.createElement("tr");
        tr.className="VUSRed"
        tr.value=this.ID;
        tr.onclick=()=>this.izabraniVUS(tr);
        host.appendChild(tr);

        var el = document.createElement("td");
        el.innerHTML=nazivVoza;
        tr.appendChild(el);

        el = document.createElement("td");
        el.innerHTML=this.pristigliPutnici;
        tr.appendChild(el);

        let pocetakDate = new Date(this.vreme_Odlaska)
        el = document.createElement("td");
        el.innerHTML=pocetakDate.toLocaleString();
        tr.appendChild(el);

        pocetakDate = new Date(this.vreme_Dolaska)
        el = document.createElement("td");
        el.innerHTML=pocetakDate.toLocaleString();
        tr.appendChild(el);

        
        this.vreme_Odlaska = 
        console.log(pocetakDate);
    }
    izabraniVUS(host)
    {
        if(host.className==="VUSRedSelected")
        {
            host.className="VUSRed"
        }else
        {
            host.className="VUSRedSelected"
        }
    }
}
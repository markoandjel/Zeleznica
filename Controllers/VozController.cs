using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Web_projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VozController : ControllerBase
    {
        public ZeleznicaContext Context{get; set;}
        public VozController(ZeleznicaContext context)
        {
            Context=context;
        }

        
        [Route("PreuzmiVoz")]
        [HttpGet]
        public async Task<ActionResult> Preuzmi()
        {
            try
            {
                return Ok(await Context.Voz.Select(p=>
                new{
                    p.ID,
                    p.Naziv,
                    p.Kapacitet,
                    p.Broj_Putnika,
                    rutaID=p.Ruta.ID,
                }
                ).ToListAsync());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("DodatiVoz/{naziv}/{broj_putnika}/{kapacitet}/{rutaID}")]
        [HttpPost]
        
            public async Task<ActionResult> DodajteVoz(string naziv, int broj_putnika, int kapacitet,int rutaID)
            {
                #region Uslovi
                if (broj_putnika<0 || broj_putnika>50000)
                {
                    return BadRequest("Nerealan broj putnika");
                }

                if (string.IsNullOrWhiteSpace(naziv)||naziv.Length > 50)
                {
                    return BadRequest("Pogrešan naziv");
                }

                if (kapacitet<0 || kapacitet>6000)
                {
                    return BadRequest("Nerealan kapacitet putnika");
                }

                if(kapacitet<broj_putnika)
                {
                    return BadRequest("Broj putnika ne može biti veći od kapaciteta voza");
                }
            #endregion

                try
                {
                    Ruta r=await Context.Ruta.Where(p=>p.ID==rutaID).FirstOrDefaultAsync();
                    Voz v=new Voz
                    {
                        Naziv=naziv,
                        Broj_Putnika=broj_putnika,
                        Kapacitet=kapacitet,
                        Ruta=r
                    };
                    Context.Voz.Add(v);
                    await Context.SaveChangesAsync();
                    return Ok($"Voz je dodat! ID je: {v.ID}");
                }
                catch(Exception e)
                {
                    return BadRequest(e.Message);
                }

            }
        

        [Route("PromenitiVoz/{id}/{naziv}/{kapacitet}/{broj_putnika}/{rutaID}")]
        [HttpPut]
        public async Task<ActionResult> PromeniVoz(int id,string naziv,int kapacitet, int broj_putnika,int rutaID)
        {
            #region Uslovi
            if (broj_putnika<0 || broj_putnika>50000)
            {
                return BadRequest("Nerealan broj putnika");
            }

            if (string.IsNullOrWhiteSpace(naziv)||naziv.Length > 50)
            {
                return BadRequest("Pogrešan naziv");
            }

            if (kapacitet<0 || kapacitet>6000)
            {
                return BadRequest("Nerealan kapacitet putnika");
            }
            #endregion

            try
            {
                var voz=Context.Voz.Where(p=>p.ID==id).FirstOrDefault();

                if(voz!=null)
                {   
                    var r=await Context.Ruta.Where(p=>p.ID==rutaID).FirstOrDefaultAsync();
                    voz.Broj_Putnika=broj_putnika;
                    voz.Kapacitet=kapacitet;
                    voz.Naziv=naziv;
                    voz.Ruta=r;
                    await Context.SaveChangesAsync();
                    return Ok($"Uspeno promenjen voz! ID: {voz.ID}");
                }
                else
                {
                    return BadRequest("Voz nije pronađen");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    
        [Route("IzbrisatiVoz/{id}")]
        [HttpDelete]
        public async Task<ActionResult> Izbrisati(int id)
        {
            try
            {   
                var voz = await Context.Voz.FindAsync(id);

                if(voz==null)
                {
                    return BadRequest("Ne postoji takav voz");
                }

                var listaVus= Context.VozUStanici.Where(p=>p.Voz==voz);
                

                if(listaVus!=null)
                {
                    Context.VozUStanici.RemoveRange(listaVus);
                }

                
                Context.Voz.Remove(voz);
                await Context.SaveChangesAsync();
                return Ok($"Uspešno izbrisan voz sa nazivom: {voz.Naziv}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }    
    }
}

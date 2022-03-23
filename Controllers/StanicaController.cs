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
    public class StanicaController : ControllerBase
    {
        public ZeleznicaContext Context{get; set;}
        public StanicaController(ZeleznicaContext context)
        {
            Context=context;
        }

        [HttpGet]
        [Route("PreuzmiStanicu")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiStanicu()
        {
            try
            {
                return Ok(await Context.Stanica.Select(p=>
                new{
                    p.ID,
                    p.Naziv,
                    p.GodinaIzgradnje,
                    ruteIDs=p.ListaRutaStanica
                        .Where(q=>q.Stanica.ID==p.ID)
                        .Select(q=>new {RutaID=q.Ruta.ID})
                }
                ).ToListAsync());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        
        [Route("DodatiStanicu/{god}/{naziv}")]
        [HttpPost]
        public async Task<ActionResult> DodatiStanicu(int god,string naziv,[FromQuery] int[] lista_ruta)
        {
            #region Uslovi
            if (god < 1830 || god > 2200)
            {
                return BadRequest("Nerealna godina izgradnje");
            }

            if (string.IsNullOrWhiteSpace(naziv)||naziv.Length > 50)
            {
                return BadRequest("Pogrešan naziv");
            }

            #endregion

            try
            {
                Stanica stanica=new Stanica
                {
                    GodinaIzgradnje=god,
                    Naziv=naziv
                };
                foreach(var i in lista_ruta)
                {
                    RutaStanica rs=new RutaStanica();
                    rs.Stanica=stanica;
                    rs.Ruta=Context.Ruta.Where(p=>p.ID==i).FirstOrDefault();
                    Context.RutaStanica.Add(rs);
                }
                Context.Stanica.Add(stanica);
                await Context.SaveChangesAsync();
                return Ok($"Stanica je dodata! ID je: {stanica.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PromenitiStanicu/{id}/{god}/{naziv}")]
        [HttpPut]
        public async Task<ActionResult> PromeniStanicu(int id,int god,string naziv,[FromQuery] int[] lista_ruta)
        {
            #region Uslovi
            if (god < 1830 || god > 2200)
            {
                return BadRequest("Nerealna godina izgradnje");
            }

            if (string.IsNullOrWhiteSpace(naziv)||naziv.Length > 50)
            {
                return BadRequest("Pogrešan naziv");
            }
            #endregion

            try
            {
                var rs=Context.RutaStanica.Where(p=>p.Stanica.ID==id);

                if(rs!=null)
                {
                    var stanica=await Context.Stanica.FindAsync(id);
                    Context.RutaStanica.RemoveRange(rs);

                    if(lista_ruta!=null)
                    {
                        foreach(var i in lista_ruta)
                        {
                            var rutstan=new RutaStanica();
                            rutstan.Stanica=stanica;
                            rutstan.Ruta=await Context.Ruta.FindAsync(i);
                            Context.RutaStanica.Add(rutstan);
                        }
                    }
                    

                    await Context.SaveChangesAsync();
                    return Ok($"Uspeno promenjena stanica! ID: {id}");
                }
                else
                {
                    return BadRequest("Stanica nije pronađena");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    
        [Route("IzbrisatiStanicu/{id}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisatiStanicu(int id)
        {
            try
            {
                var stanica=await Context.Stanica.FindAsync(id);
                if(stanica==null)
                {
                    return BadRequest("Nepostoji takva stanica");
                }

                var listaVus= Context.VozUStanici.Where(p=>p.Stanica==stanica);

                if(listaVus!=null)
                {
                    Context.VozUStanici.RemoveRange(listaVus);
                }

                Context.Stanica.Remove(stanica);
                await Context.SaveChangesAsync();
                return Ok($"Uspešno izbrisana stanica sa nazivom: {stanica.Naziv}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }    
    }
}

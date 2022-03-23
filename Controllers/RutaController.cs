using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace Web_projekat.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RutaController : ControllerBase
    {
        public ZeleznicaContext Context{get; set;}
        public RutaController(ZeleznicaContext context)
        {
            Context=context;
        }

        [HttpGet]
        [Route("PreuzmiRutu")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiRutu()
        {
            try
            {
                return Ok(await Context.Ruta.Select(p => 
                new 
                    { 
                        p.ID, 
                        p.Cena,
                        staniceIDs=p.ListaRutaStanica
                            .Where(q=>q.Ruta.ID==p.ID)
                            .Select(q=>new{StanicaID=q.Stanica.ID}),
                        lista_vozova=p.ListaVozova
                            .Select(q=>new{VozID=q.ID})  
                    }
                    ).ToListAsync());             
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
           
        }

        
        [Route("DodatiRutu/{cena}")]
        [HttpPost]
        public async Task<ActionResult> DodatiRutu(int cena,[FromQuery] int[] lista_stanica,[FromQuery] int[] lista_vozova)
        {
            if(cena<0||cena>80000)
                return BadRequest("Proveriti informaciju o ceni rute");
            
            try
            {   
                
                Ruta ruta=new Ruta
                {
                    Cena=cena,
                    ListaRutaStanica=await Context.RutaStanica.Where(p=>lista_stanica.Contains(p.ID)).ToListAsync(),
                    ListaVozova=await Context.Voz.Where(p=>lista_vozova.Contains(p.ID)).ToListAsync()
                };

                Context.Ruta.Add(ruta);
                await Context.SaveChangesAsync();
                return Ok($"Ruta je dodata! ID je: {ruta.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [Route("PromenitiRutu/{id}/{cena}")]
        [HttpPut]
        public async Task<ActionResult> PromenitiRutu(int id,int cena,[FromQuery] int[] lista_stanica,[FromQuery] int[] lista_vozova)
        {
            if(cena<0||cena>80000)
                return BadRequest("Proveriti informaciju o ceni rute");
            
            try
            {

                var rs=Context.RutaStanica.Where(p=>p.Ruta.ID==id);

                if(rs!=null)
                {
                    var ruta=await Context.Ruta.FindAsync(id); 
                    Context.RutaStanica.RemoveRange(rs);

                    if(lista_stanica!=null&&lista_vozova!=null)
                    {
                        foreach(var i in lista_stanica)
                        {
                            var rustan=new RutaStanica();
                            rustan.Ruta=ruta;
                            rustan.Stanica=await Context.Stanica.FindAsync(i);
                            Context.RutaStanica.Add(rustan);
                        }

                        foreach(var i in lista_vozova)
                        {
                            var voz=Context.Voz.Where(p=>p.ID==i).FirstOrDefault();
                            voz.Ruta=ruta;
                            Context.Voz.Update(voz);
                        }
                    }

                    await Context.SaveChangesAsync();
                    return Ok($"Uspeno promenjena ruta! ID: {id}");
                }
                else
                {
                    return BadRequest("Ruta nije pronađena");
                }

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    
        [Route("IzbrisatiRutu/{id}")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisatiRutu(int id)
        {
            try
            {
                var ruta=await Context.Ruta.FindAsync(id);

                if(ruta==null)
                {
                    return BadRequest("Nepostoji takva ruta");
                }

                var listaVozova=Context.Voz.Where(p=>p.Ruta==ruta);
                if(listaVozova!=null)
                {
                    Context.Voz.RemoveRange(listaVozova);
                }

                var rs=Context.RutaStanica.Where(p=>p.Ruta.ID==id);
                Context.RutaStanica.RemoveRange(rs);

                Context.Ruta.Remove(ruta);
                await Context.SaveChangesAsync();
                return Ok($"Uspešno izbrisana ruta sa id: {ruta.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }    
    }
}

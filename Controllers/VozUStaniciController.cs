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
    public class VozUStaniciController : ControllerBase
    {
        public ZeleznicaContext Context{get; set;}
        public VozUStaniciController(ZeleznicaContext context)
        {
            Context=context;
        }

        [HttpGet]
        [Route("PreuzmiVozUStanici")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiVozUStanici()
        {
            try
            {
               

                return Ok(await Context.VozUStanici.Select(p=>
                new{
                    p.ID,
                    p.Vreme_Dolaska,
                    p.Vreme_Odlaska,
                    p.PristigliPutnici,
                    stanicaID=p.Stanica.ID,
                    vozID=p.Voz.ID,
                }
                ).ToListAsync());

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
           
        }

        
        [Route("DodajVozUStanici/{vozID}/{stanicaID}/{broj_putnika}/{vremeDolaska}/{vremeOdlaska}")]
        [HttpPost]
        public async Task<ActionResult> DodajVozUStanici(int vozID,int stanicaID, int broj_putnika,DateTime vremeDolaska, DateTime vremeOdlaska)
        {
            #region Uslovi
            if (broj_putnika < 0 || broj_putnika > 50000)
            {
                return BadRequest("Nerealan broj putnika");
            }
            #endregion

            try
            {
                VozUStanici vozUStanici=new VozUStanici
                {
                    Vreme_Dolaska=vremeDolaska,
                    Vreme_Odlaska=vremeOdlaska,
                    PristigliPutnici=broj_putnika,
                    Stanica=await Context.Stanica.Where(p=>p.ID==stanicaID).FirstOrDefaultAsync(),
                    Voz=await Context.Voz.Where(p=>p.ID==vozID).FirstOrDefaultAsync()
                };
                Context.VozUStanici.Add(vozUStanici);
                await Context.SaveChangesAsync();
                return Ok($"VozUStanici je dodat! ID je: {vozUStanici.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [Route("PromenitiVozUStanici/{id}/{vozID}/{stanicaID}/{broj_putnika}/{vremeDolaska}/{vremeOdlaska}")]
        [HttpPut]
        public async Task<ActionResult> PromenitiKartu(int id, int vozID,int stanicaID, int broj_putnika, DateTime vremeDolaska, DateTime vremeOdlaska)
        {
            #region Uslovi
            if (broj_putnika < 0 || broj_putnika > 50000)
            {
                return BadRequest("Nerealan broj putnika");
            }
            #endregion

            try
            {
                var vozUStanici=Context.VozUStanici.Where(p=>p.ID==id).FirstOrDefault();

                if(vozUStanici!=null)
                {
                    vozUStanici.PristigliPutnici=broj_putnika;
                    vozUStanici.Voz= await Context.Voz.Where(p=>p.ID==vozID).FirstOrDefaultAsync();
                    vozUStanici.Stanica = await Context.Stanica.Where(p=>p.ID==stanicaID).FirstOrDefaultAsync();
                    vozUStanici.Vreme_Odlaska=vremeOdlaska;
                    vozUStanici.Vreme_Dolaska=vremeDolaska;

                    await Context.SaveChangesAsync();
                    return Ok($"Uspeno promenjena insanca VozUStanici! ID: {vozUStanici.ID}");
                }
                else
                {
                    return BadRequest("VozUStanici nije pronađen");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    
        [Route("IzbrisatiVozUStanici")]
        [HttpDelete]
        public async Task<ActionResult> IzbrisatiVozUStanici(int id)
        {
            if(id<=0)
            {
                return BadRequest("Pogrešan id");
            }

            try
            {
                var vozUStanici=await Context.VozUStanici.FindAsync(id);

                Context.VozUStanici.Remove(vozUStanici);
                await Context.SaveChangesAsync();
                return Ok($"Uspešno izbrisana instanca VozaUStanici sa ID: {vozUStanici.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }    
    }
}

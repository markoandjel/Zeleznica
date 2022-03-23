using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class ZeleznicaContext : DbContext
    {
        public DbSet<Voz> Voz {get; set;}

        public DbSet<Ruta> Ruta {get; set;}

        public DbSet<Stanica> Stanica {get; set;}

        public DbSet<VozUStanici> VozUStanici {get; set;}

        public DbSet<RutaStanica> RutaStanica {get;set;}

        public ZeleznicaContext(DbContextOptions options) : base(options)
        {

        }
    }
}
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Ruta
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public List<Voz> ListaVozova { get; set; }

        [Required]
        public List<RutaStanica> ListaRutaStanica { get; set; }

        public int Cena { get; set; }

    }

}
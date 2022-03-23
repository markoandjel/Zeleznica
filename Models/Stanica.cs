using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Models
{
    [Table("Stanica")]
    public class Stanica
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }

        [Required]
        [Range(0,2200)]
        public int GodinaIzgradnje { get; set; }

        public List<RutaStanica> ListaRutaStanica { get; set; }
    }
}
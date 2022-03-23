using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Models
{
    [Table("RutaStanica")]
    public class RutaStanica
    {
        [Key]
        public int ID { get; set; }

        public Stanica Stanica { get; set; }
        public Ruta Ruta { get; set; }
    }
}
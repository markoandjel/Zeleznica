using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Voz")]
    public class Voz
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }

        [Required]
        [Range(0,4000)]
        public int Kapacitet { get; set; }

        [Required]
        [Range(0,4000)]
        public int Broj_Putnika { get; set; }

        [JsonIgnore]
        public Ruta Ruta { get; set; }

    }
}
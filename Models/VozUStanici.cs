using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class VozUStanici
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [Range(0,5000)]
        public int PristigliPutnici { get; set; }

        [Required]
        public DateTime Vreme_Odlaska { get; set; }

        [Required]
        public DateTime Vreme_Dolaska { get; set; }

        [Required]
        public Stanica Stanica { get; set; }
        
        [Required]
        public Voz Voz { get; set; }
            
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
 
namespace dotnetapp.Models
{
    public class Place
    {
        [Key]
        public int PlaceId { get; set; } // matches spec spelling
 
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
 
        [Required]
        [MaxLength(100)]
        public string Category { get; set; }
 
        [MaxLength(100)]
        public string BestTimeToVisit { get; set; }
 
        public string PlaceImage { get; set; }
 
        public string Location { get; set; }
    }
}
 
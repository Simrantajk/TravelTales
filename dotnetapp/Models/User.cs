using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
 
namespace dotnetapp.Models
{
    public class User
    {
        [Key]
        public int Userld { get; set; }
 
        [Required]
        [EmailAddress]
        public string Email { get; set; }
 
        [Required]
        public string Password { get; set; }
 
        [Required]
        public string Username { get; set; }
        
        [Required]
        [StringLength(10, MinimumLength = 10)]

        public string MobileNumber { get; set; }
 
        [Required]
        public string UserRole { get; set; }
    }
}
 
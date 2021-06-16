using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Models
{
    public class DootFeed
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Users")]
        public Guid DooterId { get; set; }

        [Required]
        [ForeignKey("Feeds")]
        public int FeedId { get; set; }

        [Required]
        [Column(TypeName = "smallint")]
        public int DootType { get; set; }

        //Navigation properties
        public User Dooter { get; set; }
        public Feed Feed { get; set; }
    }
}

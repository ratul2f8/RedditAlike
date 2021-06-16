using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Models
{
    public class FeedComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Users")]
        public Guid CommenterId { get; set; }

        [Required]
        [Column(TypeName = "TIMESTAMP")]
        public DateTime CommentAt { get; set; }

        [Required]
        [ForeignKey("Feeds")]
        public int FeedId { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string Comment { get; set; }

        //Navigation properties
        public User Commenter { get; set; }
        public Feed Feed { get; set; }
    }
}

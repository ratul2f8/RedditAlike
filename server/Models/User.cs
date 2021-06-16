using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedditAlike.Models
{
    public class User
    {
        
        [Key]
        public Guid Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string FullName { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Email { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string Password { get; set; }

        [Column(TypeName ="TIMESTAMP")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "TIMESTAMP")]
        public DateTime UpdatedAt { get; set; }

        //Navigation Properties
        public ICollection<Feed> Feeds {get; set; }

        public ICollection<DootFeed> DootFeeds { get; set; }

        public ICollection<FeedComment> FeedComments { get; set; } 

    }
}

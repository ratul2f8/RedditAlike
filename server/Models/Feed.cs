using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedditAlike.Models{
    public class Feed{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id {get; set;}

        [Required]
        [Column( TypeName = "TIMESTAMP")]
        public DateTime CreatedAt {get; set; }

        [Required]
        [Column( TypeName = "TIMESTAMP")]
        public DateTime UpdatedAt {get; set;}

        [Required]
        [Column(TypeName = "TEXT")]
        public string Title { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string Content { get; set; }

        [Required]
        [ForeignKey("Users")]
        public Guid CreatorId {get; set;}

        [Required]
        public int NumberOfComments { get; set; }

        [Required]
        public int DootStatus { get; set; }
        
        //Navigation Properties
        public User Creator {get; set;}

        public ICollection<DootFeed> DootFeeds { get; set; }
        public ICollection<FeedComment> FeedComments { get; set; }
    }
}
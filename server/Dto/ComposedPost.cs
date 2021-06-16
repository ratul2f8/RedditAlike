using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class ComposedPost
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}

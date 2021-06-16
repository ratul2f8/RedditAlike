using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class DootedPost
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public string CreatorName { get; set; }
        public Guid CreatorId { get; set; }
        public string CreatorEmail { get; set; }

    }
}

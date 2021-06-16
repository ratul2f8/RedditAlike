using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class CreateCommentResponse
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public Guid CommenterId { get; set; }
        public DateTime CommentedAt { get; set; }
        public string CommenterName { get; set; }
        public int OverallNumberOfComments { get; set; }
    }
}

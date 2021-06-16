using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class CreateCommentRequest
    {
        public int FeedId { get; set; }
        public string Comment { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class RegularComment
    {
        public int Id { get; set; }
        public string Comment { get; set; }
        public Guid CommenterId { get; set; }
        public DateTime CommentedAt { get; set; }
        public string CommenterName { get; set; }
    }
    public class DetailedFeedResponse
    {
        public FeedResponse FeedInfo { get; set; }
        public List<DootedUser> DownDoots { get; set; }
        public List<DootedUser> UpDoots { get; set; }

        public List<RegularComment> Comments { get; set; }
        
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class UpdateDootRequest
    {
        public int FeedId { get; set; }
        public int DootType { get; set; }
    }
}

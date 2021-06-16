using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class DootedUser
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
    }
    public class WhoLikedResponse
    {
        public List<DootedUser> UpDoots { get; set; }
        public List<DootedUser> DownDoots { get; set; }
    }
}

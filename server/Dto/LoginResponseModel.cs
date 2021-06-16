using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class LoginResponseModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string JWT { get; set; }
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Dictionary<int, int> DootsMetadata { get; set; }
    }
}

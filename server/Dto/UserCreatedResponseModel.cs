using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RedditAlike.Dto
{
    public class UserCreatedResponseModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

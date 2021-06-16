using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RedditAlike.Dto;
using RedditAlike.Models;

namespace RedditAlike.Security
{
    public interface IJWTAuthenticationManager
    {
        string Authenticate(User loginRequestModel); 
    }
}

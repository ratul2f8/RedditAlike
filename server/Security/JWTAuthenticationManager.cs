using System.Security.Claims;
using System.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RedditAlike.Dto;
using RedditAlike.Models;
using Microsoft.Extensions.DependencyInjection;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace RedditAlike.Security
{
    public class JWTAuthenticationManager : IJWTAuthenticationManager
    {
        //private readonly ApplicationDbContext _context;

        //public JWTAuthenticationManager(ApplicationDbContext context)
        //{
        //    _context = context;
        //}
        private readonly string _secret;
        public JWTAuthenticationManager(string secret)
        {
            _secret = secret;
        }
        public string Authenticate(User user)
        {
            var securityTokenHandler = new JwtSecurityTokenHandler();
            var tokenKeyBytes = Encoding.ASCII.GetBytes(_secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                    }
                ),
                Expires = DateTime.UtcNow.AddDays(3),
                //Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKeyBytes),
                     SecurityAlgorithms.HmacSha256Signature
                )
            };
            var token = securityTokenHandler.CreateToken(tokenDescriptor);
            return securityTokenHandler.WriteToken(token);
        }
    }
}

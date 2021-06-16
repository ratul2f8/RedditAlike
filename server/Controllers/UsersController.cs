using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedditAlike.Models;
using RedditAlike.Utils;
using RedditAlike.Dto;
using RedditAlike.Security;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RedditAlike.Controllers
{
   
    public class GetTokenRequest
    {
        public string Email { get; set; }
    }
    public class ChangePasswordRequest
    {
        public string Token { get; set; }
        public string Password { get; set; }
    }
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJWTAuthenticationManager _jWTAuthenticationManager;

        public UsersController(ApplicationDbContext context,
            IJWTAuthenticationManager jWTAuthenticationManager)
        {
            _context = context;
            _jWTAuthenticationManager = jWTAuthenticationManager;
        }

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }
            user.UpdatedAt = DateTime.Now;
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [AllowAnonymous]
        [HttpPut("gettoken")]
        public async Task<ActionResult<string>> GetTokenToSendEmail(GetTokenRequest req)
        {
            var user =  _context.Users.Where(user => user.Email.Equals(req.Email)).FirstOrDefault();
            if(user == null)
            {
                return BadRequest();
            }
            else
            {
                Token newToken = new Token()
                {
                    UserId = user.Id,
                    ExpireAt = DateTime.UtcNow.AddMinutes(30)
                };
                _context.Tokens.Add(newToken);
                await _context.SaveChangesAsync();

                return newToken.Id.ToString();
            }
        }
        [AllowAnonymous]
        [HttpPut("changepassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordRequest req)
        {
            var parsedToken = Guid.Parse(req.Token);
            var foundToken = await _context.Tokens.FindAsync(parsedToken);
            if(foundToken == null)
            {
                return BadRequest("Token doesn't exist");
            }
            var expired = DateTime.Compare(DateTime.UtcNow, foundToken.ExpireAt);
            if(expired > 0)
            {
                return BadRequest("Token Expired");
            }
            var foundUser = await _context.Users.FindAsync(foundToken.UserId);
            if(foundUser == null)
            {
                return BadRequest("User doesn't exist");
            }
            if (req.Password.Length <= 4)
            {
                return BadRequest("Length of the password must be greater than 4");
            }

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                DateTime timeNow = DateTime.Now;
                foundUser.UpdatedAt = timeNow;
                foundUser.Password = BCrypt.Net.BCrypt.HashPassword(req.Password.Trim());
                _context.Entry(foundUser).State = EntityState.Modified;
                _context.Tokens.Remove(foundToken);
                await _context.SaveChangesAsync();
                transaction.Commit();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500);
            }
            return Ok();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<UserCreatedResponseModel>> PostUser(User user)
        {
            if (!Validators.IsEmailValid(user.Email))
            {
                return BadRequest("Email is not valid!");
            }
            if (IsEmailTaken(user.Email))
            {
                return BadRequest("Email already taken!");
            }
            if (user.Password.Length <= 4)
            {
                return BadRequest("Length of the password must be greater than 4");
            }
            
            DateTime timeNow = DateTime.Now;
            user.CreatedAt = timeNow;
            user.UpdatedAt = timeNow;
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password.Trim());
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserCreatedResponseModel()
            {
                Email = user.Email.Trim(),
                FullName = user.FullName.Trim(),
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                Id = user.Id
            };
        }
        [AllowAnonymous]
        [HttpPut("login")]
        public async Task<ActionResult<LoginResponseModel>> Login(LoginRequestModel model)
        {
            var user = _context.Users.Where(user => user.Email == model.Email).FirstOrDefault();
            if (user == null)
            {
                return NotFound("Email doesn't exist!");
            }
            var validPassword = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
            if (!validPassword)
            {
                return BadRequest("Password don't match");
            }
            string token = _jWTAuthenticationManager.Authenticate(user);
            if (token == null)
            {
                return Unauthorized();
            }
            var doots = await  _context.DootFeeds.Where(doot => doot.DooterId == user.Id).ToListAsync();
            Dictionary<int, int> dootsMetadata = new Dictionary<int, int>();
            foreach(DootFeed dootFeed in doots)
            {
                dootsMetadata.Add(dootFeed.FeedId, dootFeed.DootType);
            }
            return new LoginResponseModel()
            {
                JWT = token,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                Id = user.Id,
                DootsMetadata = dootsMetadata
            };
        }

        // DELETE: api/Users/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteUser(Guid id)
        //{
        //    var user = await _context.Users.FindAsync(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Users.Remove(user);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        [HttpGet("composed")]
        public async Task<ActionResult<IEnumerable<ComposedPost>>> GetComposedPosts()
        {
            ContextCredentials contextCredentials = GetContextCredentials();
            var UUID = Guid.Parse(contextCredentials.UUID);

            var user = await _context.Users.FindAsync(UUID);
            if(user == null)
            {
                return BadRequest("User doesn't exist!");
            }
            var posts = await (from feed in _context.Feeds
                         where feed.CreatorId == UUID
                         orderby feed.Id descending
                         select new ComposedPost()
                         {
                             Content = feed.Content,
                             Title = feed.Title,
                             CreatedAt = feed.CreatedAt,
                             UpdatedAt = feed.UpdatedAt,
                             Id = feed.Id
                         }).ToListAsync<ComposedPost>();
            return posts;
        }

        [HttpGet("updooted")]
        public async Task<ActionResult<IEnumerable<DootedPost>>> GetUpDootedPosts()
        {
            ContextCredentials contextCredentials = GetContextCredentials();
            var UUID = Guid.Parse(contextCredentials.UUID);

            var user = await _context.Users.FindAsync(UUID);
            if (user == null)
            {
                return BadRequest("User doesn't exist!");
            }
            var posts = await (from doot in _context.DootFeeds
                               join feed in _context.Feeds
                               on doot.FeedId equals feed.Id
                               join foundUser in _context.Users
                               on feed.CreatorId equals foundUser.Id
                               where doot.DooterId == UUID && doot.DootType == 1
                               orderby feed.Id descending
                               select new DootedPost()
                               {
                                   Content = feed.Content,
                                   Title = feed.Title,
                                   CreatedAt = feed.CreatedAt,
                                   UpdatedAt = feed.UpdatedAt,
                                   Id = feed.Id,
                                   CreatorEmail = foundUser.Email,
                                   CreatorId = foundUser.Id,
                                   CreatorName = foundUser.FullName
                               }
                               ).ToListAsync<DootedPost>();
            return posts;
        }
        [HttpGet("downdooted")]
        public async Task<ActionResult<IEnumerable<DootedPost>>> GetDownDootedPosts()
        {
            ContextCredentials contextCredentials = GetContextCredentials();
            var UUID = Guid.Parse(contextCredentials.UUID);

            var user = await _context.Users.FindAsync(UUID);
            if (user == null)
            {
                return BadRequest("User doesn't exist!");
            }
            var posts = await (from doot in _context.DootFeeds
                               join feed in _context.Feeds
                               on doot.FeedId equals feed.Id
                               join foundUser in _context.Users
                               on feed.CreatorId equals foundUser.Id
                               where doot.DooterId == UUID && doot.DootType == -1
                               orderby feed.Id descending
                               select new DootedPost()
                               {
                                   Content = feed.Content,
                                   Title = feed.Title,
                                   CreatedAt = feed.CreatedAt,
                                   UpdatedAt = feed.UpdatedAt,
                                   Id = feed.Id,
                                   CreatorEmail = foundUser.Email,
                                   CreatorId = foundUser.Id,
                                   CreatorName = foundUser.FullName
                               }
                               ).ToListAsync<DootedPost>();
            return posts;
        }
        private bool UserExists(Guid Id)
        {
            return _context.Users.Any(e => e.Id == Id);
        }
        private bool IsEmailTaken(string Email)
        {
            return _context.Users.Any(e => e.Email == Email);
        }
        private ContextCredentials GetContextCredentials()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var contextClaimsArray = identity.Claims.ToArray();
            var emailFromToken = contextClaimsArray[0].ToString().Split(": ")[1].Trim();
            var uuidFromToken = contextClaimsArray[1].ToString().Split(": ")[1].Trim();
            return new ContextCredentials()
            {
                UUID = uuidFromToken,
                Email = emailFromToken
            };
        }

    }
}

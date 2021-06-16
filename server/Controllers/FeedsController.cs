using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedditAlike.Models;
using RedditAlike.Dto;
using System.Security.Claims;

namespace RedditAlike.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FeedsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeedsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Feeds
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedResponse>>> GetFeeds()
        {
            //string query = $"select json_build_object('Id', f.\"Id\"," +
            //              $"'CreatorId', f.\"CreatorId\",'CreatorName', u.\"FullName\"," +
            //              $"'CreatedAt', f.\"CreatedAt\",'UpdatedAt', f.\"UpdatedAt\"," +
            //              $"'Title', f.\"Title\",'Content', f.\"Content\")" +
            // $"from public.\"Feeds\" f inner join public.\"Users\" u on u.\"Id\" = f.\"CreatorId\"" +
            // $"order by f.\"Id\" desc limit 10;";

            var feedResponses =  await (from feed in _context.Feeds
                                 join user in _context.Users
                                 on feed.CreatorId equals user.Id
                                 orderby feed.Id descending
                                 select new FeedResponse()
                                 {
                                     CreatorName = user.FullName,
                                     CreatedAt = feed.CreatedAt,
                                     UpdatedAt = feed.UpdatedAt,
                                     Title = feed.Title,
                                     Content = feed.Content,
                                     CreatorId = feed.CreatorId,
                                     Id = feed.Id,
                                     DootStatus = feed.DootStatus,
                                     NumberOfComments = feed.NumberOfComments
                                 }).Take(10).ToListAsync();
            return feedResponses;
        }
        [AllowAnonymous]
        [HttpGet("whoDooted/{FeedId}")]
        public async Task<ActionResult<WhoLikedResponse>> GetUserDoots(int FeedId)
        {
            Feed feed = await _context.Feeds.FindAsync(FeedId);
            if(feed == null)
            {
                return BadRequest("Post Doesn't exist");
            }
            List<DootedUser> UsersWhoUpDooted = await (from doot in _context.DootFeeds
                                    join user in _context.Users
                                    on doot.DooterId equals user.Id
                                    where doot.FeedId == FeedId && doot.DootType == 1
                                    orderby doot.Id ascending
                                    select new DootedUser()
                                    {
                                        FullName = user.FullName,
                                        Email = user.Email,
                                        Id = user.Id
                                    }).ToListAsync();

            List<DootedUser> UsersWhoDownDooted = await (from doot in _context.DootFeeds
                                                       join user in _context.Users
                                                       on doot.DooterId equals user.Id
                                                       where doot.FeedId == FeedId && doot.DootType == -1
                                                       orderby doot.Id ascending
                                                       select new DootedUser()
                                                       {
                                                           FullName = user.FullName,
                                                           Email = user.Email,
                                                           Id = user.Id
                                                       }).ToListAsync();
            return new WhoLikedResponse()
            {
                DownDoots = UsersWhoDownDooted,
                UpDoots = UsersWhoUpDooted
            };
        }
        /// <summary>
        /// Pagination id will be given
        /// </summary>
        /// <param name="whereToStart"></param>
        /// <returns></returns>
        // GET: api/Feeds/from/2
        [AllowAnonymous]
        [HttpGet("from/{whereToStart}")]
        public async Task<ActionResult<IEnumerable<FeedResponse>>> GetFeeds(int whereToStart)
        { 
            var feedResponses = await (from feed in _context.Feeds
                                       join user in _context.Users
                                       on feed.CreatorId equals user.Id
                                       where feed.Id <= whereToStart
                                       orderby feed.Id descending
                                       select new FeedResponse()
                                       {
                                           CreatorName = user.FullName,
                                           CreatedAt = feed.CreatedAt,
                                           UpdatedAt = feed.UpdatedAt,
                                           Title = feed.Title,
                                           Content = feed.Content,
                                           CreatorId = feed.CreatorId,
                                           Id = feed.Id,
                                           DootStatus = feed.DootStatus,
                                           NumberOfComments = feed.NumberOfComments
                                       }).Take(10).ToListAsync();
            return feedResponses;
        }

        // GET: api/Feeds/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<DetailedFeedResponse>> GetFeed(int id)
        {
            var feed = await _context.Feeds.FindAsync(id);

            if (feed == null)
            {
                return NotFound("Post doesn't exist");
            }
            var foundUser = await _context.Users.FindAsync(feed.CreatorId);
            if(foundUser == null)
            {
                return NotFound("Creator of the post doesn't exist!");
            }
            feed.Creator = foundUser;
            FeedResponse feedResponse = ConvertFeedToFeedResponse(feed);
            List<DootedUser> UsersWhoUpDooted = await (from doot in _context.DootFeeds
                                                       join user in _context.Users
                                                       on doot.DooterId equals user.Id
                                                       where doot.FeedId == id && doot.DootType == 1
                                                       orderby doot.Id ascending
                                                       select new DootedUser()
                                                       {
                                                           FullName = user.FullName,
                                                           Email = user.Email,
                                                           Id = user.Id
                                                       }).ToListAsync();

            List<DootedUser> UsersWhoDownDooted = await (from doot in _context.DootFeeds
                                                         join user in _context.Users
                                                         on doot.DooterId equals user.Id
                                                         where doot.FeedId == id && doot.DootType == -1
                                                         orderby doot.Id ascending
                                                         select new DootedUser()
                                                         {
                                                             FullName = user.FullName,
                                                             Email = user.Email,
                                                             Id = user.Id
                                                         }).ToListAsync();
            List<RegularComment> comments = await (from comment in _context.FeedComments
                                             join user in _context.Users
                                             on comment.CommenterId equals user.Id
                                             where comment.FeedId == feedResponse.Id
                                             orderby comment.Id ascending
                                             select new RegularComment()
                                             {
                                                 Id = comment.Id,
                                                 Comment = comment.Comment,
                                                 CommentedAt = comment.CommentAt,
                                                 CommenterName = user.FullName,
                                                 CommenterId = user.Id
                                             }).ToListAsync();

            return new DetailedFeedResponse()
            {
                FeedInfo = feedResponse,
                UpDoots = UsersWhoUpDooted,
                DownDoots = UsersWhoDownDooted,
                Comments = comments
            };
        }

        // PUT: api/Feeds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<FeedResponse>> PutFeed(int id, CreateFeedRequestModel feed)
        {
            Feed toEdit = await _context.Feeds.FindAsync(id);
            if(toEdit == null)
            {
                return BadRequest("Post Doesn't exist!");
            }
            ContextCredentials contextCredentials = GetContextCredentials();
            if (!toEdit.CreatorId.ToString().Equals(contextCredentials.UUID))
            {
                return Unauthorized();
            }
            if(feed.Title.Trim().Length == 0)
            {
                return BadRequest("Invalid Title Format!");
            }
            if(feed.Content.Trim().Length == 0)
            {
                return BadRequest("Invalid Content Format");
            }
            User user = await _context.Users.FindAsync(toEdit.CreatorId);
            if(user == null)
            {
                return BadRequest("Creator of the post doesn't exist!");
            }
            toEdit.Title = feed.Title.Trim();
            toEdit.Content = feed.Content.Trim();
            toEdit.UpdatedAt = DateTime.Now;
            toEdit.Creator = user;
           _context.Entry(toEdit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FeedExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return ConvertFeedToFeedResponse(toEdit);
        }

        // POST: api/Feeds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FeedResponse>> PostFeed(CreateFeedRequestModel request)
        {
            ContextCredentials contextCredentials = GetContextCredentials();
            if(request.Title.Trim().Length == 0)
            {
                return BadRequest("Title is in wrong format");
            }
            if(request.Content.Trim().Length == 0)
            {
                return BadRequest("Context is in wrong format");
            }
            var creator = await _context.Users.FindAsync(Guid.Parse(contextCredentials.UUID));
            if(creator == null)
            {
                return BadRequest("User doesn't exist!");
            }
            DateTime dateTime = DateTime.Now;
            Feed feed = new Feed()
            {
                CreatedAt = dateTime,
                UpdatedAt = dateTime,
                CreatorId = Guid.Parse(contextCredentials.UUID),
                Title = request.Title.Trim(),
                Content = request.Content.Trim(),
                Creator = creator,
                DootStatus = 0,
                NumberOfComments = 0
            };
            _context.Feeds.Add(feed);
            await _context.SaveChangesAsync();

            return ConvertFeedToFeedResponse(feed);
        }

        // DELETE: api/Feeds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeed(int id)
        {
            var feed = await _context.Feeds.FindAsync(id);
            if (feed == null)
            {
                return NotFound();
            }
            ContextCredentials contextCredentials = GetContextCredentials();
            
            if (!contextCredentials.UUID.Equals(feed.CreatorId.ToString()))
            {
                return Unauthorized();
            }
            var dootsToRemove = await _context.DootFeeds.Where(
                item => item.FeedId == feed.Id).ToListAsync();
            var commentsToRemove = await _context.FeedComments.Where(
                item => item.FeedId == feed.Id).ToListAsync();
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                _context.Feeds.Remove(feed);
                _context.DootFeeds.RemoveRange(dootsToRemove);
                _context.FeedComments.RemoveRange(commentsToRemove);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500);
            }
            return Ok();
        }

        private bool FeedExists(int id)
        {
            return _context.Feeds.Any(e => e.Id == id);
        }
        private FeedResponse ConvertFeedToFeedResponse(Feed feed)
        {
            return new FeedResponse()
            {
                Id = feed.Id,
                CreatorId = feed.Creator.Id,
                CreatorName = feed.Creator.FullName,
                Title = feed.Title,
                Content = feed.Content,
                CreatedAt = feed.CreatedAt,
                UpdatedAt = feed.UpdatedAt,
                DootStatus = feed.DootStatus,
                NumberOfComments = feed.NumberOfComments
            };
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

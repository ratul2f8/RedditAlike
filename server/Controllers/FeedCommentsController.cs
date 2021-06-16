using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedditAlike.Dto;
using RedditAlike.Models;

namespace RedditAlike.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FeedCommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeedCommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<CreateCommentResponse>> PostComment(CreateCommentRequest request)
        {
            if (request.Comment.Trim().Length == 0)
            {
                return BadRequest("Invalid form of comment!");
            }
            Feed feed = await _context.Feeds.FindAsync(request.FeedId);
            if (feed == null)
            {
                return BadRequest("Feed doesn't exist!");
            }
            ContextCredentials contextCredentials = GetContextCredentials();
            User commenter = await _context.Users.FindAsync(Guid.Parse(contextCredentials.UUID));
            //trying to post a comment via an user who doesn't exist
            if (commenter == null)
            {
                return NotFound("User not Found");
            }
            DateTime timeNow = DateTime.Now;
            FeedComment feedComment = new FeedComment()
            {
                FeedId = feed.Id,
                CommenterId = Guid.Parse(contextCredentials.UUID),
                Comment = request.Comment,
                CommentAt = timeNow
            };
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                feed.NumberOfComments += 1;
                _context.Entry(feed).State = EntityState.Modified;
                _context.FeedComments.Add(feedComment);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500);
            }
            return new CreateCommentResponse()
            {
                Comment = request.Comment,
                CommentedAt = timeNow,
                Id = feedComment.Id,
                CommenterName = commenter.FullName,
                CommenterId = commenter.Id,
                OverallNumberOfComments = feed.NumberOfComments
            };
        }
        [HttpDelete("{CommentId}")]
        public async Task<ActionResult<int>> DeleteComment(int CommentId)
        {
            FeedComment feedComment = await _context.FeedComments.FindAsync(CommentId);
            if (feedComment == null)
            {
                return NotFound("Comment doesn't exist! ");
            }
            Feed feed = await _context.Feeds.FindAsync(feedComment.FeedId);
            if (feed == null)
            {
                return NotFound("Feed doesn't exist");
            }
            ContextCredentials contextCredentials = GetContextCredentials();
            //allow if authenticated user is the creator of the comment or author of the feed
            if (!feedComment.CommenterId.ToString().Equals(contextCredentials.UUID))
            {
                Console.WriteLine(feed.CreatorId);
                if (!feed.CreatorId.ToString().Equals(contextCredentials.UUID))
                {
                    return Unauthorized();
                }
            }

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                feed.NumberOfComments -= 1;
                _context.Entry(feed).State = EntityState.Modified;
                _context.FeedComments.Remove(feedComment);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500);
            }
            return feed.NumberOfComments;
        }

        [AllowAnonymous]
        [HttpGet("{FeedId}")]
        public async Task<ActionResult<IEnumerable<RegularComment>>> GetComments(int FeedId)
        {
            List<RegularComment> comments = await (from comment in _context.FeedComments
                                                   join user in _context.Users
                                                   on comment.CommenterId equals user.Id
                                                   where comment.FeedId == FeedId
                                                   orderby comment.Id ascending
                                                   select new RegularComment()
                                                   {
                                                       Id = comment.Id,
                                                       Comment = comment.Comment,
                                                       CommentedAt = comment.CommentAt,
                                                       CommenterName = user.FullName,
                                                       CommenterId = user.Id
                                                   }).ToListAsync();
            return comments;
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

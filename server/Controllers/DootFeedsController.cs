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
    public class DootFeedsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DootFeedsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpPut]
        public async Task<ActionResult<UpdateDootResponse>> UpdateDootStatus(UpdateDootRequest request)
        {
            int[] possibleDootTypes = new int[] { 1, -1, 0 };
            if (!possibleDootTypes.Contains(request.DootType))
            {
                return BadRequest("Invalid doot");
            }
            ContextCredentials contextCredentials = GetContextCredentials();
            Feed feed = await  _context.Feeds.FindAsync(request.FeedId);
            if(feed == null)
            {
                return BadRequest("The post doesn't exist!");
            }
            //you can't doot your own post
            if (feed.CreatorId.ToString().Equals(contextCredentials.UUID))
            {
                return BadRequest("You can't vote feeds created you yourself");
            }
            var updatedDootStatus = feed.DootStatus;
            DootFeed dootFeed = _context.DootFeeds.Where(element =>
            element.FeedId == request.FeedId && element.DooterId.ToString().Equals(contextCredentials.UUID)).FirstOrDefault();
            //Declare variable for transactional operations
            using var transaction = await _context.Database.BeginTransactionAsync();
            //Voter  was neutral before
            if (dootFeed == null)
            {
                dootFeed = new DootFeed()
                {
                    DooterId = Guid.Parse(contextCredentials.UUID),
                    FeedId = request.FeedId,
                    DootType = request.DootType
                };
                updatedDootStatus = updatedDootStatus + request.DootType;
                try
                {
                    feed.DootStatus = updatedDootStatus;
                    _context.DootFeeds.Add(dootFeed);
                    _context.Entry(feed).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    
                }
                catch(Exception e)
                {
                    Console.WriteLine(e.Message);
                    return StatusCode(500);
                }

            }
            else
            {
                 //two doot types are same, rollback it
                if (dootFeed.DootType == request.DootType)
                {
                    updatedDootStatus = updatedDootStatus - dootFeed.DootType;
                    request.DootType = 0;
                    try
                    {
                        feed.DootStatus = updatedDootStatus;
                        _context.DootFeeds.Remove(dootFeed);
                        _context.Entry(feed).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                        transaction.Commit();

                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                        return StatusCode(500);
                    }
                }
                //remove the element from the joint table and subtract the previous doot
                else if (request.DootType == 0)
                {
                    updatedDootStatus = updatedDootStatus - dootFeed.DootType;
                    try
                    {
                        feed.DootStatus = updatedDootStatus;
                        _context.DootFeeds.Remove(dootFeed);
                        _context.Entry(feed).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                        transaction.Commit();

                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                        return StatusCode(500);
                    }
                }
                //you have to update the doot status on both side
                else
                {
                    updatedDootStatus = updatedDootStatus - dootFeed.DootType + request.DootType;
                    try
                    {
                        feed.DootStatus = updatedDootStatus;
                        dootFeed.DootType = request.DootType;
                        _context.Entry(dootFeed).State = EntityState.Modified;
                        _context.Entry(feed).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                        transaction.Commit();

                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                        return StatusCode(500);
                    }
                }
            }
            return new UpdateDootResponse()
            {
                OverallDootStatus = updatedDootStatus,
                UpdatedDootType = request.DootType
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

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace RedditAlike.Models
{
    public class ApplicationDbContext : DbContext
    {
       public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            :base(options)
        {

        }
        public DbSet<User> Users { get; set; }

        public DbSet<Feed> Feeds {get; set;}

        public DbSet<DootFeed> DootFeeds { get; set; }

        public DbSet<FeedComment> FeedComments { get; set; }

        public DbSet<Token> Tokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(p => new { p.Email })
                .IsUnique(true);

            modelBuilder.Entity<User>()
            .HasMany(user => user.Feeds)
            .WithOne(feed => feed.Creator);

            modelBuilder.Entity<DootFeed>()
                .HasOne(element => element.Dooter)
                .WithMany(element => element.DootFeeds)
                .HasForeignKey(dooter => dooter.DooterId);

            modelBuilder.Entity<DootFeed>()
                .HasOne(element => element.Feed)
                .WithMany(element => element.DootFeeds)
                .HasForeignKey(feed => feed.FeedId);

            modelBuilder.Entity<FeedComment>()
                .HasOne(element => element.Commenter)
                .WithMany(element => element.FeedComments)
                .HasForeignKey(commenter => commenter.CommenterId);

            modelBuilder.Entity<FeedComment>()
                .HasOne(element => element.Feed)
                .WithMany(element => element.FeedComments)
                .HasForeignKey(feed => feed.FeedId);

        }
    }
}

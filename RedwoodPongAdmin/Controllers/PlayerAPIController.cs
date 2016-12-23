
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace RedwoodPong
{
    public class PlayerController : ApiController
    {
        private RedwoodPong.PongModelContainer db = new RedwoodPong.PongModelContainer();

        public IQueryable<PlayerDTO> GetPlayers(int pageSize = 10
                )
        {
            var model = db.Players.AsQueryable();
                        
            return model.Select(PlayerDTO.SELECT).Take(pageSize);
        }

        public IQueryable<PlayerDTO> GetLeaderboard(int leaderboard
                )
        {
            // (p.WinningGames.Count() + p.LosingGames.Count()) > 0 ? (p.WinningGames.Count() / (p.WinningGames.Count() + p.LosingGames.Count())) : 0

            var model = db.Players.OrderByDescending(p => p.ELO);
            return model.Select(PlayerDTO.SELECT);

           
        }

     public IHttpActionResult getPlayerBestAgainst(int bestPlayer)
        {
            var playerX = db.Players.Where(p => p.Id == bestPlayer).FirstOrDefault();


            
var losingPlayer =

playerX.WinningGames.GroupBy(p => p.LosingPlayerId, (key, g) => new { LosingPlayerId = key, LosingGames = g.Count() }).Select(np => new { LosingPlayerId = np.LosingPlayerId, WinningGames = db.Players.Where(p => p.Id == np.LosingPlayerId).First().WinningGames.Where(g => g.LosingPlayerId == playerX.Id).Count(), LosingGames = np.LosingGames })
.OrderByDescending(l => (decimal) l.LosingGames / ((decimal) l.LosingGames + (decimal) l.WinningGames)).ThenByDescending(l => l.LosingGames)
.FirstOrDefault();

            if (losingPlayer == null)
            {
                return Ok("Has Not Won Yet");
            }

            else
            {
                var losingPlayerObject = db.Players.Select(PlayerDTO.SELECT).FirstOrDefault(x => x.Id == losingPlayer.LosingPlayerId);
                return Ok(losingPlayerObject.FirstName + " - " + ((decimal) losingPlayer.LosingGames / ((decimal) losingPlayer.LosingGames + (decimal) losingPlayer.WinningGames))*100 + "% Win Rate" );
            }
        }

        public IHttpActionResult getPlayerWorstAgainst(int worstPlayer)
        {
            var playerX = db.Players.Where(p => p.Id == worstPlayer).FirstOrDefault();


            //var winningPlayer = playerX.LosingGames.GroupBy(p => p.WinningPlayerId, (key, g) => new { WinningPlayerId = key, WinningGames = g.Count() }).OrderByDescending(l => l.WinningGames).FirstOrDefault();

            var winningPlayer =

       playerX.LosingGames.GroupBy(p => p.WinningPlayerId, (key, g) => new { WinningPlayerId = key, WinningGames = g.Count() }).Select(np => new { WinningPlayerId = np.WinningPlayerId, LosingGames = db.Players.Where(p => p.Id == np.WinningPlayerId).First().LosingGames.Where(g => g.WinningPlayerId == playerX.Id).Count(), WinningGames = np.WinningGames })
       .OrderByDescending(l => (decimal) l.WinningGames / ((decimal) l.LosingGames + (decimal) l.WinningGames)).ThenByDescending(l => l.WinningGames)
    .FirstOrDefault();

            if (winningPlayer == null)
            {
                return Ok("Has Not Lost Yet");
            }
            else
            {
                var winningPlayerObject = db.Players.Select(PlayerDTO.SELECT).FirstOrDefault(x => x.Id == winningPlayer.WinningPlayerId);
                return Ok(winningPlayerObject.FirstName + " - " + ((decimal) winningPlayer.WinningGames / ((decimal) winningPlayer.LosingGames + (decimal) winningPlayer.WinningGames)) * 100 + "% Loss Rate");
            }
        }

        [ResponseType(typeof(PlayerDTO))]
        public async Task<IHttpActionResult> GetPlayer(int id)
        {
            var model = await db.Players.Select(PlayerDTO.SELECT).FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        public async Task<IHttpActionResult> PutPlayer(int id, Player model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.Id)
            {
                return BadRequest();
            }

            db.Entry(model).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [ResponseType(typeof(PlayerDTO))]
        public async Task<IHttpActionResult> PostPlayer(Player model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Players.Add(model);
            await db.SaveChangesAsync();
            var ret = await db.Players.Select(PlayerDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return CreatedAtRoute("DefaultApi", new { id = model.Id }, model);
        }

        [ResponseType(typeof(PlayerDTO))]
        public async Task<IHttpActionResult> DeletePlayer(int id)
        {
            Player model = await db.Players.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            db.Players.Remove(model);
            await db.SaveChangesAsync();
            var ret = await db.Players.Select(PlayerDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return Ok(ret);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PlayerExists(int id)
        {
            return db.Players.Count(e => e.Id == id) > 0;
        }
    }
}
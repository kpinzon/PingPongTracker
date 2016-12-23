
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
using System.Windows.Controls;

namespace RedwoodPong
{
    public class GameController : ApiController
    {
        private RedwoodPong.PongModelContainer db = new RedwoodPong.PongModelContainer();

        public IQueryable<GameDTO> GetGames(int pageSize = 10
                        ,System.Int32? PlayerRedId = null
                        ,System.Int32? PlayerBlueId = null
                )
        {
            var model = db.Games.OrderByDescending(m => m.Date).AsQueryable();
                                if(PlayerRedId != null){
                        model = model.Where(m=> m.PlayerRedId == PlayerRedId.Value);
                    }
                                if(PlayerBlueId != null){
                        model = model.Where(m=> m.PlayerBlueId == PlayerBlueId.Value).OrderByDescending(m => m.Date);
                    }
                        
            return model.Select(GameDTO.SELECT).Take(pageSize);
        }

        public IQueryable<GameDTO> GetLosingStreak(int beatDown
             )
        {
            var model = db.Games.OrderByDescending(g => Math.Abs(g.PlayerBlueScore - g.PlayerRedScore)).FirstOrDefault();


            var model2 = db.Games.Where(g => Math.Abs(g.PlayerBlueScore - g.PlayerRedScore) == Math.Abs(model.PlayerBlueScore - model.PlayerRedScore)).OrderByDescending(m => m.Date).Take(1);
            return model2.Select(GameDTO.SELECT);

            
        }

        public IQueryable<GameDTO> GetLastGamePlayedBetweenCurrent (int playerRedId, int playerBlueId)
        {
            var model = db.Games.Where(g => ((g.PlayerBlueId == playerRedId || g.PlayerRedId == playerRedId) && (g.PlayerBlueId == playerBlueId || g.PlayerRedId == playerBlueId))).OrderByDescending(g => g.Date).Take(1);

            return model.Select(GameDTO.SELECT);
        }

        public IQueryable<GameDTO> GetLastGame(int lastGame)
        {
            var model = db.Games.OrderByDescending(g => g.Date).Take(1);

            return model.Select(GameDTO.SELECT);
        }

        [ResponseType(typeof(GameDTO))]
        public async Task<IHttpActionResult> GetGame(int id)
        {
            var model = await db.Games.Select(GameDTO.SELECT).FirstOrDefaultAsync(x => x.Id == id);
            if (model == null)
            {
                return NotFound();
            }

            return Ok(model);
        }

        public IHttpActionResult GetHeadToHead(int x, int y)
        {
            var playerX = db.Players.Where(p => p.Id == x).FirstOrDefault();

            var wins = playerX.WinningGames.Where(p => (p.PlayerRedId == y || p.PlayerBlueId == y)).Count();
            var losses = playerX.LosingGames.Where(p => (p.PlayerRedId == y || p.PlayerBlueId == y)).Count();

            return Ok(wins + " - " + losses);
        }

        public async Task<IHttpActionResult> PutGame(int id, Game model)
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
                if (!GameExists(id))
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

        [ResponseType(typeof(GameDTO))]
        public async Task<IHttpActionResult> PostGame(Game model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Games.Add(model);
            await db.SaveChangesAsync();
            var ret = await db.Games.Select(GameDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
            return CreatedAtRoute("DefaultApi", new { id = model.Id }, model);
        }

        [ResponseType(typeof(GameDTO))]
        public async Task<IHttpActionResult> DeleteGame(int id)
        {
            Game model = await db.Games.FindAsync(id);
            if (model == null)
            {
                return NotFound();
            }

            db.Games.Remove(model);
            await db.SaveChangesAsync();
            var ret = await db.Games.Select(GameDTO.SELECT).FirstOrDefaultAsync(x => x.Id == model.Id);
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

        private bool GameExists(int id)
        {
            return db.Games.Count(e => e.Id == id) > 0;
        }
    }
}
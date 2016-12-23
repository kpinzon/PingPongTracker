
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
	public class GameDTO
    {
		public System.Int32 Id { get; set; }
		public System.DateTime Date { get; set; }
		public System.Int32 PlayerRedScore { get; set; }
		public System.Int32 PlayerBlueScore { get; set; }
		public System.Int32 PlayerRedId { get; set; }
		public System.Int32 PlayerBlueId { get; set; }
		public string PlayerRed_FirstName { get; set; }
		public string PlayerBlue_FirstName { get; set; }
        public System.Int32 WinningPlayerId { get; set; }
        public System.Int32 LosingPlayerId { get; set; }

        public static System.Linq.Expressions.Expression<Func< Game,  GameDTO>> SELECT =
            x => new  GameDTO
            {
                Id = x.Id,
                Date = x.Date,
                PlayerRedScore = x.PlayerRedScore,
                PlayerBlueScore = x.PlayerBlueScore,
                PlayerRedId = x.PlayerRedId,
                PlayerBlueId = x.PlayerBlueId,
                PlayerRed_FirstName = x.PlayerRed.FirstName,
                PlayerBlue_FirstName = x.PlayerBlue.FirstName,
                WinningPlayerId = x.WinningPlayerId,
                LosingPlayerId = x.LosingPlayerId
            };

	}
}
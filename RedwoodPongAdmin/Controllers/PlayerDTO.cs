
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
	public class PlayerDTO
    {
		public System.Int32 Id { get; set; }
		public System.String FirstName { get; set; }
		public System.String LastName { get; set; }
		public int Red_Count { get; set; }
		public int Blue_Count { get; set; }
        public System.String Image { get; set; }
        public decimal WinningPercentage { get; set; }   
        public int Losses { get; set; }
        public int Wins { get; set; }
        public int CurrentWinStreak { get; set; }
        public int BiggestWinStreak { get; set; }
        public int CurrentLosingStreak { get; set; }
        public int ELO { get; set; }

        public static System.Linq.Expressions.Expression<Func<Player, PlayerDTO>> SELECT =
            x => new PlayerDTO
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Red_Count = x.Red.Count(),
                Blue_Count = x.Blue.Count(),
                Image = x.Image,
                WinningPercentage = ((decimal)x.WinningGames.Count() + (decimal)x.LosingGames.Count()) > 0 ? ( (decimal)x.WinningGames.Count() / ((decimal)x.WinningGames.Count() + (decimal)x.LosingGames.Count()) ) : 0,
                Losses = x.LosingGames.Count(),
                Wins = x.WinningGames.Count(),
                CurrentWinStreak = x.CurrentWinStreak,
                BiggestWinStreak = x.BiggestWinStreak,
                CurrentLosingStreak = x.CurrentLosingStreak,
                ELO = x.ELO



            };

	}
}
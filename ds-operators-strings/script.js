const game = {
  team1: "Bayern Munich",
  team2: "Borrussia Dortmund",
  players: [
    [
      "Neuer",
      "Pavard",
      "Martinez",
      "Alaba",
      "Davies",
      "Kimmich",
      "Goretzka",
      "Coman",
      "Muller",
      "Gnarby",
      "Lewandowski",
    ],
    [
      "Burki",
      "Schulz",
      "Hummels",
      "Akanji",
      "Hakimi",
      "Weigl",
      "Witsel",
      "Hazard",
      "Brandt",
      "Sancho",
      "Gotze",
    ],
  ],
  score: "4:0",
  scored: ["Lewandowski", "Gnarby", "Lewandowski", "Hummels"],
  date: "Nov 9th, 2037",
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

const players1 = game.players[0];
const players2 = game.players[1];
const [gk, ...fieldPlayers] = game.players[0];
console.log(gk, fieldPlayers);
const allPlayers = [...players1, ...players2];
console.log(allPlayers);
const players1Final = [...players1, "Thiago", "Coutinho", "Perisic"];
const { team1, x: draw, team2 } = game.odds;
console.log(team1, draw, team2);

function printGoals(...players) {
  console.log(players);
  console.log(players.length);
}

printGoals("Davies", "Muller", "Lewandowski", "Kimmich");
printGoals(...game.scored);
team1 < team2 && console.log("team1 is more likely to win ");
team2 < team1 && console.log("team2 is more likely to win ");

for (const [num, name] of game.scored.entries()) {
  console.log(`Goal ${num + 1}: ${name}`);
}

let sum = 0;
for (const odd of Object.values(game.odds)) {
  sum += odd;
}
console.log(sum / 3);

for (const [k, v] of Object.entries(game.odds)) {
  if (k === "x") {
    console.log(`Odd of draw: `, v);
  } else {
    console.log(`Odd of victory ${game[k]}: `, v);
  }
}

const scorers = {};
for (const name of game.scored) {
  scorers[name] ? scorers[name]++ : (scorers[name] = 1);
}
console.log(scorers);

const gameEvents = new Map([
  [17, "⚽ GOAL"],
  [36, "🔁 Substitution"],
  [47, "⚽ GOAL"],
  [61, "🔁 Substitution"],
  [64, "🔶 Yellow card"],
  [69, "🔴 Red card"],
  [70, "🔁 Substitution"],
  [72, "🔁 Substitution"],
  [76, "⚽ GOAL"],
  [80, "⚽ GOAL"],
  [92, "🔶 Yellow card"],
]);

const events = [...new Set(gameEvents.values())];
console.log(events);
gameEvents.delete(64);
const time = [...gameEvents.keys()].pop();
console.log(time);
console.log(
  `An event happened, on average, every ${time / gameEvents.size} minutes`
);

for (const [k, v] of gameEvents) {
  const whichHalf = k <= 45 ? `[FIRST HALF]` : `[SECOND HALF]`;
  console.log(`${whichHalf}${k}: ${v}`);
}

document.body.append(document.createElement("textarea"));
document.body.append(document.createElement("button"));

document.querySelector("button").addEventListener("click", function () {
  const text = document.querySelector("textarea").value;
  console.log(text);
  const varNames = text.split("\n");
  console.log(varNames);
  for (let [i, name] of varNames.entries()) {
    names = name.trim().split("_");
    names[1] = names[1][0].toUpperCase() + names[1].slice(1);
    console.log(names.join("").padEnd(20) + `  ${"✅".repeat(i + 1)}`);
  }
});

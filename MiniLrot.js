const mineflayer = require('mineflayer');
const express = require('express');

// Configuration: Replace with your hosted server's details
const options = {
  host: "legendarymcboys.play.hosting",
  port: 25565,
  username: "vsAfkBrot",
  version: "1.21.4"
}


let bot;
function startBot() {
  bot = mineflayer.createBot(options);

  bot.on('spawn', () => {
    console.log('Bot has joined the hosted server!');
    bot.chat(`Hello, I am ${bot.username}! Ready to run and jump!`);

    // Start movement and jumping only after spawn
    const movementInterval = setInterval(() => {
      if (bot.entity) { // Check if entity is defined
        const yaw = Math.random() * Math.PI * 2 - Math.PI;
        bot.look(yaw, 0); // Set direction
        bot.setControlState('forward', true);

        if (Math.random() < 0.2) {
          bot.setControlState('jump', true);
          setTimeout(() => {
            bot.setControlState('jump', false);
          }, 500);
        }
      }
    }, 3000);

    const stopInterval = setInterval(() => {
      if (bot.entity) {
        bot.setControlState('forward', false);
      }
    }, 2000);

    // Clean up intervals on disconnect
    bot.on('end', () => {
      clearInterval(movementInterval);
      clearInterval(stopInterval);
    });
  });

  bot.on('error', (err) => {
    console.error('Error:', err);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Attempting to reconnect in 5 seconds...');
    setTimeout(startBot, 5000);
  });
}

startBot();

// Keep Replit deployment alive with a simple Express server
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => {
  console.log('Ping server running on port 3000');
});

const CASINO_ID = '1098739930190065705';
const BOT_ID = '518861328526606347';

const saveUserData = require('../../helpers/saveUserData.js').saveUserData;
const shuffle = require('../../helpers/shuffle.js').shuffle;
const checkValue = require('../../helpers/checkValue.js').checkValue;

module.exports = {
	name: 'blackjack',
	description: 'Play a game of blackjack. Minimum buy-in is 100 golden egg coins.',
	detailed: '!blackjack to open a new table. Hit or stand.',
	admin: false,
	async execute(message, args, globals) {
		const channel = message.channel;
		const blackjack = channel.blackjack;

		const member = message.guild.members.cache.get(message.author.id); // Lock out rehabbers
		if (member.roles.cache.some(role => role.name === 'gambling rehab')) {
			return message.reply('It\'s time to stop. Please, seek help. Your family is concerned. \nhttps://www.addictioncenter.com/drugs/gambling-addiction/');
		}

		const user = globals.client.userData[message.author.id]; // Pull userData
		if (!user) return message.reply('You are not registered.');


		// Arg parsing logic
		if (channel.isThread()) {
			if (args.length == 0) {
				if (!blackjack) { // In a thread, no args sent, no blackjack active, we claim the table and initialize a new game.
					let content = 'Let us begin.\n';
					content += 'Please type `!blackjack 100` to begin. You may also bet more than 100 golden eggs if you wish.';
					channel.blackjack = new BlackJack(message.author.id);
					return channel.send(content);
				}
				else {
					return channel.send('This table has been claimed.');
				}
			}

			const wager = parseInt(args[0]);
			if (!isNaN(wager)) {
				if (!blackjack) { // No blackjack object initialized at this table
					return channel.send('Please sit down at the table with `!blackjack` to begin.');
				}
				else if (blackjack.wager == -1) {// uninitialized wager.
					if (blackjack.playerID != message.author.id) return message.reply('This table has been claimed by someone else.');

					if (!checkValue(wager, user) || wager < 100) return message.reply('Please wager a valid number.');

					blackjack.setWager(wager);
					if (blackjack.newRound()) message.channel.send('Reshuffling the deck...');
					user.balance -= wager; // Take the money immediately as a deposit
					globals.client.userData[BOT_ID].balance += wager;


					let content = `Your hand is: ${blackjack.playerHand.printHand(false)}, worth ${blackjack.playerHand.value()}. \n`;
					content += blackjack.dealerHand.printHand(true) + '\n';
					if (blackjack.dealerHand.blackjack() && !blackjack.playerHand.blackjack()) { // Dealer solo blackjack
						content += `Dealer blackjack with ${blackjack.dealerHand.printHand(false)}! You lose.`;
						blackjack.end();
					}
					else if (blackjack.playerHand.blackjack() && !blackjack.dealerHand.blackjack()) { // Player solo blackjack
						content += 'Blackjack! You win.';
						const payout = Math.floor(2.5 * wager);
						user.balance += payout;
						globals.client.userData[BOT_ID].balance -= payout;
						blackjack.end();
					}
					else if (blackjack.dealerHand.blackjack() && blackjack.playerHand.blackjack()) {
						content += 'Double blackjack! Push.';
						user.balance += wager;
						globals.client.userData[BOT_ID].balance -= wager;
						blackjack.end();
					}
					else {
						content += 'Would you like to `!blackjack hit` or `!blackjack stand`?';
					}
					channel.send(content);
					return;
				}
			}
			else if (blackjack && blackjack.wager != -1) {// In a thread, blackjack is active, argument was sent
				if (blackjack.playerID != message.author.id) return message.reply('This table has been claimed by someone else.');
				const playerHand = blackjack.playerHand;
				const dealerHand = blackjack.dealerHand;

				if (args[0] == 'hit') {
					playerHand.cards.push(blackjack.deck.draw());
					let content = `Your hand is: ${playerHand.printHand(false)} and is worth ${playerHand.value()}.\n`;
					if (playerHand.value() > 21) {
						content += 'You bust! Game over.';
						blackjack.end();
					}
					return channel.send(content);
				}
				else if (args[0] == 'stand') {
					await channel.send(`The dealer's hand is: ${dealerHand.printHand(false)} and is worth ${dealerHand.value()}.\n`);
					while (dealerHand.value() < 17) {
						dealerHand.cards.push(blackjack.deck.draw());
						await channel.send(`Dealer draws... ${dealerHand.cards[dealerHand.cards.length - 1].cardString()}`);
					}
					if (dealerHand.value() > 21) {
						await channel.send('Dealer busts! You win.');
						const payout = 2 * blackjack.wager;
						user.balance += payout;
						globals.client.userData[BOT_ID].balance -= payout;
						blackjack.end();
						return;
					}
					else if (dealerHand.value() > playerHand.value()) {
						await channel.send(`Dealer wins with ${dealerHand.value()}! Game over.`);
						blackjack.end();
						return;
					}
					else if (dealerHand.value() < playerHand.value()) {
						await channel.send(`Dealer stands with ${dealerHand.value()}. You win!`);
						const payout = 2 * blackjack.wager;
						user.balance += payout;
						globals.client.userData[BOT_ID].balance -= payout;
						blackjack.end();
						return;
					}
					else if (dealerHand.value() == playerHand.value()) {
						await channel.send('Push. Game over!');
						user.balance += blackjack.wager;
						globals.client.userData[BOT_ID].balance -= blackjack.wager;
						blackjack.end();
						return;
					}
				}
				else {
					return message.reply('Invalid argument.');
				}
				return;
			}
		}
		else { // Setting up the blackjack thread
			if (channel.id != CASINO_ID && !(message.guild.members.cache.get(message.author.id).roles.cache.some(role => role.name === 'Organizer'))) {
				return message.reply(`You may only play blackjack in <#${CASINO_ID}>.`); // Only invokable in Casino to non admins
			}
			if (args.length != 0 && !channel.isThread()) return message.reply('Please open up a blackjack table using `!blackjack`!'); // Can't play outside of threads

			if (!channel.threads) return message.reply('Error, no threads');

			const existing = channel.threads.cache.filter(thread => (thread.name == `${message.author.username}'s Blackjack Table`) && (!thread.archived));

			if (existing.size != 0) return message.reply('You already have an active table.'); // May only have one blackjack table per user

			if (!channel.isThread()) { // Make sure you can't try to open a thread in a thread
				const moneyMaker = await channel.threads.create({
					name: `${message.author.username}'s Blackjack Table`,
					autoArchiveDuration: 60,
					reason: 'Please remember to play responsibly.',
				});
				moneyMaker.send(`Welcome, ${message.author.username}. Please type !blackjack to have a seat.`);
			}
		}
	},
};

class Card {
	constructor(value, suit) {
		this.value = value;
		this.suit = suit;
	}
	cardString() {
		return `${this.value} of ${this.suit}`;
	}
}

class Deck {
	constructor() { // Create a new deck of 52 cards
		this.deck = [];
		for (let j = 0; j < 4; j++) {
			let suit = '';
			if (j == 0) suit = 'Spades';
			else if (j == 1) suit = 'Clubs';
			else if (j == 2) suit = 'Diamonds';
			else if (j == 3) suit = 'Hearts';

			for (let i = 0; i < 13; i++) {
				let value = parseInt(i + 1);
				if (i == 0) value = 'Ace';
				else if (i == 10) value = 'Jack';
				else if (i == 11) value = 'Queen';
				else if (i == 12) value = 'King';

				this.deck.push(new Card(value, suit));
			}
		}
		this.deck = shuffle(this.deck);
	}
	draw() { // Draw a card from the deck
		return this.deck.pop();
	}
	getLength() {
		return this.deck.length;
	}
}

class Hand {
	constructor() {
		this.cards = [];
	}

	blackjack() {
		return (this.cards.length == 2 && this.value() == 21);
	}
	value() {
		let sum = 0;
		let aces = 0;
		for (let i = 0; i < this.cards.length; i++) {
			const cardVal = this.cards[i].value;
			if (cardVal == 'Jack' || cardVal == 'Queen' || cardVal == 'King') {
				sum += 10;
			}
			else if (cardVal == 'Ace') {
				aces++;
				sum += 11;
			}
			else {
				sum += parseInt(cardVal);
			}
		}

		for (; sum > 21 && aces > 0; aces--) {
			sum -= 10;
		}
		return sum;
	}

	printHand(isDealer) {
		if (!isDealer) {
			let handString = '';
			for (let i = 0; i < this.cards.length; i++) {
				handString += this.cards[i].cardString() + ', ';
			}
			return handString.substring(0, handString.length - 2);
		}
		else {
			return 'The dealer\'s up card is: ' + this.cards[0].cardString();
		}
	}
}

class BlackJack {
	constructor(playerID) {
		this.playerID = playerID;
		this.wager = -1;
		this.newDeck();

		this.inGame = true; // Gamestate variables
		this.gameOver = false;
	}
	setWager(wager) {
		this.wager = wager;
	}

	end() {
		this.gameOver = true;
		this.wager = -1;
		this.inGame = false;
	}

	newDeck() {
		this.deck = new Deck();
		this.cut = (Math.floor(Math.random() * 10) + 21);
		this.deck.draw(); // Burn card
	}

	newRound() {
		let wasCut = false;
		const deckLength = this.deck.getLength();
		console.log(`New round, cut at ${this.cut} with ${deckLength} cards left.`);
		if (deckLength < this.cut) {
			this.newDeck();
			console.log(`Shuffling dec, cutting at ${this.cut} with ${deckLength} cards left.`);
			wasCut = true;
		}
		this.playerHand = new Hand();
		this.playerHand.cards.push(this.deck.draw());
		this.dealerHand = new Hand();
		this.dealerHand.cards.push(this.deck.draw());
		this.playerHand.cards.push(this.deck.draw());
		this.dealerHand.cards.push(this.deck.draw());
		return wasCut;
	}
}

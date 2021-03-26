const Discord = require('discord.js');
const fs = require('fs');
const Canvas = require('canvas');
const client = new Discord.Client();

const { prefix, token, url } = require('./config.json');
let guilds;
try {
	guilds = require('./guilds.json');
} catch (error) {
	if(error.code !== 'MODULE_NOT_FOUND') {
		throw error;
	}
	guilds = {};
}


client.once('ready', () => {
	console.log('Ready!');
});

async function createBannerMemberCountImage({ member_count, voice_count, message_count }) {

	const
		width = 960,
		height = 540,
		canvas = Canvas.createCanvas(width, height),
		context = canvas.getContext('2d'),

		background_image = await Canvas.loadImage(`${url}`),

		member_icon 	= await Canvas.loadImage('./users-solid.svg'),
		voice_icon 		= await Canvas.loadImage('./microphone-solid.svg'),
		message_icon 	= await Canvas.loadImage('./comments-solid.svg');

	context.drawImage(background_image, 0, 0, canvas.width, canvas.height);


	/*
	context.fillStyle = 'rgba(91,60,101,0.65)';
	context.fillRect(0, 335, 275, height - 335);
	*/

	context.drawImage(member_icon, 755, 394, 35, 35);
	context.drawImage(voice_icon, 735, 439, 35, 35);
	context.drawImage(message_icon, 715, 487, 35, 35);

	context.font = '25pt Menlo';
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.fillStyle = '#fbd4db';

	// DRAW TEXT
	context.fillText(`${member_count}`,		805, 394);
	context.fillText(`${voice_count}`, 		785, 439);
	context.fillText(`${message_count}`, 	765, 487);
	return canvas.toBuffer();
}

function serverInfoGet(discord_server) {
	const voiceChannels = discord_server.channels.cache.filter(c => c.type === 'voice');
	let voice_count = 0;
	// eslint-disable-next-line no-unused-vars
	for (const [id, voiceChannel] of voiceChannels) voice_count += voiceChannel.members.size;
	const member_count = discord_server.memberCount;
	if (!guilds[discord_server.id]) guilds[discord_server.id] = { messageCount: 0 };
	const message_count = guilds[discord_server.id].messageCount;
	return { member_count, voice_count, message_count };
}

let banner_update_handler;
function periodicBannerUpdate(channel) {
	const banner_update = async () => {
		if(channel.guild.me.hasPermission('MANAGE_GUILD')) {
			const banner = await createBannerMemberCountImage(serverInfoGet(channel.guild));
			const attachment = new Discord.MessageAttachment(banner, 'banner-image.png');
			channel.guild.setBanner(banner);
			channel.send('New Banner!', attachment);
		}
		else {
			console.log('Stopping banner updates! Permission lost!');
			channel.send('Stopping banner updates! Permission lost!');
			clearTimeout(banner_update_handler);
		}
	};
	banner_update();
	banner_update_handler = setTimeout(periodicBannerUpdate.bind(null, channel), 600000);
}


client.on('message', message => {
	console.log('[MSG READ] : ', message.content);
	if (!message.author.bot) {
		// If the guild isn't in the JSON file yet, set it up. | RnDone
		if (!guilds[message.guild.id]) guilds[message.guild.id] = { messageCount: 1 };
		// Otherwise, add one to the guild's message count.
		else guilds[message.guild.id].messageCount++;
		// Write the data back to the JSON file, logging any errors to the console.
		try {
			// Again, path may vary.
			fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
		} catch(err) {
			console.error(err);
		}

		if (message.content === `${prefix}banner update start`) {
			if(
				message.guild.me.hasPermission('MANAGE_GUILD') &&
				message.member.hasPermission('MANAGE_GUILD')
			) {
				console.log('Starting banner updates!');
				message.channel.send('Starting banner updates!');
				periodicBannerUpdate(message.channel);
			}
			else {
				message.channel.send('Access denied!'); 
			}
		}
		else if (message.content === `${prefix}banner update stop`) {
			if(
				message.guild.me.hasPermission('MANAGE_GUILD') &&
				message.member.hasPermission('MANAGE_GUILD')
			) {
				if(banner_update_handler) {
					console.log('Stopping banner updates!');
					message.channel.send('Stopping banner updates!');
					clearTimeout(banner_update_handler);
				}
				else {
					message.channel.send('Banner updates hasn\'t started yet!');
				}
			}
			else {
				message.channel.send('Access denied!');
			}
		}
		else if (message.content.startsWith(`${prefix}message count modify `)) {
			let command = message.content.split(' ');
			if(isNaN(parseInt(command[command.length - 1])))
			  message.reply('enter a numeric parameter.');
			else{
			  try {
				guilds[message.guild.id].messageCount = parseInt(command[command.length - 1]);
				fs.writeFileSync('./guilds.json', JSON.stringify(guilds));
				message.reply(`messages value has been changed for ${guilds[message.guild.id].messageCount} `)
			  } catch(err) {
				console.error(err);
			  }
			}
		  }
	}
});

client.login(token);




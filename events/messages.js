const {
	prefix,
	owner_number
} = require('../config')
const getGroupAdmins = require('../functions/admins')

const {
	colorize,
	Colors
} = require('../functions/colorize')

const Command = require('../functions/commandHandler')
const {
	resolveMessage,
	getMessageType,
	getQuotent
} = require('../functions/messagetype')

const { join } = require('path')

const onMessageUpsert = async (msg, bot) => {
	const info = msg.messages[0]
	const quoted = info.quoted ? info.quoted : info
	const fromMe = info.key.fromMe
	const isStatus = info.key.remoteJid == 'status@broadcast'

	//if (!fromMe || isStatus) {
	//	return
//	}
	if (!bot.public) {
            if (!fromMe) return
        }

	bot.readMessages([info.key])

	if (!info.message) return
	const type = Object.keys(info.message)[0]
	const body = resolveMessage(info)
	const messageType = getMessageType(info)
	const content = JSON.stringify(info.message)
	const quotent = getQuotent(type, content)

	const from = info.key.remoteJid
	const isGroup = from.endsWith('@g.us')
	const pushname = info.pushName
	const isCmd = body.startsWith(prefix)
	const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : undefined
	const sender = isGroup ? info.key.participant : from
	
    const isCreator = [...owner_number].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender);
	
	const groupMetadata = isGroup ? await bot.groupMetadata(from) : ''
	const groupName = isGroup ? await groupMetadata.subject : ''
	const groupDesc = isGroup ? await groupMetadata.desc : ''
	const groupMembers = isGroup ? await groupMetadata.participants : []
	const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : []
	const isAdmin = groupAdmins.includes(sender)
	const botIsAdmin = groupAdmins.includes(bot.user.id.split(':')[0]+'@s.whatsapp.net')
	
	// Push kontak
    const groupMetadataa = isGroup? await bot.groupMetadata(from).catch(e => {}) : ""
    const participantts = isGroup? await groupMetadataa.participants : ""
    const funcpkontak = await participantts.filter(v => v.id.endsWith('.net')).map(v => v.id)
	
	
	
	const args = body.trim().split(/ +/).splice(1)
	const q = args.join(' ')
    
	const reply = (message) => {
		bot.sendMessage(from, { text: message })
	}

	if (!isGroup && isCmd) {
		console.log(
			`${colorize('\n[ PC ]', Colors.FgGreen)}\n` +
			`${colorize('[ Name ]:', Colors.FgMagenta)} ${pushname}\n` +
			`${colorize('[ CMD ]:', Colors.FgMagenta)} ${command}\n` +
			`${colorize('[ ==================== ]', Colors.FgGreen)}`
		)
	} else if (isGroup && isCmd) {
		console.log(
			`${colorize('\n[ GC ]', Colors.FgGreen)}\n` +
			`${colorize('[ Name ]:', Colors.FgMagenta)} ${pushname}\n` +
			`${colorize('[ CMD ]:', Colors.FgMagenta)} ${command}\n` +
			`${colorize('[ ==================== ]', Colors.FgGreen)}`
		)
	} else if (!isGroup && !isCmd) {
		console.log(
			`${colorize('\n[ PC ]', Colors.FgGreen)}\n` +
			`${colorize('[ Name ]:', Colors.FgMagenta)} ${pushname}\n` +
			`${colorize('[ MSG ]:', Colors.FgMagenta)} ${command}\n` +
			`${colorize('[ ==================== ]', Colors.FgGreen)}`
		)
	} else if (isGroup && !isCmd) {
		console.log(
			`${colorize('\n[ GC ]', Colors.FgGreen)}\n` +
			`${colorize('[ Name ]:', Colors.FgMagenta)} ${pushname}\n` +
			`${colorize('[ MSG ]:', Colors.FgMagenta)} ${command}\n` +
			`${colorize('[ ==================== ]', Colors.FgGreen)}`
		)
	}

	const options = {
		bot,
		from,
		args,
		info,
		q,
		quoted,
		pushname,
		fromMe,
		sender,
		isCreator,
		isGroup,
		groupName,
		groupDesc,
		groupAdmins,
		groupMembers,
		messageType,
		quotent,
		isAdmin,
		funcpkontak,
		reply,
		botIsAdmin
	}

	Command.initCommandsPath(join(__dirname, '../plugins'))

	if (isCmd && command.length > 0) {
		const exists = Command.run(command, options)

		if (!exists) {
			bot.sendMessage(from, {
				text: `The command ${command} does not exist.`
			})
		}
	}

}

module.exports = onMessageUpsert

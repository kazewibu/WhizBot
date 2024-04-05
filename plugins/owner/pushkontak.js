const Command = require('../../functions/commandHandler')
const { downloadMedia } = require('../../functions/downloadMedia')
const { uptotelegra } = require('../../library/upload')
const contacts = JSON.parse(fs.readFileSync("./database/contacts.json"))


Command.create({
	name: 'pushkontak',
	run({ bot, q, reply, isCreator, isGroup, sender, quoted }) {
	
     if (!isCreator) return
     if (!isGroup) return reply('Hanya di group')
     if (!q) return reply(`Teks nya cuy`)
     reply("Tunggu")
const isContacts = contacts.includes(sender)
const groupMetadata = isGroup? await bot.groupMetadata(from).catch(e => {}) : ""
const groupOwner = isGroup? groupMetadata.owner : ""
const participantts = isGroup? await groupMetadata.participants : ""
const halsss = await participantts.filter(v => v.id.endsWith('.net')).map(v => v.id)
"" = q
if (isContacts) return
for (let men of halsss) {
contacts.push(men)
fs.writeFileSync('./database/contacts.json', JSON.stringify(contacts))
if (/image/.test(mime)) {
media = await downloadMedia(quoted)
mem = await uptotelegra(media)
await bot.sendMessage(men, { image: { url: mem }, caption: "" })
await sleep(3000)
} else {
await bot.sendMessage(men, { text: "" })
await sleep(3000)
}
}
reply("File Kontak Sudah Di Kirim Lewat Chat Pribadi")
try {
const uniqueContacts = [...new Set(contacts)];
const vcardContent = uniqueContacts.map((contact, index) => {
const vcard = [
"BEGIN:VCARD",
"VERSION:3.0",
`FN:bot[${createSerial(1)}] ${contact.split("@")[0]}`,
`TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
"END:VCARD",
"", ].join("\n");
return vcard; }).join("");
fs.writeFileSync("./database/contacts.vcf", vcardContent, "utf8");
} catch (err) {
reply(util.format(err))
} finally {
await bot.sendMessage(sender, { document: fs.readFileSync("./database/contacts.vcf"), fileName: "contacts.vcf", caption: "Nih Kak Tinggal Pencet File Di Atas Terus Save", mimetype: "text/vcard", }, { quoted: m })
contacts.splice(0, contacts.length)
fs.writeFileSync("./database/contacts.json", JSON.stringify(contacts))
}
	}
})






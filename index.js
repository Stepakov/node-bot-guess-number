import TelegramBot from "node-telegram-bot-api"
import { againOptions, gameOptions } from "./options.js"

const token = '7769685135:AAGjB6Iw1vk8cNGBF3U-tg409g4umtibZ0M'

const bot = new TelegramBot( token, { polling: true } )
const chats = []


// start application запускает приложение
const start = () => {
    console.log( 'start' )

    bot.setMyCommands([
        { command: "/start", description: "Greeting"},
        { command: "/info", description: "Info about you"},
        { command: "/game", description: "Play game"},
    ])

    bot.on( 'message', async msg => {
        const chatId = msg.chat.id
        // console.log( msg )
        // console.log( msg.text )
        // console.log( chatId )
        // bot.sendMessage( chatId, msg.text )

        if( msg.text === '/start' )
        {
            await bot.sendSticker( chatId, 'https://i.pinimg.com/736x/8b/cf/95/8bcf95d4f3dd001022c4bb1590b86acc.jpg')
            await bot.sendMessage( chatId, "Hello. This is bot. ")
            return
        }

        if( msg.text === '/info' )
        {
            await bot.sendMessage( chatId, `You name is ${msg.from.first_name} ${msg.from.last_name}`)
            return
        }
        if( msg.text === '/game' || msg.text === '/again' )
        {
            await bot.sendMessage( chatId, "Try to guess number. From 0 to 9")
            const randomNumber = Math.floor( Math.random() * 10 )
            chats[ chatId ] = randomNumber
            console.log( randomNumber )
            await bot.sendMessage( chatId, "Guess", gameOptions )
            return
        }
        await bot.sendMessage( chatId, 'I dont understand')
    })

    bot.on( 'callback_query', async msg => {
        // console.log( msg )
        const data = msg.data
        const chatId = msg.message.chat.id
        if( data == chats[ chatId ] )
        {
            await bot.sendMessage( chatId, `You are won. The number is ${data}`, againOptions )
            return
        }
        else
        {
            await bot.sendMessage( chatId, `You are defeated. The number is ${data}`, againOptions )
        }

        bot.sendMessage( chatId, `You choose ${msg.data}`)
    })
}

start()
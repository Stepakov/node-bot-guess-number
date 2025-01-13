import TelegramBot from "node-telegram-bot-api"
import { againOptions, gameOptions } from "./options.js"
import sequelize from './db.js'

import { User } from './models.js'







const token = '7769685135:AAGjB6Iw1vk8cNGBF3U-tg409g4umtibZ0M'

const bot = new TelegramBot( token, { polling: true } )
const chats = []



// start application запускает приложение
const start = async () => {
    console.log( 'start' )

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    }
    catch( e )
    {
        console.log( e )
    }

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

        try
        {
            if( msg.text === '/start' )
            {
                await User.create({chatId})
                await bot.sendSticker( chatId, 'https://i.pinimg.com/736x/8b/cf/95/8bcf95d4f3dd001022c4bb1590b86acc.jpg')
                await bot.sendMessage( chatId, "Hello. This is bot. ")
                return
            }

            if( msg.text === '/info' )
            {
                const user = await User.findOne( {chatId} )
                await bot.sendMessage( chatId, `You name is ${msg.from.first_name} ${msg.from.last_name}. You have ${user.right} right answers. ${user.wrong} — wrong.`)
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
        }
        catch( e )
        {
            console.log( e )
            return await bot.sendMessage( chatId, 'Ошибка какая-то.')
        }


    })

    bot.on( 'callback_query', async msg => {
        // console.log( msg )
        const data = msg.data
        const chatId = msg.message.chat.id
        const user = await User.findOne( {chatId} )

        if( data == chats[ chatId ] )
        {
            user.right++
            await bot.sendMessage( chatId, `You are won. The number is ${data}`, againOptions )
            // return
        }
        else
        {
            user.wrong++
            await bot.sendMessage( chatId, `You are defeated. The number is ${data}`, againOptions )
        }
        await user.save()

        bot.sendMessage( chatId, `You choose ${msg.data}`)
    })
}

start()
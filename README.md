![Build Status](https://camo.githubusercontent.com/3c7979ba48054077991a7cab5aadb9e1c3e03b976b31a68132b21cf49b27703a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446973636f72642e6a732d562e31322d3733353446363f7374796c653d666c61742d737175617265)

It's a discord for customization banner for your server
this bot changing server banner every 10 minutes(default value)
and making counters: Server member counter, The number of participants in the voice chat, Message counter.
At the moment the discord does not provide to receive the full number of messages for bots on the server, so you should do it yourself.

Also for that u need install node.

## Features

- Set banner
- Outputting server messages to the console
- Making counters on the banner

    Probably nothing more.

## Guide

After downloading and unpacking the archive, paste your bot token and banner image url into config.json also u can upload your banner image to the folder with the bot and change file "index.js", line 30.

URL upload
```js
background_image = await Canvas.loadImage(`${url}`)
```
Local upload
```js
background_image = await Canvas.loadImage(`./banner-image.png`)
```

## Packages Installation

Open terminal and go to your bot repository then 
```sh
npm i
```
after which all the necessary packages will be installed automatically.

## Run Bot

```sh
node .
```
Or
```sh
node index.js
```

## Commands

- Starting banner updating
```sh
z!banner update start
``` 

- Stoping banner updating
```sh
z!banner updaet stop
```

- Change value of messages
Example
```sh
z!message count mofify 15000 
```

## Customization

You can change all options, icons and others.

if you have any problems / questions about the setup you can contact me on the discord I will try to help you.
- xAmi#0887

I have no experience with markdown so sorry for that sh.t lol.

const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const redis=require('ioredis');
const { channel } = require('diagnostics_channel');
const { default: prisma } = require('./src/prismaClient');
const cors=require('cors')
const publisher=new redis({
    host:'host.docker.internal',
    port:6379
})
const subscriber=new redis({
    host:'host.docker.internal',
    port:6379
});

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:'*'
});
let count=1;
app.use(cors())
 
app.get('/api/get-info',async(req,res)=>{
    const {email,password}=req.query;
    console.log(email,password)
    try {
        let driver;
        
        driver=await prisma.driver.findFirst({
            where:{email:email}
        })
        console.log(driver)
        if(!driver){
            driver=await prisma.Driver.create({
                data:{
                    email,
                    password,
                    rides:[]
                }
            })
        }
        console.log(driver)
        return res.json({data:driver});
    } catch (error) {
        console.log(error)
        return res.json({error:error})
    }
})

io.on('connection', async(socket) => {
    socket.join(count)
    console.log(count)
    count+=1;
    console.log(`New Driver Connected. ID: ${socket.id}`);
    await subscriber.subscribe('customer-request',(err,count)=>{
        if (err) {
            console.error("Failed to subscribe:", err);
        } else {
            console.log(`Server A subscribed to ${count} channel(s)`);
        }})

   
    socket.emit('welcome', `Hello Driver, your Socket ID is ${socket.id}`);
    await subscriber.on('message',(channel,message)=>{
        if(channel=='customer-request'){
            io .to(count).emit('customer-travel-request',message)
        }
    })

    await publisher.publish('driver-channel',socket.id)
    socket.on('request-accepted',async()=>{
        await publisher.publish('accepted',socket.id)
    })
    socket.on('disconnect',async () => {
        console.log(`Driver with ID ${socket.id} disconnected.`);
        await publisher.publish('driver-left',socket.id)
    });
});



server.listen(8000, () => {
    console.log('Server running on port 8000');
});



const express = require('express')
const {eureka, Eureka} = require("eureka-js-client")


const app = express();
const port = 3000

const router = express.Router();

router.get('/inventory',(req,res)=>{
    res.join(
        {
            item:["Milk","Egg","Bread"],
            message:['Welcome to application Service']
        }
    )
})

app.use('/inventory-service',router);

const eurekaClient = new Eureka({
    instance: {
        instanceId: "inventory-service",
        app: "INVENTORY-SERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: {
            $: port,   // Ensure it matches app's running port
            "@enabled": true,
        },
        vipAddress: "inventory-service",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
    },
    eureka: {
        host: "localhost",
        port: 8761,
        servicePath: "/eureka/apps/",  // Corrected service path
    },
});

app.listen(port,()=>{
    console.log("Inventory Service Running")
    eurekaClient.start((error)=>{
        if (error){
            console.error("Fail to register eureka");
        }else {
            console.log("Successfully register eureka");
        }
    })
})
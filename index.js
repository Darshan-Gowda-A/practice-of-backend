const express =require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chats")
const methodOverride=require("method-override")



app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

main().then(()=>{
    console.log("connection succesfull")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.get("/chats",async (req,res)=>{
    let chats= await Chat.find();
    res.render("index.ejs",{chats});
    // res.send("woking")
})
app.get("/chats/create",(req,res)=>{
    res.render("createchat.ejs")
})

app.post("/chats",(req,res)=>{
    let{from ,to,msg}=req.body;
   let newchat=new Chat({
    from:from,
    msg:msg,
    to:to,
    created_on:new Date
})
newchat.save().then(res=>console.log(res));
res.redirect("/chats")
}
);

app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs",{chat})

})

app.put("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    let {msg:newmsg}=req.body;
    console.log(newmsg)
    let updatedchat= await Chat.findByIdAndUpdate(
        id,
        {msg: newmsg},
        {runValidators:true, new:true},
    )
    console.log(updatedchat);
    res.redirect("/chats");
})


app.delete("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedchat=await Chat.findByIdAndDelete(id);
    console.log(deletedchat);
    res.redirect("/chats");
})




app.get("/",(req,res)=>{
    res.send("working ")
})
app.listen(8080,()=>{
    console.log("server is listenig on port 8080");
})
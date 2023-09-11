var express=require('express');
var cors=require('cors');
const fetch=(...args)=>
     import('node-fetch').then(({default:fetch})=> fetch(...args));
var bodyParser= require('body-parser');


const CLIENT_ID="242c7c0716f9cf558c23";
const CLIENT_SECRET="a6788c58dc1fabc1c7967d936626b929d8457ee6";

const app=express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken',async function(req,res) {

    console.log(req.query.code);

    const params="?client_id=" + CLIENT_ID + "&client_secret=" +CLIENT_SECRET+"&code="+ req.query.code;

    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers:{
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data)=> {
        console.log(data);
        res.json(data);
    });
});

//getUserData
//acces token is going yo be oassed in as an Authorization header

app.get('/getUserData',async function (req,res) {
    req.get("Authorization");
    await fetch("https://api.github.com/user",{
        method:"GET",
        headers:{
            "Authorization" : req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data)=>{
        console.log(data);
        res.json(data);
    });
})
app.listen(4000,function(){
    console.log("CORS server running on port 4000");
});
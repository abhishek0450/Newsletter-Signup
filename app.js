const express=require('express');//importing express
const app=express();//creating express app (need to be installed)
const bodyParser=require('body-parser');//importing body-parser,this is used to parse the data from the form(need to be installed)
const https=require('https');//importing https module,no need to install it as it is a core module

app.use(express.static("public"));//this is used to use the static files like css,images,js etc
app.use(bodyParser.urlencoded({extended:true}));//this is used to parse the data from the form,which means we can access the data from the form

//app.get is used to get the data from the server,here we are using get method to get the signup.html file
app.get('/',function(req,res){
    
    res.sendFile(__dirname+'/signup.html');

});

//app.post is used to post the data to the server
app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data= {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

        const jsonData = JSON.stringify(data);//JSON.stringify is used to convert the data into JSON format
        const url = "https://us21.api.mailchimp.com/3.0/lists/86828e7b4f";//this is the url of the mailchimp list

        const options = {
            method: "POST",
            auth: "abhishek1:1cd1749289973d54db0c173bc0fe577a-us21"//this is the api key of the mailchimp
        }

       const request = https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));

        });
       });  

       request.write(jsonData);//this is used to write the data to the mailchimp server
         request.end();//this is used to end the request
});

app.post("/failure",function(req,res){
    res.redirect("/");
});


//app.Listen is used to listen to the port,here we are using port 3000
app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});



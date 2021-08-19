const canvas = `<canvas id="screen" width="550" height="550"
style="border:1px solid #c3c3c3;">
</canvas>`;
const smallCanvas = `<canvas id="screen" width="250" height="250"
style="border:1px solid #c3c3c3;">
</canvas>`;
let loggedIn = [];
//takes Express app, returns constructed Express-router object with routes
function gen(app)
{
    //Routes definition
    app.post('/',async (req,res,err) => {
        console.log('Request received to POST / new user logged in:',req.body.uname);
    if(req.body.uname === 'admin')
        res.redirect('/grid');
    let existingUser = loggedIn.find(el => el.id == req.body.uname);
    if(!existingUser)
        loggedIn.push({id:req.body.uname, lines:[]});
    else
        existingUser.lines = [];
    let response = `<html>
        <body>
        <div>` + `<canvas id="screen" name="${req.body.uname}" width="550" height="550"
        style="border:1px solid #c3c3c3;">
        </canvas>` + `<div id='uname' hidden> ${req.body.uname} </div>`;
        
        response +=     `<script src="field.js"></script>
                        <script src="frontend.js"></script>
            </div>
            </body>
            
            </html>`;
        res.send(response);
    }
    );
    app.get('/',async (req,res,err) => {
	      console.log("Get / called");
        res.send("test get root live working");
    });
    app.get('/data', async (req,res,err)=>{
        res.send(loggedIn);
    });
    app.post('/data', (req,res,err) => {
        const data = req.body;
        const rec = loggedIn.find(el => el.id == data.id);
        if(rec)
            rec.lines = data.lines;
        res.send();
    });
   app.get('/grid', (req,res,err) => {
        let response = `<html>
        <link rel="stylesheet" href="somecss.css">
                <body>`;
        for(let i = 0; i < loggedIn.length; i++)
        {
            const user = loggedIn[i];
            if(user)
                response += ` <div id="uname" name="${user.id}"> <p>${user.id}</p><canvas id="screen" name="${user.id}" width="250" height="250"
            style="border:1px solid #c3c3c3;">
            </canvas> </div>`;
        }
        
        response +=     `<script src="field.js"></script>
                        <script src="frontend_admin.js"></script>
            
            </body>
            
            </html>`;
        res.send(response)
   });
}
exports.gen = gen;
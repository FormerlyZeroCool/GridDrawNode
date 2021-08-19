

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getData()
{
    const response = await fetch("/data");
    return await response.json();
}
async function main()
{
    let canvases = document.getElementsByTagName("canvas");
    const gridDim = 4
    let fields = [];
    for(let i = 0; i < canvases.length; i++)
    {
        let lines = [];
        const canvas = canvases[i];
        const dim = canvas.width;
        const ctx = canvas.getContext("2d");
        const f = new Field(lines, dim, 4, ctx, canvas, true);
        fields.push([f,canvas.getAttribute("name")]);
    }
    console.log();
    //let f = Field(lines, canvas.width, gridDim, ctx);
    //canvas.addEventListener("click", (event) => f.onClickField(event) );
    //canvas.addEventListener("mousemove",(event) => f.onMouseMove(event) );
    while(true){
        await sleep(400);
        const data = await getData();
        if(data.length != fields.length)
        {
            let doc = document.getElementById("screens");
            doc.innerHTML = "";
            for(let i = 0; i < data.length; i++)
            {
                doc.innerHTML += ` <div id="uname" name="${data[i].id}"> <p>${data[i].id}</p><canvas id="screen" name="${data[i].id}" width="250" height="250"
                style="border:1px solid #c3c3c3;">
                </canvas> </div>`;
            }
            fields = [];
            canvases = document.getElementsByTagName("canvas");
            for(let i = 0; i < data.length; i++)
            {
                const canvas = canvases[i];
                const dim = canvas.width;
                const ctx = canvas.getContext("2d");
                const field = new Field(data.lines, dim, 4, ctx, canvas, true);
                fields.push([field, canvas.getAttribute("name")]);
            }
        }
        for(let i = 0; i < fields.length; i++)
        {
            const f = fields[i];
            const uname = f[1];
            console.log(f[1]);
            f[0].lines = data.find((element) => {return element.id === uname;}).lines;
            f[0].ctx.fillStyle = "#FFFFFF";
            f[0].ctx.fillRect(0,0,f[0].canvas.width,f[0].canvas.height);
            f[0].ctx.fillStyle = "#FF0000";
            f[0].draw()
        }
    }
}
main();
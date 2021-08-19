

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
    const canvases = document.getElementsByTagName("canvas");
    const gridDim = 4
    fields = [];
    for(let i = 0; i < canvases.length; i++)
    {
        let lines = [];
        const canvas = canvases[i];
        const dim = canvas.width;
        const ctx = canvas.getContext("2d");
        const f = new Field(lines, dim, 4, ctx, canvas, true);
        fields.push(f);
    }
    console.log();
    //let f = Field(lines, canvas.width, gridDim, ctx);
    //canvas.addEventListener("click", (event) => f.onClickField(event) );
    //canvas.addEventListener("mousemove",(event) => f.onMouseMove(event) );
    while(true){
        await sleep(400);
        const data = await getData();
        for(let i = 0; i < fields.length; i++)
        {
            const f = fields[i];
            const uname = f.canvas.getAttribute("name");
            f.lines = data.find((element) => {console.log(element.id);return element.id === uname;}).lines;
            f.ctx.fillStyle = "#FFFFFF";
            f.ctx.fillRect(0,0,f.canvas.width,f.canvas.height);
            f.ctx.fillStyle = "#FF0000";
            f.draw()
        }
    }
}
main();
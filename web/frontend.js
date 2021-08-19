

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function main()
{
    const canvas = document.getElementById("screen");
    const ctx = canvas.getContext("2d");
    const gridDim = 4
    
    ctx.fillStyle = "#FF0000";
    let x = 0
    let lines = [[0,0,0,0]];
    //let f = Field(lines, canvas.width, gridDim, ctx)
    dim = canvas.width;
    let f = new Field(lines, dim, 4, ctx, canvas, false);
    canvas.addEventListener("click", (event) => f.onClickField(event) );
    canvas.addEventListener("mousemove",(event) => f.onMouseMove(event) );
    document.addEventListener("keypress", (event) => f.onKeyPress(event) );
    let count = 0;
    while(true){
        await sleep(20);
        count++;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,canvas.width,canvas.height)
        ctx.fillStyle = "#FF0000";
        f.draw()
    }
}
main();


function dist(p1, p2)
{
    return Math.sqrt((p1[0]-p2[0])**2+(p1[1]-p2[1])**2)
}
class Field {
    constructor(lines, dim, gridDim, ctx, canvas, admin){
        this.lines = lines;
        this.dim = dim;
        this.gridDim = gridDim;
        this.ctx = ctx;
        this.canvas = canvas;
        this.admin = admin;
        this.offset = dim*0.15;
        this.collisionRadius = this.offset/3;
        this.mousePos = {x: this.offset, y: this.offset};
        this.drawCount = 0;
    }
    draw()
    {
        const offset = this.offset;
        const gridDim = this.gridDim;
        const dim = this.dim
        const ctx = this.ctx;
        const scale = (dim-offset/4)/dim;
        const fs = ctx.fillStyle;
        const fontSize = dim*.095;
        ctx.font = `${fontSize}px serif`;
        for(let x = 0; x < gridDim; x++)
        {
            let xpos = x*scale*(dim/gridDim)+offset;
            ctx.fillRect(xpos, offset, 3, (scale*dim)*((gridDim-1)/gridDim));
            ctx.fillRect(offset ,scale*(dim/gridDim*x)+offset, (scale*dim)*((gridDim-1)/gridDim), 3);
            for(let y = 0; y < gridDim; y++)
            {
                ctx.beginPath();
                ctx.arc(xpos, scale*(dim/gridDim*y)+offset, this.collisionRadius-2, 0, 2 * Math.PI);
                ctx.stroke();
            }
            ctx.fillStyle = "#000000";
            ctx.fillText(x+'', offset/4, xpos);
            ctx.fillText(x+'', xpos, offset/1.6);
            ctx.fillStyle = fs;
        }
        const lineWidth = this.ctx.lineWidth;
        this.ctx.lineWidth = 5;
        for(let x = 0; x < this.lines.length; x++){
            let line = this.lines[x];
            ctx.beginPath();
            ctx.moveTo(this.transformCoordinate(line[0]), this.transformCoordinate(line[1]));
            ctx.lineTo(this.transformCoordinate(line[2]), this.transformCoordinate(line[3]));
            ctx.stroke();
        }
        const last = this.lines[this.lines.length-1];
        if(last){
            const strokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = "#808080";
            ctx.beginPath();
            ctx.moveTo(this.transformCoordinate(last[2]), this.transformCoordinate(last[3]));
            ctx.lineTo(this.mousePos.x, this.mousePos.y);
            ctx.stroke();
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = "#006077";
            let mpx = this.mousePos.x;
            if(mpx > dim - (dim/5*2))
                mpx -= dim/3;
            const str = `x: ${Math.floor(0.5+((this.mousePos.x-offset)*(gridDim/dim))/scale)}, y: ${Math.floor(0.5+((this.mousePos.y-offset)*(gridDim/dim))/scale)}`;
            ctx.fillText(str,mpx, this.mousePos.y);
            ctx.fillStyle = fs;
        }
        
        if(this.admin){
            if(last)
            {
                const fillStyle = ctx.fillStyle;
                ctx.fillStyle = "#00F000";
                ctx.beginPath();
                ctx.moveTo(scale* (dim/gridDim*last[2])+offset, scale*(dim/gridDim*last[3])+offset);
                ctx.lineTo(scale* (dim/gridDim*last[2])+offset - 5, scale*(dim/gridDim*last[3])+offset - 5);
                ctx.moveTo(scale* (dim/gridDim*last[2])+offset, scale*(dim/gridDim*last[3])+offset);
                ctx.lineTo(scale* (dim/gridDim*last[2])+offset + 5, scale*(dim/gridDim*last[3])+offset + 5);
                ctx.stroke();
                ctx.fillStyle = fillStyle;
            }
        }
        if(this.drawCount++ % 10 == 0)
            this.sync();
        this.ctx.lineWidth = lineWidth;
    }
    onMouseMove(event)
    {
        if(!this.admin){
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = event.clientX-rect.left;
        this.mousePos.y = event.clientY-rect.top;
        }
    }
    onKeyPress(event)
    {
        console.log(event.code);
        if(event.code === 'Digit9')
        {
            this.deleteLast();
        }
    }
    deleteLast()
    {
        if(this.lines.length > 1){
            this.lines.pop();
            this.sync();
        }
    }
    onClickField(event)
    {
        const gridDim = this.gridDim;
        const offset = this.offset
        const canvas = this.canvas;
        const ctx = this.ctx;
        dim = canvas.width;
        const x = this.mousePos.x;
        const y = this.mousePos.y;
        let scale = (dim-offset/4)/dim;
        for(let i = 0; i < gridDim; i++)
        {
            for(let j = 0; j < gridDim; j++)
            {
                const gx = scale*(dim/gridDim*j)+offset;
                const gy = scale*(dim/gridDim*i)+offset;
                //console.log(dist([gx,gy],[y,x]));
                if(dist([gx,gy],[y,x]) < this.collisionRadius)
                {
                    const last = this.lines[this.lines.length-1];
                    if(i != last[2] || j != last[3]){
                        this.lines.push([last[2],last[3],i,j]);
                    }
                }
            }
        }
    }
    transformCoordinate(n)
    {
        const scale = (this.dim-this.offset/4)/this.dim;
        return n*scale*(this.dim/this.gridDim)+this.offset;
    }
    sync()
    {
        if(!this.admin)
        {
            const offset = this.offset
            const gridDim = this.gridDim;
            const dim = this.dim;
            const scale = (dim-offset/4)/dim;
            const gx = ((this.mousePos.x-offset)*(gridDim/dim))/scale;
            const gy = ((this.mousePos.y-offset)*(gridDim/dim))/scale;
            console.log(gx,gy)
            const data = {id:this.canvas.getAttribute("name"),mousePos:{x:gx,y:gy},lines:this.lines};

            fetch("/data", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              }).then(res => {console.log("Request complete! response:", data);});
        }
    }
};

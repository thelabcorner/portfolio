class BadassTesseract {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.rotationSpeed = 0.005;
        this.vertices4D = [
            [-1, -1, -1, -1], [1, -1, -1, -1], [1, 1, -1, -1], [-1, 1, -1, -1],
            [-1, -1, 1, -1], [1, -1, 1, -1], [1, 1, 1, -1], [-1, 1, 1, -1],
            [-1, -1, -1, 1], [1, -1, -1, 1], [1, 1, -1, 1], [-1, 1, -1, 1],
            [-1, -1, 1, 1], [1, -1, 1, 1], [1, 1, 1, 1], [-1, 1, 1, 1]
        ];
        this.edges = [
            [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],
            [8,9],[9,10],[10,11],[11,8],[12,13],[13,14],[14,15],[15,12],[8,12],[9,13],[10,14],[11,15],
            [0,8],[1,9],[2,10],[3,11],[4,12],[5,13],[6,14],[7,15]
        ];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = rect.width;
        this.height = rect.height;
    }
    rotate(point, a, b, angle) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        let p = [...point];
        const tempA = p[a]*cos - p[b]*sin;
        const tempB = p[a]*sin + p[b]*cos;
        p[a] = tempA; p[b] = tempB;
        return p;
    }
    project4Dto3D(p) {
        const w = p[3], d = 3.5;
        const s = d/(d+w);
        return [p[0]*s, p[1]*s, p[2]*s];
    }
    project3Dto2D(p) {
        const z = p[2], d = 3.5;
        const s = d/(d+z);
        return [p[0]*s, p[1]*s];
    }
    getScreen(p) {
        const scale = Math.min(this.width, this.height)/2.75;
        return [
            this.width/2 + p[0]*scale,
            this.height/2 - p[1]*scale
        ];
    }
    drawGlowLine(a, b, color, glow=16, width=2.5) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = glow;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(a[0], a[1]);
        this.ctx.lineTo(b[0], b[1]);
        this.ctx.stroke();
        this.ctx.restore();
    }
    draw() {
        // BG gradient
        let g = this.ctx.createRadialGradient(
            this.width/2, this.height/2, this.width/8,
            this.width/2, this.height/2, this.width/1.2
        );
        g.addColorStop(0, 'rgba(139,92,246,0.18)');
        g.addColorStop(0.4, 'rgba(168,139,250,0.10)');
        g.addColorStop(1, 'rgba(30,41,59,0.0)');
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.fillStyle = g;
        this.ctx.fillRect(0,0,this.width,this.height);

        // Animate color
        const t = this.time;
        const edgeColor = `hsl(${(t*60)%360}, 95%, 65%)`;
        const vertexColor = `hsl(${(t*60+120)%360}, 100%, 70%)`;

        // Rotate vertices
        const rotated = this.vertices4D.map(v => {
            let p = [...v];
            // Only rotate on unique axis pairs to avoid guaranteed intersections
            p = this.rotate(p, 0, 1, t * 0.7);
            p = this.rotate(p, 0, 2, t * 0.5);
            p = this.rotate(p, 0, 3, t * 0.9);
            p = this.rotate(p, 1, 2, t * 0.6);
            p = this.rotate(p, 1, 3, t * 0.8);
            // Removed: p = this.rotate(p, 2, 3, t * 0.4); // This can cause overlap if all previous rotations are applied
            return p;
        });
        // Project to 2D
        const projected = rotated.map(v => this.getScreen(this.project3Dto2D(this.project4Dto3D(v))));

        // Draw glowing edges
        for (const [a,b] of this.edges) {
            this.drawGlowLine(projected[a], projected[b], edgeColor, 18, 2.7);
        }
        // Draw neon vertices
        for (const v of projected) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(v[0], v[1], 7, 0, 2*Math.PI);
            this.ctx.shadowColor = vertexColor;
            this.ctx.shadowBlur = 18;
            this.ctx.fillStyle = vertexColor;
            this.ctx.globalAlpha = 0.92;
            this.ctx.fill();
            this.ctx.restore();
            // Inner core
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(v[0], v[1], 2.7, 0, 2*Math.PI);
            this.ctx.fillStyle = "#fff";
            this.ctx.globalAlpha = 0.8;
            this.ctx.fill();
            this.ctx.restore();
        }
        // Subtle animated particles
        for (let i=0; i<18; ++i) {
            const angle = t*0.7 + i*2*Math.PI/18;
            const r = Math.min(this.width, this.height)/2.1 + Math.sin(t*0.8+i)*18;
            const x = this.width/2 + Math.cos(angle)*r;
            const y = this.height/2 + Math.sin(angle)*r;
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2.2+Math.sin(t+i)*1.2, 0, 2*Math.PI);
            this.ctx.fillStyle = `hsl(${(t*60+i*20)%360},100%,60%)`;
            this.ctx.globalAlpha = 0.18;
            this.ctx.shadowColor = "#fff";
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    animate() {
        this.time += this.rotationSpeed;
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
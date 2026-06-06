"use client";
import React, { useRef, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const Visualizer = () => {
  const uploadAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const workspaceRef = useRef(null);
  const canvasRef = useRef(null);
  const opacityValRef = useRef(null);
  const scaleValRef = useRef(null);

  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const { data: fetchedTiles, error } = await supabase.from("products").select('id, name, img').not('img', 'is', null).order('order');
        if (error) throw error;
        // Some products might have empty string or just the word 'null'
        const validTiles = (fetchedTiles || []).filter(t => t.img && t.img.length > 5);
        setTiles(validTiles);
      } catch (e) {
        console.error("Error fetching visualizer tiles", e);
      }
    };
    fetchTiles();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let roomImg = null;
    let tileImg = null;
    let offscreen = null;
    let tileOpacity = 0.9;
    let tileScale = 15;
    let pts = [];
    let dragging = null;
    const HANDLE_R = 11;
    const SUBDIV = 28;

    const fileInput = fileInputRef.current;
    const uploadArea = uploadAreaRef.current;
    const workspace = workspaceRef.current;

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const img = new Image();
            img.onload = () => {
                roomImg = img;
                if(uploadArea) uploadArea.style.display = 'none';
                if(workspace) workspace.style.display = 'grid';
                setupCanvas();
                resetPts();
                render();
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    if(uploadArea) {
      uploadArea.onclick = () => fileInput.click();
      uploadArea.ondragover = (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--accent-color)'; };
      uploadArea.ondragleave = () => uploadArea.style.borderColor = '';
      uploadArea.ondrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };
    }

    if(fileInput) {
      fileInput.onchange = () => handleFile(fileInput.files[0]);
    }

    function setupCanvas() {
        if (!roomImg) return;
        const maxW = canvas.parentElement.clientWidth || 800;
        canvas.width = maxW;
        canvas.height = Math.round(maxW * roomImg.height / roomImg.width);
    }

    function resetPts() {
        const W = canvas.width, H = canvas.height;
        pts = [
            { x: W * 0.18, y: H * 0.52 },
            { x: W * 0.82, y: H * 0.52 },
            { x: W,        y: H },
            { x: 0,        y: H },
            { x: 0,        y: H * 0.76 },
            { x: W,        y: H * 0.76 },
        ];
    }

    function buildOffscreen() {
        if (!tileImg) { offscreen = null; return; }
        const ts = Math.max(10, tileScale * 8);
        const need = Math.max(canvas.width, canvas.height, 400);
        const sz = Math.ceil(need / ts) * ts;
        const oc = document.createElement('canvas');
        oc.width = sz; oc.height = sz;
        const octx = oc.getContext('2d');
        for (let ty = 0; ty < sz; ty += ts)
            for (let tx = 0; tx < sz; tx += ts)
                octx.drawImage(tileImg, tx, ty, ts, ts);
        offscreen = oc;
    }

    function drawWarped() {
        if (!offscreen) return;
        const [TL, TR, BR, BL, ML, MR] = pts;
        const ts = Math.max(10, tileScale * 8);

        function leftEdge(v) {
            if (v <= 0.5) {
                const t = v / 0.5; return { x: TL.x + (ML.x - TL.x) * t, y: TL.y + (ML.y - TL.y) * t };
            } else {
                const t = (v - 0.5) / 0.5; return { x: ML.x + (BL.x - ML.x) * t, y: ML.y + (BL.y - ML.y) * t };
            }
        }
        function rightEdge(v) {
            if (v <= 0.5) {
                const t = v / 0.5; return { x: TR.x + (MR.x - TR.x) * t, y: TR.y + (MR.y - TR.y) * t };
            } else {
                const t = (v - 0.5) / 0.5; return { x: MR.x + (BR.x - MR.x) * t, y: MR.y + (BR.y - MR.y) * t };
            }
        }
        function shapePoint(u, v) {
            const L = leftEdge(v), R = rightEdge(v);
            return { x: L.x + (R.x - L.x) * u, y: L.y + (R.y - L.y) * u };
        }

        const allX = [TL.x, TR.x, BR.x, BL.x, ML.x, MR.x];
        const allY = [TL.y, TR.y, BR.y, BL.y, ML.y, MR.y];
        const bw = Math.max(...allX) - Math.min(...allX);
        const bh = Math.max(...allY) - Math.min(...allY);

        ctx.save();
        ctx.globalAlpha = tileOpacity;
        ctx.beginPath();
        ctx.moveTo(TL.x, TL.y); ctx.lineTo(TR.x, TR.y); ctx.lineTo(MR.x, MR.y);
        ctx.lineTo(BR.x, BR.y); ctx.lineTo(BL.x, BL.y); ctx.lineTo(ML.x, ML.y);
        ctx.closePath();
        ctx.clip();

        for (let row = 0; row < SUBDIV; row++) {
            for (let col = 0; col < SUBDIV; col++) {
                const u0 = col / SUBDIV, u1 = (col + 1) / SUBDIV;
                const v0 = row / SUBDIV, v1 = (row + 1) / SUBDIV;

                const p00 = shapePoint(u0, v0), p10 = shapePoint(u1, v0);
                const p11 = shapePoint(u1, v1), p01 = shapePoint(u0, v1);

                const t00 = { u: u0 * bw, v: v0 * bh }, t10 = { u: u1 * bw, v: v0 * bh };
                const t11 = { u: u1 * bw, v: v1 * bh }, t01 = { u: u0 * bw, v: v1 * bh };

                drawTriangle(p00, p10, p11, t00, t10, t11);
                drawTriangle(p00, p11, p01, t00, t11, t01);
            }
        }
        ctx.restore();
    }

    function drawTriangle(p0, p1, p2, t0, t1, t2) {
        const x0 = p0.x, y0 = p0.y, x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
        const u0 = t0.u, v0 = t0.v, u1 = t1.u, v1 = t1.v, u2 = t2.u, v2 = t2.v;
        const denom = u0*(v1-v2) + u1*(v2-v0) + u2*(v0-v1);
        if (Math.abs(denom) < 1e-10) return;
        const a = (x0*(v1-v2) + x1*(v2-v0) + x2*(v0-v1)) / denom;
        const b = (x0*(u2-u1) + x1*(u0-u2) + x2*(u1-u0)) / denom;
        const c = (x0*(u1*v2-u2*v1) + x1*(u2*v0-u0*v2) + x2*(u0*v1-u1*v0)) / denom;
        const d = (y0*(v1-v2) + y1*(v2-v0) + y2*(v0-v1)) / denom;
        const e = (y0*(u2-u1) + y1*(u0-u2) + y2*(u1-u0)) / denom;
        const f = (y0*(u1*v2-u2*v1) + y1*(u2*v0-u0*v2) + y2*(u0*v1-u1*v0)) / denom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.clip();
        ctx.setTransform(a, d, b, e, c, f);
        ctx.drawImage(offscreen, 0, 0);
        ctx.restore();
    }

    function render() {
        if (!roomImg) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(roomImg, 0, 0, canvas.width, canvas.height);
        if (offscreen && pts.length === 6) drawWarped();
        drawHandles();
    }

    function drawHandles() {
        if (pts.length !== 6) return;
        const [TL, TR, BR, BL, ML, MR] = pts;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(TL.x, TL.y); ctx.lineTo(TR.x, TR.y); ctx.lineTo(MR.x, MR.y);
        ctx.lineTo(BR.x, BR.y); ctx.lineTo(BL.x, BL.y); ctx.lineTo(ML.x, ML.y);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5; ctx.setLineDash([4,4]); ctx.stroke();

        pts.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, HANDLE_R, 0, Math.PI * 2);
            ctx.fillStyle = (i === 4 || i === 5) ? '#2196f3' : '#ffeb3b';
            ctx.fill();
            ctx.lineWidth = 2; ctx.strokeStyle = '#000'; ctx.stroke();
        });
        ctx.restore();
    }

    const getEventPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e) => {
        if (!roomImg) return;
        const pos = getEventPos(e);
        dragging = pts.findIndex(p => Math.hypot(p.x - pos.x, p.y - pos.y) <= HANDLE_R * 1.5);
    };

    const onMove = (e) => {
        if (dragging === -1 || dragging === null) return;
        e.preventDefault();
        const pos = getEventPos(e);
        pts[dragging].x = Math.max(0, Math.min(canvas.width, pos.x));
        pts[dragging].y = Math.max(0, Math.min(canvas.height, pos.y));
        render();
    };

    const onUp = () => dragging = null;

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, {passive:false});
    canvas.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('touchend', onUp);

    window.visualizerSelectTile = (url) => {
      const img = new Image();
      img.onload = () => {
          tileImg = img;
          buildOffscreen();
          render();
      };
      img.src = url;
    };

    window.visualizerSetOpacity = (val) => {
      tileOpacity = val / 100;
      if(opacityValRef.current) opacityValRef.current.textContent = val + '%';
      render();
    };

    window.visualizerSetScale = (val) => {
      tileScale = parseInt(val);
      if(scaleValRef.current) scaleValRef.current.textContent = (val / 15).toFixed(1) + 'x';
      buildOffscreen();
      render();
    };

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
  }, []);

  return (
    <section id="visualizer" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Room Visualizer</h2>
          <p>Upload a photo of your room and see how our terrazzo tiles look in your space.</p>
        </div>
        <div className="visualizer-container">
          <div className="visualizer-upload" id="visualizer-upload" ref={uploadAreaRef}>
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Click or drag to upload your room photo</p>
            <input type="file" id="room-photo-input" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} />
          </div>
          <div className="visualizer-workspace" id="visualizer-workspace" ref={workspaceRef} style={{ display: 'none' }}>
            <div className="visualizer-canvas-wrap">
              <canvas id="viz-canvas" ref={canvasRef}></canvas>
              <div className="viz-hint">Drag yellow corners + blue side handles to fit your floor</div>
            </div>
            <div className="visualizer-controls">
              <h3>Choose a Tile</h3>
              <div id="visualizer-tiles" className="visualizer-tiles-grid" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {tiles.length === 0 ? <p style={{fontSize:'0.8rem', color:'#888'}}>Loading tiles...</p> : tiles.map(tile => (
                  <div 
                    key={tile.id} 
                    className="viz-tile-btn" 
                    title={tile.name} 
                    style={{ backgroundImage: `url('${tile.img}')` }} 
                    onClick={() => window.visualizerSelectTile(tile.img)}
                  ></div>
                ))}
              </div>
              <div className="visualizer-sliders">
                <label>Tile Opacity <span id="opacity-val" ref={opacityValRef}>90%</span></label>
                <input type="range" id="opacity-slider" min="10" max="100" defaultValue="90" onChange={(e) => window.visualizerSetOpacity(e.target.value)} />
                <label>Tile Scale <span id="scale-val" ref={scaleValRef}>1.0x</span></label>
                <input type="range" id="scale-slider" min="3" max="40" defaultValue="15" onChange={(e) => window.visualizerSetScale(e.target.value)} />
              </div>
              <button className="btn btn-outline" id="reset-visualizer" style={{ marginTop: '1rem', width: '100%' }} onClick={() => window.location.reload()}>
                <i className="fas fa-redo"></i> Upload New Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visualizer;

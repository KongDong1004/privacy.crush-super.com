export function applyMosaic(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    intensity: number
) {
    // Intensity 1-50 -> Block size 2-50ish
    const blockSize = Math.max(2, Math.floor(intensity));

    // Get image data for the region
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    for (let py = 0; py < h; py += blockSize) {
        for (let px = 0; px < w; px += blockSize) {
            const regionW = Math.min(blockSize, w - px);
            const regionH = Math.min(blockSize, h - py);

            let r = 0, g = 0, b = 0, count = 0;

            // Calculate average color
            for (let dy = 0; dy < regionH; dy++) {
                for (let dx = 0; dx < regionW; dx++) {
                    const idx = ((py + dy) * w + (px + dx)) * 4;
                    r += data[idx];
                    g += data[idx + 1];
                    b += data[idx + 2];
                    count++;
                }
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            // Fill the block with average color
            for (let dy = 0; dy < regionH; dy++) {
                for (let dx = 0; dx < regionW; dx++) {
                    const idx = ((py + dy) * w + (px + dx)) * 4;
                    data[idx] = r;
                    data[idx + 1] = g;
                    data[idx + 2] = b;
                }
            }
        }
    }

    ctx.putImageData(imageData, x, y);
}

export function applyBlur(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    intensity: number
) {
    // Simple Box Blur implementation for performance
    // For better quality, StackBlur is recommended but this is zero-dependency vanilla JS.
    const radius = Math.max(1, Math.floor(intensity / 2));

    // We'll use the browser's native filter API if possible for speed, 
    // but `filter` applies to drawing commands, not existing pixels easily without re-draw.
    // Actually, standard way:
    // 1. Save region state.
    // 2. Clear region.
    // 3. Set ctx.filter = `blur(${radius}px)`
    // 4. Draw the saved region back.
    // This handles edge cases better than naive JS loops.

    try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Copy current region to temp canvas
        tempCtx.drawImage(ctx.canvas, x, y, width, height, 0, 0, width, height);

        // Draw back with blur
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
        ctx.filter = `blur(${radius}px)`;
        ctx.drawImage(tempCanvas, 0, 0, width, height, x, y, width, height);
        ctx.restore();
    } catch (e) {
        console.error("Blur failed", e);
    }
}

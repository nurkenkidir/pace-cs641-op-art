const canvas = document.getElementById('opArtCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// =========================================================================
// Section 1: Wavy Background (Phase-shifted sine waves)
// =========================================================================
function drawWavyLines() {
    // Base color palette for background waves
    const colors = ['#d33d24', '#2a82a0', '#418b36', '#222222'];
    const numLines = 85;
    const lineSpacing = height / numLines; // Spacing between parallel lines

    ctx.lineWidth = 3.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Mathematical constants for the waves
    const freq = 0.018; // Frequency of the sine wave
    const amp = 28;     // Amplitude (how tall the waves are)

    for (let i = 0; i < numLines; i++) {
        ctx.beginPath();
        ctx.strokeStyle = colors[i % colors.length];

        // Phase shifting linearly with the row index to align wave peaks diagonally
        const phaseShift = -i * 0.18;

        // Draw the wave across the entire width
        for (let x = 0; x <= width; x += 3) {
            // Frequency modulation creates variable wave spacing
            const currentFreq = freq * (1 + x * 0.00015);
            const y = (i * lineSpacing) + Math.sin(x * currentFreq + phaseShift) * amp;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

// =========================================================================
// Section 2: Concentric Optical Illusion (Checkerboard Layers)
// =========================================================================
function drawZigZagIllusion() {
    // Position and size the vortex
    const centerX = width * 0.90;
    const centerY = height * 0.5;
    const maxRadius = height * 0.65;

    // Concentric layer configuration
    // Adjacent layers alternate in direction to create the zigzag effect
    const N = 72;         // Total divisions (36 black stripes, 36 white gaps)
    const numLayers = 32; // Number of concentric layers
    
    const d = (2 * Math.PI) / N; // Base angle unit

    // Layer geometry and styling parameters
    const A = d * 1.6;       // Angle slant across layer bounds
    const W_thick = d * 1.8; // Maximum width of the black stripe
    const W_thin = d * 0.15; // Minimum width of the black stripe

    ctx.save();

    // Circular clipping mask
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.clip();

    // Fill background with white (these will act as the white stripes)
    ctx.fillStyle = '#f4f4f4';
    ctx.fill();

    // Draw explicit concentric layers
    for (let L = 0; L < numLayers; L++) {
        // Compress the inner layers and expand the outer ones 
        let r_in = Math.pow(L / numLayers, 1.25) * maxRadius;
        let r_out = Math.pow((L + 1) / numLayers, 1.25) * maxRadius;
        
        // At the inner boundary L, calculate the slant and width
        let z_in = (L % 2 === 0) ? A : -A;
        let w_in = (L % 2 === 0) ? W_thick : W_thin;
        
        // At the outer boundary L+1, reverse the direction!
        let z_out = ((L + 1) % 2 === 0) ? A : -A;
        let w_out = ((L + 1) % 2 === 0) ? W_thick : W_thin;
        
        // We step by 2 because we only draw the black stripes (the gaps stay white)
        for (let s = 0; s < N; s += 2) {
            let base = s * d;
            
            // Left and right edges at inner radius
            let a_in_left = base + z_in - w_in / 2;
            let a_in_right = base + z_in + w_in / 2;
            
            // Left and right edges at outer radius
            let a_out_left = base + z_out - w_out / 2;
            let a_out_right = base + z_out + w_out / 2;
            
            // Draw individual quadrilateral block for the current layer segment
            ctx.beginPath();
            ctx.moveTo(centerX + r_in * Math.cos(a_in_left), centerY + r_in * Math.sin(a_in_left));
            ctx.lineTo(centerX + r_out * Math.cos(a_out_left), centerY + r_out * Math.sin(a_out_left));
            ctx.lineTo(centerX + r_out * Math.cos(a_out_right), centerY + r_out * Math.sin(a_out_right));
            ctx.lineTo(centerX + r_in * Math.cos(a_in_right), centerY + r_in * Math.sin(a_in_right));
            ctx.closePath();
            
            ctx.fillStyle = '#111'; // Pure black
            ctx.fill();
        }
    }

    // Center focal point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#f8f8f8';
    ctx.fill();

    ctx.restore();
}

// Render the layers
drawWavyLines();
drawZigZagIllusion();

export function renderLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link href="/output.css" rel="stylesheet">
    <title>${title}</title>
    <style>
      body { margin: 0; padding: 0; background: #000; }
      .layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
      .layer img { width: 100%; height: 100%; object-fit: cover; }
      .layer::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        pointer-events: none;
      }
    </style>
  </head>
  <body>
    
    <!-- Fixed Background Layers (negative z-index to stay behind content) -->
    
    <!-- z-50: Sky (furthest back) -->
    <div class="layer" style="z-index: -50;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/fde8716c-ca6a-4614-03a6-a9922d36d100/2000" alt="Sky" />
    </div>
    
    <!-- z-40: Mountains -->
    <div class="layer" style="z-index: -40;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/95897b23-c845-4ca9-932a-4fac7dcb6c00/2000" alt="Mountains" />
    </div>
    
    <!-- z-30: Hills -->
    <div class="layer" style="z-index: -30;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/9bc17223-ec67-491d-948a-0e1f908fa600/2000" alt="Hills" />
    </div>
    
    <!-- z-20: Forest (front) -->
    <div class="layer" style="z-index: -20;">
      <img src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/0844a762-d277-481d-5dbc-f2c69820bf00/2000" alt="Forest" />
    </div>
    
    <!-- Scrollable Content Container -->
    <div class="">
      ${content}
    </div>
    
  </body>
</html>`;
}
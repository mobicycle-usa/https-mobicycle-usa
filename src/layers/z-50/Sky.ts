// LAYER z-40: Sky Background (furthest back)
export function renderLayer_zNeg40_Sky(): string {
  return `
    <!-- LAYER z-40: SKY (furthest back) -->
    <div class="fixed inset-0 parallax-layer" data-speed="0.1" style="z-index: -40;">
      <img 
        src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/fde8716c-ca6a-4614-03a6-a9922d36d100/2000" 
        alt="Sky Background"
        class="w-full h-screen object-cover"
        style="transform: scale(1.5);"
      />
    </div>
  `;
}
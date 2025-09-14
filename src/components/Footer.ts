export function renderFooter(): string {
  return `
    <!-- FOOTER -->
    <footer class="relative w-full pt-20 text-white-650 border-t rounded-4xl border-t-purple-650 shadow bg-slate-900/90" style="backdrop-filter: blur(20px) saturate(180%) contrast(120%); -webkit-backdrop-filter: blur(8px) saturate(150%) contrast(120%);">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-orange-600/10"></div>
      <div class="relative container mx-auto max-w-7xl px-8">
        <div class="flex gap-12 w-full justify-between">
          <div class="flex-1">
            ${renderFooterMenu()}
          </div>
          <div class="flex-shrink-0">
            ${renderNewsletter()}
          </div>
        </div>
      </div>
      ${renderAddress()}
    </footer>
  `;
}

function renderFooterMenu(): string {
  return `
    <div class="text-md">
      <!-- LOGO -->
      <div class="mb-8 -ml-4">
        <a href="https://mobicycle.tech">
          <img
            src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/e6682ad4-09cd-48b3-eb0e-530252e29d00/150"
            alt="MobiCycle Logo"
            class="h-12 w-auto"
          />
        </a>
      </div>
      <!-- Footer Links Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        <!-- CORE OFFER -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">CORE OFFER</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-purple-400">EE Management</a></li>
            <li><a href="#" class="hover:text-purple-400">eWaste Management</a></li>
          </ul>
        </div>
        <!-- OUR PLATFORM -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">OUR PLATFORM</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="https://mobicycle.consulting" class="hover:text-purple-400">Consulting</a></li>
            <li><a href="https://mobicycle.tech" class="hover:text-purple-400">Technologies</a></li>
            <li><a href="https://mobicycle.games" class="hover:text-purple-400">Games</a></li>
            <li><a href="https://mobicycle.marketing" class="hover:text-purple-400">Marketing</a></li>
          </ul>
        </div>
        <!-- CREDITS -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">CREDITS</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-purple-400">Tax</a></li>
            <li><a href="#" class="hover:text-purple-400">Carbon (Scope 3)</a></li>
            <li><a href="#" class="hover:text-purple-400">Biodiversity</a></li>
            <li><a href="#" class="hover:text-purple-400">Pollution</a></li>
          </ul>
        </div>
        <!-- COMPANY -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">COMPANY</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/about" class="hover:text-purple-400">About us</a></li>
            <li><a href="#" class="hover:text-purple-400">Case studies</a></li>
            <li><a href="#" class="hover:text-purple-400">Capabilities</a></li>
            <li><a href="#" class="hover:text-purple-400">Careers</a></li>
          </ul>
        </div>
        <!-- LEGAL -->
        <div>
          <h4 class="font-semibold mb-4 text-orange-650">LEGAL</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-purple-400">Disclaimer</a></li>
            <li><a href="#" class="hover:text-purple-400">Cookies</a></li>
            <li><a href="#" class="hover:text-purple-400">Privacy</a></li>
            <li><a href="#" class="hover:text-purple-400">Terms</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderNewsletter(): string {
  return `
    <div class="bg-slate-800 rounded-lg p-8 max-w-lg">
      <h3 class="text-2xl font-semibold mb-4 text-orange-650">Stay Updated</h3>
      <p class="mb-6">Get the latest news about our environmental impact solutions and electronic waste management.</p>
      <form class="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-md text-white-650 placeholder-gray-400 focus:outline-none focus:border-orange-650"
          required
        />
        <button
          type="submit"
          class="w-full px-4 py-3 bg-orange-650 text-slate-950 font-semibold rounded-md hover:bg-orange-700 transition-colors"
        >
          Subscribe to Newsletter
        </button>
      </form>
      <p class="mt-4 text-sm text-gray-400">We respect your privacy. Unsubscribe at any time.</p>
    </div>
  `;
}

function renderAddress(): string {
  return `
    <div class="w-full px-8 py-20 text-center bg-transparent-650">
      <p class="text-sm text-gray-400 mb-2">
        1606 Headway Circle, Austin, TX 78754 | Rue de la Presse, 4 - 1000 Bruxelles Belgium
      </p>
      <p class="text-sm">&copy; Copyright 2025. All rights reserved by MobiCycle LLC.</p>
      <p class="text-xs mt-2 text-orange-650">Tech to save the planet.</p>
    </div>
`;
}
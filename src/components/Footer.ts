export function renderFooter(): string {
  return `
    <!-- FOOTER -->
    <footer class="pt-20 border-t border-purple-650 text-white-650">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12">
          ${renderFooterMenu()}
          ${renderNewsletter()}
        </div>
      </div>
      ${renderAddress()}
    </footer>
  `;
}

function renderFooterMenu(): string {
  return `
    <div>
      <!-- LOGO -->
      <div class="mb-8 -ml-4">
        <a href="https://mobicycle.tech">
          <img
            src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/e6682ad4-09cd-48b3-eb0e-530252e29d00/450"
            alt="MobiCycle Logo"
            class="h-12 w-auto"
          />
        </a>
      </div>
      <!-- Platform Links -->
      <div class="flex flex-row gap-12">
      <div>
        <h4 class="font-semibold mb-4">Platform</h4>
        <ul class="space-y-2">
          <li><a href="https://mobicycle.consulting" class="hover:text-purple-400">Consulting</a></li>
          <li><a href="https://mobicycle.tech" class="hover:text-purple-400">Technologies</a></li>
          <li><a href="https://mobicycle.games" class="hover:text-purple-400">Games</a></li>
          <li><a href="https://mobicycle.marketing" class="hover:text-purple-400">Marketing</a></li>
        </ul>
      </div>
      <!-- Resources -->
      <div>
        <h4 class="font-semibold mb-4">Resources</h4>
        <ul class="space-y-2">
          <li><a href="https://about.mobicycle.group" class="hover:text-purple-400">About</a></li>
          <li><a href="https://demos.mobicycle.group" class="hover:text-purple-400">Demos</a></li>
          <li><a href="https://pricing.mobicycle.group" class="hover:text-purple-400">Pricing</a></li>
          <li><a href="https://mobicycle.support" class="hover:text-purple-400">Support</a></li>
        </ul>
      </div>
      <!-- Company -->
      <div>
        <h4 class="font-semibold mb-4">Company</h4>
        <ul class="space-y-2">
          <li><a href="/about" class="hover:text-purple-400">About Us</a></li>
          <li><a href="/services" class="hover:text-purple-400">Services</a></li>
          <li><a href="/contact" class="hover:text-purple-400">Contact</a></li>
        </ul>
      </div>
      <!-- Connect -->
      <div>
        <h4 class="font-semibold mb-4">Connect</h4>
        <ul class="space-y-2">
          <li>Email: info@mobicycle.us</li>
        </ul>
      </div>
      </div>
    </div>
  `;
}

function renderNewsletter(): string {
  return `
    <div class="bg-slate-800 rounded-lg p-8">
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
    <div class="container mx-auto px-4 pt-20 text-center bg-transparent-650">
      <p class="text-sm">&copy; 2025 MobiCycle USA. All rights reserved.</p>
      <p class="text-xs mt-2 text-orange-650">Tech to save the planet.</p>
    </div>
`;
}
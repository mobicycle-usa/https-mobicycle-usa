export function renderNavigation(): string {
  return `
    <nav class="min-w-full p-10 lg:px-16">
      <div class="mx-auto">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0">
            <a 
              href="https://mobicycle.group" 
              class="block z-50"
            >
              <div class="h-auto max-w-40 w-20 md:w-24
              ">
                <img 
                  src="https://imagedelivery.net/uIknt2TlDR57WZHMJo_oWQ/b5559dc3-d375-47cc-c889-df3c41382200/200" 
                  alt="MobiCycle USA"
                  class="invert"
                />
              </div>
            </a>
          </div>
          <button class="navbar-burger relative z-40">
            <div id="menuToggle" class="flex items-center justify-center border-4 border-orange-650 cursor-pointer bg-gradient-to-r from-orange-650 to-purple-650 hover:bg-purple-650 w-16 h-16">
              <!-- THE THREE LINES (initially visible) -->
              <svg id="openIcon" class="w-10 h-10 text-yellow-650 hover:text-slate-100" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <!-- THE 'X' (initially hidden) -->
              <svg id="closeIcon" class="w-10 h-10 text-slate-100 hover:text-slate-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </button>
          <!-- Hidden menu that will toggle visibility -->
          <div class="navbar-menu fixed inset-0 transition-opacity duration-1000 opacity-0 invisible">
            <div class="navbar-backdrop fixed inset-0</div>
            <nav class="relative flex flex-col w-full h-full overflow-y-auto items-center justify-center">
              <div>
                <div class="w-screen">
                  <div class="flex flex-col px-4 py-10 space-y-8 text-white-650 container mx-auto h-screen items-start justify-center">
                    <a href="https://about.mobicycle.us" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650 md:text-right">About MobiCycle USA</a>
                    <a href="https://mobicycle.consulting" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Consulting</a>
                    <a href="https://mobicycle.tech" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Technologies</a>
                    <a href="https://mobicycle.marketing" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Games</a>
                    <a href="https://mobicycle.marketing" class="flex p-2 mx-0 w-fit lg:mx-3 hover:text-orange-650">Marketing</a>
                  </div>
                </div>
              </div>
              <!-- DEMO BUTTON -->
              <div class="mt-auto flex flex-col w-full items-end font-semibold bg-gradient-to-l from-orange-650 via-slate-650 tracking-widest">
                <a href="https://demos.mobicycle.group/" 
                class="text-white-650 px-4 py-2 uppercase hover:text-white-650">
                DEMOS</a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </nav>

    <script>
      (function() {
        function initMenu() {
          const burgerButton = document.querySelector('.navbar-burger');
          const menu = document.querySelector('.navbar-menu');
          const openIcon = document.getElementById('openIcon');
          const closeIcon = document.getElementById('closeIcon');

          if (!burgerButton || !menu || !openIcon || !closeIcon) {
            console.error('One or more navigation elements are missing!');
            return;
          }

          burgerButton.addEventListener('click', function() {
            if (menu.classList.contains('invisible')) {
              // Open the menu
              menu.classList.remove('invisible', 'opacity-0');
              openIcon.classList.add('hidden');
              closeIcon.classList.remove('hidden');
            } else {
              // Close the menu
              menu.classList.add('opacity-0');
              setTimeout(() => {
                menu.classList.add('invisible');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
              }, 300);
            }
          });
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initMenu);
        } else {
          initMenu();
        }
      })();
    </script>
  `;
}
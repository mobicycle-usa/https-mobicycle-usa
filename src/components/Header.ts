export function renderHeader(): string {
  return `
    <div class="inline-block p-20 xl:ml-64 space-y-6 bg-gradient-to-l from-slate-500 border-r rounded-md">
      <div class="flex justify-end md:text-left pr-8 md:pr-0">
        <h2 class="inline-block leading-relaxed font-light text-slate-50 dark:text-slate-50 text-sm">
          Tech to save the planet.
        </h2>
      </div>
      <div class="flex text-right md:text-left pr-8 md:pr-0">
        <h5 class="tracking-widest font-extralight w-fit rounded-md text-xs p-1 sm:text-slate-200 text-slate-50">
        </h5>
      </div>
      <div class="flex text-right md:text-left pr-8 md:pr-0">
        <h2 class="flex leading-relaxed font-light text-orange-650 text-4xl">
          Scope 3 management of electronics & electricals
        </h2>
      </div>
    </div>
  `;
}
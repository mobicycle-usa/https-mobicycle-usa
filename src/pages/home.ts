import { renderLayout } from '../layouts/layout';
import { renderHeader } from '../components/Header';
import { renderSectionOne } from '../components/SectionOne';
import { renderSectionTwo } from '../components/SectionTwo';
import { renderSectionThree } from '../components/SectionThree';
import { renderSectionFour } from '../components/SectionFour';
import { renderFooter } from '../components/Footer';
import { renderNavigation } from '../components/TopNavigation';

export function renderHomePage(): string {
  const content = `
    <!-- Main Content -->
    <div class="relative">
      <!-- TITLE SECTION (Above Navigation) -->
      <div class="" >
        ${renderTitle()}
      </div>
      
      <!-- Navigation (z+20) -->
      <div class="fixed top-0 left-0 right-0" style="z-index: 20;">
        ${renderNavigation()}
      </div>
      
      
      <!-- CONTENT SECTIONS -->
      <div class="space-y-40 w-full">
        ${renderSectionOne()}
        ${renderSectionTwo()}
        ${renderSectionThree()}
        ${renderSectionFour()}
      </div>
      
      <!-- FOOTER -->
      <div class="grid grid-flow-row mt-20 pt-2">
          ${renderFooter()}
      </div>
    </div>
  `; 
  
  return renderLayout('MobiCycle USA | Home', content);   
}

function renderTitle(): string {
  return `
    <div class="container mx-auto px-4 h-screen flex items-center justify-center">
        ${renderHeader()}
    </div>
  `;
}
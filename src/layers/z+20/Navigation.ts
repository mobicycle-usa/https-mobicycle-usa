// LAYER z20: Navigation
import { renderNavigation } from '../../components/TopNavigation';

export function renderLayer_z20_Navigation(): string {
  return `
    <!-- LAYER z20: NAVIGATION -->
    <div class="fixed top-0 left-0 right-0" style="z-index: 20;">
      ${renderNavigation()}
    </div>
  `;
}
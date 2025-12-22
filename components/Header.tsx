
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useUI } from '@/lib/state';

export default function Header() {
  const { toggleSidebar, isSidebarOpen } = useUI();

  // Hide the floating button if sidebar is already open
  if (isSidebarOpen) return null;

  return (
    <header className="minimal-header">
      <div className="header-right">
        <button
          className="settings-button"
          onClick={toggleSidebar}
          aria-label="Orbit Settings"
        >
          <span className="icon">tune</span>
        </button>
      </div>
    </header>
  );
}

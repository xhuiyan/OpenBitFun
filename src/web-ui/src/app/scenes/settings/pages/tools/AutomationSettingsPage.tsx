import { SettingsPage } from '../shared/SettingsPage';
import HooksSettingsSection from './HooksSettingsSection';
import QuickActionsSettingsSection from './QuickActionsSettingsSection';

export default function AutomationSettingsPage() {
  return (
    <SettingsPage pageId="tools.automation" data-openbitfun-component="automation-settings-page" data-openbitfun-part="root" data-starmate-component="automation-settings-page" data-starmate-part="root" >
      <div data-openbitfun-component="automation-settings-page" data-openbitfun-part="quickActions" data-starmate-component="automation-settings-page" data-starmate-part="quickActions" >
        <QuickActionsSettingsSection />
      </div>
      <div data-openbitfun-component="automation-settings-page" data-openbitfun-part="hooks" data-starmate-component="automation-settings-page" data-starmate-part="hooks" >
        <HooksSettingsSection />
      </div>
    </SettingsPage>
  );
}

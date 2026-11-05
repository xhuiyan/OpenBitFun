import '@starmate/theme-openbitfun/default.css';
import { themes } from '@starmate/theme-openbitfun';

const colorScheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
const root = document.documentElement;

root.setAttribute('data-openbitfun-design-system-root', '');

root.setAttribute('data-starmate-design-system-root', '');
root.setAttribute('data-color-scheme', colorScheme);
root.setAttribute('data-contrast', 'standard');
root.setAttribute('data-density', 'comfortable');
root.style.colorScheme = colorScheme;

document.querySelector('meta[name="theme-color"]')?.setAttribute(
  'content',
  String(themes[colorScheme]['color.surface.canvas']),
);

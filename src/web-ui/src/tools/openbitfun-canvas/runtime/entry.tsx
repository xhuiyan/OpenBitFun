import '@starmate/design-tokens/tokens.css';
import './styles/canvas-runtime.scss';
import * as sdkAdapters from './sdk';
import { installOpenBitFunCanvasRuntimeApp } from './CanvasRuntimeApp';
import {
  CANVAS_RUNTIME_VERSION,
  CANVAS_SDK_RUNTIME_EXPORTS,
  CANVAS_SDK_VERSION,
} from './sdk/contract.generated';

declare global {
  interface Window {
    StarMateCanvasSDKAdapters?: typeof sdkAdapters;
    StarMateCanvasContract?: {
      runtimeVersion: string;
      sdkVersion: string;
    };
  }
}

const missingExports = CANVAS_SDK_RUNTIME_EXPORTS.filter(name => !(name in sdkAdapters));
if (missingExports.length > 0) {
  throw new Error(`Canvas SDK runtime contract is incomplete: ${missingExports.join(', ')}`);
}

window.StarMateCanvasContract = {
  runtimeVersion: CANVAS_RUNTIME_VERSION,
  sdkVersion: CANVAS_SDK_VERSION,
};
window.StarMateCanvasSDKAdapters = sdkAdapters;
installOpenBitFunCanvasRuntimeApp();

import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { DialogFooter, DialogHeader } from "../dist/index.js";

test("Dialog and Sheet compose the shared overlay kernel and compound anatomy", async () => {
  const source = await readFile(
    new URL("../src/components/Dialog/Dialog.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /<Portal target=\{resolvedPortalHost\} open=\{open\} modal/);
  assert.match(source, /useDismissibleLayer/);
  assert.match(source, /useFocusScope/);
  assert.match(source, /preventScroll=\{preventScroll\}/);
  assert.match(source, /usePresence/);
  assert.match(source, /kind="dialog"/);
  assert.match(source, /kind="sheet"/);
  for (const part of [
    "overlay",
    "surface",
    "header",
    "heading",
    "title",
    "description",
    "header-actions",
    "header-leading",
    "close",
    "body",
    "footer",
  ]) {
    assert.match(source, new RegExp(`data-openbitfun-part=\\"${part}\\"`));
  }
  assert.match(source, /aria-describedby=\{ariaDescribedBy \?\? \(hasDescription \? descriptionId : undefined\)\}/);
  assert.match(source, /aria-labelledby=\{ariaLabelledBy \?\? \(!ariaLabel && hasTitle \? titleId : undefined\)\}/);
});

test("Dialog public API has canonical axes and no legacy escape hatches", async () => {
  const source = await readFile(
    new URL("../src/components/Dialog/Dialog.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /export type DialogSize = "sm" \| "md" \| "lg" \| "xl" \| "2xl"/);
  assert.match(source, /export type SheetPlacement = "left" \| "right" \| "bottom"/);
  assert.match(source, /onOpenChange: \(open: false, reason: DialogCloseReason\) => void/);
  assert.doesNotMatch(source, /contentClassName|overlayClassName|portalContainer|portalled|resizable|draggable/);
});

test("Dialog geometry and typography use public design tokens", async () => {
  const styles = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");

  for (const token of [
    "--starmate-overlay-dialog-viewport-gutter",
    "--starmate-overlay-dialog-backdrop-blur",
    "--starmate-overlay-dialog-surface-radius",
    "--starmate-overlay-dialog-header-padding-inline",
    "--starmate-overlay-dialog-footer-padding-inline",
    "--starmate-overlay-dialog-max-inline-size-xxlarge",
    "--starmate-type-heading-dialog-font-size",
    "--starmate-type-heading-dialog-font-weight",
    "--starmate-color-overlay-scrim",
    "--starmate-color-surface-raised",
    "--starmate-shadow-overlay",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}/i);
});

test("DialogFooter exposes a centered frosted floating action layer", async () => {
  const markup = renderToStaticMarkup(
    createElement(
      DialogFooter,
      { appearance: "floating" },
      createElement("button", null, "Cancel"),
      createElement("button", null, "Save"),
    ),
  );
  const styles = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");

  assert.match(markup, /data-appearance="floating"/);
  assert.match(styles, /\[data-appearance=floating\]\{[^}]*position:absolute/);
  assert.match(styles, /\[data-appearance=floating\]\{[^}]*justify-content:center/);
  assert.match(styles, /\[data-appearance=floating\]:before\{[^}]*background:linear-gradient/);
  assert.match(styles, /\[data-appearance=floating\]:before\{[^}]*backdrop-filter:var\(--starmate-overlay-dialog-footer-blur\)/);
  assert.match(styles, /\[data-appearance=floating\]\{[^}]*pointer-events:auto/);
  assert.match(styles, /--starmate-overlay-dialog-footer-action-min-width/);
});

test("Panel Dialog publishes fixed viewport-safe geometry and centered header spacing", async () => {
  const styles = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");
  const panelRules = styles.match(/\[data-preset=panel\][^{}]*\{[^}]*\}/g)?.join("\n") ?? "";

  assert.match(panelRules, /\[data-preset=panel\]\{[^}]*grid-template-rows:auto minmax\(0,max-content\) auto;align-content:center/);
  assert.match(panelRules, /--_dialog-panel-title-gap:\s*calc\(var\(--starmate-overlay-dialog-header-padding-block-start\) \+ var\(--starmate-space-4\)\)/);
  assert.match(panelRules, /\[data-preset=panel\]\{[^}]*padding-block:var\(--_dialog-panel-title-gap\);block-size:min\(var\(--starmate-overlay-dialog-panel-block-size\),calc\(100dvh/);
  assert.match(panelRules, /\[data-preset=panel\]>[^{}]+\{padding-block-start:0;padding-block-end:var\(--_dialog-panel-title-gap\)/);
  assert.match(panelRules, /\[data-preset=panel\]>[^{}]+\{[^}]*min-block-size:var\(--starmate-control-height-sm\);[^}]*text-align:center/);
  assert.match(panelRules, /padding-block-end:max\([^}]*var\(--starmate-overlay-dialog-footer-height\)/);
  assert.doesNotMatch(panelRules, /--starmate-overlay-dialog-footer-content-inset/);
  assert.match(panelRules, /\[data-preset=panel\]>[^{}]+\{[^}]*padding-inline:max\(var\(--starmate-overlay-dialog-content-padding-lg\),calc\(\(100% - var\(--starmate-overlay-dialog-max-inline-size-large\)\)\s*\/\s*2\)\)/);
});

test("dialog separators are explicit and do not leak native attributes", () => {
  for (const component of [DialogHeader, DialogFooter]) {
    assert.match(renderToStaticMarkup(createElement(component)), /data-separator="false"/);
    const markup = renderToStaticMarkup(createElement(component, { separator: true }));
    assert.match(markup, /data-separator="true"/);
    assert.doesNotMatch(markup, / separator=/);
  }
});

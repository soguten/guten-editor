/// <reference lib="deno.ns" />
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { computeOverlayPosition } from "./positioning.ts";

Deno.test("computeOverlayPosition keeps legacy-like default bottom center", () => {
    const result = computeOverlayPosition({
        anchorRect: { left: 100, top: 100, right: 140, bottom: 120, width: 40, height: 20 },
        overlaySize: { width: 80, height: 40 },
        placement: "bottom",
        offset: 10,
        collision: { flip: true, shift: true },
        boundary: { left: 0, top: 0, right: 400, bottom: 300 },
    });

    assertEquals(result.left, 80);
    assertEquals(result.top, 130);
    assertEquals(result.placement, "bottom");
});

Deno.test("computeOverlayPosition flips when overflowing bottom", () => {
    const result = computeOverlayPosition({
        anchorRect: { left: 140, top: 250, right: 180, bottom: 270, width: 40, height: 20 },
        overlaySize: { width: 100, height: 60 },
        placement: "bottom",
        offset: 10,
        collision: { flip: true, shift: true },
        boundary: { left: 0, top: 0, right: 320, bottom: 320 },
    });

    assertEquals(result.placement, "top");
    assertEquals(result.top, 180);
});
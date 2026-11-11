import { test } from "node:test";
import assert from "node:assert/strict";
import {
  contactPath,
  langFromPath,
  localizedPath,
  resolveLegacyRedirect,
  switchLangPath,
  tourPath,
} from "./site-routes";

test("localized paths", () => {
  assert.equal(localizedPath("en"), "/en/");
  assert.equal(localizedPath("ko", "faq"), "/ko/faq");
  assert.equal(localizedPath("mn", "travelInfo"), "/mn/travel-information");
  assert.equal(tourPath("ja", "summer-fishing"), "/ja/tours/summer-fishing");
  assert.equal(contactPath("en", "winter-hunting"), "/en/contact?tour=winter-hunting");
});

test("langFromPath", () => {
  assert.equal(langFromPath("/ko/tours/x"), "ko");
  assert.equal(langFromPath("/mn/"), "mn");
  assert.equal(langFromPath("/"), null);
  assert.equal(langFromPath("/ont1"), null);
  assert.equal(langFromPath("/fr/tours"), null);
});

test("switching language keeps the same page", () => {
  assert.equal(switchLangPath("/en/tours/summer-fishing", "ko"), "/ko/tours/summer-fishing");
  assert.equal(switchLangPath("/ko/faq", "mn"), "/mn/faq");
  assert.equal(switchLangPath("/ja/", "en"), "/en/");
  assert.equal(switchLangPath("/ja", "en"), "/en/");
  assert.equal(switchLangPath("/", "mn"), "/mn/");
  assert.equal(switchLangPath("/ont2", "ko"), "/ont2");
});

test("legacy URLs redirect to /en/ equivalents", () => {
  assert.equal(resolveLegacyRedirect("/tours/bird-photography"), "/en/tours/wildlife-photography");
  assert.equal(resolveLegacyRedirect("/tours/kherlen-fishing"), "/en/tours/summer-fishing");
  assert.equal(resolveLegacyRedirect("/tours/arburd-gobi"), "/en/tours/nomadic-culture");
  assert.equal(resolveLegacyRedirect("/tours/winter-hunting"), "/en/tours/winter-hunting");
  assert.equal(resolveLegacyRedirect("/tours/winter-hunting/"), "/en/tours/winter-hunting");
  assert.equal(resolveLegacyRedirect("/book"), "/en/contact");
  assert.equal(resolveLegacyRedirect("/book", "?tour=bird-photography"), "/en/contact?tour=wildlife-photography");
  assert.equal(resolveLegacyRedirect("/gallery"), "/en/gallery");
  assert.equal(resolveLegacyRedirect("/comic"), "/en/comic");
});

test("legacy slugs under a language prefix redirect", () => {
  assert.equal(resolveLegacyRedirect("/ko/tours/bird-photography"), "/ko/tours/wildlife-photography");
  assert.equal(resolveLegacyRedirect("/mn/book", "?tour=arburd-gobi"), "/mn/contact?tour=nomadic-culture");
});

test("current URLs are not redirected", () => {
  for (const p of ["/", "/en/", "/ko/tours/summer-fishing", "/en/tours/winter-hunting", "/ont1", "/api/inquiries", "/mn/faq"]) {
    assert.equal(resolveLegacyRedirect(p), null, p);
  }
});

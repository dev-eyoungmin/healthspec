import assert from 'node:assert/strict';
import { test } from 'node:test';
import { units } from '../src/index.js';

const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('glucose mmol/L ↔ mg/dL', () => {
  close(units.glucose.mmolPerLToMgPerDl(5.5), 99.1001);
  close(units.glucose.mgPerDlToMmolPerL(units.glucose.mmolPerLToMgPerDl(7.2)), 7.2);
});

test('temperature °C ↔ °F', () => {
  close(units.temperature.celsiusToFahrenheit(37), 98.6);
  close(units.temperature.fahrenheitToCelsius(98.6), 37);
});

test('mass kg ↔ lb', () => {
  close(units.mass.kgToLb(1), 2.2046226218, 1e-9);
  close(units.mass.lbToKg(units.mass.kgToLb(72.4)), 72.4);
});

test('length m ↔ mi/ft/km/cm', () => {
  close(units.length.milesToMeters(1), 1609.344);
  close(units.length.metersToFeet(0.3048), 1);
  close(units.length.kmToMeters(2.5), 2500);
  close(units.length.cmToMeters(176), 1.76);
});

test('energy kcal ↔ kJ, volume L ↔ fl oz, percent ↔ fraction', () => {
  close(units.energy.kcalToKj(100), 418.4);
  close(units.volume.usFlOzToLiters(16.907), 0.5, 1e-4);
  close(units.percent.fractionToPercent(0.97), 97);
});

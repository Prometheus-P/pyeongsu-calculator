import { bench, describe } from 'vitest';
import {
  convert,
  convertSqmToPyeong,
  convertPyeongToSqm,
  convertSqmToSqft,
  convertPyeongToSqft,
  convertPyeongToAcre,
  registerUnit,
} from './converter';

describe('converter performance (<1ms requirement per NFR-001)', () => {
  describe('direct conversions (registry.fromBase)', () => {
    bench('convertSqmToPyeong', () => {
      convertSqmToPyeong(100);
    });

    bench('convertPyeongToSqm', () => {
      convertPyeongToSqm(30);
    });

    bench('convertSqmToSqft', () => {
      convertSqmToSqft(100);
    });
  });

  describe('cross-unit conversions (via sqm base)', () => {
    bench('convertPyeongToSqft', () => {
      convertPyeongToSqft(30);
    });

    bench('convertPyeongToAcre', () => {
      convertPyeongToAcre(30);
    });
  });

  describe('generic convert() function', () => {
    bench('convert sqm → pyeong', () => {
      convert(100, 'sqm', 'pyeong');
    });

    bench('convert pyeong → sqft', () => {
      convert(30, 'pyeong', 'sqft');
    });

    bench('convert pyeong → acre', () => {
      convert(30, 'pyeong', 'acre');
    });

    bench('convert sqm → sqm (same-unit no-op)', () => {
      convert(100, 'sqm', 'sqm');
    });
  });

  describe('large values (edge case)', () => {
    bench('convert large value (999999999)', () => {
      convert(999999999, 'sqm', 'pyeong');
    });
  });

  describe('runtime unit registration (US3)', () => {
    bench('registerUnit + convert', () => {
      registerUnit(
        'hectare',
        (v) => v * 10000,
        (v) => v / 10000
      );
      convert(10000, 'sqm', 'hectare' as any);
    });
  });
});

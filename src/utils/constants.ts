import { Device, Recipe, SensorType, UserSettings } from '../types';
import recipesData from '../data/recipes.json';

export const CAMERAS: Device[] = [
  // X-Trans V (Latest)
  { id: 'x100vi', name: 'Fujifilm X100VI', sensor: SensorType.XTransV, processor: 'X-Processor 5', customSlotCount: 7 },
  { id: 'xt5', name: 'Fujifilm X-T5', sensor: SensorType.XTransV, processor: 'X-Processor 5', customSlotCount: 7 },
  { id: 'xh2', name: 'Fujifilm X-H2', sensor: SensorType.XTransV, processor: 'X-Processor 5', customSlotCount: 7 },
  { id: 'xh2s', name: 'Fujifilm X-H2S', sensor: SensorType.XTransV, processor: 'X-Processor 5', customSlotCount: 7 },
  { id: 'xt50', name: 'Fujifilm X-T50', sensor: SensorType.XTransV, processor: 'X-Processor 5', customSlotCount: 7 },
  { id: 'xe5', name: 'Fujifilm X-E5', sensor: SensorType.XTransV, processor: 'X-Processor 5', customSlotCount: 7 },

  // X-Trans IV
  { id: 'xt4', name: 'Fujifilm X-T4', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 7 },
  { id: 'x100v', name: 'Fujifilm X100V', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 7 },
  { id: 'xpro3', name: 'Fujifilm X-Pro3', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 7 },
  { id: 'xt3', name: 'Fujifilm X-T3', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 7 },
  { id: 'xt30', name: 'Fujifilm X-T30', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 4 },
  { id: 'xt30ii', name: 'Fujifilm X-T30 II', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 4 },
  { id: 'xs10', name: 'Fujifilm X-S10', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 4 },
  { id: 'xs20', name: 'Fujifilm X-S20', sensor: SensorType.XTransIV, processor: 'X-Processor 5', customSlotCount: 7 },
  { id: 'xe4', name: 'Fujifilm X-E4', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 4 },
  { id: 'xm5', name: 'Fujifilm X-M5', sensor: SensorType.XTransIV, processor: 'X-Processor 4', customSlotCount: 4 },

  // X-Trans III
  { id: 'xt2', name: 'Fujifilm X-T2', sensor: SensorType.XTransIII, processor: 'X-Processor Pro', customSlotCount: 7 },
  { id: 'xpro2', name: 'Fujifilm X-Pro2', sensor: SensorType.XTransIII, processor: 'X-Processor Pro', customSlotCount: 7 },
  { id: 'xh1', name: 'Fujifilm X-H1', sensor: SensorType.XTransIII, processor: 'X-Processor Pro', customSlotCount: 7 },
  { id: 'xt20', name: 'Fujifilm X-T20', sensor: SensorType.XTransIII, processor: 'X-Processor Pro', customSlotCount: 4 },
  { id: 'xe3', name: 'Fujifilm X-E3', sensor: SensorType.XTransIII, processor: 'X-Processor Pro', customSlotCount: 4 },
  { id: 'x100f', name: 'Fujifilm X100F', sensor: SensorType.XTransIII, processor: 'X-Processor Pro', customSlotCount: 4 },

  // X-Trans II
  { id: 'xt1', name: 'Fujifilm X-T1', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 7 },
  { id: 'xt10', name: 'Fujifilm X-T10', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },
  { id: 'xe2', name: 'Fujifilm X-E2', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },
  { id: 'xe2s', name: 'Fujifilm X-E2S', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },
  { id: 'x100t', name: 'Fujifilm X100T', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },
  { id: 'x100s', name: 'Fujifilm X100S', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },
  { id: 'x70', name: 'Fujifilm X70', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },
  { id: 'x30', name: 'Fujifilm X30', sensor: SensorType.XTransII, processor: 'EXR Processor II', customSlotCount: 4 },

  // X-Trans I
  { id: 'xpro1', name: 'Fujifilm X-Pro1', sensor: SensorType.XTransI, processor: 'EXR Processor Pro', customSlotCount: 0 },
  { id: 'xe1', name: 'Fujifilm X-E1', sensor: SensorType.XTransI, processor: 'EXR Processor Pro', customSlotCount: 0 },
  { id: 'xm1', name: 'Fujifilm X-M1', sensor: SensorType.XTransI, processor: 'EXR Processor II', customSlotCount: 0 },

  // Bayer / EXR / Entry Level
  { id: 'x100', name: 'Fujifilm X100', sensor: SensorType.Bayer, processor: 'EXR Processor', customSlotCount: 0 },
  { id: 'xa1', name: 'Fujifilm X-A1', sensor: SensorType.Bayer, processor: 'EXR Processor II', customSlotCount: 0 },
  { id: 'xa2', name: 'Fujifilm X-A2', sensor: SensorType.Bayer, processor: 'EXR Processor II', customSlotCount: 0 },
  { id: 'xa3', name: 'Fujifilm X-A3', sensor: SensorType.Bayer, processor: 'EXR Processor II', customSlotCount: 0 },
  { id: 'xa5', name: 'Fujifilm X-A5', sensor: SensorType.Bayer, processor: 'Processor (generic)', customSlotCount: 0 },
  { id: 'xa7', name: 'Fujifilm X-A7', sensor: SensorType.Bayer, processor: 'Processor (generic)', customSlotCount: 0 },
  { id: 'xt100', name: 'Fujifilm X-T100', sensor: SensorType.Bayer, processor: 'Processor (generic)', customSlotCount: 0 },
  { id: 'xt200', name: 'Fujifilm X-T200', sensor: SensorType.Bayer, processor: 'Processor (generic)', customSlotCount: 0 },
  { id: 'xf10', name: 'Fujifilm XF10', sensor: SensorType.Bayer, processor: 'Processor (generic)', customSlotCount: 0 },
  { id: 'x10', name: 'Fujifilm X10', sensor: SensorType.EXR, processor: 'EXR Processor', customSlotCount: 0 },
  { id: 'xs1', name: 'Fujifilm X-S1', sensor: SensorType.EXR, processor: 'EXR Processor', customSlotCount: 0 },

  // GFX
  { id: 'gfx100ii', name: 'Fujifilm GFX 100 II', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx100sii', name: 'Fujifilm GFX 100S II', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx100s', name: 'Fujifilm GFX 100S', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx100', name: 'Fujifilm GFX 100', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx50sii', name: 'Fujifilm GFX 50S II', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx50s', name: 'Fujifilm GFX 50S', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx50r', name: 'Fujifilm GFX 50R', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfxeterna', name: 'Fujifilm GFX Eterna', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
  { id: 'gfx100rf', name: 'Fujifilm GFX 100RF', sensor: SensorType.GFX, processor: 'GFX Processor', customSlotCount: 7 },
];

export const MOCK_RECIPES: Recipe[] = recipesData as unknown as Recipe[];

export const DEFAULT_SETTINGS: UserSettings = {
  device: CAMERAS[0], // X100VI
  customSlots: { C1: null, C2: null, C3: null, C4: null, C5: null, C6: null, C7: null }
};
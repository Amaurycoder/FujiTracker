export enum SensorType {
  XTransV = 'X-Trans V',
  XTransIV = 'X-Trans IV',
  XTransIII = 'X-Trans III',
  XTransII = 'X-Trans II',
  XTransI = 'X-Trans I',
  EXR = 'EXR CMOS',
  Bayer = 'Bayer',
  GFX = 'GFX',
}

export enum FilmSimulation {
  Provia = 'Provia/Standard',
  Velvia = 'Velvia/Vivid',
  Astia = 'Astia/Soft',
  ClassicChrome = 'Classic Chrome',
  ProNegHi = 'Pro Neg. Hi',
  ProNegStd = 'Pro Neg. Std',
  ClassicNeg = 'Classic Neg.',
  NostalgicNeg = 'Nostalgic Neg.',
  Eterna = 'Eterna/Cinema',
  EternaBleachBypass = 'Eterna Bleach Bypass',
  Acros = 'Acros',
  AcrosYe = 'Acros + Ye Filter',
  AcrosR = 'Acros + R Filter',
  AcrosG = 'Acros + G Filter',
  Monochrome = 'Monochrome',
  Sepia = 'Sepia',
  RealaAce = 'Reala Ace',
}

export enum DynamicRange {
  DR100 = 'DR100',
  DR200 = 'DR200',
  DR400 = 'DR400',
  DRAuto = 'DRAuto',
}

export enum GrainEffect {
  Off = 'Off',
  WeakSmall = 'Weak Small',
  WeakLarge = 'Weak Large',
  StrongSmall = 'Strong Small',
  StrongLarge = 'Strong Large',
}

export enum ColorChromeEffect {
  Off = 'Off',
  Weak = 'Weak',
  Strong = 'Strong',
}

export enum WhiteBalanceType {
  Auto = 'Auto',
  Daylight = 'Daylight',
  Shade = 'Shade',
  Fluorescent1 = 'Fluorescent 1',
  Fluorescent2 = 'Fluorescent 2',
  Fluorescent3 = 'Fluorescent 3',
  Incandescent = 'Incandescent',
  Underwater = 'Underwater',
  Kelvin = 'Kelvin',
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  author: string;
  sensor: SensorType;
  simulation: FilmSimulation;
  grain: GrainEffect;
  colorChromeEffect: ColorChromeEffect;
  colorChromeFXBlue: ColorChromeEffect;
  whiteBalance: WhiteBalanceType;
  wbShiftR: number; // -9 to +9
  wbShiftB: number; // -9 to +9
  kelvin?: number;
  dynamicRange: DynamicRange;
  highlight: number; // -2 to +4 usually, depends on sensor
  shadow: number;
  color: number;
  sharpness: number;
  noiseReduction: number;
  clarity?: number;
  isFavorite?: boolean;
  tags?: string[];
  imageUrl?: string; // For preview visualization
  iso?: string; // New field
  exposureCompensation?: string; // New field
  personalRating?: number; // 1-5 star rating
  personalNotes?: string; // Private notes
}

export interface Device {
  id: string;
  name: string;
  sensor: SensorType;
  processor: string;
  customSlotCount: number;
}

export interface UserSettings {
  device: Device;
  customSlots: Record<string, string | null>; // C1 -> RecipeID
}
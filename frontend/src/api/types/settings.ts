import { LanguageCode } from "./lang-codes";

type MeasurementSystem = "metric" | "imperial";
type PreferedHeightUnit = "cm" | "ft_in";
type PreferedWeightUnit = "kg" | "lbs";
type Theme = "light" | "dark" | "system";
type OneRepMaxFormula = "epley" | "brzycki";

type Preferences = {
  height_unit: PreferedHeightUnit;
  language: LanguageCode;
  measurement_system: MeasurementSystem;
  orm_formula: OneRepMaxFormula;
  theme: Theme;
  units: PreferedWeightUnit;
  week_starts_on: "monday" | "sunday";
};

export type {
  MeasurementSystem,
  PreferedHeightUnit,
  PreferedWeightUnit,
  Preferences,
  Theme,
  OneRepMaxFormula,
};

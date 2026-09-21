const fs = require('fs');
const path = require('path');

const agriFiles = [
  'SoilMoistureCard', 'TemperatureCard', 'HumidityCard', 'LightIntensityCard',
  'IrrigationPanel', 'CropSelector', 'CropRegistrationForm', 'CropGrowthTimeline', 'AgricultureCharts'
];

const powerFiles = [
  'BatteryCard', 'SolarPanelCard', 'GridStatusCard', 'VoltageSensorCard',
  'CurrentSensorCard', 'PowerSourceSelector', 'LoadStatus', 'PowerHistoryChart'
];

const roofFiles = [
  'RoofStatus', 'RainSensorCard', 'RoofMotorControl', 'SolarTrackerStatus', 'TrackerPositionChart'
];

const securityFiles = [
  'PerimeterStatus', 'SecurityEventCard', 'SecurityCamera', 'CropCamera', 'MotionStatus', 'AlertHistory'
];

const baseDir = path.join(process.cwd(), 'src', 'components');

function makeDummy(name) {
  return "export function " + name + "() {\\n" +
  "  return <div className='p-4 border border-border bg-panel text-ink-dim rounded text-center text-sm'>" + name + " Component</div>;\\n" +
  "}";
}

agriFiles.forEach(f => fs.writeFileSync(path.join(baseDir, 'agriculture', f + '.tsx'), makeDummy(f)));
powerFiles.forEach(f => fs.writeFileSync(path.join(baseDir, 'power', f + '.tsx'), makeDummy(f)));
roofFiles.forEach(f => fs.writeFileSync(path.join(baseDir, 'roof', f + '.tsx'), makeDummy(f)));
securityFiles.forEach(f => fs.writeFileSync(path.join(baseDir, 'security', f + '.tsx'), makeDummy(f)));

console.log('Created all dummy files');

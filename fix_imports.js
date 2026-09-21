const fs = require('fs');

let p = 'src/app/dashboard/crop-camera/page.tsx';
let txt = fs.readFileSync(p, 'utf8');
txt = txt.replace(/SecurityCards/g, 'SecurityCamera');
txt = txt.replace(/SecurityCameraStream/g, 'SecurityCamera');
fs.writeFileSync(p, txt);

p = 'src/app/dashboard/roof-tracker/page.tsx';
txt = fs.readFileSync(p, 'utf8');
txt = txt.replace(/RoofCards/g, 'RoofStatus').replace(/RoofStatusCard/g, 'RoofStatus');
txt = txt.replace("import { RoofStatus, RainSensorCard } from '@/components/roof/RoofStatus';", 
  "import { RoofStatus } from '@/components/roof/RoofStatus';\\nimport { RainSensorCard } from '@/components/roof/RainSensorCard';");
fs.writeFileSync(p, txt);

p = 'src/app/dashboard/agriculture/page.tsx';
txt = fs.readFileSync(p, 'utf8');
txt = txt.replace("import { SoilMoistureCard, TemperatureCard, HumidityCard, LightIntensityCard } from '@/components/agriculture/AgricultureCards';", 
  "import { SoilMoistureCard } from '@/components/agriculture/SoilMoistureCard';\\nimport { TemperatureCard } from '@/components/agriculture/TemperatureCard';\\nimport { HumidityCard } from '@/components/agriculture/HumidityCard';\\nimport { LightIntensityCard } from '@/components/agriculture/LightIntensityCard';");
fs.writeFileSync(p, txt);

p = 'src/app/dashboard/power/page.tsx';
txt = fs.readFileSync(p, 'utf8');
txt = txt.replace("import { BatteryCard, SolarPanelCard, GridStatusCard } from '@/components/power/PowerCards';", 
  "import { BatteryCard } from '@/components/power/BatteryCard';\\nimport { SolarPanelCard } from '@/components/power/SolarPanelCard';\\nimport { GridStatusCard } from '@/components/power/GridStatusCard';");
fs.writeFileSync(p, txt);

console.log('Done replacing imports');

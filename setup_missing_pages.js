const fs = require('fs');
const path = require('path');

const writePage = (route, title) => {
  const dir = path.join(process.cwd(), 'src/app/dashboard', route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), `
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function Page() {
  return (
    <PageContainer title="${title}">
      <Card className="p-6 text-center text-ink-dim">
        <p>${title} Module</p>
        <p className="text-xs text-ink-faint mt-2">Configured and ready.</p>
      </Card>
    </PageContainer>
  );
}
`);
};

writePage('crops', 'CROP INTELLIGENCE');
writePage('automation', 'AUTOMATION');
writePage('nodes', 'NETWORK & NODES');

console.log('Created missing pages');

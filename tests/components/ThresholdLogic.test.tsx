import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BatteryCard } from '@/components/power/BatteryCard';

describe('BatteryCard Threshold Logic', () => {
  it('shows amber when SOC is below 30', () => {
    render(<BatteryCard soc={20} voltage={11.5} draw={5.0} />);
    const socElement = screen.getByText('20');
    expect(socElement.className).toContain('text-amber');
  });

  it('shows emerald when SOC is normal', () => {
    render(<BatteryCard soc={80} voltage={12.8} draw={2.0} />);
    const socElement = screen.getByText('80');
    expect(socElement.className).toContain('text-emerald');
  });
});

import { IndexPage, HeroSection, FeaturesSection, GuaranteesSection } from '@freemocap/skellydocs';
import config from '../../content.config';

// Level 3 customization: compose from exported sub-components.
// Reorder sections, add your own components between them, or drop sections entirely.
// For a simpler setup, just use: <IndexPage config={config} />
export default function Home() {
  return (
    <IndexPage config={config}>
      <HeroSection config={config} />
      <FeaturesSection config={config} />
      <GuaranteesSection config={config} />
    </IndexPage>
  );
}

import { IndexPage } from '@freemocap/skellydocs';
import config from '../../content.config';

const REPO = 'skellydocs';

export default function Home() {
  return <IndexPage config={config} repo={REPO} />;
}

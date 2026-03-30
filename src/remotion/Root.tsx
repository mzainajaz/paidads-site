import { Composition } from "remotion";
import { BetaAdsHighImpact } from "./BetaAdsHighImpact";
import { PaidAdsIntro } from "./PaidAdsIntro";

export const RemotionRoot = () => (
  <>
    <Composition id="BetaAdsHighImpact" component={BetaAdsHighImpact} durationInFrames={1080} fps={30} width={1920} height={1080} />
    <Composition id="PaidAdsIntro" component={PaidAdsIntro} durationInFrames={360} fps={30} width={1920} height={1080} />
  </>
);

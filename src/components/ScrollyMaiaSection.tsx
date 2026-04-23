import CaseStudyScrollySection from "@/components/CaseStudyScrollySection";
import beforeImg from "@/assets/case-maia-before.png";
import afterImg from "@/assets/case-maia-after.png";

const ScrollyMaiaSection = () => (
  <CaseStudyScrollySection
    id="case-study-maia"
    i18nPrefix="scrollyMaia"
    beforeSrc={beforeImg}
    afterSrc={afterImg}
    beforeIntrinsicW={1024}
    afterIntrinsicW={1024}
    beforeIntrinsicH={569}
    afterIntrinsicH={590}
    intrinsicH={590}
    tone="default"
  />
);

export default ScrollyMaiaSection;

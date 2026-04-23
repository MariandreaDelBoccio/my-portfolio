import CaseStudyScrollySection from "@/components/CaseStudyScrollySection";
import beforeImg from "@/assets/case-medbio-before.png";
import afterImg from "@/assets/case-medbio-after.png";

const ScrollyRedesignSection = () => (
  <CaseStudyScrollySection
    id="case-study"
    i18nPrefix="scrollyCase"
    beforeSrc={beforeImg}
    afterSrc={afterImg}
    beforeIntrinsicW={265}
    afterIntrinsicW={326}
    intrinsicH={1024}
    liveUrl="https://medbioinformatics.com"
    liveHostDisplay="medbioinformatics.com"
    tone="default"
  />
);

export default ScrollyRedesignSection;

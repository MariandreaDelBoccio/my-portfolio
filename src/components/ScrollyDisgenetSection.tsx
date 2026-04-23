import CaseStudyMultiPageSection from "@/components/CaseStudyMultiPageSection";
import old1 from "@/assets/case-disgenet-before.png";
import old2 from "@/assets/case-disgenet-before-2.png";
import new1 from "@/assets/case-disgenet-after.png";
import new2 from "@/assets/case-disgenet-after-2.png";

const ScrollyDisgenetSection = () => (
  <CaseStudyMultiPageSection
    id="case-study-disgenet"
    i18nPrefix="scrollyDisgenet"
    images={[
      { src: old1, intrinsicW: 349, intrinsicH: 1024 },
      { src: old2, intrinsicW: 3416, intrinsicH: 4940 },
      { src: new1, intrinsicW: 480, intrinsicH: 1024 },
      { src: new2, intrinsicW: 3416, intrinsicH: 4490 },
    ]}
    liveUrl="https://disgenet.com"
    liveHostDisplay="disgenet.com"
    tone="muted"
  />
);

export default ScrollyDisgenetSection;

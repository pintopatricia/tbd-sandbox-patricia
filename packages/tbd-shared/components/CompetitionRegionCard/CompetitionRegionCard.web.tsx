import { Card, Divider, Image, QuickLink } from "@ppb/the-wall-web";
import { FunctionComponent, MouseEvent, useCallback } from "react";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { ComponentProps } from "./props";
import styles from "./CompetitionRegionCard.web.css";
import { CompetitionViewLink } from "./competition-region-card-view-model";

type QuickLinkOnClick = (e: MouseEvent, item: CompetitionViewLink) => void;

const CompetitionRegionCard: FunctionComponent<ComponentProps> = ({
  competitionRegions,
  urn,
  dispatchNavigateToCompetitionView,
  dispatchPushAction,
}) => {
  const handleLinkClick = useCallback<QuickLinkOnClick>(
    (e, item) => {
      const { viewLink, title } = item;

      e.preventDefault();

      dispatchNavigateToCompetitionView(urn, viewLink.viewUrl, title);
      dispatchPushAction(viewLink);
    },
    [dispatchNavigateToCompetitionView, dispatchPushAction, urn],
  );

  return (
    <div className={styles.container}>
      <Card theme={CardTheme.PRIMARY} fullWidthContent={true}>
        {competitionRegions?.map((competitionRegion, index) => {
          const renderFlag = () =>
            competitionRegion.flag ? (
              <div className={styles.collapseHeaderContainer}>
                <Image src={competitionRegion.flag} alt="" />
              </div>
            ) : null;

          return (
            <>
              <Card
                startElement={renderFlag()}
                title={competitionRegion.title}
                key={competitionRegion.urn}
                startOpen={false}
                isCollapsible={true}
                size={CardHeaderSize.LARGE}
                theme={CardTheme.PRIMARY}
                fullWidthContent={true}
                removeBorderRadius={true}
              >
                {competitionRegion.competitionViewLinks.map((competitionViewLink, indexLink) => (
                  <div key={`${competitionViewLink.title}-${indexLink}`}>
                    <QuickLink
                      item={{ viewLink: competitionViewLink.viewLink, text: competitionViewLink.title }}
                      isIndented
                      isLightBackground
                      onLinkClick={(event) => handleLinkClick(event, competitionViewLink)}
                    />
                    <Divider />
                  </div>
                ))}
              </Card>
              {index !== competitionRegions.length - 1 && <Divider />}
            </>
          );
        })}
      </Card>
    </div>
  );
};

export default CompetitionRegionCard;

import { FunctionComponent, MouseEvent } from "react";
import { LinkItem } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { RewardsIconName } from "@ppb/the-wall-icons";
import { Card, QuickLink, ScrollableSwimlane } from "@ppb/the-wall-web";
import { CashBalancesSimpleViewWallets } from "../CashBalancesSimpleView/CashBalancesSimpleView.web";
import {
  CashBalances,
  CashBalancesToggleSimpleDetailedViewClick,
  CashBalancesEyeIconClick,
  CashBalancesI18N,
} from "../CashBalances/CashBalances.web";
import { Budget, BudgetLimit } from "../Budget/Budget.web";
import { DetailedSummaryGroups } from "../../../MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.types";
import { RegulatorySection } from "../RegulatorySectionsSession/RegulatorySections.types";
import { RewardCard } from "../RewardCard/RewardCard.web";
import { Rewards, type RewardsMonthType } from "../Rewards/Rewards.web";
import { SectionElements, SectionItemOnClick } from "../SectionElements/SectionElements.web";
import { UserMenu, UserMenuItem } from "../UserMenu/UserMenu.web";
import { UserQuickMenu, UserQuickMenuItem, UserQuickMenuOnClick } from "../UserQuickMenu/UserQuickMenu.web";
import styles from "./UserProfile.web.css";

export type UserProfileI18n = {
  welcomeText: string;
  lastLoginText: string;
  cashBalance: CashBalancesI18N;
  basicPlan: string;
  rewardsPlan: string;
};

export type UserProfileMenus = {
  groupsMenuItem: RegulatorySection;
};

export type UserProfileNoPlanSelected = {
  packageLevel: string | null;
  packages: (string | null[])[];
};

export type UserProfileBudgetClick = (event: MouseEvent, budgetLimit: BudgetLimit) => void;

export type UserProfileNoPlanSelectedClick = () => void;

export type UserProfileRewardsClick = () => void;

export type UserProfileProps = {
  firstName: string;
  translations: UserProfileI18n;
  lastLoginDate?: string;
  menuItems: UserMenuItem[];
  quickMenu: UserQuickMenuItem[];
  showBalances: boolean;
  simpleViewBalances: CashBalancesSimpleViewWallets[];
  detailedViewBalance: DetailedSummaryGroups[];
  rewards?: RewardsMonthType[] | null;
  rewardsTitle: string | null;
  basicPlan?: LinkItem | null;
  noPlanSelected: UserProfileNoPlanSelected[] | null;
  packageLevel: string;
  groupsMenu: UserProfileMenus[];
  budgetLimit?: BudgetLimit | null;
  balanceToggle: boolean;
  onClickUserMenuLink: SectionItemOnClick;
  onNoPlanSelectedClick: UserProfileNoPlanSelectedClick;
  onRewardsClick: UserProfileRewardsClick;
  onClickQuickMenuLink: UserQuickMenuOnClick;
  onToggleSimpleDetailedViewClick: CashBalancesToggleSimpleDetailedViewClick;
  onEyeIconClick: CashBalancesEyeIconClick;
  onBudgetLinkClick: UserProfileBudgetClick;
  hasUnreadNotifications?: boolean;
};

export const UserProfile: FunctionComponent<UserProfileProps> = ({
  firstName,
  translations,
  lastLoginDate,
  menuItems,
  quickMenu,
  showBalances,
  simpleViewBalances,
  detailedViewBalance,
  rewards,
  rewardsTitle,
  basicPlan,
  noPlanSelected,
  packageLevel,
  groupsMenu,
  budgetLimit,
  balanceToggle,
  onClickUserMenuLink,
  onNoPlanSelectedClick,
  onRewardsClick,
  onClickQuickMenuLink,
  onToggleSimpleDetailedViewClick,
  onEyeIconClick,
  onBudgetLinkClick,
  hasUnreadNotifications,
}) => {
  const titleMapping: { [key: string]: string } = {
    GOOD: translations.basicPlan,
    BETTER: translations.rewardsPlan,
    BEST: `${translations.rewardsPlan}+`,
  };
  const iconMapping: { [key: string]: RewardsIconName } = {
    GOOD: RewardsIconName.BASIC,
    BETTER: RewardsIconName.NORMAL,
    BEST: RewardsIconName.DIAMOND,
  };
  const packageOrder: { [key: string]: number } = {
    BEST: 1,
    BETTER: 2,
    GOOD: 3,
    NO_PACKAGE_LEVEL: 4,
  };

  const orderedNoPlanSelected =
    noPlanSelected &&
    noPlanSelected
      .map((item) =>
        item.packageLevel
          ? { ...item, order: packageOrder[item.packageLevel] }
          : { ...item, order: packageOrder.NO_PACKAGE_LEVEL },
      )
      .sort((package1, package2) => {
        if (package1.order > package2.order) return 1;
        if (package1.order < package2.order) return -1;
        return 0;
      });

  const formattedLoginDate = lastLoginDate
    ? new Date(lastLoginDate)
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "")
    : undefined;

  return (
    <div role="menu" tabIndex={0} className={styles.userProfile}>
      <div className={styles.title}>
        <div className={`typography-h680`}>
          {translations.welcomeText} {firstName}
        </div>
        {!!lastLoginDate && (
          <div className={styles.lastLogin}>
            {translations.lastLoginText} {formattedLoginDate}
          </div>
        )}
      </div>

      {!!quickMenu.length && <UserQuickMenu items={quickMenu} onItemClick={onClickQuickMenuLink} />}

      {!!simpleViewBalances.length && detailedViewBalance.length && (
        <div className={styles.cashBalances}>
          <CashBalances
            i18n={translations.cashBalance}
            showBalances={showBalances}
            simpleViewBalances={simpleViewBalances}
            detailedViewBalance={detailedViewBalance}
            onToggleSimpleDetailedViewClick={onToggleSimpleDetailedViewClick}
            onEyeIconClick={onEyeIconClick}
            balanceToggle={balanceToggle}
          />
        </div>
      )}
      {rewardsTitle && (
        <div className={styles.rewardsContainer}>
          <p className={`typography-h380 ${styles.title}`}>{rewardsTitle}</p>
          {rewards && (
            <Card title={titleMapping[packageLevel]} icon={iconMapping[packageLevel]}>
              <Rewards monthRewards={rewards} onClick={() => onRewardsClick()} />
            </Card>
          )}
          {basicPlan && (
            <QuickLink
              item={basicPlan}
              onLinkClick={(e) => {
                if (basicPlan.viewLink?.viewUrl) {
                  onClickQuickMenuLink(e, basicPlan.viewLink?.viewUrl);
                }
              }}
              icon={
                <div className={styles.iconWrapper}>
                  <GenericIcon name={RewardsIconName.BASIC} color={"var(--neutrals-icon-default)"} />
                </div>
              }
            />
          )}
          {orderedNoPlanSelected && (
            <div className={`${styles.rewardsCardContainer}`}>
              <ScrollableSwimlane
                snap
                noSpacing
                onClick={() => {
                  onNoPlanSelectedClick();
                }}
              >
                {orderedNoPlanSelected.map((item: any, index) => (
                  <RewardCard
                    key={index}
                    icon={<GenericIcon name={iconMapping[item.packageLevel]} color={"var(--neutrals-icon-default)"} />}
                    title={titleMapping[item.packageLevel]}
                    benefits={item.packages}
                  />
                ))}
              </ScrollableSwimlane>
            </div>
          )}
        </div>
      )}
      {budgetLimit && (
        <div className={styles.card}>
          <Budget budgetLimit={budgetLimit} onBudgetLinkClick={(event) => onBudgetLinkClick(event, budgetLimit)} />
        </div>
      )}
      {!!groupsMenu &&
        groupsMenu.map(({ groupsMenuItem }, index) => (
          <div key={index} className={`${styles.sectionGroupMenu} ${groupsMenuItem.sectionLabel}`}>
            <SectionElements
              section={groupsMenuItem}
              onSectionClick={onClickUserMenuLink}
              hasUnreadNotifications={hasUnreadNotifications}
            />
          </div>
        ))}

      <UserMenu items={menuItems} onDismiss={() => {}} />
    </div>
  );
};

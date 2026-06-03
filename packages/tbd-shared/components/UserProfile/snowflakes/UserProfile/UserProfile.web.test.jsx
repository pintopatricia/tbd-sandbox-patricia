import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Alignment } from "@ppb/the-wall-common/constants";
import { QuickLink, ScrollableSwimlane } from "@ppb/the-wall-web";
import { CashBalances } from "../CashBalances/CashBalances.web";
import { Budget } from "../Budget/Budget.web";
import { Rewards } from "../Rewards/Rewards.web";
import { SectionElements } from "../SectionElements/SectionElements.web";
import { UserMenu } from "../UserMenu/UserMenu.web";
import { UserQuickMenu } from "../UserQuickMenu/UserQuickMenu.web";
import { UserProfile } from "./UserProfile.web";
import { TITLE, LAST_LOGIN } from "./UserProfile.web.selectors";
import { RewardCard } from "../RewardCard/RewardCard.web";

const mockUserProfile = {
  firstName: "Sebastian",
  formattedLoginDate: "2024-10-28T18:55:50.000Z",
};

const mockI18n = {
  welcomeText: "Welcome,",
  lastLoginText: "Last login",
  cashBalance: {
    cashBalancesTitleLabel: "Cash Balances",
    hiddenLabel: "Hidden",
    showMoreLabel: "Show More",
    showLessLabel: "Show Less",
  },
};

const menuItemsMock = [
  {
    label: "item",
  },
  {
    label: "link",
    href: "https://noop.io",
  },
];

const simpleViewBalancesMock = [
  {
    title: "Cash Balance",
    subTitle: "",
    amount: "$450,000.00",
  },
];

const detailedViewBalanceMock = [
  {
    title: "Cash Balance",
    wallets: [
      {
        title: "Poker Wallet",
        amount: "£7.00",
      },
    ],
  },
  {
    title: "Bonus Balances (non-withdrawable)",
    wallets: [
      {
        title: "Bonus with turnover requirements",
        amount: "£1,000.00",
      },
    ],
  },
];

const groupLinksMockOne = {
  sectionType: "GENERIC",
  title: "Betfair Rewards & Promotions",
  bgColor: "",
  textColor: "",
  items: [
    {
      type: "LINK",
      text: "My Betfair Rewards",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
    {
      type: "LINK",
      text: "My Promotions",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
    {
      type: "LINK",
      text: "Refer & Earn",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
    {
      type: "LINK",
      text: "Active Bonuses",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
  ],
};

const groupLinksMockTwo = {
  sectionType: "GENERIC",
  title: "Account Details",
  bgColor: "",
  textColor: "",
  items: [
    {
      type: "LINK",
      text: "Verify My Account",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
    {
      type: "LINK",
      text: "My Details",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
    {
      type: "LINK",
      text: "Settings",
      url: "",
      target: "_blank",
      alignment: Alignment.Left,
    },
  ],
};

const groupLinksMock = [{ groupsMenuItem: groupLinksMockOne }, { groupsMenuItem: groupLinksMockTwo }];

const quickMenuItemsMock = [
  { label: "Deposit", url: "deposit", icon: "deposit" },
  { label: "Withdraw", url: "withdraw", icon: "withdraw" },
];

const rewardsMock = [
  {
    month: "September",
    monthMessage: (
      <p>
        You need to have bets settled on
        <span> 20 more markets </span> to qualify for benefits next month.
      </p>
    ),
    bets: {
      totalBets: 20,
      currentBets: 0,
    },
    url: "https://myaccount.betfair.com/rewards/my-rewards?prod=7&returnURL=https%3A%2F%2Fmyaccount.betfair.com%2Faccount%2Fnavigation%3Fprod%3D7%26showHeader%3D1%26iframe%3Dfalse%26returnURL%3Dhttps%3A%2F%2Fwww.betfair.com%2Fexchange%2F",
    target: "_self",
  },
  {
    month: "August",
    monthMessage: <p>Sorry, you didn t qualify for this month s rewards as you only had settled bets in 0 markets.</p>,
    url: "https://myaccount.betfair.com/rewards/my-rewards?prod=7&returnURL=https%3A%2F%2Fmyaccount.betfair.com%2Faccount%2Fnavigation%3Fprod%3D7%26showHeader%3D1%26iframe%3Dfalse%26returnURL%3Dhttps%3A%2F%2Fwww.betfair.com%2Fexchange%2F",
    target: "_self",
  },
];

const rewardsTitleMock = "My Betfair Rewards";

const noPlanSelectedMock = [
  {
    packageLevel: "BEST",
    packages: [
      "10% Refund on Losses",
      "$10 Free Acca Every Month",
      " Free Spins Every Month",
      "Cash Race - Extra Prizes",
      " Free Play(s) on Beat The Drop",
      "8% Commission",
    ],
  },
  {
    packageLevel: "BETTER",
    packages: [
      "$5 Free Acca Every Month",
      " Free Spins Every Month",
      "Cash Race - Extra Prizes",
      " Free Play(s) on Beat The Drop",
      "5% Commission",
    ],
  },
  {
    packageLevel: "GOOD",
    packages: ["Cash Race - Extra Prizes", "Best Odds Guaranteed on Sportsbook", "Access to Promos", "2% Commission"],
  },
];

const basicPlanMock = {
  target: "_self",
  text: "Basic Plan",
  viewLink: {
    viewUrl:
      "https://myaccount.betfair.com/rewards/my-rewards?prod=7&returnURL=https%3A%2F%2Fmyaccount.betfair.com%2Faccount%2Fnavigation%3Fprod%3D7%26showHeader%3D1%26iframe%3Dfalse%26returnURL%3Dhttps%3A%2F%2Fwww.betfair.com%2Fexchange%2F",
    viewUrn: "",
  },
};

const noPlanSelectedClick = jest.fn();

const budgetLimitMock = {
  budgetLimit: [
    {
      amount: 500,
      remain: 400,
      currencyValue: "$400",
      remainMessage: "remaining",
      resetMessage: "Resets: 02.03.2021, 00:00",
      reset: "02.03.2021, 00:00",
      linkMessage: "Go to My Spend Budget",
      itemLink: {
        viewLink: {
          viewUrl: "https://myspendbudget.betfair.com/my-budget?prod=90&showHeader=0",
          viewUrn: "",
        },
        target: "_self",
        isTextLink: true,
      },
    },
  ],
};

jest.mock("@ppb/the-wall-web", () => ({
  QuickLink: jest.fn(() => <quick-link />),
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
  ScrollableSwimlane: jest.fn(({ children }) => <swimlane-mock>{children}</swimlane-mock>),
}));

jest.mock("../SectionElements/SectionElements.web", () => ({
  SectionElements: jest.fn(() => <user-menu />),
}));

jest.mock("../UserMenu/UserMenu.web", () => ({
  UserMenu: jest.fn(() => <user-menu />),
}));

jest.mock("../RewardCard/RewardCard.web", () => ({
  RewardCard: jest.fn(() => <reward-card />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../UserQuickMenu/UserQuickMenu.web", () => ({
  UserQuickMenu: jest.fn(() => <user-quick-menu />),
}));

jest.mock("../Rewards/Rewards.web", () => ({
  Rewards: jest.fn(() => <rewards-menu />),
}));

jest.mock("../CashBalances/CashBalances.web", () => ({
  CashBalances: jest.fn(() => <cash-balances />),
}));

jest.mock("../Budget/Budget.web", () => ({
  Budget: jest.fn(() => <budget-card />),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  ...jest.requireActual("@ppb/the-wall-icons"),
  RewardsColor: jest.fn(() => <mock-rewards-color />),
}));

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("UserProfile", () => {
  beforeEach(jest.clearAllMocks);

  const renderUserProfile = (
    quickMenu = [],
    simpleViewBalances = [],
    detailedViewBalance = [],
    groupsMenu = [],
    rewards = [],
    basicPlan = {},
    noPlanSelected = [],
    rewardsTitle = rewardsTitleMock,
    packageLevel = "",
    rewardsOnClick = jest.fn(),
    quickLinkOnClick = jest.fn(),
    budgetLimit = [],
  ) =>
    render(
      <>
        <div className="outsideElement">DUMMY</div>
        <UserProfile
          firstName={mockUserProfile.firstName}
          translations={mockI18n}
          lastLoginDate={mockUserProfile.formattedLoginDate}
          menuItems={menuItemsMock}
          quickMenu={quickMenu}
          showBalances={true}
          simpleViewBalances={simpleViewBalances}
          detailedViewBalance={detailedViewBalance}
          rewards={rewards}
          rewardsTitle={rewardsTitle}
          onRewardsClick={rewardsOnClick}
          basicPlan={basicPlan}
          noPlanSelected={noPlanSelected}
          packageLevel={packageLevel}
          onNoPlanSelectedClick={noPlanSelectedClick}
          groupsMenu={groupsMenu}
          onClickUserMenuLink={() => {}}
          onClickQuickMenuLink={quickLinkOnClick}
          onToggleSimpleDetailedViewClick={() => {}}
          budgetLimit={budgetLimit}
          onBudgetLinkClick={() => {}}
        />
      </>,
    );
  describe("when component is called with props", () => {
    it("should render the correct title", () => {
      const { container } = renderUserProfile();

      expect(container.querySelector(TITLE)).toHaveTextContent(`Welcome, ${mockUserProfile.firstName}`);
    });

    it("should render correct last login date if lastLoginDate is defined", () => {
      const { container } = renderUserProfile();

      expect(container.querySelector(LAST_LOGIN)).toHaveTextContent(`Last login 28/10/2024 18:55`);
    });

    it("should render Balances", () => {
      renderUserProfile([], simpleViewBalancesMock, detailedViewBalanceMock);

      expect(CashBalances).toHaveBeenCalledTimes(1);
      expect(CashBalances).toHaveBeenCalledWith(
        {
          showBalances: true,
          simpleViewBalances: simpleViewBalancesMock,
          detailedViewBalance: detailedViewBalanceMock,
          onToggleSimpleDetailedViewClick: expect.any(Function),
          i18n: mockI18n.cashBalance,
        },
        undefined,
      );
    });
  });

  describe("when component has quick menu", () => {
    it("should not render group menus", () => {
      renderUserProfile([], [], [], [], [], {}, []);

      expect(UserQuickMenu).toHaveBeenCalledTimes(0);
    });

    it("should render quick menu", () => {
      renderUserProfile(quickMenuItemsMock);

      expect(UserQuickMenu).toHaveBeenCalledTimes(1);
      expect(UserQuickMenu).toHaveBeenCalledWith(
        {
          items: quickMenuItemsMock,
          onItemClick: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when component has no balances", () => {
    it("should not render balances", () => {
      renderUserProfile([], [], []);

      expect(CashBalances).toHaveBeenCalledTimes(0);
    });

    it("should render user menu", () => {
      renderUserProfile([], simpleViewBalancesMock, detailedViewBalanceMock);

      expect(UserMenu).toHaveBeenCalledTimes(1);
      expect(UserMenu).toHaveBeenCalledWith(
        {
          items: menuItemsMock,
          onDismiss: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when component has groups menu", () => {
    it("should not render group menus", () => {
      renderUserProfile([], [], [], [], [], {}, []);

      expect(SectionElements).toHaveBeenCalledTimes(0);
    });

    it("should render group menu", () => {
      renderUserProfile([], [], [], groupLinksMock);

      expect(SectionElements).toHaveBeenCalledTimes(2);
      expect(SectionElements).toHaveBeenCalledWith(
        {
          onSectionClick: expect.any(Function),
          section: expect.any(Object),
        },
        undefined,
      );
    });
  });

  describe("when component has rewards menu", () => {
    it("should not render rewards menu", () => {
      renderUserProfile([], [], [], [], null);

      expect(Rewards).toHaveBeenCalledTimes(0);
    });

    it("should not render rewards menu if rewards title is null", () => {
      renderUserProfile([], [], [], [], [], null, [], null);

      expect(Rewards).toHaveBeenCalledTimes(0);
    });

    it("should not render rewards menu if rewards is null", () => {
      renderUserProfile([], [], [], [], null, null, [], rewardsTitleMock);

      expect(Rewards).toHaveBeenCalledTimes(0);
    });

    it("should render rewards menu", () => {
      renderUserProfile(rewardsMock);

      expect(Rewards).toHaveBeenCalledTimes(1);
      expect(Rewards).toHaveBeenCalledWith(
        {
          monthRewards: expect.any(Array),
          onClick: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when component has basic plan for rewards", () => {
    it("should not render basic plan", () => {
      renderUserProfile([], [], [], [], null, null);

      expect(QuickLink).toHaveBeenCalledTimes(0);
    });

    it("should render rewards menu", () => {
      renderUserProfile(basicPlanMock);

      expect(QuickLink).toHaveBeenCalledTimes(1);
      expect(QuickLink).toHaveBeenCalledWith(
        {
          item: expect.any(Object),
          onLinkClick: expect.any(Function),
          icon: expect.any(Object),
        },
        undefined,
      );
    });
  });

  describe("when component has no plan selected for rewards", () => {
    it("should not render no plan selected", () => {
      renderUserProfile([], [], [], [], null, null, null);

      expect(RewardCard).toHaveBeenCalledTimes(0);
    });

    it("should render no plan selected", () => {
      renderUserProfile([], [], [], [], [], {}, noPlanSelectedMock);

      expect(RewardCard).toHaveBeenCalledWith(
        {
          title: expect.any(String),
          icon: expect.any(Object),
          benefits: expect.any(Array),
        },
        undefined,
      );
    });
  });

  describe("onClick callbacks", () => {
    it("should execute 'rewardsOnClick' when we click on rewards", () => {
      const mockFunction = jest.fn();

      act(() => {
        renderUserProfile([], [], [], [], rewardsMock, {}, [], rewardsTitleMock, "BETTER", mockFunction);
      });
      const rewards = Rewards.mock.calls[0][0];
      act(() => {
        rewards.onClick();
      });

      expect(mockFunction).toHaveBeenCalled();
    });

    it("should execute 'onLinkClick' when we click on quick link", () => {
      const mockFunction = jest.fn();

      act(() => {
        renderUserProfile(
          [],
          [],
          [],
          [],
          rewardsMock,
          basicPlanMock,
          [],
          rewardsTitleMock,
          "BETTER",
          () => {},
          mockFunction,
        );
      });
      const event = new MouseEvent("click");
      const quickLink = QuickLink.mock.calls[0][0];
      act(() => {
        quickLink.onLinkClick(event);
      });

      expect(mockFunction).toHaveBeenCalledWith(event, basicPlanMock.viewLink.viewUrl);
    });

    it("should execute 'onNoPlanSelectedClick' when we click on scrollableSwimlane", () => {
      renderUserProfile([], [], [], [], null, null, noPlanSelectedMock, rewardsTitleMock);

      ScrollableSwimlane.mock.calls[0][0].onClick();
      expect(noPlanSelectedClick).toHaveBeenCalled();
    });
  });

  describe("when component has budget card", () => {
    it("should render budget card", () => {
      renderUserProfile(budgetLimitMock);
      expect(Budget).toHaveBeenCalledTimes(1);
    });

    it("should not render budget card if props are null", () => {
      renderUserProfile([], [], [], [], [], undefined, [], null, "", jest.fn(), jest.fn(), null);
      expect(Budget).toHaveBeenCalledTimes(0);
    });
  });
});

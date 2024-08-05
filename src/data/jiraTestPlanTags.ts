export const jiraTestPlanTags = {
  prefix: "2p0_portal_",
  operator: {
    tags: ["flow", "recurring", "taas", "rcd", "dcr", "sharedphones"],
  },
  driver: {
    shift: {
      tags: ["flow", "unplanned", "autoend", "manualend", "earlystart"],
    },
    login: {
      tags: ["regular", "sso", "hybrid", "otp"],
    },
    app: {
      tags: ["flow", "cityselector"],
    },
    ride: {
      tags: ["flow", "dcr", "rcd", "dcd", "cash", "notes"],
    },
    breaks: {
      tags: ["flow", "scheduled", "dynamic", "autoend", "spontaneous"],
    },
    tags: ["taas"],
  },
  webapp: {
    tags: ["flow"],
  },
  rider: {
    paymentmethods: {
      tags: ["flow", "other"],
    },
    pricing: {
      tags: ["flow"],
    },
    app: {
      tags: ["flow", "menuitems_flow", "menuitems_custom"],
    },
    booking: {
      tags: [
        "flow",
        "prebooking",
        "travelreasons",
        "recurring",
        "noskipbilling",
        "skipbillingv1",
        "skipbillingv2",
        "skipbillingv3",
        "notes",
        "multimodal",
        "intermodal",
        "rcd",
      ],
    },
    login: {
      tags: ["regular", "sso", "hybrid", "otp"],
    },
  },
};

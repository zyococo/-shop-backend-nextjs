"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const stripe = require("stripe")(
  "sk_test_51MhVJDJ4qHhkggkTk9uQHrPlKFhyNGikSki3fYLzW1cRfSdXpD8tmRJXAjlDpN4vP2DW2QpB3tTQqfRCBiVGg5RQ004frH366t"
);

module.exports = {
  /**
   * Create a/an order record.
   *
   *
   */

  create: async (ctx) => {
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body);
    // charge on stripe
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      description: `Order ${new Date()} by ${ctx.state.user.id}`,
      source: token,
    });

    //データベースに注文を登録する
    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: amount,
      address,
      dishes,
    });

    return order;
  },
};

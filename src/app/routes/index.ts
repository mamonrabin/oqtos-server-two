import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { categoryRoutes } from '../modules/category/category.route.js';
import { subcategoryRoutes } from '../modules/sub-category/sub-category.route.js';
import { sizeRoutes } from '../modules/size/size.route.js';
import { colorRoutes } from '../modules/color/color.route.js';
import { brandRoutes } from '../modules/brand/brand.route.js';
import { productRoutes } from '../modules/product/product.route.js';
import { bannerRoutes } from '../modules/banner/banner.route.js';
import { orderRoutes } from '../modules/order/order.route.js';
import { PaymentRoutes } from '../modules/payment/payment.route.js';
import { OtpRoutes } from '../modules/otp/otp.route.js';
import { StatsRoutes } from '../modules/stats/stats.route.js';
import { aboutRoutes } from '../modules/about/about.route.js';
import { policyRoutes } from '../modules/policy/policy.route.js';
import { socialIconRoutes } from '../modules/social/social.route.js';
import { logoRoutes } from '../modules/logo/logo.route.js';
import { wishlistRoutes } from '../modules/wishlist/wishlist.route.js';
import { contactRoutes } from '../modules/contact/contact.route.js';
import { campaignRoutes } from '../modules/campaign/campaign.route.js';
import { couponRoutes } from '../modules/coupon/coupon.route.js';
import { reviewRoutes } from '../modules/review/review.route.js';
import { CourierRoutes } from '../modules/courier/courier.route.js';
import { returnRoutes } from '../modules/return/return.route.js';
import { homeRoutes } from '../modules/home-control/home-control.route.js';
import { blogRoutes } from '../modules/blog/blog.route.js';
import { affiliateRoutes } from '../modules/affiliate/affiliate.route.js';
import { customeRoutes } from '../modules/custome-design/custome-design.route.js';
import { themeRouter } from '../modules/theme/theme.route.js';
import { visitorRoutes } from '../modules/visitor/visitor.route.js';

export const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/sub-category',
    route: subcategoryRoutes,
  },
  {
    path: '/brand',
    route: brandRoutes,
  },
  {
    path: '/size',
    route: sizeRoutes,
  },
  {
    path: '/color',
    route: colorRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
  {
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/banner',
    route: bannerRoutes,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
  {
    path: '/wishlist',
    route: wishlistRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/otp',
    route: OtpRoutes,
  },
  {
    path: '/stats',
    route: StatsRoutes,
  },
  {
    path: '/about',
    route: aboutRoutes,
  },
  {
    path: '/policy',
    route: policyRoutes,
  },
  {
    path: '/socialIcon',
    route: socialIconRoutes,
  },
  {
    path: '/logo',
    route: logoRoutes,
  },
  {
    path: '/contact',
    route: contactRoutes,
  },
  {
    path: '/coupon',
    route: couponRoutes,
  },
  {
    path: '/campaign',
    route: campaignRoutes,
  },
  {
    path: '/courier',
    route: CourierRoutes,
  },
  {
    path: '/return',
    route: returnRoutes,
  },
  {
    path: '/home',
    route: homeRoutes,
  },
  {
    path: '/blog',
    route: blogRoutes,
  },
  {
    path: '/affiliate',
    route: affiliateRoutes,
  },
  {
    path: '/custome',
    route: customeRoutes,
  },
  {
    path: '/theme',
    route: themeRouter,
  },
  {
    path: '/visitor',
    route: visitorRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

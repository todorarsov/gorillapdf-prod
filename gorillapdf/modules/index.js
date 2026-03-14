const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

const routeHelper = require('./routeHelper');
const routeConfig = require('./routeConfig');
const homeInfo = require('./homePageHelper');
const ServiceRating = require('./schema/serviceRatingSchema');

const { createDynamicPageInfoJson, setNewLocaleAndReturnTranslation } = routeHelper;
const { servicesRoutingArray, staticRoutingArray } = routeConfig;
const { getHomePageInfo } = homeInfo;

/* ------------------------------------------------------------------
 * Multer setup
 * ------------------------------------------------------------------ */
const upload = multer({
  dest: 'public/uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

/* ------------------------------------------------------------------
 * MongoDB connection (singleton-safe)
 * ------------------------------------------------------------------ */
// mongoose.Promise = global.Promise;

// if (mongoose.connection.readyState === 0) {
//   const mongoUri =
//     process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gorilladb';

//   mongoose
//     .connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
// }

/* ------------------------------------------------------------------
 * Rating update (atomic, numeric _id safe)
 * ------------------------------------------------------------------ */
const updateSingleRating = async (rating, serviceId) => {
  if (Number.isNaN(rating) || Number.isNaN(serviceId)) return;

  try {
    const result = await ServiceRating.updateOne(
      { _id: Number(serviceId) },
      {
        $inc: {
          rating_total: Number(rating),
          rating_count: 1
        }
      }
    );

    if (result.matchedCount === 0) {
      console.warn('ServiceRating not found:', serviceId);
    }
  } catch (err) {
    console.error('Failed to update rating:', err);
  }
};

/* ------------------------------------------------------------------
 * Dynamic routing
 * ------------------------------------------------------------------ */
const dynamicRouteDetect = (routeId, req, res) => {
  let root = res.__('root');

  const routeItemServices = servicesRoutingArray.find(
    e => e.full === routeId
  );
  const routeItemPages = staticRoutingArray.find(
    e => e.full === routeId
  );

  if (routeItemServices) {
    root = setNewLocaleAndReturnTranslation(
      req,
      res,
      root,
      routeItemServices.locale
    );

    createDynamicPageInfoJson(
      res,
      root,
      routeItemServices.name,
      false
    );
  } else if (routeItemPages) {
    root = setNewLocaleAndReturnTranslation(
      req,
      res,
      root,
      routeItemPages.locale
    );

    res.render(routeItemPages.name, {
      root,
      status: '',
      homeData: getHomePageInfo(root)
    });
  } else {
    res.status(404).render('error', { root });
  }
};

/* ------------------------------------------------------------------
 * Routes
 * ------------------------------------------------------------------ */
router.get('/', (req, res) => {
  const root = setNewLocaleAndReturnTranslation(
    req,
    res,
    res.__('root'),
    'en'
  );

  res.render('index', {
    root,
    homeData: getHomePageInfo(root)
  });
});

router.get('/:id', (req, res) => {
  const routeId = req.params.id;

  if (routeId === 'powerpoint-to-pdf') {
    return res.redirect('ppt-to-pdf');
  }

  dynamicRouteDetect(routeId, req, res);
});

router.get(
  '/:type(en|fr|pt|ja|es|de|mk|ms|ru|tr|zh|id|uk|it|careers)/:id',
  (req, res) => {
    const routeId = req.url.split('?')[0];
    dynamicRouteDetect(routeId, req, res);
  }
);

/* ------------------------------------------------------------------
 * API endpoints
 * ------------------------------------------------------------------ */
router.post('/update-rating', upload.none(), async (req, res) => {
  const rating = parseFloat(req.body.ratingValue);
  const serviceId = parseInt(req.body.serviceId, 10);

  await updateSingleRating(rating, serviceId);

  res.json({ success: true });
});

router.post('/contact', upload.none(), async (req, res) => {
  const root = res.__('root');
  req.setTimeout(15000);

  try {
    const SendEmail = require('./sendEmail');
    const response = await new SendEmail(
      req.body.email,
      req.body.subject,
      req.body.emailBody
    ).sendEmail(res);

    res.render('contact', { root, status: response });
  } catch (err) {
    console.error(err);
    res.render('contact', { root, status: 'error' });
  }
});

module.exports = router;

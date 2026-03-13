const { allowedPaths } = require('./routeConfig');
const ServiceRating = require('./schema/serviceRatingSchema');
const i18n = require('./languageHelper');

/* ------------------------------------------------------------------
 * Service → DB ID mapping (MUST match Mongo _id)
 * ------------------------------------------------------------------ */
const SERVICE_ID_MAP = {
  'jpg-to-pdf': 1,
  'png-to-pdf': 2,
  'word-to-pdf': 3,
  'txt-to-pdf': 4,
  'password-protect-pdf': 5,
  'unlock-pdf': 6,
  'excel-to-pdf': 7,
  'ppt-to-pdf': 8,
  'compress-pdf': 9,
  'odt-to-pdf': 10,
  'ods-to-pdf': 11,
  'odp-to-pdf': 12,
  'online-ocr': 13,
  'pdf-to-text': 14,
  'html-to-pdf': 15,
  'pdf-reader': 16,
  'pdf-editor': 17,
  'pdf-to-word': 18,
  'merge-pdf': 19
};

/* ------------------------------------------------------------------
 * Utils
 * ------------------------------------------------------------------ */
const isValidFormat = (mimeType, validMimeType) =>
  mimeType === validMimeType;

/* ------------------------------------------------------------------
 * Page data builder
 * ------------------------------------------------------------------ */
const getInitialPageData = (
  id,
  page,
  serviceName,
  buttonTitle,
  cardHeader,
  cardTitle,
  cardBody,
  allowedExt,
  processing
) => ({
  id,
  page,
  serviceName,
  buttonTitle,
  cardHeader,
  cardTitle,
  cardBody,
  allowedExt,
  processing,
  numberOfVotes: 0,
  totalRatingAllVotes: 0,
  ratingAverage: 0
});

/* ------------------------------------------------------------------
 * Dynamic page renderer with DB ratings
 * ------------------------------------------------------------------ */
const createDynamicPageInfoJson = async (res, root, view, useDb) => {
  const serviceInfo = getViewAndExtension(view, root);

  if (!serviceInfo) {
    return res.render('404', { root });
  }

  const pageData = getInitialPageData(
    serviceInfo.translation.id,
    serviceInfo.translation.page,
    serviceInfo.view,
    serviceInfo.translation.buttonTitle,
    serviceInfo.translation.cardHeader,
    serviceInfo.translation.cardTitle,
    serviceInfo.translation.cardBody,
    serviceInfo.allowedExt,
    serviceInfo.translation.processing
  );

  if (!useDb) {
    return res.render(view, { root, page: view, pageData });
  }

  const serviceId = SERVICE_ID_MAP[view];

  if (!serviceId) {
    return res.render(view, { root, page: view, pageData });
  }

  try {
    const rating = await ServiceRating.findOne({ _id: serviceId }).lean();

    if (rating) {
      pageData.numberOfVotes = rating.rating_count || 0;
      pageData.totalRatingAllVotes = rating.rating_total || 0;
      pageData.ratingAverage =
        rating.rating_count > 0
          ? (rating.rating_total / rating.rating_count).toFixed(2)
          : 0;
    }
  } catch (err) {
    console.error('Failed to load service rating:', err);
  }

  return res.render(view, { root, page: view, pageData });
};

/* ------------------------------------------------------------------
 * JSON responder
 * ------------------------------------------------------------------ */
const sendJsonResponseToView = (res, responseFromService) => {
  res.json(responseFromService);
};

/* ------------------------------------------------------------------
 * View ↔ translation mapping
 * ------------------------------------------------------------------ */
const getViewAndExtension = (view, root) => {
  switch (view) {
    case 'jpg-to-pdf':
      return { translation: root.services.jpgtopdf, view, allowedExt: '.jpg' };

    case 'png-to-pdf':
      return { translation: root.services.pngtopdf, view, allowedExt: '.png' };

    case 'word-to-pdf':
      return {
        translation: root.services.wordtopdf,
        view,
        allowedExt: '.doc,.docx,.dotx,.docm'
      };

    case 'txt-to-pdf':
      return { translation: root.services.txttopdf, view, allowedExt: '.txt' };

    case 'password-protect-pdf':
      return {
        translation: root.services.passwordprotectpdf,
        view,
        allowedExt: '.pdf'
      };

    case 'unlock-pdf':
      return { translation: root.services.unlockpdf, view, allowedExt: '.pdf' };

    case 'excel-to-pdf':
      return {
        translation: root.services.exceltopdf,
        view,
        allowedExt: '.xls,.xlsx,.xlsb'
      };

    case 'ppt-to-pdf':
      return {
        translation: root.services.powerpointtopdf,
        view,
        allowedExt: '.ppt,.pptx,.potx,.ppsx'
      };

    case 'compress-pdf':
      return {
        translation: root.services.compresspdf,
        view,
        allowedExt: '.pdf'
      };

    case 'odt-to-pdf':
      return {
        translation: root.services.odttopdf,
        view,
        allowedExt: '.doc,.docx,.dotx,.docm,.odt'
      };

    case 'ods-to-pdf':
      return {
        translation: root.services.odstopdf,
        view,
        allowedExt: '.xls,.xlsx,.xlsb,.ods'
      };

    case 'odp-to-pdf':
      return {
        translation: root.services.odptopdf,
        view,
        allowedExt: '.ppt,.pptx,.potx,.ppsx,.odp'
      };

    case 'online-ocr':
      return {
        translation: root.services.onlineocr,
        view,
        allowedExt: '.jpg,.jpeg,.png,.pneg'
      };

    case 'pdf-to-text':
      return { translation: root.services.pdftotxt, view, allowedExt: '.pdf' };

    case 'html-to-pdf':
      return { translation: root.services.htmltopdf, view, allowedExt: '.html' };

    case 'pdf-reader':
      return { translation: root.services.pdfreader, view, allowedExt: '.pdf' };

    case 'pdf-editor':
      return { translation: root.services.pdfeditor, view, allowedExt: '.pdf' };

    case 'pdf-to-word':
      return { translation: root.services.pdftoword, view, allowedExt: '.pdf' };

    case 'merge-pdf':
      return { translation: root.services.mergepdf, view, allowedExt: '.pdf' };

    default:
      return null;
  }
};

/* ------------------------------------------------------------------
 * Locale helpers
 * ------------------------------------------------------------------ */
const setNewLocale = (res, newLocale, expirationDays = 180) => {
  i18n.setLocale(newLocale);
  res.locale = newLocale;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  res.cookie('lang', newLocale, {
    expires: expirationDate,
    secure: true,
    httpOnly: true
  });
};

const setNewLocaleAndReturnTranslation = (req, res, root, newLocale) => {
  if (req.locale !== newLocale) {
    setNewLocale(res, newLocale);
    root = res.__('root');
  }
  return root;
};

/* ------------------------------------------------------------------
 * Error translation
 * ------------------------------------------------------------------ */
const translateErrorMessage = (res, errorType) => {
  const translation = res.__('root.messages');

  switch (errorType) {
    case 'GenericError':
      return translation.genericError;

    case 'FileEncrypted':
      return translation.errorEncrypted;

    case 'FileLarger':
      return translation.compressFail;

    default:
      return translation.genericError;
  }
};

/* ------------------------------------------------------------------
 * Path validator
 * ------------------------------------------------------------------ */
const isAllowedPath = path =>
  allowedPaths.some(p => path.includes(p));

/* ------------------------------------------------------------------
 * Exports
 * ------------------------------------------------------------------ */
module.exports = {
  isValidFormat,
  getInitialPageData,
  createDynamicPageInfoJson,
  sendJsonResponseToView,
  setNewLocale,
  setNewLocaleAndReturnTranslation,
  translateErrorMessage,
  isAllowedPath
};

const getHomePageInfo = (root) => {
    const homePageArr= [{
        "id": 1,
        "url": root.services.txttopdf.url,
        "imgUrl": root.services.txttopdf.imgUrl,
        "imgAlt": root.services.txttopdf.imgAlt,
        "text": root.services.txttopdf.text,
        "homepageDesc":root.services.txttopdf.homepageDesc 
    },
    {
      "id": 2,
      "url": root.services.pdftotxt.url,
      "imgUrl": root.services.pdftotxt.imgUrl,
      "imgAlt": root.services.pdftotxt.imgAlt,
      "text": root.services.pdftotxt.text,
      "homepageDesc":root.services.pdftotxt.homepageDesc 
  },
  {
    "id": 3,
    "url": root.services.jpgtopdf.url,
    "imgUrl": root.services.jpgtopdf.imgUrl,
    "imgAlt": root.services.jpgtopdf.imgAlt,
    "text": root.services.jpgtopdf.text,
    "homepageDesc":root.services.jpgtopdf.homepageDesc 
},
{
  "id": 4,
  "url": root.services.pngtopdf.url,
  "imgUrl": root.services.pngtopdf.imgUrl,
  "imgAlt": root.services.pngtopdf.imgAlt,
  "text": root.services.pngtopdf.text,
  "homepageDesc":root.services.pngtopdf.homepageDesc 
},
{
  "id": 5,
  "url": root.services.passwordprotectpdf.url,
  "imgUrl": root.services.passwordprotectpdf.imgUrl,
  "imgAlt": root.services.passwordprotectpdf.imgAlt,
  "text": root.services.passwordprotectpdf.text,
  "homepageDesc":root.services.passwordprotectpdf.homepageDesc 
},
{
  "id": 6,
  "url": root.services.wordtopdf.url,
  "imgUrl": root.services.wordtopdf.imgUrl,
  "imgAlt": root.services.wordtopdf.imgAlt,
  "text": root.services.wordtopdf.text,
  "homepageDesc":root.services.wordtopdf.homepageDesc 
},
{
  "id": 7,
  "url": root.services.exceltopdf.url,
  "imgUrl": root.services.exceltopdf.imgUrl,
  "imgAlt": root.services.exceltopdf.imgAlt,
  "text": root.services.exceltopdf.text,
  "homepageDesc":root.services.exceltopdf.homepageDesc 
},
{
  "id": 8,
  "url": root.services.powerpointtopdf.url,
  "imgUrl": root.services.powerpointtopdf.imgUrl,
  "imgAlt": root.services.powerpointtopdf.imgAlt,
  "text": root.services.powerpointtopdf.text,
  "homepageDesc":root.services.powerpointtopdf.homepageDesc 
},
{
  "id": 9,
  "url": root.services.unlockpdf.url,
  "imgUrl": root.services.unlockpdf.imgUrl,
  "imgAlt": root.services.unlockpdf.imgAlt,
  "text": root.services.unlockpdf.text,
  "homepageDesc":root.services.unlockpdf.homepageDesc 
},
{
  "id": 10,
  "url": root.services.compresspdf.url,
  "imgUrl": root.services.compresspdf.imgUrl,
  "imgAlt": root.services.compresspdf.imgAlt,
  "text": root.services.compresspdf.text,
  "homepageDesc":root.services.compresspdf.homepageDesc 
},
{
  "id": 11,
  "url": root.services.odttopdf.url,
  "imgUrl": root.services.odttopdf.imgUrl,
  "imgAlt": root.services.odttopdf.imgAlt,
  "text": root.services.odttopdf.text,
  "homepageDesc":root.services.odttopdf.homepageDesc 
},
{
  "id": 12,
  "url": root.services.odstopdf.url,
  "imgUrl": root.services.odstopdf.imgUrl,
  "imgAlt": root.services.odstopdf.imgAlt,
  "text": root.services.odstopdf.text,
  "homepageDesc":root.services.odstopdf.homepageDesc 
},
{
  "id": 13,
  "url": root.services.odptopdf.url,
  "imgUrl": root.services.odptopdf.imgUrl,
  "imgAlt": root.services.odptopdf.imgAlt,
  "text": root.services.odptopdf.text,
  "homepageDesc":root.services.odptopdf.homepageDesc 
},
{
  "id": 14,
  "url": root.services.pdfreader.url,
  "imgUrl": root.services.pdfreader.imgUrl,
  "imgAlt": root.services.pdfreader.imgAlt,
  "text": root.services.pdfreader.text,
  "homepageDesc":root.services.pdfreader.homepageDesc 
},
{
  "id": 15,
  "url": root.services.mergepdf.url,
  "imgUrl": root.services.mergepdf.imgUrl,
  "imgAlt": root.services.mergepdf.imgAlt,
  "text": root.services.mergepdf.text,
  "homepageDesc":root.services.mergepdf.homepageDesc 
},
{
  "id": 16,
  "url": root.services.htmltopdf.url,
  "imgUrl": root.services.htmltopdf.imgUrl,
  "imgAlt": root.services.htmltopdf.imgAlt,
  "text": root.services.htmltopdf.text,
  "homepageDesc":root.services.htmltopdf.homepageDesc 
},
{
  "id": 17,
  "url": root.services.onlineocr.url,
  "imgUrl": root.services.onlineocr.imgUrl,
  "imgAlt": root.services.onlineocr.imgAlt,
  "text": root.services.onlineocr.text,
  "homepageDesc":root.services.onlineocr.homepageDesc 
},
{
  "id": 18,
  "url": root.services.pdftoword.url,
  "imgUrl": root.services.pdftoword.imgUrl,
  "imgAlt": root.services.pdftoword.imgAlt,
  "text": root.services.pdftoword.text,
  "homepageDesc":root.services.pdftoword.homepageDesc 
},
{
  "id": 19,
  "url": root.services.pdftoexcel.url,
  "imgUrl": root.services.pdftoexcel.imgUrl,
  "imgAlt": root.services.pdftoexcel.imgAlt,
  "text": root.services.pdftoexcel.text,
  "homepageDesc":root.services.pdftoword.homepageDesc 
},
{
  "id": 20,
  "url": root.services.pdftopptx.url,
  "imgUrl": root.services.pdftopptx.imgUrl,
  "imgAlt": root.services.pdftopptx.imgAlt,
  "text": root.services.pdftopptx.text,
  "homepageDesc":root.services.pdftopptx.homepageDesc 
}
  ]
    return homePageArr
  }

  exports.getHomePageInfo = getHomePageInfo;